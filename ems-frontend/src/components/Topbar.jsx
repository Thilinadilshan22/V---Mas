import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const roleBadgeStyle = {
  ADMIN:      { background: '#ede9fe', color: '#6d28d9' },
  CONTROLLER: { background: '#dbeafe', color: '#1d4ed8' },
  DRIVER:     { background: '#d1fae5', color: '#065f46' },
}

const Topbar = ({ title, subtitle }) => {
  const { user } = useAuth()
  const badgeStyle = roleBadgeStyle[user?.role] || { background: '#f3f4f6', color: '#374151' }

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div>
          <div className="topbar-title">{title}</div>
          {subtitle && <div className="topbar-breadcrumb">{subtitle}</div>}
        </div>
      </div>

      <div className="topbar-right">
        <span style={{
          padding: '4px 12px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '0.05em',
          ...badgeStyle,
        }}>
          {user?.role}
        </span>

        <Link to="/profile">
          <div className="topbar-user">
            <img src={user?.profilePicture} alt={user?.userName} className="topbar-avatar" />
            <div>
              <div className="topbar-name">{user?.userName}</div>
            </div>
          </div>
        </Link>
      </div>
    </header>
  )
}

export default Topbar
