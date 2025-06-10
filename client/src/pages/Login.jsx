import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, User, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import API from '../services/api.mjs';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const result = await API.auth.login({
        username: formData.username,
        password: formData.password
      });
      
      if (result.success) {
        // Login to context
        await login(result.data.user);
        
        // Redirect after successful login
        navigate('/');
      } else {
        // Show the specific error message from the server
        setError(result.error || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      // Only show network error for actual network issues
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-vh-100 d-flex align-items-center position-relative"
      style={{
        backgroundImage: 'url(/images/freepik__the-style-is-candid-image-photography-with-natural__62692.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Background overlay for better readability */}
      <div 
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(2px)'
        }}
      ></div>
      
      <div className="container position-relative">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            {/* Back to Home */}
            <div className="mb-4">
              <button 
                className="btn d-flex align-items-center p-2 rounded"
                style={{
                  color: 'white', 
                  textDecoration: 'none',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="me-2" size={20} />
                Back to Home
              </button>
            </div>

            {/* Login Card */}
            <div className="card border-0 shadow-lg" style={{backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)'}}>
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <img 
                    src="/images/logo1.png" 
                    alt="Logo" 
                    className="img-fluid mb-3"
                    style={{ maxHeight: '80px' }}
                  />
                  <h2 className="fw-bold mb-2" style={{color: '#1e3a8a'}}>Welcome Back</h2>
                  <p className="text-muted">Sign in to continue your adventure</p>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* Error Message */}
                  {error && (
                    <div className="alert alert-danger mb-3" role="alert">
                      {error}
                    </div>
                  )}

                  {/* Username Field */}
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label fw-semibold" style={{color: '#1e3a8a'}}>
                      Username
                    </label>
                    <div className="position-relative">
                      <User 
                        className="position-absolute top-50 translate-middle-y ms-3" 
                        size={20} 
                        style={{color: '#4A90E2'}}
                      />
                      <input
                        type="text"
                        className="form-control ps-5 py-3"
                        id="username"
                        name="username"
                        placeholder="Enter your username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        style={{
                          borderColor: '#d1d5db',
                          fontSize: '16px'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#4A90E2';
                          e.target.style.boxShadow = '0 0 0 0.2rem rgba(74, 144, 226, 0.25)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#d1d5db';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label fw-semibold" style={{color: '#1e3a8a'}}>
                      Password
                    </label>
                    <div className="position-relative">
                      <Lock 
                        className="position-absolute top-50 translate-middle-y ms-3" 
                        size={20} 
                        style={{color: '#4A90E2'}}
                      />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-control ps-5 pe-5 py-3"
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={{
                          borderColor: '#d1d5db',
                          fontSize: '16px'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#4A90E2';
                          e.target.style.boxShadow = '0 0 0 0.2rem rgba(74, 144, 226, 0.25)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#d1d5db';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-link position-absolute top-50 translate-middle-y end-0 me-3 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{color: '#4A90E2'}}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="rememberMe"
                        style={{
                          borderColor: '#d1d5db',
                          accentColor: '#4A90E2'
                        }}
                      />
                      <label className="form-check-label text-muted" htmlFor="rememberMe">
                        Remember me
                      </label>
                    </div>
                    <button
                      type="button"
                      className="btn btn-link p-0"
                      style={{color: '#4A90E2', textDecoration: 'none'}}
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* Login Button */}
                  <button
                    type="submit"
                    className="btn btn-lg w-100 py-3 mb-3"
                    disabled={isLoading}
                    style={{
                                      backgroundColor: '#4A90E2',
                borderColor: '#4A90E2',
                      color: 'white',
                      fontWeight: '600'
                    }}
                  >
                    {isLoading ? (
                      <div className="d-flex align-items-center justify-content-center">
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        Signing In...
                      </div>
                    ) : (
                      'Sign In'
                    )}
                  </button>

                  {/* Demo Note */}
                  <div className="text-center">
                    <p className="text-muted mb-0">
                      Don't have an account? Send us an email to{' '}
                      <a href="mailto:info@stuffhappens.com" className="text-decoration-none" style={{color: '#4A90E2', fontWeight: '600'}}>
                        info@stuffhappens.com
                      </a>
                    </p>
                  </div>
                </form>
              </div>
            </div>

            {/* Benefits Section */}
            <div className="card border-0 mt-4" style={{backgroundColor: '#f8fafc'}}>
              <div className="card-body p-4 text-center">
                <h6 className="fw-bold mb-2" style={{color: '#1e3a8a'}}>Why create an account?</h6>
                <div className="row g-3">
                  <div className="col-4">
                    <div className="small text-muted">
                      <div className="fw-semibold">Track Progress</div>
                      <div>Save your scores</div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="small text-muted">
                      <div className="fw-semibold">All Themes</div>
                      <div>Unlock everything</div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="small text-muted">
                      <div className="fw-semibold">Leaderboards</div>
                      <div>Compete globally</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 