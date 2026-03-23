import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import { useAuth } from '../context/AuthContext'
import { fuelAPI } from '../services/api'

const FuelLogPage = () => {
  const { user } = useAuth()
  
  // State for fuel logs
  const [myVehicleLogs, setMyVehicleLogs] = useState([])
  const [loading, setLoading] = useState(true)
  
  // State for Add Fuel Log Form
  const [formData, setFormData] = useState({
    vehicleRegNumber: user?.vehicleRegNumber || '',
    fuelType: 'Diesel',
    liters: '',
    costPerLiter: '',
    mileage: '',
    date: new Date().toISOString().split('T')[0]
  })
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)

  // Load fuel logs
  useEffect(() => {
    const loadLogs = async () => {
      if (!user?.vehicleRegNumber) {
        setLoading(false)
        return
      }
      
      try {
        setLoading(true)
        const logsRes = await fuelAPI.getLogsByVehicle(user.vehicleRegNumber)
        setMyVehicleLogs(logsRes.data.data || [])
      } catch (error) {
        console.error('Error loading fuel logs:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadLogs()
  }, [user])

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Handle form submit
  const handleAddFuelLog = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      const payload = {
        vehicleRegNumber: formData.vehicleRegNumber,
        fuelType: formData.fuelType,
        liters: parseFloat(formData.liters),
        costPerLiter: parseFloat(formData.costPerLiter),
        mileage: parseFloat(formData.mileage),
        date: formData.date
      }
      
      await fuelAPI.addFuelLog(payload)
      
      // Reload logs
      const logsRes = await fuelAPI.getLogsByVehicle(formData.vehicleRegNumber)
      setMyVehicleLogs(logsRes.data.data || [])
      
      // Reset form
      setFormData({
        vehicleRegNumber: user?.vehicleRegNumber || '',
        fuelType: 'Diesel',
        liters: '',
        costPerLiter: '',
        mileage: '',
        date: new Date().toISOString().split('T')[0]
      })
      setShowForm(false)
      
      alert('✅ Fuel log added successfully!')
    } catch (error) {
      console.error('Error adding fuel log:', error)
      alert('❌ Failed to add fuel log: ' + (error.response?.data?.message || error.message))
    } finally {
      setSubmitting(false)
    }
  }

  // Calculate statistics
  const totalLiters = myVehicleLogs.reduce((sum, log) => sum + log.liters, 0)
  const totalCost = myVehicleLogs.reduce((sum, log) => sum + log.totalCost, 0)
  const avgEfficiency = myVehicleLogs.filter(log => log.fuelEfficiency).length > 0
    ? myVehicleLogs.filter(log => log.fuelEfficiency).reduce((sum, log) => sum + log.fuelEfficiency, 0) / myVehicleLogs.filter(log => log.fuelEfficiency).length
    : 0
  const lastMileage = myVehicleLogs.length > 0 ? myVehicleLogs[0].mileage : 0

  if (loading) {
    return (
      <div className="app-shell">
        <Sidebar />
        <div className="main-content">
          <Topbar title="Fuel Log" subtitle="Home / Fuel Log" />
          <div className="page-body">
            <div className="loading-spinner">
              <div className="spinner"></div>
              <span>Loading fuel logs...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Fuel Log" subtitle="Home / Fuel Log" />
        <div className="page-body">

          {/* Welcome Banner */}
          <div className="welcome-banner">
            <div className="welcome-text">
              <h1>My Fuel Log ⛽</h1>
              <p>Track your vehicle's fuel consumption and monitor efficiency over time.</p>
            </div>
            <div className="welcome-icon">⛽</div>
          </div>

          {/* Statistics Cards */}
          <div className="stats-grid" style={{ marginBottom: 24 }}>
            {[
              { label: 'Total Fuel (L)', value: totalLiters.toFixed(1), icon: '⛽', color: 'icon-purple' },
              { label: 'Total Spent (LKR)', value: `Rs. ${Math.round(totalCost).toLocaleString()}`, icon: '💰', color: 'icon-green' },
              { label: 'Avg Efficiency', value: avgEfficiency > 0 ? `${avgEfficiency.toFixed(2)} km/L` : 'N/A', icon: '📊', color: 'icon-indigo' },
              { label: 'Last Mileage', value: lastMileage > 0 ? `${lastMileage.toFixed(0)} km` : 'N/A', icon: '🚗', color: 'icon-orange' },
            ].map(s => (
              <div key={s.label} className="stat-card" style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div><p className="stat-card-label">{s.label}</p><p className="stat-card-value">{s.value}</p></div>
                  <div className={`stat-card-icon ${s.color}`}>{s.icon}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Fuel Log Button */}
          <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              className="btn btn-primary"
              onClick={() => setShowForm(!showForm)}
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              {showForm ? '✕ Cancel' : '+ Add New Fuel Log'}
            </button>
          </div>

          {/* Add Fuel Log Form */}
          {showForm && (
            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #f0f0f0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: 28, marginBottom: 24 }}>
              <h3 style={{ margin: '0 0 20px', fontWeight: 700, color: '#111827', fontSize: '1rem' }}>Add Fuel Log Entry</h3>
              
              <form onSubmit={handleAddFuelLog}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, marginBottom: 24 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                      Vehicle Registration Number *
                    </label>
                    <input 
                      type="text" 
                      name="vehicleRegNumber" 
                      value={formData.vehicleRegNumber} 
                      onChange={handleInputChange}
                      required 
                      readOnly={!!user?.vehicleRegNumber}
                      placeholder="e.g., WP-CAB-1234"
                      style={{ 
                        width: '100%', 
                        padding: '10px 14px', 
                        borderRadius: 8, 
                        border: '1.5px solid #d1d5db', 
                        fontSize: '0.9rem',
                        background: user?.vehicleRegNumber ? '#f9fafb' : '#fff'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                      Fuel Type *
                    </label>
                    <select 
                      name="fuelType" 
                      value={formData.fuelType} 
                      onChange={handleInputChange}
                      required
                      style={{ 
                        width: '100%', 
                        padding: '10px 14px', 
                        borderRadius: 8, 
                        border: '1.5px solid #d1d5db', 
                        fontSize: '0.9rem',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="Diesel">⛽ Diesel</option>
                      <option value="Petrol">⛽ Petrol</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                      Liters *
                    </label>
                    <input 
                      type="number" 
                      name="liters" 
                      value={formData.liters} 
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      required
                      placeholder="e.g., 45.5"
                      style={{ 
                        width: '100%', 
                        padding: '10px 14px', 
                        borderRadius: 8, 
                        border: '1.5px solid #d1d5db', 
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                      Cost per Liter (LKR) *
                    </label>
                    <input 
                      type="number" 
                      name="costPerLiter" 
                      value={formData.costPerLiter} 
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      required
                      placeholder="e.g., 380.00"
                      style={{ 
                        width: '100%', 
                        padding: '10px 14px', 
                        borderRadius: 8, 
                        border: '1.5px solid #d1d5db', 
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                      Current Mileage (km) *
                    </label>
                    <input 
                      type="number" 
                      name="mileage" 
                      value={formData.mileage} 
                      onChange={handleInputChange}
                      step="0.1"
                      min="0"
                      required
                      placeholder="e.g., 15250.5"
                      style={{ 
                        width: '100%', 
                        padding: '10px 14px', 
                        borderRadius: 8, 
                        border: '1.5px solid #d1d5db', 
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                      Date *
                    </label>
                    <input 
                      type="date" 
                      name="date" 
                      value={formData.date} 
                      onChange={handleInputChange}
                      required
                      style={{ 
                        width: '100%', 
                        padding: '10px 14px', 
                        borderRadius: 8, 
                        border: '1.5px solid #d1d5db', 
                        fontSize: '0.9rem',
                        cursor: 'pointer'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                  >
                    {submitting ? 'Submitting...' : '✓ Add Fuel Log'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowForm(false)}
                    className="btn btn-secondary"
                    style={{ flex: 0.3 }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Fuel Logs Table */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #f0f0f0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ padding: '18px 22px 14px', borderBottom: '1px solid #f3f4f6' }}>
              <h3 style={{ margin: 0, fontWeight: 700, color: '#111827', fontSize: '0.95rem' }}>Fuel Log History</h3>
              <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#9ca3af' }}>
                {myVehicleLogs.length} {myVehicleLogs.length === 1 ? 'entry' : 'entries'} recorded
              </p>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              {myVehicleLogs.length === 0 ? (
                <div style={{ padding: 60, textAlign: 'center', color: '#9ca3af' }}>
                  <div style={{ fontSize: '4rem', marginBottom: 16 }}>⛽</div>
                  <h4 style={{ margin: '0 0 8px', fontWeight: 600, color: '#374151' }}>No Fuel Logs Yet</h4>
                  <p style={{ fontSize: '0.9rem', marginBottom: 20 }}>Start tracking your vehicle's fuel consumption by adding your first log entry.</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setShowForm(true)}
                  >
                    + Add Your First Fuel Log
                  </button>
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead style={{ background: '#f9fafb' }}>
                    <tr style={{ borderBottom: '1.5px solid #f0f0f0' }}>
                      {['Date', 'Fuel Type', 'Liters', 'Cost/L', 'Total Cost', 'Mileage', 'Efficiency', 'Status'].map(h => (
                        <th key={h} style={{ 
                          padding: '12px 16px', 
                          textAlign: 'left', 
                          fontWeight: 700, 
                          color: '#374151', 
                          fontSize: '0.75rem', 
                          textTransform: 'uppercase', 
                          letterSpacing: '0.05em' 
                        }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {myVehicleLogs.map((log, i) => (
                      <tr key={log.id} style={{ 
                        borderBottom: '1px solid #f3f4f6', 
                        background: i % 2 === 0 ? '#fff' : '#fafafa',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                      onMouseLeave={(e) => e.currentTarget.style.background = i % 2 === 0 ? '#fff' : '#fafafa'}
                      >
                        <td style={{ padding: '14px 16px', color: '#374151', fontWeight: 500 }}>
                          {new Date(log.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ 
                            padding: '4px 10px', 
                            borderRadius: 6, 
                            fontSize: '0.75rem', 
                            fontWeight: 600, 
                            background: log.fuelType === 'Diesel' ? '#eef2ff' : '#fff7ed', 
                            color: log.fuelType === 'Diesel' ? '#6366f1' : '#f59e0b' 
                          }}>
                            {log.fuelType}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', color: '#374151', fontWeight: 600 }}>{log.liters.toFixed(2)} L</td>
                        <td style={{ padding: '14px 16px', color: '#6b7280' }}>Rs. {log.costPerLiter.toFixed(2)}</td>
                        <td style={{ padding: '14px 16px', fontWeight: 700, color: '#111827' }}>Rs. {log.totalCost.toLocaleString()}</td>
                        <td style={{ padding: '14px 16px', color: '#6b7280' }}>{log.mileage.toFixed(1)} km</td>
                        <td style={{ padding: '14px 16px' }}>
                          {log.fuelEfficiency ? (
                            <span style={{ 
                              fontWeight: 700, 
                              color: log.fuelEfficiency > 10 ? '#10b981' : log.fuelEfficiency > 5 ? '#6366f1' : '#f59e0b' 
                            }}>
                              {log.fuelEfficiency.toFixed(2)} km/L
                            </span>
                          ) : (
                            <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>—</span>
                          )}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          {log.fuelEfficiency ? (
                            log.fuelEfficiency > 10 ? (
                              <span className="badge badge-success">Excellent</span>
                            ) : log.fuelEfficiency > 7 ? (
                              <span className="badge badge-primary">Good</span>
                            ) : log.fuelEfficiency > 5 ? (
                              <span className="badge badge-warning">Average</span>
                            ) : (
                              <span className="badge badge-danger">Poor</span>
                            )
                          ) : (
                            <span className="badge badge-secondary">N/A</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default FuelLogPage
