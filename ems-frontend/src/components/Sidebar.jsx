import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = {
  ADMIN: [
    { label: 'Dashboard', icon: '📊', to: '/dashboard' },
    { label: 'User Management', icon: '👥', to: '/users' },
    { label: 'My Profile', icon: '👤', to: '/profile' },
  ],
  CONTROLLER: [
    { label: 'Dashboard', icon: '📊', to: '/dashboard' },
    { label: 'Vehicles', icon: '🚗', to: '/vehicles', disabled: true },
    { label: 'Driver Assignment', icon: '👨‍✈️', to: '/assignments', disabled: true },
    { label: 'Live Tracking', icon: '📍', to: '/tracking', disabled: true },
    { label: 'Maintenance', icon: '🔧', to: '/maintenance', disabled: true },
    { label: 'My Profile', icon: '👤', to: '/profile' },
  ],
  DRIVER: [
    { label: 'Dashboard', icon: '📊', to: '/dashboard' },
    { label: 'My Vehicle', icon: '🚗', to: '/vehicle', disabled: true },
    { label: 'Task List', icon: '📋', to: '/tasks', disabled: true },
    { label: 'Fuel Log', icon: '⛽', to: '/fuel', disabled: true },
    { label: 'My Profile', icon: '👤', to: '/profile' },
  ],
}

const Sidebar = () => {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const items = navItems[user?.role] || navItems.DRIVER

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const roleColor = { ADMIN: '#6366f1', CONTROLLER: '#3b82f6', DRIVER: '#10b981' }[user?.role] || '#6366f1'
  const roleBg   = { ADMIN: '#eef2ff', CONTROLLER: '#dbeafe', DRIVER: '#d1fae5'  }[user?.role] || '#eef2ff'
  const roleText = { ADMIN: 'Admin', CONTROLLER: 'Controller', DRIVER: 'Driver'  }[user?.role] || ''

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="sidebar-logo">🚗</div>
          <div>
            <div className="sidebar-title">V-MAS</div>
            <div className="sidebar-subtitle">Fleet Management</div>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <div className="nav-section-label">Navigation</div>
          {items.map((item) =>
            item.disabled ? (
              <div
                key={item.to}
                className="nav-item"
                style={{ opacity: 0.45, cursor: 'not-allowed', pointerEvents: 'none' }}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
                <span style={{
                  marginLeft: 'auto', fontSize: '0.62rem', fontWeight: 700,
                  background: '#fef3c7', color: '#92400e',
                  padding: '2px 6px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: '0.04em',
                }}>Soon</span>
              </div>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </NavLink>
            )
          )}
        </div>
      </nav>

      <div className="sidebar-footer">
        {/* User card */}
        <div className="sidebar-user" style={{ marginBottom: 8 }}>
          <img
            src={user?.profilePicture}
            alt={user?.userName}
            style={{
              width: 36, height: 36, borderRadius: '50%', objectFit: 'cover',
              border: `2px solid ${roleColor}25`, flexShrink: 0,
            }}
          />
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.userName}</div>
            <div className="sidebar-user-role">
              <span style={{
                display: 'inline-block', fontSize: '0.65rem', fontWeight: 700,
                background: roleBg, color: roleColor, padding: '1px 7px', borderRadius: 999,
                textTransform: 'uppercase', letterSpacing: '0.04em',
              }}>{roleText}</span>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 12px', borderRadius: 8, border: '1px solid #fee2e2',
            background: '#fff5f5', color: '#dc2626', cursor: 'pointer',
            fontFamily: 'inherit', fontSize: '0.82rem', fontWeight: 600,
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff5f5'; e.currentTarget.style.color = '#dc2626'; }}
        >
          <span>🚪</span> Sign Out
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
