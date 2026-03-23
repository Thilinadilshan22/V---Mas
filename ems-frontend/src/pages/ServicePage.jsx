import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import { serviceAPI, vehicleAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'

const statusColors = {
  SCHEDULED:   { bg: '#dbeafe', color: '#1e40af' },
  IN_PROGRESS: { bg: '#fef3c7', color: '#92400e' },
  COMPLETED:   { bg: '#d1fae5', color: '#065f46' },
  CANCELLED:   { bg: '#fee2e2', color: '#991b1b' },
}

const initialForm = {
  vehicleId: '',
  serviceType: 'OIL_CHANGE',
  serviceTypeDetail: '',
  serviceDate: '',
  currentMileageKm: '',
  serviceCost: '',
  technicianWorkshop: '',
  nextServiceDue: '',
  description: ''
}

const ServicePage = () => {
  const { user } = useAuth()
  const isDriver = user?.role === 'DRIVER'

  const [services, setServices] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [stats, setStats] = useState(null)
  const [filter, setFilter] = useState('ALL')

  // Modal State
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(initialForm)
  const [editId, setEditId] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [servicesRes, statsRes, vehiclesRes] = await Promise.all([
        serviceAPI.getAllServices(),
        serviceAPI.getServiceStats(),
        vehicleAPI.getAllVehicles()
      ])
      setServices(servicesRes.data.data || [])
      setStats(statsRes.data.data)
      setVehicles(vehiclesRes.data.data || vehiclesRes.data || [])
    } catch (error) {
      console.error("Error loading service data", error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service record?')) {
      try {
        await serviceAPI.deleteService(id)
        loadData()
      } catch (error) {
        console.error("Error deleting service", error)
        alert('Failed to delete service record.')
      }
    }
  }

  const handleEdit = (service) => {
    setFormData({
      vehicleId: service.vehicleId || '',
      serviceType: service.serviceType || 'OIL_CHANGE',
      serviceTypeDetail: service.serviceTypeDetail || '',
      serviceDate: service.serviceDate ? service.serviceDate.substring(0, 10) : '',
      currentMileageKm: service.currentMileageKm || '',
      serviceCost: service.serviceCost || '',
      technicianWorkshop: service.technicianWorkshop || '',
      nextServiceDue: service.nextServiceDue ? service.nextServiceDue.substring(0, 10) : '',
      description: service.description || ''
    })
    setEditId(service.id)
    setIsEditing(true)
    setShowModal(true)
  }

  const handleCreateNew = () => {
    setFormData(initialForm)
    setIsEditing(false)
    setEditId(null)
    setShowModal(true)
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    try {
      if (isEditing) {
        await serviceAPI.updateService(editId, formData)
      } else {
        await serviceAPI.createService(formData)
      }
      setShowModal(false)
      loadData()
    } catch (error) {
      console.error("Error saving service", error)
      alert(error.response?.data?.message || 'Error saving service record.')
    }
  }

  // Frontend matching for status since backend does not currently have a "status" field defined in the entity snippet shown
  // We'll calculate a pseudo status based on schedule date or just default to COMPLETED if not implemented
  const getStatus = (s) => {
    const today = new Date()
    const scheduled = new Date(s.serviceDate)
    if (scheduled > today) return 'SCHEDULED'
    return 'COMPLETED'
  }

  const filtered = services.filter(s => filter === 'ALL' || getStatus(s) === filter)

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Topbar title={isDriver ? 'Service History' : 'Service'} subtitle={`Home / ${isDriver ? 'Service History' : 'Service'}`} />
        <div className="page-body">

          <div className="welcome-banner">
            <div className="welcome-text">
              <h1>{isDriver ? 'Service History 🔧' : 'Service & Maintenance 🔧'}</h1>
              <p>{isDriver ? 'View past service and maintenance history.' : 'Track and manage all vehicle service appointments and maintenance records.'}</p>
            </div>
            <div className="welcome-icon">🔧</div>
          </div>

          {/* Stats */}
          {stats && (
            <div className="stats-grid" style={{ marginBottom: 24 }}>
              <div className="stat-card" style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div><p className="stat-card-label">Total Records</p><p className="stat-card-value">{stats.totalServiceRecords}</p></div>
                  <div className="stat-card-icon icon-blue">📋</div>
                </div>
              </div>
              <div className="stat-card" style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div><p className="stat-card-label">Total Cost (LKR)</p><p className="stat-card-value">{(stats.totalServiceCost || 0).toLocaleString()}</p></div>
                  <div className="stat-card-icon icon-purple">💰</div>
                </div>
              </div>
            </div>
          )}

          {/* Filter + Add */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
            {['ALL', 'SCHEDULED', 'COMPLETED'].map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                style={{
                  padding: '7px 14px', borderRadius: 8, fontSize: '0.78rem', fontWeight: 600,
                  border: filter === s ? 'none' : '1.5px solid #e5e7eb',
                  background: filter === s ? '#6366f1' : '#fff',
                  color: filter === s ? '#fff' : '#6b7280',
                  cursor: 'pointer', transition: 'all 0.15s ease',
                }}
              >
                {s.replace('_', ' ')}
              </button>
            ))}
            
            {!isDriver && (
              <button onClick={handleCreateNew} className="btn btn-primary btn-sm" style={{ marginLeft: 'auto', whiteSpace: 'nowrap' }}>
                + Schedule Service
              </button>
            )}
          </div>

          {/* Table */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #f0f0f0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1.5px solid #f0f0f0' }}>
                  {['Vehicle ID', 'Service Type', 'Workshop', 'Date', 'Cost (LKR)', 'Status', 'Actions'].map((h, i) => (
                    // Hide Actions for Driver
                    (isDriver && h === 'Actions') ? null :
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#374151', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={isDriver ? 6 : 7} style={{ padding: 32, textAlign: 'center', color: '#9ca3af' }}>No records found.</td></tr>
                ) : filtered.map((s, i) => {
                  const status = getStatus(s)
                  const sc = statusColors[status] || statusColors.COMPLETED
                  return (
                    <tr key={s.id} style={{ borderBottom: '1px solid #f3f4f6', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 600, color: '#6366f1' }}>V-{s.vehicleId}</td>
                      <td style={{ padding: '12px 16px', color: '#374151' }}>{s.serviceType}</td>
                      <td style={{ padding: '12px 16px', color: '#6b7280' }}>{s.technicianWorkshop}</td>
                      <td style={{ padding: '12px 16px', color: '#374151' }}>{s.serviceDate ? s.serviceDate.substring(0, 10) : '-'}</td>
                      <td style={{ padding: '12px 16px', color: '#374151', fontWeight: 600 }}>{(s.serviceCost || 0).toLocaleString()}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ background: sc.bg, color: sc.color, padding: '3px 10px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          {status}
                        </span>
                      </td>
                      {!isDriver && (
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button onClick={() => handleEdit(s)} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff', color: '#374151', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>Edit</button>
                            <button onClick={() => handleDelete(s.id)} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #fee2e2', background: '#fff5f5', color: '#dc2626', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>Delete</button>
                          </div>
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Add/Edit Modal */}
          {showModal && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
              <div style={{ background: '#fff', padding: 24, borderRadius: 12, width: '400px', maxWidth: '90%' }}>
                <h2 style={{ marginTop: 0, marginBottom: 16 }}>{isEditing ? 'Edit Service' : 'Schedule Service'}</h2>
                <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: 4 }}>Vehicle (License Plate)*</label>
                    <select required name="vehicleId" value={formData.vehicleId} onChange={handleFormChange} style={{ width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 6 }}>
                      <option value="" disabled>Select a Vehicle</option>
                      {vehicles.map(v => (
                        <option key={v.id} value={v.id}>{v.registrationNo}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: 4 }}>Service Type*</label>
                    <select required name="serviceType" value={formData.serviceType} onChange={handleFormChange} style={{ width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 6 }}>
                      <option value="OIL_CHANGE">Oil Change</option>
                      <option value="TUNE_UP">Tune Up</option>
                      <option value="BRAKE_SERVICE">Brake Service</option>
                      <option value="TIRE_ROTATION">Tire Rotation</option>
                      <option value="WHEEL_ALIGNMENT">Wheel Alignment</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  {formData.serviceType === 'OTHER' && (
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: 4 }}>Service Type Detail*</label>
                      <input required type="text" name="serviceTypeDetail" value={formData.serviceTypeDetail} onChange={handleFormChange} style={{ width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 6 }} />
                    </div>
                  )}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: 4 }}>Service Date*</label>
                    <input required type="date" name="serviceDate" value={formData.serviceDate} onChange={handleFormChange} style={{ width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 6 }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: 4 }}>Cost (LKR)*</label>
                    <input required type="number" step="0.01" name="serviceCost" value={formData.serviceCost} onChange={handleFormChange} style={{ width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 6 }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: 4 }}>Workshop</label>
                    <input type="text" name="technicianWorkshop" value={formData.technicianWorkshop} onChange={handleFormChange} style={{ width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 6 }} />
                  </div>
                  <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                    <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '10px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                    <button type="submit" style={{ flex: 1, padding: '10px', borderRadius: 8, border: 'none', background: '#6366f1', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>{isEditing ? 'Save' : 'Add'}</button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default ServicePage
