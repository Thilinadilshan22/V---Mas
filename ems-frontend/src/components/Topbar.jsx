import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Topbar = ({ title, subtitle }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const roleBadgeClass = {
    ADMIN: 'badge badge-admin',
    CONTROLLER: 'badge badge-controller',
    DRIVER: 'badge badge-driver',
  }[user?.role] || 'badge'

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div>
          <div className="topbar-title">{title}</div>
          {subtitle && <div className="topbar-breadcrumb">{subtitle}</div>}
        </div>
      </div>

      <div className="topbar-right">
        <span className={roleBadgeClass}>{user?.role}</span>
        <div className="topbar-user" onClick={() => navigate('/profile')}>
          <img
            src={user?.profilePicture}
            alt={user?.userName}
            className="topbar-avatar"
          />
          <div>
            <div className="topbar-name">{user?.userName}</div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Topbar
