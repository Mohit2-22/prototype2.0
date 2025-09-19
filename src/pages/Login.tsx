import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Upload, Lock } from 'lucide-react';
import Navigation from '../components/Navigation';
import { encryptPassword, validateEmail, validateAadhaar, validatePassword, validatePhone } from '../utils/encryption';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    dateOfBirth: '',
    aadhaar: '',
    email: '',
    phone: '',
    password: '',
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      // Login logic
      console.log('Login attempted with:', {
        identifier: formData.aadhaar || formData.email,
        password: encryptPassword(formData.password)
      });
    } else {
      // Signup logic
      if (!validateEmail(formData.email)) {
        alert('Please enter a valid email address');
        return;
      }
      
      if (!validatePassword(formData.password)) {
        alert('Password must be at least 6 characters long');
        return;
      }
      
      if (!validateAadhaar(formData.aadhaar)) {
        alert('Please enter a valid 12-digit Aadhaar number');
        return;
      }
      
      if (!validatePhone(formData.phone)) {
        alert('Please enter a valid 10-digit phone number');
        return;
      }
      
      console.log('Signup attempted with:', {
        ...formData,
        password: encryptPassword(formData.password)
      });
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

              <button type="submit" className="w-full civic-button-primary">
                {isLogin ? 'Sign In' : 'Create Account'}
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