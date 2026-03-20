import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { userAPI } from '../services/api'

const DashboardPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalUsers: 0,
    admins: 0,
    controllers: 0,
    drivers: 0,
    activeUsers: 0,
    inactiveUsers: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        if (user?.role === 'ADMIN') {
          const response = await userAPI.getAllUsers()
          const users = response.data.data
          
          setStats({
            totalUsers: users.length,
            admins: users.filter(u => u.role === 'ADMIN').length,
            controllers: users.filter(u => u.role === 'CONTROLLER').length,
            drivers: users.filter(u => u.role === 'DRIVER').length,
            activeUsers: users.filter(u => u.accountStatus === 'ACTIVE').length,
            inactiveUsers: users.filter(u => u.accountStatus === 'INACTIVE').length
          })
        }
      } catch (error) {
        console.error('Error loading stats:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadStats()
  }, [user])

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="dashboard">
          <div className="dashboard-header">
            <h1>Welcome, {user?.userName}!</h1>
            <p>Your role: <span className={`role-badge role-${user?.role?.toLowerCase()}`}>{user?.role}</span></p>
            <p style={{ marginTop: '10px', color: '#666' }}>
              {user?.role === 'ADMIN' && 'You have full system access and can manage all users.'}
              {user?.role === 'CONTROLLER' && 'You can monitor vehicles and manage their status.'}
              {user?.role === 'DRIVER' && 'You can view and update your assigned vehicles.'}
            </p>
          </div>

          {user?.role === 'ADMIN' && (
            <>
              {loading ? (
                <div className="loading">Loading statistics...</div>
              ) : (
                <>
                  <h2 style={{ marginBottom: '20px', color: '#333' }}>System Overview</h2>
                  <div className="stats-grid">
                    <div className="stat-card">
                      <h3>Total Users</h3>
                      <div className="stat-value">{stats.totalUsers}</div>
                      <p style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>Registered in system</p>
                    </div>
                    <div className="stat-card">
                      <h3>Admins</h3>
                      <div className="stat-value">{stats.admins}</div>
                      <p style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>System administrators</p>
                    </div>
                    <div className="stat-card">
                      <h3>Controllers</h3>
                      <div className="stat-value">{stats.controllers}</div>
                      <p style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>Vehicle controllers</p>
                    </div>
                    <div className="stat-card">
                      <h3>Drivers</h3>
                      <div className="stat-value">{stats.drivers}</div>
                      <p style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>Vehicle drivers</p>
                    </div>
                    <div className="stat-card">
                      <h3>Active Users</h3>
                      <div className="stat-value" style={{ color: '#4caf50' }}>{stats.activeUsers}</div>
                      <p style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>Currently active</p>
                    </div>
                    <div className="stat-card">
                      <h3>Inactive Users</h3>
                      <div className="stat-value" style={{ color: '#f44336' }}>{stats.inactiveUsers}</div>
                      <p style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>Temporarily disabled</p>
                    </div>
                  </div>

                  <h2 style={{ margin: '30px 0 20px', color: '#333' }}>Admin Capabilities</h2>
                  <div className="features-grid">
                    <div className="feature-card" onClick={() => navigate('/users')}>
                      <div className="feature-icon">👥</div>
                      <h3>User Management</h3>
                      <p>Create, view, update, and delete users. Manage roles and permissions.</p>
                      <button className="btn btn-primary btn-sm" style={{ marginTop: '15px' }}>
                        Manage Users
                      </button>
                    </div>
                    <div className="feature-card">
                      <div className="feature-icon">🔐</div>
                      <h3>Access Control</h3>
                      <p>Configure role-based permissions and access levels for different user types.</p>
                      <button className="btn btn-secondary btn-sm" style={{ marginTop: '15px' }}>
                        Configure Access
                      </button>
                    </div>
                    <div className="feature-card">
                      <div className="feature-icon">📊</div>
                      <h3>System Reports</h3>
                      <p>Generate and view detailed reports on system usage and user activities.</p>
                      <button className="btn btn-secondary btn-sm" style={{ marginTop: '15px' }}>
                        View Reports
                      </button>
                    </div>
                    <div className="feature-card">
                      <div className="feature-icon">⚙️</div>
                      <h3>System Settings</h3>
                      <p>Configure system-wide settings, security policies, and application parameters.</p>
                      <button className="btn btn-secondary btn-sm" style={{ marginTop: '15px' }}>
                        Settings
                      </button>
                    </div>
                    <div className="feature-card">
                      <div className="feature-icon">🔔</div>
                      <h3>Notifications</h3>
                      <p>Manage system notifications and alerts for all users and events.</p>
                      <button className="btn btn-secondary btn-sm" style={{ marginTop: '15px' }}>
                        Manage Alerts
                      </button>
                    </div>
                    <div className="feature-card">
                      <div className="feature-icon">📝</div>
                      <h3>Audit Logs</h3>
                      <p>View and analyze system audit logs and user activity history.</p>
                      <button className="btn btn-secondary btn-sm" style={{ marginTop: '15px' }}>
                        View Logs
                      </button>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {user?.role === 'CONTROLLER' && (
            <>
              <h2 style={{ marginBottom: '20px', color: '#333' }}>Controller Dashboard</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>Total Vehicles</h3>
                  <div className="stat-value">24</div>
                  <p style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>Under your control</p>
                </div>
                <div className="stat-card">
                  <h3>Active Vehicles</h3>
                  <div className="stat-value" style={{ color: '#4caf50' }}>18</div>
                  <p style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>Currently in use</p>
                </div>
                <div className="stat-card">
                  <h3>Maintenance</h3>
                  <div className="stat-value" style={{ color: '#ff9800' }}>4</div>
                  <p style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>In maintenance</p>
                </div>
                <div className="stat-card">
                  <h3>Available</h3>
                  <div className="stat-value" style={{ color: '#2196f3' }}>2</div>
                  <p style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>Ready to assign</p>
                </div>
              </div>

              <h2 style={{ margin: '30px 0 20px', color: '#333' }}>Controller Capabilities</h2>
              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-icon">🚗</div>
                  <h3>Vehicle Management</h3>
                  <p>Monitor, track, and manage all vehicles in the fleet.</p>
                  <button className="btn btn-primary btn-sm" style={{ marginTop: '15px' }}>
                    Manage Vehicles
                  </button>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">👨‍✈️</div>
                  <h3>Driver Assignment</h3>
                  <p>Assign and manage drivers for different vehicles and routes.</p>
                  <button className="btn btn-primary btn-sm" style={{ marginTop: '15px' }}>
                    Assign Drivers
                  </button>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">📍</div>
                  <h3>Live Tracking</h3>
                  <p>Real-time GPS tracking and location monitoring of all vehicles.</p>
                  <button className="btn btn-primary btn-sm" style={{ marginTop: '15px' }}>
                    Track Vehicles
                  </button>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">🔧</div>
                  <h3>Maintenance Schedule</h3>
                  <p>Schedule and track vehicle maintenance and service appointments.</p>
                  <button className="btn btn-secondary btn-sm" style={{ marginTop: '15px' }}>
                    View Schedule
                  </button>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">📊</div>
                  <h3>Performance Reports</h3>
                  <p>Generate reports on vehicle usage, fuel consumption, and efficiency.</p>
                  <button className="btn btn-secondary btn-sm" style={{ marginTop: '15px' }}>
                    View Reports
                  </button>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">⚠️</div>
                  <h3>Alerts & Incidents</h3>
                  <p>Monitor and respond to vehicle alerts, incidents, and emergencies.</p>
                  <button className="btn btn-secondary btn-sm" style={{ marginTop: '15px' }}>
                    View Alerts
                  </button>
                </div>
              </div>
            </>
          )}

          {user?.role === 'DRIVER' && (
            <>
              <h2 style={{ marginBottom: '20px', color: '#333' }}>Driver Dashboard</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>Assigned Vehicle</h3>
                  <div className="stat-value">1</div>
                  <p style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>Vehicle #VH-2024-087</p>
                </div>
                <div className="stat-card">
                  <h3>Today's Tasks</h3>
                  <div className="stat-value" style={{ color: '#2196f3' }}>3</div>
                  <p style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>Pending deliveries</p>
                </div>
                <div className="stat-card">
                  <h3>Completed</h3>
                  <div className="stat-value" style={{ color: '#4caf50' }}>12</div>
                  <p style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>This week</p>
                </div>
                <div className="stat-card">
                  <h3>Vehicle Status</h3>
                  <div className="stat-value" style={{ color: '#4caf50', fontSize: '20px' }}>Active</div>
                  <p style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>Ready to drive</p>
                </div>
              </div>

              <h2 style={{ margin: '30px 0 20px', color: '#333' }}>Driver Capabilities</h2>
              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-icon">🚗</div>
                  <h3>My Vehicle</h3>
                  <p>View details, status, and information about your assigned vehicle.</p>
                  <button className="btn btn-primary btn-sm" style={{ marginTop: '15px' }}>
                    View Vehicle
                  </button>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">📋</div>
                  <h3>Task List</h3>
                  <p>View and manage your assigned tasks and delivery schedules.</p>
                  <button className="btn btn-primary btn-sm" style={{ marginTop: '15px' }}>
                    View Tasks
                  </button>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">📍</div>
                  <h3>Navigation</h3>
                  <p>Get directions and optimal routes for your deliveries.</p>
                  <button className="btn btn-primary btn-sm" style={{ marginTop: '15px' }}>
                    Get Directions
                  </button>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">⛽</div>
                  <h3>Fuel Log</h3>
                  <p>Record fuel consumption and view fuel usage history.</p>
                  <button className="btn btn-secondary btn-sm" style={{ marginTop: '15px' }}>
                    Log Fuel
                  </button>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">🔧</div>
                  <h3>Report Issue</h3>
                  <p>Report vehicle issues, defects, or maintenance requirements.</p>
                  <button className="btn btn-secondary btn-sm" style={{ marginTop: '15px' }}>
                    Report Issue
                  </button>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">📊</div>
                  <h3>My Performance</h3>
                  <p>View your driving statistics, performance metrics, and history.</p>
                  <button className="btn btn-secondary btn-sm" style={{ marginTop: '15px' }}>
                    View Stats
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default DashboardPage
