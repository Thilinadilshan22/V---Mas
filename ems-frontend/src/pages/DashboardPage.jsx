import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import { useAuth } from '../context/AuthContext'
import { userAPI } from '../services/api'

const StatCard = ({ icon, label, value, iconClass, change }) => (
  <div className="stat-card">
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
      <div>
        <p className="stat-card-label">{label}</p>
        <p className="stat-card-value">{value}</p>
        {change && <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: 3 }}>{change}</p>}
      </div>
      <div className={`stat-card-icon ${iconClass}`}>{icon}</div>
    </div>
  </div>
)

const AdminDashboard = ({ stats, loading, navigate }) => {
  if (loading) return (
    <div className="loading-spinner"><div className="spinner"></div><span>Loading statistics...</span></div>
  )
  return (
    <>
      <div className="section-header" style={{ marginBottom: 14 }}>
        <h2 className="section-title">User Statistics</h2>
        <div className="section-divider"></div>
      </div>
      <div className="stats-grid" style={{ marginBottom: 28 }}>
        <StatCard icon="👥" label="Total Users" value={stats.totalUsers} iconClass="icon-purple" change="Registered in system" />
        <StatCard icon="🛡️" label="Admins" value={stats.admins} iconClass="icon-indigo" change="System administrators" />
        <StatCard icon="🎮" label="Controllers" value={stats.controllers} iconClass="icon-blue" change="Fleet controllers" />
        <StatCard icon="🚗" label="Drivers" value={stats.drivers} iconClass="icon-green" change="Vehicle operators" />
        <StatCard icon="✅" label="Active" value={stats.activeUsers} iconClass="icon-green" change="Currently active accounts" />
        <StatCard icon="⛔" label="Inactive" value={stats.inactiveUsers} iconClass="icon-red" change="Disabled accounts" />
      </div>

      <div className="section-header" style={{ marginBottom: 14 }}>
        <h2 className="section-title">Quick Actions</h2>
        <div className="section-divider"></div>
      </div>
      <div className="features-grid">
        <div className="feature-card" onClick={() => navigate('/users')}>
          <div className="feature-icon">👥</div>
          <h3>User Management</h3>
          <p>Create, view, edit, and delete users. Manage roles and account status.</p>
          <button className="btn btn-primary btn-sm" style={{ marginTop: 14 }}>Open →</button>
        </div>
        <div className="feature-card" onClick={() => navigate('/profile')}>
          <div className="feature-icon">👤</div>
          <h3>My Profile</h3>
          <p>View and manage your personal profile, role information, and settings.</p>
          <button className="btn btn-secondary btn-sm" style={{ marginTop: 14 }}>View →</button>
        </div>
        <div className="feature-card" style={{ opacity: 0.5, cursor: 'default' }}>
          <div className="feature-icon">📊</div>
          <h3>System Reports</h3>
          <p>Generate detailed reports on system usage, user activities, and performance.</p>
          <span className="badge badge-warning" style={{ marginTop: 14, display: 'inline-flex' }}>Coming Soon</span>
        </div>
        <div className="feature-card" style={{ opacity: 0.5, cursor: 'default' }}>
          <div className="feature-icon">📝</div>
          <h3>Audit Logs</h3>
          <p>View and analyze system audit logs, activity history, and security events.</p>
          <span className="badge badge-warning" style={{ marginTop: 14, display: 'inline-flex' }}>Coming Soon</span>
        </div>
        <div className="feature-card" style={{ opacity: 0.5, cursor: 'default' }}>
          <div className="feature-icon">⚙️</div>
          <h3>System Settings</h3>
          <p>Configure system-wide settings, security policies, and app parameters.</p>
          <span className="badge badge-warning" style={{ marginTop: 14, display: 'inline-flex' }}>Coming Soon</span>
        </div>
        <div className="feature-card" style={{ opacity: 0.5, cursor: 'default' }}>
          <div className="feature-icon">🔔</div>
          <h3>Notifications</h3>
          <p>Manage system-wide notifications, alerts, and announcement broadcasts.</p>
          <span className="badge badge-warning" style={{ marginTop: 14, display: 'inline-flex' }}>Coming Soon</span>
        </div>
      </div>
    </>
  )
}

const ControllerDashboard = ({ navigate }) => (
  <>
    <div className="section-header" style={{ marginBottom: 14 }}>
      <h2 className="section-title">Fleet Overview</h2>
      <div className="section-divider"></div>
    </div>
    <div className="stats-grid" style={{ marginBottom: 28 }}>
      <StatCard icon="🚗" label="Total Vehicles" value="24" iconClass="icon-purple" change="Under your management" />
      <StatCard icon="✅" label="Active" value="18" iconClass="icon-green" change="Currently in use" />
      <StatCard icon="🔧" label="Maintenance" value="4" iconClass="icon-orange" change="Being serviced" />
      <StatCard icon="🟢" label="Available" value="2" iconClass="icon-blue" change="Ready to assign" />
    </div>
    <div className="section-header" style={{ marginBottom: 14 }}>
      <h2 className="section-title">Controller Tools</h2>
      <div className="section-divider"></div>
    </div>
    <div className="features-grid">
      {[
        { icon: '🚗', title: 'Vehicle Management', desc: 'Monitor, track, and manage all fleet vehicles.' },
        { icon: '👨‍✈️', title: 'Driver Assignment', desc: 'Assign and manage drivers to vehicles and routes.' },
        { icon: '📍', title: 'Live Tracking', desc: 'Real-time GPS tracking and vehicle monitoring.' },
        { icon: '🔧', title: 'Maintenance Schedule', desc: 'Schedule and track vehicle service appointments.' },
        { icon: '📊', title: 'Performance Reports', desc: 'Reports on vehicle usage and fuel efficiency.' },
        { icon: '⚠️', title: 'Alerts & Incidents', desc: 'Monitor vehicle alerts and emergency incidents.' },
      ].map(f => (
        <div key={f.title} className="feature-card" style={{ opacity: 0.55, cursor: 'default' }}>
          <div className="feature-icon">{f.icon}</div>
          <h3>{f.title}</h3>
          <p>{f.desc}</p>
          <span className="badge badge-warning" style={{ marginTop: 14, display: 'inline-flex' }}>Coming Soon</span>
        </div>
      ))}
    </div>
  </>
)

const DriverDashboard = () => (
  <>
    <div className="section-header" style={{ marginBottom: 14 }}>
      <h2 className="section-title">My Overview</h2>
      <div className="section-divider"></div>
    </div>
    <div className="stats-grid" style={{ marginBottom: 28 }}>
      <StatCard icon="🚗" label="Assigned Vehicle" value="1" iconClass="icon-purple" change="VH-2024-087" />
      <StatCard icon="📋" label="Today's Tasks" value="3" iconClass="icon-blue" change="Pending deliveries" />
      <StatCard icon="✅" label="Completed" value="12" iconClass="icon-green" change="This week" />
      <StatCard icon="🟢" label="Status" value="Active" iconClass="icon-green" change="Ready to drive" />
    </div>
    <div className="section-header" style={{ marginBottom: 14 }}>
      <h2 className="section-title">Driver Tools</h2>
      <div className="section-divider"></div>
    </div>
    <div className="features-grid">
      {[
        { icon: '🚗', title: 'My Vehicle', desc: 'View status and information about your assigned vehicle.' },
        { icon: '📋', title: 'Task List', desc: 'View and manage your assigned tasks and schedules.' },
        { icon: '📍', title: 'Navigation', desc: 'Get directions and optimal routes for deliveries.' },
        { icon: '⛽', title: 'Fuel Log', desc: 'Record fuel consumption and view usage history.' },
        { icon: '🔧', title: 'Report Issue', desc: 'Report vehicle issues or maintenance requirements.' },
        { icon: '📊', title: 'My Performance', desc: 'View driving stats, performance metrics, and history.' },
      ].map(f => (
        <div key={f.title} className="feature-card" style={{ opacity: 0.55, cursor: 'default' }}>
          <div className="feature-icon">{f.icon}</div>
          <h3>{f.title}</h3>
          <p>{f.desc}</p>
          <span className="badge badge-warning" style={{ marginTop: 14, display: 'inline-flex' }}>Coming Soon</span>
        </div>
      ))}
    </div>
  </>
)

const DashboardPage = () => {
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({ totalUsers: 0, admins: 0, controllers: 0, drivers: 0, activeUsers: 0, inactiveUsers: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        if (isAdmin) {
          const response = await userAPI.getAllUsers()
          const users = response.data.data || []
          setStats({
            totalUsers:    users.length,
            admins:        users.filter(u => u.role === 'ADMIN').length,
            controllers:   users.filter(u => u.role === 'CONTROLLER').length,
            drivers:       users.filter(u => u.role === 'DRIVER').length,
            activeUsers:   users.filter(u => u.accountStatus === 'ACTIVE').length,
            inactiveUsers: users.filter(u => u.accountStatus === 'INACTIVE').length,
          })
        }
      } catch (err) {
        console.error('Error loading stats:', err)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [isAdmin])

  const roleLabel = { ADMIN: 'Administrator', CONTROLLER: 'Fleet Controller', DRIVER: 'Vehicle Driver' }
  const roleEmoji = { ADMIN: '🛡️', CONTROLLER: '🎮', DRIVER: '🚗' }

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Dashboard" subtitle="Home / Dashboard" />
        <div className="page-body">

          {/* Welcome Banner */}
          <div className="welcome-banner">
            <div className="welcome-text">
              <h1>Good day, {user?.userName}! 👋</h1>
              <p>
                Logged in as{' '}
                <strong style={{ color: 'rgba(255,255,255,0.95)' }}>
                  {roleLabel[user?.role] || user?.role}
                </strong>
                {' '}· Here's your personalized overview
              </p>
            </div>
            <div className="welcome-icon">{roleEmoji[user?.role]}</div>
          </div>

          {/* Role-based content */}
          {user?.role === 'ADMIN'      && <AdminDashboard stats={stats} loading={loading} navigate={navigate} />}
          {user?.role === 'CONTROLLER' && <ControllerDashboard navigate={navigate} />}
          {user?.role === 'DRIVER'     && <DriverDashboard />}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
