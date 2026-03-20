import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard')
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await login(userName, password)
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error || 'Invalid username or password')
    }
    setLoading(false)
  }

  return (
    <div className="auth-page">
      {/* Left Panel */}
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-brand-logo">🚗</div>
          <div className="auth-brand-name">V-MAS</div>
          <p className="auth-brand-tagline">
            Smart Vehicle Management System — streamlining your fleet operations with ease.
          </p>
          <ul className="auth-feature-list">
            <li className="auth-feature-item">
              <span className="auth-feature-check">✓</span>
              Role-based access control
            </li>
            <li className="auth-feature-item">
              <span className="auth-feature-check">✓</span>
              Real-time fleet monitoring
            </li>
            <li className="auth-feature-item">
              <span className="auth-feature-check">✓</span>
              Secure JWT authentication
            </li>
            <li className="auth-feature-item">
              <span className="auth-feature-check">✓</span>
              Driver & vehicle management
            </li>
          </ul>
        </div>
      </div>

      {/* Right Panel */}
      <div className="auth-right">
        <div className="auth-right-inner">
          <div className="auth-header">
            <h1>Welcome back 👋</h1>
            <p>Sign in to your V-MAS account to continue</p>
          </div>

          {error && (
            <div className="error-message" style={{ marginBottom: 16 }}>
              ⚠️ {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-input-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                className="auth-input"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your username"
                required
                autoComplete="username"
              />
            </div>

            <div className="auth-input-group">
              <label htmlFor="password">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="auth-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: 12, top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none',
                    color: '#9ca3af', cursor: 'pointer', fontSize: '1rem', padding: 0,
                  }}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }}></span>
                  Signing in...
                </span>
              ) : (
                'Sign In →'
              )}
            </button>
          </form>

          <div className="auth-footer">
            Don't have an account?{' '}
            <Link to="/register">Create one here</Link>
          </div>

          <div style={{
            marginTop: 28,
            padding: '14px 16px',
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: 8,
            fontSize: '0.78rem',
            color: '#065f46',
            lineHeight: 1.6,
          }}>
            <strong>💡 Tip:</strong> Use your registered credentials. Contact your system administrator if you need access.
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
