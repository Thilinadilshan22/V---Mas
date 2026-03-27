import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const isActive = (path) => {
    return location.pathname === path ? 'active' : ''
  }

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">V-MAS</div>
        <div className="navbar-menu">
          <Link to="/dashboard" className={`navbar-link ${isActive('/dashboard')}`}>
            Dashboard
          </Link>
          {isAdmin && (
            <Link to="/users" className={`navbar-link ${isActive('/users')}`}>
              Users
            </Link>
          )}
          <div className="navbar-user">
            {user?.profilePicture && (
              <img src={user.profilePicture} alt={user.userName} className="user-avatar" />
            )}
            <div className="user-info">
              <span className="user-name">{user?.userName}</span>
              <span className={`user-role role-${user?.role?.toLowerCase()}`}>
                {user?.role}
              </span>
            </div>
            <button onClick={handleLogout} className="btn btn-secondary btn-sm">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
