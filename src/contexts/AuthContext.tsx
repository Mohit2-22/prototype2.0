import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/apiService';
import { getAuthToken, removeAuthToken } from '../lib/api';

interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  total_points: number;
  is_verified: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    let cancelled = false;

    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    const initializeAuth = async () => {
      console.log('AuthContext: Initializing authentication...');
      const token = getAuthToken();
      const cachedUserRaw = localStorage.getItem('authUser');
      
      if (token && cachedUserRaw) {
        try {
          const cachedUser = JSON.parse(cachedUserRaw);
          console.log('AuthContext: Restoring cached user:', cachedUser.username);
          setUser(cachedUser); // Immediate optimistic restore
        } catch {
          console.warn('AuthContext: Invalid cached user data, removing...');
          localStorage.removeItem('authUser');
        }
      }

      if (!token) {
        console.log('AuthContext: No token found, user not authenticated');
        setIsLoading(false);
        return;
      }

      console.log('AuthContext: Token found, fetching fresh profile...');
      // Retry profile fetch up to 3 times on network errors
      let attempts = 0;
      while (attempts < 3 && !cancelled) {
        try {
          const response = await authService.getProfile();
          if (cancelled) return;
          
          console.log('AuthContext: Profile fetch successful:', response.data.username);
          setUser(response.data);
          localStorage.setItem('authUser', JSON.stringify(response.data));
          break;
        } catch (error: any) {
          const msg = error?.message || '';
          console.error(`AuthContext: Profile fetch attempt ${attempts + 1} failed:`, msg);
          
          if (msg.includes('401') || msg.includes('403') || msg.includes('Unauthorized')) {
            console.log('AuthContext: Authentication invalid, clearing session...');
            removeAuthToken();
            localStorage.removeItem('authUser');
            setUser(null);
            break;
          }
          
          attempts += 1;
          if (attempts < 3) {
            console.log(`AuthContext: Retrying in ${400 * attempts}ms...`);
            await delay(400 * attempts); // backoff
            continue;
          } else {
            console.error('AuthContext: All profile fetch attempts failed');
          }
        }
      }
      if (!cancelled) {
        console.log('AuthContext: Initialization complete');
        setIsLoading(false);
      }
    };

    initializeAuth();

    const storageListener = (e: StorageEvent) => {
      if (e.key === 'authToken' && !e.newValue) {
        setUser(null);
      }
      if (e.key === 'authUser' && e.newValue) {
        try { setUser(JSON.parse(e.newValue)); } catch { /* ignore */ }
      }
    };
    window.addEventListener('storage', storageListener);
    return () => {
      cancelled = true;
      window.removeEventListener('storage', storageListener);
    };
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('authUser', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      removeAuthToken();
      localStorage.removeItem('authUser');
      setUser(null);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...userData } as User;
      localStorage.setItem('authUser', JSON.stringify(updated));
      return updated;
    });
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};