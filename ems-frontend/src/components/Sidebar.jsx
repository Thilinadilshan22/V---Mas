import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Sidebar = () => {
  const { user, isAdmin, isController, isDriver, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="sidebar-logo">🚗</div>
          <div>
            <div className="sidebar-title">V-MAS</div>
            <div className="sidebar-subtitle">Vehicle Management</div>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {/* Common */}
        <div className="nav-section">
          <div className="nav-section-label">Main</div>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <span className="nav-icon">🏠</span>
            Dashboard
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <span className="nav-icon">👤</span>
            My Profile
          </NavLink>
        </div>

        {/* Admin Section */}
        {isAdmin && (
          <div className="nav-section">
            <div className="nav-section-label">Administration</div>
            <NavLink
              to="/users"
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            >
              <span className="nav-icon">👥</span>
              User Management
            </NavLink>
            <div className="nav-item" style={{ opacity: 0.5, cursor: 'default' }}>
              <span className="nav-icon">📊</span>
              System Reports
              <span style={{ marginLeft: 'auto', fontSize: '0.65rem', background: 'rgba(245,158,11,0.2)', color: '#f59e0b', padding: '2px 6px', borderRadius: '4px' }}>Soon</span>
            </div>
            <div className="nav-item" style={{ opacity: 0.5, cursor: 'default' }}>
              <span className="nav-icon">⚙️</span>
              Settings
              <span style={{ marginLeft: 'auto', fontSize: '0.65rem', background: 'rgba(245,158,11,0.2)', color: '#f59e0b', padding: '2px 6px', borderRadius: '4px' }}>Soon</span>
            </div>
          </div>
        )}

        {/* Controller Section */}
        {isController && (
          <div className="nav-section">
            <div className="nav-section-label">Fleet Control</div>
            <div className="nav-item" style={{ opacity: 0.5, cursor: 'default' }}>
              <span className="nav-icon">🚗</span>
              Vehicles
              <span style={{ marginLeft: 'auto', fontSize: '0.65rem', background: 'rgba(245,158,11,0.2)', color: '#f59e0b', padding: '2px 6px', borderRadius: '4px' }}>Soon</span>
            </div>
            <div className="nav-item" style={{ opacity: 0.5, cursor: 'default' }}>
              <span className="nav-icon">📍</span>
              Live Tracking
              <span style={{ marginLeft: 'auto', fontSize: '0.65rem', background: 'rgba(245,158,11,0.2)', color: '#f59e0b', padding: '2px 6px', borderRadius: '4px' }}>Soon</span>
            </div>
            <div className="nav-item" style={{ opacity: 0.5, cursor: 'default' }}>
              <span className="nav-icon">🔧</span>
              Maintenance
              <span style={{ marginLeft: 'auto', fontSize: '0.65rem', background: 'rgba(245,158,11,0.2)', color: '#f59e0b', padding: '2px 6px', borderRadius: '4px' }}>Soon</span>
            </div>
          </div>
        )}

        {/* Driver Section */}
        {isDriver && (
          <div className="nav-section">
            <div className="nav-section-label">My Work</div>
            <div className="nav-item" style={{ opacity: 0.5, cursor: 'default' }}>
              <span className="nav-icon">🚗</span>
              My Vehicle
              <span style={{ marginLeft: 'auto', fontSize: '0.65rem', background: 'rgba(245,158,11,0.2)', color: '#f59e0b', padding: '2px 6px', borderRadius: '4px' }}>Soon</span>
            </div>
            <div className="nav-item" style={{ opacity: 0.5, cursor: 'default' }}>
              <span className="nav-icon">📋</span>
              Tasks
              <span style={{ marginLeft: 'auto', fontSize: '0.65rem', background: 'rgba(245,158,11,0.2)', color: '#f59e0b', padding: '2px 6px', borderRadius: '4px' }}>Soon</span>
            </div>
            <div className="nav-item" style={{ opacity: 0.5, cursor: 'default' }}>
              <span className="nav-icon">⛽</span>
              Fuel Log
              <span style={{ marginLeft: 'auto', fontSize: '0.65rem', background: 'rgba(245,158,11,0.2)', color: '#f59e0b', padding: '2px 6px', borderRadius: '4px' }}>Soon</span>
            </div>
          </div>
        )}
      </nav>

      <div className="sidebar-footer">
        {/* User Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 8px', marginBottom: 8, borderRadius: 10, background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
          <img
            src={user?.profilePicture}
            alt={user?.userName}
            style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent)', flexShrink: 0 }}
          />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.userName}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{user?.role}</div>
          </div>
        </div>
        <button className="btn btn-danger w-full btn-sm" onClick={handleLogout}>
          🚪 Sign Out
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
