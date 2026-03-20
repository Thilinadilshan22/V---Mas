import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import { useAuth } from '../context/AuthContext'
import { userAPI } from '../services/api'

const ProfilePage = () => {
  const { user, isAdmin } = useAuth()
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const roleBadgeClass = {
    ADMIN: 'badge badge-admin',
    CONTROLLER: 'badge badge-controller',
    DRIVER: 'badge badge-driver',
  }[user?.role] || 'badge'

  const roleDescription = {
    ADMIN: 'Full system access — manage users, view reports, and configure the system.',
    CONTROLLER: 'Fleet control access — manage vehicles, assign drivers, and monitor operations.',
    DRIVER: 'Driver access — view assigned vehicles, tasks, and log fuel consumption.',
  }[user?.role] || ''

  const infoRows = [
    { label: 'Username', value: user?.userName, icon: '👤' },
    { label: 'Role', value: <span className={roleBadgeClass}>{user?.role}</span>, icon: '🔑' },
    { label: 'Account Status', value: <span className="badge badge-active">● Active</span>, icon: '✅' },
  ]

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Topbar title="My Profile" subtitle="Home / Profile" />
        <div className="page-body">

          <div className="page-header">
            <div>
              <h1 className="page-title">My Profile</h1>
              <p className="page-subtitle">View your account information and role details</p>
            </div>
          </div>

          {error   && <div className="alert alert-error"   style={{ marginBottom: 16 }}><span>⚠️</span> {error}</div>}
          {success && <div className="alert alert-success" style={{ marginBottom: 16 }}><span>✅</span> {success}</div>}

          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24, alignItems: 'start' }}>

            {/* Profile Card */}
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: 20 }}>
                <img
                  src={user?.profilePicture}
                  alt={user?.userName}
                  className="avatar-xl"
                />
                <div style={{
                  position: 'absolute', bottom: 4, right: 4,
                  width: 16, height: 16, borderRadius: '50%',
                  background: 'var(--success)',
                  border: '2px solid var(--bg-card)',
                }}></div>
              </div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                {user?.userName}
              </h2>
              <span className={roleBadgeClass} style={{ marginBottom: 16, display: 'inline-block' }}>
                {user?.role}
              </span>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6, marginTop: 8 }}>
                {roleDescription}
              </p>

              {/* Role Permissions */}
              <div style={{
                marginTop: 24,
                padding: '14px 16px',
                background: 'var(--bg-elevated)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                textAlign: 'left',
              }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                  Your Permissions
                </div>
                {isAdmin ? (
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {['Manage all users', 'View system stats', 'Configure settings', 'Access all modules'].map(p => (
                      <li key={p} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ color: 'var(--success)' }}>✓</span> {p}
                      </li>
                    ))}
                  </ul>
                ) : user?.role === 'CONTROLLER' ? (
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {['Manage fleet vehicles', 'Assign drivers', 'Live vehicle tracking', 'Schedule maintenance'].map(p => (
                      <li key={p} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ color: 'var(--success)' }}>✓</span> {p}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {['View assigned vehicle', 'Manage tasks', 'Log fuel usage', 'Report vehicle issues'].map(p => (
                      <li key={p} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ color: 'var(--success)' }}>✓</span> {p}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Info Panel */}
            <div>
              <div className="card" style={{ marginBottom: 20 }}>
                <div className="section-header" style={{ marginBottom: 20 }}>
                  <h2 className="section-title">Account Information</h2>
                  <div className="section-divider"></div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {infoRows.map((row, idx) => (
                    <div key={idx} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '14px 0',
                      borderBottom: idx < infoRows.length - 1 ? '1px solid var(--border)' : 'none',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: '1.1rem' }}>{row.icon}</span>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>{row.label}</span>
                      </div>
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Session info */}
              <div className="card">
                <div className="section-header" style={{ marginBottom: 20 }}>
                  <h2 className="section-title">Session Information</h2>
                  <div className="section-divider"></div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 14, background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '1.2rem' }}>🔐</span>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>Authentication</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>JWT Token-based authentication active</div>
                    </div>
                    <span className="badge badge-active" style={{ marginLeft: 'auto' }}>Secure</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 14, background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '1.2rem' }}>🌐</span>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>Backend API</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Connected to V-MAS Spring Boot backend</div>
                    </div>
                    <span className="badge badge-active" style={{ marginLeft: 'auto' }}>Connected</span>
                  </div>
                </div>

                <div style={{
                  marginTop: 20,
                  padding: 16,
                  background: 'var(--accent-light)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(99,102,241,0.2)',
                  fontSize: '0.82rem',
                  color: 'var(--text-muted)',
                }}>
                  <span style={{ color: 'var(--text-accent)', fontWeight: 600 }}>💡 Note:</span>{' '}
                  Profile editing and password change features are coming soon. Contact your administrator for account changes.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
