import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Upload, Lock } from 'lucide-react';
import Navigation from '../components/Navigation';
import { validateEmail, validateAadhaar, validatePassword, validatePhone } from '../utils/encryption';
import { authService } from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);
  
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    age: '',
    dateOfBirth: '',
    aadhaar: '',
    email: '',
    phone: '',
    password: '',
    passwordConfirm: '',
    aadhaarFile: null as File | null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, aadhaarFile: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isLogin) {
        // Login logic
        const identifier = formData.aadhaar || formData.email || formData.username;
        if (!identifier || !formData.password) {
          setError('Please fill in all required fields');
          return;
        }
        
        const response = await authService.login(identifier, formData.password);
        
        if (response.token && response.user) {
          login(response.token, response.user);
          const from = (location.state as any)?.from?.pathname || '/dashboard';
          navigate(from, { replace: true });
        }
      } else {
        // Signup logic - validation
        if (!validateEmail(formData.email)) {
          setError('Please enter a valid email address');
          return;
        }
        
        if (!validatePassword(formData.password)) {
          setError('Password must be at least 6 characters long');
          return;
        }
        
        if (formData.password !== formData.passwordConfirm) {
          setError('Passwords do not match');
          return;
        }
        
        if (!validateAadhaar(formData.aadhaar)) {
          setError('Please enter a valid 12-digit Aadhaar number');
          return;
        }
        
        if (!validatePhone(formData.phone)) {
          setError('Please enter a valid 10-digit phone number');
          return;
        }
        
        const signupData = {
          username: formData.username || formData.email.split('@')[0],
          email: formData.email,
          password: formData.password,
          password_confirm: formData.passwordConfirm,
          full_name: formData.fullName,
          age: formData.age ? parseInt(formData.age) : null,
          date_of_birth: formData.dateOfBirth || null,
          aadhaar: formData.aadhaar,
          phone: formData.phone,
          aadhaar_document: formData.aadhaarFile,
        };
        
        const response = await authService.register(signupData);
        
        if (response.token && response.user) {
          login(response.token, response.user);
          const from = (location.state as any)?.from?.pathname || '/dashboard';
          navigate(from, { replace: true });
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navigation />
      
      <div className="min-h-screen bg-muted/30 py-12">
        <div className="max-w-md mx-auto px-4">
          <div className="civic-card p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {isLogin ? 'Welcome Back' : 'Join CivicCare'}
              </h1>
              <p className="text-muted-foreground">
                {isLogin ? 'Sign in to your account' : 'Create your account to get started'}
              </p>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="civic-input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="civic-input"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Age
                      </label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        className="civic-input"
                        min="18"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="civic-input"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Aadhaar Upload
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="civic-input"
                        accept=".pdf,.jpg,.jpeg,.png"
                        required
                      />
                      <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="civic-input"
                      placeholder="10-digit phone number"
                      required
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {isLogin ? 'Aadhaar Number / Email' : 'Aadhaar Number'}
                </label>
                <input
                  type="text"
                  name={isLogin ? 'identifier' : 'aadhaar'}
                  value={isLogin ? (formData.aadhaar || formData.email) : formData.aadhaar}
                  onChange={(e) => {
                    if (isLogin) {
                      // For login, it can be either aadhaar or email
                      const value = e.target.value;
                      if (value.includes('@')) {
                        setFormData(prev => ({ ...prev, email: value, aadhaar: '' }));
                      } else {
                        setFormData(prev => ({ ...prev, aadhaar: value, email: '' }));
                      }
                    } else {
                      handleInputChange(e);
                    }
                  }}
                  className="civic-input"
                  placeholder={isLogin ? "Enter Aadhaar number or email" : "12-digit Aadhaar number"}
                  required
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="civic-input"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="civic-input pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {!isLogin && (
                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Password will be encrypted for security
                  </p>
                )}
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="passwordConfirm"
                    value={formData.passwordConfirm}
                    onChange={handleInputChange}
                    className="civic-input"
                    required
                  />
                </div>
              )}

              <button 
                type="submit" 
                className="w-full civic-button-primary"
                disabled={loading}
              >
                {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:underline font-medium"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>

            {isLogin && (
              <div className="mt-4 text-center">
                <Link to="/forgot-password" className="text-muted-foreground hover:text-primary text-sm">
                  Forgot your password?
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;