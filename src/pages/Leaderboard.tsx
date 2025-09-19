import { useState, useEffect } from 'react';
import { Trophy, Medal, Award, TrendingUp, Users, Target, AlertTriangle, Crown } from 'lucide-react';
import Navigation from '../components/Navigation';
import { leaderboardService } from '../services/apiService';

interface LeaderboardEntry {
  rank: number;
  user: {
    id: number;
    username: string;
    full_name: string;
  };
  total_points: number;
  reports_submitted: number;
  activities_completed: number;
  badge_level: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
}

interface LeaderboardStats {
  total_users: number;
  total_points_awarded: number;
  reports_this_month: number;
  activities_this_month: number;
}

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [stats, setStats] = useState<LeaderboardStats>({
    total_users: 0,
    total_points_awarded: 0,
    reports_this_month: 0,
    activities_this_month: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [leaderboardRes, statsRes] = await Promise.all([
          leaderboardService.getLeaderboard(),
          leaderboardService.getPublicLeaderboardStats(),
        ]);
        
        setLeaderboardData(leaderboardRes.data || []);
        setStats(statsRes.data || {
          total_users: 0,
          total_points_awarded: 0,
          reports_this_month: 0,
          activities_this_month: 0,
        });
      } catch (err: any) {
        console.error('Error fetching leaderboard data:', err);
        setError(err.message || 'Failed to load leaderboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const getBadgeIcon = (level: LeaderboardEntry['badge_level']) => {
    switch (level) {
      case 'Bronze':
        return <Award className="w-5 h-5 text-amber-600" />;
      case 'Silver':
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 'Gold':
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 'Platinum':
        return <Crown className="w-5 h-5 text-purple-500" />;
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">
          {rank}
        </div>;
    }
  };

  const getBadgeColor = (level: LeaderboardEntry['badge_level']) => {
    switch (level) {
      case 'Bronze': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Silver': return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'Gold': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Platinum': return 'bg-purple-50 text-purple-700 border-purple-200';
    }
  };

  return (
    <>
      <Navigation />
      
      <div className="min-h-screen bg-muted/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Community Leaderboard</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Celebrate our most active community members who are making a real difference
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-4 text-muted-foreground">Loading leaderboard...</p>
            </div>
          ) : (
            <>
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <div className="civic-card p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-1">{stats.total_users}</h3>
                  <p className="text-muted-foreground">Active Members</p>
                </div>
                
                <div className="civic-card p-6 text-center">
                  <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Target className="w-6 h-6 text-success" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-1">{stats.total_points_awarded.toLocaleString()}</h3>
                  <p className="text-muted-foreground">Total Points</p>
                </div>
            
                <div className="civic-card p-6 text-center">
                  <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-6 h-6 text-warning" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-1">{stats.reports_this_month}</h3>
                  <p className="text-muted-foreground">Reports This Month</p>
                </div>
                
                <div className="civic-card p-6 text-center">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Award className="w-6 h-6 text-purple-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-1">{stats.activities_this_month}</h3>
                  <p className="text-muted-foreground">Activities This Month</p>
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="civic-card">
            <div className="p-6 border-b border-border">
              <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                <Trophy className="w-6 h-6 text-primary" />
                Top Contributors
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              {leaderboardData.length === 0 ? (
                <div className="text-center py-16">
                  <Trophy className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-foreground mb-4">Leaderboard Starts at 0</h3>
                  <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                    Be the first to make a difference! Start reporting issues and participating in activities to climb the leaderboard.
                  </p>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      <strong>How to earn points:</strong>
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <Award className="w-8 h-8 text-primary mx-auto mb-2" />
                        <p className="text-sm font-medium">Submit verified reports</p>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <Users className="w-8 h-8 text-success mx-auto mb-2" />
                        <p className="text-sm font-medium">Complete activities</p>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <TrendingUp className="w-8 h-8 text-warning mx-auto mb-2" />
                        <p className="text-sm font-medium">Help your community</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Rank</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Points</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Reports</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Activities</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Badge</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {leaderboardData.map((entry) => (
                      <tr key={entry.rank} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {getRankIcon(entry.rank)}
                            <span className="font-semibold text-foreground">#{entry.rank}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-foreground">{entry.user.full_name || entry.user.username}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-primary text-lg">{entry.total_points.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-foreground">{entry.reports_submitted}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-foreground">{entry.activities_completed}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {getBadgeIcon(entry.badge_level)}
                            <span className="text-sm font-medium text-muted-foreground">
                              {entry.badge_level}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

              {/* Achievement Levels */}
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Achievement Levels</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="civic-card p-6 text-center">
                    <Award className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">Bronze</h3>
                    <p className="text-sm text-muted-foreground">0 - 99 points</p>
                  </div>
                  
                  <div className="civic-card p-6 text-center">
                    <Medal className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">Silver</h3>
                    <p className="text-sm text-muted-foreground">100 - 499 points</p>
                  </div>
                  
                  <div className="civic-card p-6 text-center">
                    <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">Gold</h3>
                    <p className="text-sm text-muted-foreground">500 - 999 points</p>
                  </div>
                  
                  <div className="civic-card p-6 text-center">
                    <Trophy className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">Platinum</h3>
                    <p className="text-sm text-muted-foreground">1000+ points</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Leaderboard;