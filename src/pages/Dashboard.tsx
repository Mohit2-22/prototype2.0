import { useState } from 'react';
import { Upload, MapPin, Camera, FileText, Clock, CheckCircle, X } from 'lucide-react';
import Navigation from '../components/Navigation';
import StatCard from '../components/StatCard';

interface Report {
  id: string;
  category: string;
  description: string;
  location: string;
  status: 'Pending' | 'Verified' | 'Rejected';
  date: string;
  image?: string;
}

const Dashboard = () => {
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    location: '',
    image: null as File | null,
    video: null as File | null,
  });

  const [reports, setReports] = useState<Report[]>([
    // Sample data - would come from backend
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, [type]: file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newReport: Report = {
      id: Date.now().toString(),
      category: formData.category,
      description: formData.description,
      location: formData.location,
      status: 'Pending',
      date: new Date().toLocaleDateString(),
    };
    
    setReports(prev => [newReport, ...prev]);
    
    // Reset form
    setFormData({
      category: '',
      description: '',
      location: '',
      image: null,
      video: null,
    });
    
    // Reset file inputs
    const fileInputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>;
    fileInputs.forEach(input => input.value = '');
  };

  const getStatusBadge = (status: Report['status']) => {
    switch (status) {
      case 'Pending':
        return <span className="civic-badge-pending">Pending</span>;
      case 'Verified':
        return <span className="civic-badge-verified">Verified</span>;
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

          {/* User Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              title="Your Reports"
              value={reports.length}
              icon={FileText}
            />
            <StatCard
              title="Verified Reports"
              value={reports.filter(r => r.status === 'Verified').length}
              icon={CheckCircle}
            />
            <StatCard
              title="Your Points"
              value="0"
              icon={Clock}
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
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="civic-input"
                    required
                  >
                    <option value="">Select category</option>
                    <option value="pothole">Pothole</option>
                    <option value="garbage">Garbage Collection</option>
                    <option value="streetlight">Street Light</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description
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

                <button type="submit" className="w-full civic-button-primary">
                  Submit Report
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
                          <h3 className="font-medium text-foreground capitalize">{report.category}</h3>
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
                        <span>{report.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;