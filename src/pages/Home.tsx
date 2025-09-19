import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, CheckCircle, Award, ArrowRight } from 'lucide-react';
import Navigation from '../components/Navigation';
import StatCard from '../components/StatCard';
import heroBackground from '../assets/civic-hero-bg.jpg';
import { authService, reportService, leaderboardService } from '../services/apiService';

const Home = () => {
  const [stats, setStats] = useState({
    totalReports: 0,
    resolutionRate: 0,
    totalPoints: 0,
    loading: true
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [reportStats, leaderboardStats] = await Promise.all([
          reportService.getPublicReportStats(),
          leaderboardService.getPublicLeaderboardStats()
        ]);
        
        setStats({
          totalReports: reportStats.total_reports || 0,
          resolutionRate: reportStats.resolution_rate || 0,
          totalPoints: leaderboardStats.total_community_points || 0,
          loading: false
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      <Navigation />
      
      {/* Hero Section */}
      <section 
        className="civic-hero relative min-h-[60vh] flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.8), rgba(37, 99, 235, 0.8)), url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            CivicCare — Report & Resolve
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90">
            Your voice matters. Report civic issues and help build a better community together.
          </p>
          <Link to="/login" className="civic-button-success inline-flex items-center space-x-2 text-lg">
            <span>Report an Issue</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Community Impact
            </h2>
            <p className="text-muted-foreground text-lg">
              Track our collective progress in making our city better
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard
              title="Total Reports"
              value={stats.loading ? "..." : stats.totalReports.toString()}
              icon={FileText}
              subtitle="Issues reported by citizens"
            />
            <StatCard
              title="Resolution Rate"
              value={stats.loading ? "..." : `${stats.resolutionRate}%`}
              icon={CheckCircle}
              subtitle="Successfully resolved issues"
            />
            <StatCard
              title="Community Points"
              value={stats.loading ? "..." : stats.totalPoints.toString()}
              icon={Award}
              subtitle="Earned by active citizens"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              How CivicCare Works
            </h2>
            <p className="text-muted-foreground text-lg">
              Simple steps to make your community better
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="civic-card p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Report Issues</h3>
              <p className="text-muted-foreground">
                Easily report potholes, garbage, streetlight issues, and more with photos and location details.
              </p>
            </div>
            
            <div className="civic-card p-8 text-center">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Track Progress</h3>
              <p className="text-muted-foreground">
                Monitor the status of your reports and see real-time updates from local authorities.
              </p>
            </div>
            
            <div className="civic-card p-8 text-center">
              <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-warning" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Earn Rewards</h3>
              <p className="text-muted-foreground">
                Get points for active participation and climb the community leaderboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Join thousands of citizens working together to improve our community
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login" className="civic-button-primary">
              Get Started Today
            </Link>
            <Link to="/contact" className="civic-button-success">
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;