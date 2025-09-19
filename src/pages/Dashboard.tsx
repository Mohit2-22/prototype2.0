import { useState, useEffect } from 'react';
import { Upload, MapPin, Camera, FileText, Clock, CheckCircle, X, AlertTriangle } from 'lucide-react';
import Navigation from '../components/Navigation';
import StatCard from '../components/StatCard';
import { reportService, authService } from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

interface Report {
  id: number;
  title: string;
  description: string;
  category: number;
  location: string;
  status: 'Pending' | 'Verified' | 'In Progress' | 'Resolved' | 'Rejected';
  created_at: string;
  updated_at: string;
  image?: string;
  video?: string;
  category_name?: string;
  upvotes?: number;
}

interface ReportCategory {
  id: number;
  name: string;
  description: string;
}

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    location: '',
    image: null as File | null,
    video: null as File | null,
  });

  const [reports, setReports] = useState<Report[]>([]);
  const [categories, setCategories] = useState<ReportCategory[]>([]);
  const [userStats, setUserStats] = useState({
    total_reports: 0,
    total_points: 0,
    reports_verified: 0,
    reports_pending: 0,
  });
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fallback categories in case API fails
  const fallbackCategories: ReportCategory[] = [
    { id: 1, name: 'Road Issues', description: 'Potholes, damaged roads, traffic signals' },
    { id: 2, name: 'Garbage & Sanitation', description: 'Waste collection, drainage, cleanliness' },
    { id: 3, name: 'Street Lighting', description: 'Broken street lights, dark areas' },
    { id: 4, name: 'Water Supply', description: 'Water shortage, leakage, quality issues' },
    { id: 5, name: 'Public Safety', description: 'Security concerns, emergency services' },
    { id: 6, name: 'Parks & Recreation', description: 'Public parks, playgrounds, maintenance' },
    { id: 7, name: 'Public Transport', description: 'Bus stops, transport services, accessibility' },
    { id: 8, name: 'Other', description: 'Other civic issues not listed above' }
  ];

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      console.log('Dashboard: Fetching data...');
      console.log('Auth token:', localStorage.getItem('authToken'));
      console.log('Is authenticated:', isAuthenticated);
      
      try {
        // Always try to fetch categories first (now public endpoint)
        let categoriesData = [];
        try {
          const categoriesRes = await reportService.getCategories();
          categoriesData = categoriesRes.data || [];
        } catch (catError) {
          categoriesData = fallbackCategories;
        }
        
        // Set categories regardless of auth status
        setCategories(categoriesData);
        console.log('Dashboard: Categories set to:', categoriesData);

        // Only fetch user-specific data if authenticated
        if (isAuthenticated) {
          const [reportsRes, statsRes] = await Promise.all([
            reportService.getReports({ my_reports: 'true' }),
            authService.getUserStats(),
          ]);
          
          console.log('Dashboard: User data fetched successfully');
          
          setReports(reportsRes.data || reportsRes.results || []);
          setUserStats(statsRes.data || {
            total_reports: 0,
            total_points: 0,
            reports_verified: 0,
            reports_pending: 0,
          });
        } else {
          console.log('Dashboard: User not authenticated, showing empty user data');
          setReports([]);
          setUserStats({
            total_reports: 0,
            total_points: 0,
            reports_verified: 0,
            reports_pending: 0,
          });
        }
        
      } catch (err: any) {
  setError(err.message || 'Failed to load dashboard data.');
        // Ensure categories are available even if other data fails
        if (categories.length === 0) {
          setCategories(fallbackCategories);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear messages when user starts typing
    if (error) setError(null);
    if (successMessage) setSuccessMessage(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, [type]: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.category || !formData.description.trim() || !formData.location.trim()) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (formData.description.trim().length < 10) {
      setError('Description must be at least 10 characters long');
      return;
    }
    
    setSubmitLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const reportData = {
        title: formData.title,
        category: parseInt(formData.category),
        description: formData.description,
        location: formData.location,
        image: formData.image,
        video: formData.video,
      };
      
      console.log('Submitting report:', reportData);
      console.log('Auth token:', localStorage.getItem('authToken'));
      
      const response = await reportService.createReport(reportData);
      console.log('Report creation response:', response);
      
      // Handle different response formats from backend
      let reportData_created;
      if (response?.data?.id) {
        reportData_created = response.data;
      } else if (response?.id) {
        reportData_created = response;
      } else {
        // If we get here, check if the response at least indicates success
        console.warn('Unexpected response format, but proceeding:', response);
        // Create a mock report object for UI update
        reportData_created = {
          id: Date.now(), // temporary ID
          title: formData.title,
          description: formData.description,
          location: formData.location,
          status: 'Pending',
          created_at: new Date().toISOString(),
          category_name: categories.find(c => c.id.toString() === formData.category)?.name || 'Unknown'
        };
      }
      
      // Update UI with the created report
      setReports(prev => [reportData_created, ...prev]);
      
      // Update user stats
      setUserStats(prev => ({
        ...prev,
        total_reports: prev.total_reports + 1,
        reports_pending: prev.reports_pending + 1,
      }));
      
      // Reset form
      setFormData({
        title: '',
        category: '',
        description: '',
        location: '',
        image: null,
        video: null,
      });
      
      // Reset file inputs
      const fileInputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>;
      fileInputs.forEach(input => input.value = '');
      
      setSuccessMessage('Report submitted successfully!');
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      console.error('Error submitting report:', err);
      if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
        setError('You must be logged in to submit reports. Please log in and try again.');
      } else {
        setError(err.message || 'Failed to submit report. Please try again.');
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const getStatusBadge = (status: Report['status']) => {
    switch (status) {
      case 'Pending':
        return <span className="civic-badge-pending">Pending</span>;
      case 'Verified':
        return <span className="civic-badge-verified">Verified</span>;
      case 'In Progress':
        return <span className="civic-badge-pending">In Progress</span>;
      case 'Resolved':
        return <span className="civic-badge-verified">Resolved</span>;
      case 'Rejected':
        return <span className="civic-badge-rejected">Rejected</span>;
    }
  };

  const getStatusIcon = (status: Report['status']) => {
    switch (status) {
      case 'Pending':
        return <Clock className="w-5 h-5 text-warning" />;
      case 'Verified':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'In Progress':
        return <AlertTriangle className="w-5 h-5 text-blue-500" />;
      case 'Resolved':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'Rejected':
        return <X className="w-5 h-5 text-destructive" />;
    }
  };

  return (
    <>
      <Navigation />
      
      <div className="min-h-screen bg-muted/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Report issues and track your community contributions</p>
          </div>

          {/* Authentication Warning */}
          {!isAuthenticated && (
            <div className="mb-6 p-6 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-600 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-amber-800 mb-2">Authentication Required</h3>
                  <p className="text-amber-700 mb-4">
                    You need to be logged in to submit reports and view your dashboard data. 
                    Please log in to access all features.
                  </p>
                  <Link 
                    to="/login" 
                    className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    Go to Login
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-center gap-2 text-destructive">
                <X className="w-5 h-5" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Success Display */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="w-5 h-5" />
                <span>{successMessage}</span>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
            </div>
          ) : (
            <>
              {/* User Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StatCard
                  title="Total Reports"
                  value={userStats.total_reports}
                  icon={FileText}
                  subtitle="Issues you've reported"
                />
                <StatCard
                  title="Verified Reports"
                  value={userStats.reports_verified}
                  icon={CheckCircle}
                  subtitle="Successfully verified"
                />
                <StatCard
                  title="Pending Reports"
                  value={userStats.reports_pending}
                  icon={Clock}
                  subtitle="Awaiting review"
                />
                <StatCard
                  title="Your Points"
                  value={userStats.total_points}
                  icon={FileText}
                  subtitle="Civic engagement points"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Report Form */}
                <div className="civic-card p-6">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary" />
                Submit New Report
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Report Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="civic-input"
                    placeholder="Brief title of the issue"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="civic-input"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="civic-input min-h-[100px] resize-y"
                    placeholder="Describe the issue in detail... (minimum 10 characters)"
                    required
                  />
                  {formData.description && formData.description.length < 10 && (
                    <p className="text-sm text-amber-600 mt-1">
                      {10 - formData.description.length} more characters needed
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="civic-input pl-10"
                      placeholder="Enter the location of the issue"
                      required
                    />
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Upload Image
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, 'image')}
                        className="civic-input"
                        accept="image/*"
                      />
                      <Camera className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Upload Video
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, 'video')}
                        className="civic-input"
                        accept="video/*"
                      />
                      <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full civic-button-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={submitLoading}
                >
                  {submitLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    'Submit Report'
                  )}
                </button>
              </form>
            </div>

              {/* Reports List */}
              <div className="civic-card p-6">
                <h2 className="text-2xl font-semibold mb-6">Your Reports</h2>
                
                {reports.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No reports yet</h3>
                    <p className="text-muted-foreground">Submit your first civic issue report to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reports.map((report) => (
                      <div key={report.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(report.status)}
                            <h3 className="font-medium text-foreground">{report.title}</h3>
                          </div>
                          {getStatusBadge(report.status)}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {report.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{report.location}</span>
                          </div>
                          <div className="flex flex-col text-right">
                            <span>{report.category_name}</span>
                            <span>{new Date(report.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;