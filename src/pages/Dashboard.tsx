import { useState, useEffect } from 'react';
import { Upload, MapPin, Camera, FileText, Clock, CheckCircle, X, AlertTriangle } from 'lucide-react';
import Navigation from '../components/Navigation';
import StatCard from '../components/StatCard';
import { reportService, authService } from '../services/apiService';

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

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [reportsRes, categoriesRes, statsRes] = await Promise.all([
          reportService.getReports({ my_reports: 'true' }),
          reportService.getCategories(),
          authService.getUserStats(),
        ]);
        
        setReports(reportsRes.data || []);
        setCategories(categoriesRes.data || []);
        setUserStats(statsRes.data || {
          total_reports: 0,
          total_points: 0,
          reports_verified: 0,
          reports_pending: 0,
        });
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    
    setSubmitLoading(true);
    setError(null);
    
    try {
      const reportData = {
        title: formData.title,
        category: parseInt(formData.category),
        description: formData.description,
        location: formData.location,
        image: formData.image,
        video: formData.video,
      };
      
      const response = await reportService.createReport(reportData);
      
      // Add new report to the list
      setReports(prev => [response.data, ...prev]);
      
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
      
      alert('Report submitted successfully!');
    } catch (err: any) {
      console.error('Error submitting report:', err);
      setError(err.message || 'Failed to submit report');
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

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-center gap-2 text-destructive">
                <X className="w-5 h-5" />
                <span>{error}</span>
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
                    placeholder="Describe the issue in detail..."
                    required
                  />
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