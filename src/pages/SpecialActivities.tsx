import { Heart, Users, Award, Calendar, MapPin, Clock } from 'lucide-react';
import Navigation from '../components/Navigation';

interface Activity {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: React.ElementType;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedTime: string;
  location?: string;
}

const SpecialActivities = () => {
  const activities: Activity[] = [
    {
      id: '1',
      title: 'Government Event Volunteering',
      description: 'Participate in local government events, community meetings, and public awareness campaigns. Help organize and support civic initiatives in your area.',
      points: 0,
      icon: Users,
      category: 'Community Service',
      difficulty: 'Medium',
      estimatedTime: '3-5 hours',
      location: 'Various locations',
    },
    {
      id: '2',
      title: 'Assist Disabled / Blind Citizens',
      description: 'Provide assistance to disabled and visually impaired citizens with daily activities, navigation, and accessing public services.',
      points: 0,
      icon: Heart,
      category: 'Accessibility Support',
      difficulty: 'Easy',
      estimatedTime: '1-2 hours',
      location: 'Community centers',
    },
  ];

  const handleParticipate = (activityId: string) => {
    console.log(`Participating in activity: ${activityId}`);
    // Here you would implement the participation logic
    alert('Thank you for your interest! You will be contacted with more details soon.');
  };

  const getDifficultyColor = (difficulty: Activity['difficulty']) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-success bg-success/10';
      case 'Medium':
        return 'text-warning bg-warning/10';
      case 'Hard':
        return 'text-destructive bg-destructive/10';
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

          {/* Activity Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="civic-card p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-1">0</h3>
              <p className="text-muted-foreground">Activities Completed</p>
            </div>
            
            <div className="civic-card p-6 text-center">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-success" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-1">0</h3>
              <p className="text-muted-foreground">People Helped</p>
            </div>
            
            <div className="civic-card p-6 text-center">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-warning" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-1">0</h3>
              <p className="text-muted-foreground">Community Impact Score</p>
            </div>
          </div>

          {/* Activities Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {activities.map((activity) => {
              const IconComponent = activity.icon;
              
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
                        {activity.points}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        reward points
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {activity.description}
                  </p>

                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(activity.difficulty)}`}>
                      {activity.difficulty}
                    </div>
                    
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {activity.estimatedTime}
                    </div>
                    
                    {activity.location && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {activity.location}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleParticipate(activity.id)}
                    className="w-full civic-button-success"
                  >
                    Participate
                  </button>
                </div>
              );
            })}
          </div>

          {/* Call to Action */}
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