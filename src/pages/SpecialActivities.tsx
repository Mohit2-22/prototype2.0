import { useState, useEffect } from 'react';
import { Heart, Users, Award, Calendar, MapPin, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import Navigation from '../components/Navigation';
import { activityService, authService } from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';

interface Activity {
  id: number;
  title: string;
  description: string;
  points_reward: number;
  category: string;
  max_participants: number;
  current_participants: number;
  start_date: string;
  end_date: string;
  location: string;
  requirements: string;
  contact_info: string;
  is_active: boolean;
  created_at: string;
  category_name?: string;
}

interface ActivityStats {
  total_activities: number;
  user_participations: number;
  points_earned: number;
  people_helped: number;
  community_impact_score: number;
}

interface Participation {
  id: number;
  activity: number;
  status: 'Registered' | 'Approved' | 'Completed' | 'Cancelled';
  created_at: string;
  completed_at?: string;
  feedback?: string;
  rating?: number;
}

const SpecialActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [participations, setParticipations] = useState<Participation[]>([]);
  const [stats, setStats] = useState<ActivityStats>({
    total_activities: 0,
    user_participations: 0,
    points_earned: 0,
    people_helped: 0,
    community_impact_score: 0,
  });
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { updateUser } = useAuth();

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [activitiesRes, participationsRes, statsRes] = await Promise.all([
          activityService.getActivities(),
          activityService.getMyParticipations(),
          activityService.getActivityStats(),
        ]);
        
        setActivities(activitiesRes.data || []);
        setParticipations(participationsRes.data || []);
        setStats(statsRes.data || {
          total_activities: 0,
          user_participations: 0,
          points_earned: 0,
          people_helped: 0,
          community_impact_score: 0,
        });
      } catch (err: any) {
        console.error('Error fetching activities data:', err);
        setError(err.message || 'Failed to load activities data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleParticipate = async (activityId: number) => {
    setSubmitLoading(activityId);
    setError(null);
    
    try {
      const response = await activityService.participateInActivity(activityId);
      
      // Add new participation to the list
      setParticipations(prev => [...prev, response.data]);
      
      // Update activity current participants count
      setActivities(prev => 
        prev.map(activity => 
          activity.id === activityId 
            ? { ...activity, current_participants: activity.current_participants + 1 }
            : activity
        )
      );
      
      // Update user stats
      setStats(prev => ({
        ...prev,
        user_participations: prev.user_participations + 1,
      }));
      
      alert('Successfully registered for the activity! You will be contacted with more details soon.');
    } catch (err: any) {
      console.error('Error participating in activity:', err);
      setError(err.message || 'Failed to register for activity');
    } finally {
      setSubmitLoading(null);
    }
  };

  const isParticipating = (activityId: number) => {
    return participations.some(p => p.activity === activityId && p.status !== 'Cancelled');
  };

  const getActivityIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'community service':
        return Users;
      case 'accessibility support':
        return Heart;
      case 'environmental':
        return Award;
      default:
        return Users;
    }
  };

  return (
    <>
      <Navigation />
      
      <div className="min-h-screen bg-muted/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Special Activities</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Make a difference in your community through meaningful volunteer activities. 
              Earn points while helping others and building a stronger society.
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
              <p className="mt-4 text-muted-foreground">Loading activities...</p>
            </div>
          ) : (
            <>
              {/* Activity Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <div className="civic-card p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-1">{stats.user_participations}</h3>
                  <p className="text-muted-foreground">Your Participations</p>
                </div>
                
                <div className="civic-card p-6 text-center">
                  <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-success" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-1">{stats.people_helped}</h3>
                  <p className="text-muted-foreground">People Helped</p>
                </div>
                
                <div className="civic-card p-6 text-center">
                  <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-6 h-6 text-warning" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-1">{stats.points_earned}</h3>
                  <p className="text-muted-foreground">Points Earned</p>
                </div>

                <div className="civic-card p-6 text-center">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-purple-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-1">{stats.total_activities}</h3>
                  <p className="text-muted-foreground">Available Activities</p>
                </div>
              </div>
            </>
          )}

          {!loading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {activities.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Award className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No activities available</h3>
                  <p className="text-muted-foreground">Check back soon for new community activities!</p>
                </div>
              ) : (
                activities.map((activity) => {
                  const IconComponent = getActivityIcon(activity.category);
                  const isUserParticipating = isParticipating(activity.id);
                  const isFull = activity.current_participants >= activity.max_participants;
                  const isActive = activity.is_active && new Date(activity.end_date) > new Date();
              
              return (
                <div key={activity.id} className="civic-card p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
                        <IconComponent className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-foreground mb-1">
                          {activity.title}
                        </h3>
                        <span className="text-sm text-muted-foreground">
                          {activity.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                                                    {activity.points_reward}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        reward points
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {activity.description}
                  </p>

                      <div className="flex flex-wrap gap-3 mb-6">
                        <div className="flex items-center gap-1 px-3 py-1 bg-muted rounded-full text-sm">
                          <Users className="w-4 h-4" />
                          {activity.current_participants}/{activity.max_participants}
                        </div>
                  </div>

                  <button
                    onClick={() => handleParticipate(activity.id)}
                    className="w-full civic-button-success"
                  >
                    Participate
                  </button>
                </div>
              );
                })
              )}
            </div>
          )}          {/* Call to Action */}
          <div className="mt-16 text-center">
            <div className="civic-card p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Want to Suggest an Activity?
              </h2>
              <p className="text-muted-foreground mb-6">
                Have an idea for a community service activity? We'd love to hear from you!
              </p>
              <button className="civic-button-primary">
                Suggest Activity
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SpecialActivities;