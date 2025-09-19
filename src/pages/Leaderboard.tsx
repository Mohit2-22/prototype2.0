import { Trophy, Medal, Award, TrendingUp, Users, Target } from 'lucide-react';
import Navigation from '../components/Navigation';

interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  reportsSubmitted: number;
  activitiesCompleted: number;
  badgeLevel: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
}

const Leaderboard = () => {
  // Sample data - in a real app, this would come from the backend
  const leaderboardData: LeaderboardEntry[] = [
    // Initially empty as requested - leaderboard starts at 0
  ];

  const getBadgeIcon = (level: LeaderboardEntry['badgeLevel']) => {
    switch (level) {
      case 'Bronze':
        return <Award className="w-5 h-5 text-amber-600" />;
      case 'Silver':
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 'Gold':
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 'Platinum':
        return <Trophy className="w-5 h-5 text-purple-500" />;
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

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="civic-card p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-1">0</h3>
              <p className="text-muted-foreground">Active Members</p>
            </div>
            
            <div className="civic-card p-6 text-center">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-success" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-1">0</h3>
              <p className="text-muted-foreground">Total Points</p>
            </div>
            
            <div className="civic-card p-6 text-center">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-warning" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-1">0</h3>
              <p className="text-muted-foreground">Reports This Month</p>
            </div>
            
            <div className="civic-card p-6 text-center">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-1">0</h3>
              <p className="text-muted-foreground">Activities Completed</p>
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
                          <div className="font-medium text-foreground">{entry.name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-primary text-lg">{entry.points.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-foreground">{entry.reportsSubmitted}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-foreground">{entry.activitiesCompleted}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {getBadgeIcon(entry.badgeLevel)}
                            <span className="text-sm font-medium text-muted-foreground">
                              {entry.badgeLevel}
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
        </div>
      </div>
    </>
  );
};

export default Leaderboard;