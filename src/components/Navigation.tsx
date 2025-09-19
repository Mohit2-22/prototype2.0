import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, BarChart3, Award, Trophy, Phone, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  
  const publicNavItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/contact', label: 'Contact Us', icon: Phone },
  ];

  const authenticatedNavItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/special', label: 'Special Activities', icon: Award },
    { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { path: '/contact', label: 'Contact Us', icon: Phone },
  ];

  const navItems = isAuthenticated ? authenticatedNavItems : publicNavItems;
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="civic-nav sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">CivicCare</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg font-medium transition-colors ${
                  isActive(path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            ))}
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="text-sm text-foreground">
                  Welcome, <span className="font-medium">{user?.full_name || user?.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="civic-button-primary flex items-center space-x-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            ) : (
              <Link
                to="/login"
                className="civic-button-primary flex items-center space-x-1"
              >
                <User className="w-4 h-4" />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive(path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Link>
            ))}
            
            {isAuthenticated ? (
              <div className="mt-4 space-y-3">
                <div className="px-4 py-2 text-sm text-foreground">
                  Welcome, <span className="font-medium">{user?.full_name || user?.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : isLoading ? (
              <div className="mt-4 flex items-center justify-center space-x-2 px-4 py-3">
                <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-2 mt-4 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium"
                onClick={() => setIsOpen(false)}
              >
                <User className="w-5 h-5" />
                <span>Login</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;