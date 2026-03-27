import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'DRIVER',
    profilePicture: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard')
  }, [isAuthenticated, navigate])

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    const { confirmPassword, ...submitData } = formData
    if (!submitData.profilePicture) {
      submitData.profilePicture = `https://ui-avatars.com/api/?name=${encodeURIComponent(submitData.userName)}&background=6366f1&color=fff&size=128&bold=true`
    }
    const result = await register(submitData)
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error || 'Registration failed')
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
            Join the Smart Vehicle Service Management System and take control of your fleet operations.
          </p>
          <ul className="auth-feature-list">
            <li className="auth-feature-item">
              <span className="auth-feature-check">✓</span>
              Three distinct user roles
            </li>
            <li className="auth-feature-item">
              <span className="auth-feature-check">✓</span>
              Admin, Controller & Driver portals
            </li>
            <li className="auth-feature-item">
              <span className="auth-feature-check">✓</span>
              Centralized fleet management
            </li>
            <li className="auth-feature-item">
              <span className="auth-feature-check">✓</span>
              Secure & scalable platform
            </li>
          </ul>
        </div>
      </div>

      {/* Right Panel */}
      <div className="auth-right">
        <div className="auth-right-inner" style={{ maxWidth: 480 }}>
          <div className="auth-header">
            <h1>Create account ✨</h1>
            <p>Join V-MAS — fill in your details below</p>
          </div>

          {error && (
            <div className="error-message" style={{ marginBottom: 16 }}>
              ⚠️ {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="auth-input-group" style={{ gridColumn: '1 / -1' }}>
                <label>Username *</label>
                <input
                  type="text"
                  name="userName"
                  className="auth-input"
                  value={formData.userName}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  required
                />
              </div>
              <div className="auth-input-group" style={{ gridColumn: '1 / -1' }}>
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  className="auth-input"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div className="auth-input-group">
                <label>Password *</label>
                <input
                  type="password"
                  name="password"
                  className="auth-input"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  required
                />
              </div>
              <div className="auth-input-group">
                <label>Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="auth-input"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  required
                />
              </div>
              <div className="auth-input-group">
                <label>Role</label>
                <select
                  name="role"
                  className="auth-input"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="DRIVER">Driver</option>
                  <option value="CONTROLLER">Controller</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div className="auth-input-group">
                <label>Profile Picture URL</label>
                <input
                  type="url"
                  name="profilePicture"
                  className="auth-input"
                  value={formData.profilePicture}
                  onChange={handleChange}
                  placeholder="https://... (optional)"
                />
              </div>
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2, borderTopColor: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}></span>
                  Creating account...
                </span>
              ) : (
                'Create Account →'
              )}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
