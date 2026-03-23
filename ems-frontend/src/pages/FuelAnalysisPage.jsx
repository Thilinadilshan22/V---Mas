import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import { useAuth } from '../context/AuthContext'
import { fuelAPI } from '../services/api'

const BAR_COLORS = { Diesel: '#6366f1', Petrol: '#f59e0b' }

const FuelAnalysisPage = () => {
  const { user, isAdmin, isController, isDriver } = useAuth()
  const [period, setPeriod] = useState('6M')
  const [activeTab, setActiveTab] = useState('dashboard') // 'dashboard' or 'add-log' (driver only)
  
  // State for backend data
  const [summary, setSummary] = useState({ totalDiesel: 0, totalPetrol: 0, totalVolume: 0, totalCost: 0 })
  const [chartData, setChartData] = useState({ months: [], data: { Diesel: [], Petrol: [] } })
  const [vehicleStats, setVehicleStats] = useState([])
  const [myVehicleLogs, setMyVehicleLogs] = useState([])
  const [loading, setLoading] = useState(true)
  
  // State for Add Fuel Log Form (Driver only)
  const [formData, setFormData] = useState({
    vehicleRegNumber: '',
    fuelType: 'Diesel',
    liters: '',
    costPerLiter: '',
    mileage: '',
    date: new Date().toISOString().split('T')[0]
  })
  const [submitting, setSubmitting] = useState(false)

  // Load data from backend
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        
        // Load summary and chart data for all roles
        const [summaryRes, chartRes] = await Promise.all([
          fuelAPI.getSummary(),
          fuelAPI.getChartData()
        ])
        
        setSummary(summaryRes.data.data || { totalDiesel: 0, totalPetrol: 0, totalVolume: 0, totalCost: 0 })
        setChartData(chartRes.data.data || { months: [], data: { Diesel: [], Petrol: [] } })
        
        // Load vehicle stats for admin/controller
        if (isAdmin || isController) {
          const statsRes = await fuelAPI.getVehicleStats()
          setVehicleStats(statsRes.data.data || [])
        }
        
        // Load driver's own vehicle logs
        if (isDriver && user?.vehicleRegNumber) {
          const logsRes = await fuelAPI.getLogsByVehicle(user.vehicleRegNumber)
          setMyVehicleLogs(logsRes.data.data || [])
          setFormData(prev => ({ ...prev, vehicleRegNumber: user.vehicleRegNumber }))
        }
      } catch (error) {
        console.error('Error loading fuel data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [isAdmin, isController, isDriver, user])
  
  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  // Handle form submit (Driver)
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
      
      // Reload data
      const [summaryRes, chartRes, logsRes] = await Promise.all([
        fuelAPI.getSummary(),
        fuelAPI.getChartData(),
        fuelAPI.getLogsByVehicle(formData.vehicleRegNumber)
      ])
      
      setSummary(summaryRes.data.data)
      setChartData(chartRes.data.data)
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
      setActiveTab('dashboard')
      
      alert('✅ Fuel log added successfully!')
    } catch (error) {
      console.error('Error adding fuel log:', error)
      alert('❌ Failed to add fuel log: ' + (error.response?.data?.message || error.message))
    } finally {
      setSubmitting(false)
    }
  }
  
  const getEfficiencyBadge = (status) => {
    const badges = {
      Excellent: { text: 'Excellent', class: 'badge-success' },
      Good: { text: 'Good', class: 'badge-primary' },
      Average: { text: 'Average', class: 'badge-warning' },
      Poor: { text: 'Poor', class: 'badge-danger' },
      'N/A': { text: 'N/A', class: 'badge-secondary' }
    }
    return badges[status] || badges['N/A']
  }
  
  const monthlyData = chartData.months?.map((month, idx) => ({
    month,
    Diesel: chartData.data?.Diesel?.[idx] || 0,
    Petrol: chartData.data?.Petrol?.[idx] || 0
  })) || []
  
  const maxVal = Math.max(
    ...(chartData.data?.Diesel || []),
    ...(chartData.data?.Petrol || []),
    1
  )

  if (loading) {
    return (
      <div className="app-shell">
        <Sidebar />
        <div className="main-content">
          <Topbar title="Fuel Analysis" subtitle="Home / Fuel Analysis" />
          <div className="page-body">
            <div className="loading-spinner">
              <div className="spinner"></div>
              <span>Loading fuel data...</span>
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
        <Topbar title="Fuel Analysis" subtitle="Home / Fuel Analysis" />
        <div className="page-body">

          <div className="welcome-banner">
            <div className="welcome-text">
              <h1>Fuel Analysis ⛽</h1>
              <p>
                {isDriver 
                  ? 'Track your vehicle fuel consumption and view history.'
                  : 'Monitor fuel consumption trends and cost analysis across the entire fleet.'
                }
              </p>
            </div>
            <div className="welcome-icon">⛽</div>
          </div>

          {/* Driver Tabs */}
          {isDriver && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', gap: 8, borderBottom: '2px solid #f0f0f0' }}>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  style={{
                    padding: '12px 24px',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: activeTab === 'dashboard' ? '3px solid #6366f1' : '3px solid transparent',
                    color: activeTab === 'dashboard' ? '#6366f1' : '#6b7280',
                    fontWeight: activeTab === 'dashboard' ? 700 : 500,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    marginBottom: '-2px'
                  }}
                >
                  📊 Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('add-log')}
                  style={{
                    padding: '12px 24px',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: activeTab === 'add-log' ? '3px solid #6366f1' : '3px solid transparent',
                    color: activeTab === 'add-log' ? '#6366f1' : '#6b7280',
                    fontWeight: activeTab === 'add-log' ? 700 : 500,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    marginBottom: '-2px'
                  }}
                >
                  ⛽ Add Fuel Log
                </button>
              </div>
            </div>
          )}

          {/* Dashboard Tab Content */}
          {(!isDriver || activeTab === 'dashboard') && (
            <>
              {/* Stats */}
              <div className="stats-grid" style={{ marginBottom: 24 }}>
                {[
                  { label: 'Total Diesel (L)', value: Math.round(summary.totalDiesel).toLocaleString(), icon: '🛢️', color: 'icon-indigo' },
                  { label: 'Total Petrol (L)', value: Math.round(summary.totalPetrol).toLocaleString(), icon: '⛽', color: 'icon-orange' },
                  { label: 'Total Volume (L)', value: Math.round(summary.totalVolume).toLocaleString(), icon: '📊', color: 'icon-purple' },
                  { label: 'Total Cost (LKR)',  value: Math.round(summary.totalCost).toLocaleString(),   icon: '💰', color: 'icon-green'  },
                ].map(s => (
                  <div key={s.label} className="stat-card" style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div><p className="stat-card-label">{s.label}</p><p className="stat-card-value">{s.value}</p></div>
                      <div className={`stat-card-icon ${s.color}`}>{s.icon}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chart + Legend */}
              <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f0f0f0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: 28, marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <div>
                    <h3 style={{ margin: 0, fontWeight: 700, color: '#111827', fontSize: '1rem' }}>Monthly Fuel Consumption</h3>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#9ca3af' }}>Litres consumed per month</p>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {['3M', '6M', '12M'].map(p => (
                      <button key={p} onClick={() => setPeriod(p)} style={{
                        padding: '5px 12px', borderRadius: 7, fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                        border: period === p ? 'none' : '1.5px solid #e5e7eb',
                        background: period === p ? '#6366f1' : '#fff',
                        color: period === p ? '#fff' : '#6b7280',
                      }}>{p}</button>
                    ))}
                  </div>
                </div>

                {/* Bar Chart */}
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 18, height: 180, paddingBottom: 8 }}>
                  {monthlyData.length === 0 ? (
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#9ca3af' }}>
                      No data available
                    </div>
                  ) : (
                    (period === '3M' ? monthlyData.slice(-3) : period === '6M' ? monthlyData.slice(-6) : monthlyData).map(d => (
                      <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                        <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 150, width: '100%', justifyContent: 'center' }}>
                          <div style={{ width: 18, height: `${(d.Diesel / maxVal) * 150}px`, background: BAR_COLORS.Diesel, borderRadius: '4px 4px 0 0', transition: 'height 0.4s ease' }} title={`Diesel: ${d.Diesel}L`} />
                          <div style={{ width: 18, height: `${(d.Petrol / maxVal) * 150}px`, background: BAR_COLORS.Petrol, borderRadius: '4px 4px 0 0', transition: 'height 0.4s ease' }} title={`Petrol: ${d.Petrol}L`} />
                        </div>
                        <span style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 600 }}>{d.month}</span>
                      </div>
                    ))
                  )}
                </div>

                {/* Legend */}
                <div style={{ display: 'flex', gap: 20, marginTop: 12 }}>
                  {[['Diesel', '#6366f1'], ['Petrol', '#f59e0b']].map(([name, color]) => (
                    <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: '#6b7280', fontWeight: 600 }}>
                      <div style={{ width: 12, height: 12, borderRadius: 3, background: color }} />
                      {name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Driver: My Fuel History */}
              {isDriver && (
                <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #f0f0f0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 24 }}>
                  <div style={{ padding: '18px 22px 14px', borderBottom: '1px solid #f3f4f6' }}>
                    <h3 style={{ margin: 0, fontWeight: 700, color: '#111827', fontSize: '0.95rem' }}>My Fuel History</h3>
                    <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#9ca3af' }}>Recent fuel logs for your vehicle</p>
                  </div>
                  
                  <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                    {myVehicleLogs.length === 0 ? (
                      <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>
                        <div style={{ fontSize: '3rem', marginBottom: 12 }}>⛽</div>
                        <p style={{ fontWeight: 600, marginBottom: 6 }}>No fuel logs yet</p>
                        <p style={{ fontSize: '0.85rem' }}>Click "Add Fuel Log" tab to add your first entry</p>
                      </div>
                    ) : (
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                        <thead style={{ position: 'sticky', top: 0, background: '#f9fafb', zIndex: 1 }}>
                          <tr style={{ borderBottom: '1.5px solid #f0f0f0' }}>
                            {['Date', 'Fuel Type', 'Liters', 'Cost/L', 'Total Cost', 'Mileage', 'Efficiency'].map(h => (
                              <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontWeight: 700, color: '#374151', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {myVehicleLogs.map((log, i) => (
                            <tr key={log.id} style={{ borderBottom: '1px solid #f3f4f6', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                              <td style={{ padding: '11px 16px', color: '#374151' }}>{new Date(log.date).toLocaleDateString()}</td>
                              <td style={{ padding: '11px 16px' }}>
                                <span style={{ padding: '3px 8px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 600, background: log.fuelType === 'Diesel' ? '#eef2ff' : '#fff7ed', color: log.fuelType === 'Diesel' ? '#6366f1' : '#f59e0b' }}>
                                  {log.fuelType}
                                </span>
                              </td>
                              <td style={{ padding: '11px 16px', color: '#374151' }}>{log.liters} L</td>
                              <td style={{ padding: '11px 16px', color: '#374151' }}>Rs. {log.costPerLiter.toFixed(2)}</td>
                              <td style={{ padding: '11px 16px', fontWeight: 600, color: '#111827' }}>Rs. {log.totalCost.toFixed(2)}</td>
                              <td style={{ padding: '11px 16px', color: '#6b7280' }}>{log.mileage.toFixed(1)} km</td>
                              <td style={{ padding: '11px 16px' }}>
                                {log.fuelEfficiency ? (
                                  <span style={{ fontWeight: 600, color: '#6366f1' }}>{log.fuelEfficiency.toFixed(2)} km/L</span>
                                ) : (
                                  <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>—</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Admin/Controller: Vehicle Statistics Table */}
          {(isAdmin || isController) && (
            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #f0f0f0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{ padding: '18px 22px 14px', borderBottom: '1px solid #f3f4f6' }}>
                <h3 style={{ margin: 0, fontWeight: 700, color: '#111827', fontSize: '0.95rem' }}>Vehicle Fuel Statistics</h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#9ca3af' }}>Fuel efficiency and spending overview</p>
              </div>
              {vehicleStats.length === 0 ? (
                <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>
                  <p>No vehicle statistics available yet.</p>
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: '#f9fafb', borderBottom: '1.5px solid #f0f0f0' }}>
                      {['Vehicle', 'Fuel Efficiency', 'Total Spending', 'Status'].map(h => (
                        <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontWeight: 700, color: '#374151', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {vehicleStats.map((v, i) => {
                      const badge = getEfficiencyBadge(v.efficiencyStatus)
                      return (
                        <tr key={v.vehicleRegNumber} style={{ borderBottom: '1px solid #f3f4f6', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                          <td style={{ padding: '11px 16px' }}>
                            <div style={{ fontWeight: 600, color: '#6366f1' }}>{v.vehicleRegNumber}</div>
                          </td>
                          <td style={{ padding: '11px 16px', fontWeight: 600, color: '#111827' }}>
                            {v.fuelEfficiency !== null ? `${v.fuelEfficiency.toFixed(2)} km/L` : 'N/A'}
                          </td>
                          <td style={{ padding: '11px 16px', fontWeight: 600, color: '#6366f1' }}>
                            Rs. {v.totalSpending.toLocaleString()}
                          </td>
                          <td style={{ padding: '11px 16px' }}>
                            <span className={`badge ${badge.class}`}>{badge.text}</span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default FuelAnalysisPage
