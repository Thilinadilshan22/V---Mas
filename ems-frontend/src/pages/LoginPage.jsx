import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, Truck, Shield, BarChart3, MapPin, AlertCircle } from 'lucide-react';
import './LoginPage.css';
import bgImage from '../assets/login-bg.jpg';

const LoginPage = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(userName, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Invalid username or password');
    }
    setLoading(false);
  };

  return (
    <div className="split-login-container">
      {/* Background with user provided image */}
      <img 
        src={bgImage} 
        alt="Dark background with vehicle lights" 
        className="split-login-bg-image" 
      />
      <div className="split-login-bg-gradient" />

      {/* Main Split Container */}
      <div className="split-login-main-card">
        
        {/* Left Panel - Branding */}
        <div className="split-login-left">
          {/* Decorative circles */}
          <div className="split-login-circle-1" />
          <div className="split-login-circle-2" />

          <div className="split-login-left-content">
            <div className="split-login-logo-container">
              <div className="split-login-logo-box">
                <Truck className="split-login-logo-icon" color="white" size={20} />
              </div>
              <span className="split-login-logo-text">V-MAS</span>
            </div>

            <h2 className="split-login-heading">
              Manage Your<br />Fleet Smarter
            </h2>
            <p className="split-login-subheading">
              Real-time tracking, advanced analytics, and complete control over your vehicle operations.
            </p>

            <div className="split-login-features">
              <div className="split-login-feature-item">
                <div className="split-login-feature-icon">
                  <Shield size={16} />
                </div>
                <span className="split-login-feature-text">Enterprise-grade Security</span>
              </div>
              <div className="split-login-feature-item">
                <div className="split-login-feature-icon">
                  <BarChart3 size={16} />
                </div>
                <span className="split-login-feature-text">Real-time Analytics</span>
              </div>
              <div className="split-login-feature-item">
                <div className="split-login-feature-icon">
                  <MapPin size={16} />
                </div>
                <span className="split-login-feature-text">Live GPS Tracking</span>
              </div>
            </div>
          </div>

          <p className="split-login-copyright">© 2026 V-MAS. All rights reserved.</p>
        </div>

        {/* Right Panel - Form */}
        <div className="split-login-right">
          <div className="split-login-mobile-logo">
            <div className="split-login-mobile-logo-box">
              <Truck size={16} color="white" />
            </div>
            <span className="split-login-title" style={{ marginBottom: 0 }}>V-MAS</span>
          </div>

          <h3 className="split-login-title">Welcome back</h3>
          <p className="split-login-subtitle">Sign in to your account to continue</p>

          {error && (
            <div className="split-login-error">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form className="split-login-form" onSubmit={handleSubmit}>
            <div className="split-login-input-wrapper">
              <label className="split-login-label">Username</label>
              <div className="split-login-input-group">
                <Mail className="split-login-input-icon" size={16} />
                <input 
                  type="text" 
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your username"
                  className="split-login-input" 
                  required
                />
              </div>
            </div>
            
            <div className="split-login-input-wrapper">
              <label className="split-login-label">Password</label>
              <div className="split-login-input-group">
                <Lock className="split-login-input-icon" size={16} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="split-login-input" 
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="split-login-input-btn"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="split-login-options">
              <label className="split-login-remember" onClick={() => setRemember(!remember)}>
                <div className={`split-login-checkbox ${remember ? 'checked' : ''}`}>
                  {remember && <div className="split-login-checkbox-inner" />}
                </div>
                <span className="split-login-remember-text">Remember me</span>
              </label>
              <a href="#" className="split-login-forgot" onClick={(e) => e.preventDefault()}>Forgot password?</a>
            </div>

            <button type="submit" className="split-login-submit" disabled={loading}>
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <span>Sign In to Dashboard</span>
              )}
            </button>
          </form>

          <div className="split-login-divider">
            <div className="split-login-divider-line" />
            <span className="split-login-divider-text">or</span>
            <div className="split-login-divider-line" />
          </div>

          <div className="split-login-socials">
            <button className="split-login-social-btn" onClick={() => {}}>Google</button>
            <button className="split-login-social-btn" onClick={() => {}}>Facebook</button>
            <button className="split-login-social-btn" onClick={() => {}}>Apple</button>
          </div>

          <p className="split-login-footer">
            New to V-MAS?{" "}
            <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
