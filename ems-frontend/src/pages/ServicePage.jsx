import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'

const mockServices = [
  { id: 1, reg: 'WP-CAB-1234', type: 'Oil Change',       mechanic: 'Ranjith Auto',   scheduled: '2026-03-25', status: 'SCHEDULED', cost: 3500  },
  { id: 2, reg: 'CP-2345',     type: 'Engine Overhaul',  mechanic: 'City Garage',    scheduled: '2026-03-20', status: 'IN_PROGRESS', cost: 45000 },
  { id: 3, reg: 'WP-CAB-5678', type: 'Tyre Replacement', mechanic: 'Lanka Tyres',    scheduled: '2026-03-15', status: 'COMPLETED',  cost: 22000 },
  { id: 4, reg: 'SP-7890',     type: 'Brake Service',    mechanic: 'Ranjith Auto',   scheduled: '2026-04-01', status: 'SCHEDULED', cost: 8500  },
  { id: 5, reg: 'NW-3456',     type: 'Full Inspection',  mechanic: 'Pro Motors',     scheduled: '2026-02-28', status: 'COMPLETED',  cost: 5000  },
  { id: 6, reg: 'WP-CAB-9012', type: 'AC Service',       mechanic: 'Cool Autos',     scheduled: '2026-04-10', status: 'SCHEDULED', cost: 6000  },
]

const statusColors = {
  SCHEDULED:   { bg: '#dbeafe', color: '#1e40af' },
  IN_PROGRESS: { bg: '#fef3c7', color: '#92400e' },
  COMPLETED:   { bg: '#d1fae5', color: '#065f46' },
  CANCELLED:   { bg: '#fee2e2', color: '#991b1b' },
}

const ServicePage = () => {
  const [filter, setFilter] = useState('ALL')

  const filtered = mockServices.filter(s => filter === 'ALL' || s.status === filter)

  const counts = {
    SCHEDULED:   mockServices.filter(s => s.status === 'SCHEDULED').length,
    IN_PROGRESS: mockServices.filter(s => s.status === 'IN_PROGRESS').length,
    COMPLETED:   mockServices.filter(s => s.status === 'COMPLETED').length,
  }
  const totalCost = mockServices.reduce((sum, s) => sum + s.cost, 0)

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Service" subtitle="Home / Service" />
        <div className="page-body">

          <div className="welcome-banner">
            <div className="welcome-text">
              <h1>Service & Maintenance 🔧</h1>
              <p>Track and manage all vehicle service appointments and maintenance records.</p>
            </div>
            <div className="welcome-icon">🔧</div>
          </div>

          {/* Stats */}
          <div className="stats-grid" style={{ marginBottom: 24 }}>
            <div className="stat-card" style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                <div><p className="stat-card-label">Scheduled</p><p className="stat-card-value">{counts.SCHEDULED}</p></div>
                <div className="stat-card-icon icon-blue">📅</div>
              </div>
            </div>
            <div className="stat-card" style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                <div><p className="stat-card-label">In Progress</p><p className="stat-card-value">{counts.IN_PROGRESS}</p></div>
                <div className="stat-card-icon icon-orange">🔧</div>
              </div>
            </div>
            <div className="stat-card" style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                <div><p className="stat-card-label">Completed</p><p className="stat-card-value">{counts.COMPLETED}</p></div>
                <div className="stat-card-icon icon-green">✅</div>
              </div>
            </div>
            <div className="stat-card" style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                <div><p className="stat-card-label">Total Cost (LKR)</p><p className="stat-card-value">{totalCost.toLocaleString()}</p></div>
                <div className="stat-card-icon icon-purple">💰</div>
              </div>
            </div>
          </div>

          {/* Filter + Add */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
            {['ALL', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED'].map(s => (
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
            <button className="btn btn-primary btn-sm" style={{ marginLeft: 'auto', whiteSpace: 'nowrap' }}>
              + Schedule Service
            </button>
          </div>

          {/* Table */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #f0f0f0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1.5px solid #f0f0f0' }}>
                  {['Vehicle', 'Service Type', 'Mechanic / Workshop', 'Scheduled Date', 'Cost (LKR)', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#374151', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} style={{ padding: 32, textAlign: 'center', color: '#9ca3af' }}>No records found.</td></tr>
                ) : filtered.map((s, i) => {
                  const sc = statusColors[s.status] || {}
                  return (
                    <tr key={s.id} style={{ borderBottom: '1px solid #f3f4f6', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 600, color: '#6366f1' }}>{s.reg}</td>
                      <td style={{ padding: '12px 16px', color: '#374151' }}>{s.type}</td>
                      <td style={{ padding: '12px 16px', color: '#6b7280' }}>{s.mechanic}</td>
                      <td style={{ padding: '12px 16px', color: '#374151' }}>{s.scheduled}</td>
                      <td style={{ padding: '12px 16px', color: '#374151', fontWeight: 600 }}>{s.cost.toLocaleString()}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ background: sc.bg, color: sc.color, padding: '3px 10px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          {s.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff', color: '#374151', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>View</button>
                          <button style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff', color: '#374151', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>Edit</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ServicePage
