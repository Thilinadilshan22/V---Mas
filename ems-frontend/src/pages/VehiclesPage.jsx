import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'

const mockVehicles = [
  { id: 1, reg: 'WP-CAB-1234', make: 'Toyota', model: 'Prado', year: 2022, status: 'ACTIVE',   driver: 'Kamal Perera',   fuel: 'Diesel', mileage: 45200 },
  { id: 2, reg: 'WP-CAB-5678', make: 'Nissan',  model: 'Navara', year: 2021, status: 'ACTIVE',   driver: 'Nimal Silva',    fuel: 'Diesel', mileage: 62100 },
  { id: 3, reg: 'CP-2345',     make: 'Mitsubishi',model: 'L200', year: 2020, status: 'SERVICE',  driver: '—',              fuel: 'Diesel', mileage: 81400 },
  { id: 4, reg: 'SP-7890',     make: 'Toyota',  model: 'Hilux',  year: 2023, status: 'AVAILABLE',driver: '—',              fuel: 'Diesel', mileage: 12300 },
  { id: 5, reg: 'NW-3456',     make: 'Ford',    model: 'Ranger', year: 2019, status: 'INACTIVE', driver: '—',              fuel: 'Diesel', mileage: 98700 },
  { id: 6, reg: 'WP-CAB-9012', make: 'Isuzu',   model: 'D-Max',  year: 2022, status: 'ACTIVE',   driver: 'Sunil Fernando', fuel: 'Petrol', mileage: 34500 },
]

const statusColors = {
  ACTIVE:    { bg: '#d1fae5', color: '#065f46' },
  AVAILABLE: { bg: '#dbeafe', color: '#1e40af' },
  SERVICE:   { bg: '#fef3c7', color: '#92400e' },
  INACTIVE:  { bg: '#fee2e2', color: '#991b1b' },
}

const StatBadge = ({ label, value, icon, color }) => (
  <div className="stat-card" style={{ flex: 1 }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
      <div>
        <p className="stat-card-label">{label}</p>
        <p className="stat-card-value">{value}</p>
      </div>
      <div className={`stat-card-icon ${color}`}>{icon}</div>
    </div>
  </div>
)

const VehiclesPage = () => {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('ALL')

  const filtered = mockVehicles.filter(v => {
    const matchSearch = v.reg.toLowerCase().includes(search.toLowerCase()) ||
      v.make.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'ALL' || v.status === filter
    return matchSearch && matchFilter
  })

  const counts = {
    ACTIVE:    mockVehicles.filter(v => v.status === 'ACTIVE').length,
    AVAILABLE: mockVehicles.filter(v => v.status === 'AVAILABLE').length,
    SERVICE:   mockVehicles.filter(v => v.status === 'SERVICE').length,
    INACTIVE:  mockVehicles.filter(v => v.status === 'INACTIVE').length,
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Vehicles" subtitle="Home / Vehicles" />
        <div className="page-body">

          {/* Welcome banner */}
          <div className="welcome-banner">
            <div className="welcome-text">
              <h1>Vehicle Fleet 🚗</h1>
              <p>Manage and monitor all fleet vehicles in the system.</p>
            </div>
            <div className="welcome-icon">🚗</div>
          </div>

          {/* Stats row */}
          <div className="stats-grid" style={{ marginBottom: 24 }}>
            <StatBadge label="Total Vehicles" value={mockVehicles.length} icon="🚗" color="icon-purple" />
            <StatBadge label="Active"          value={counts.ACTIVE}    icon="✅" color="icon-green"  />
            <StatBadge label="In Service"      value={counts.SERVICE}   icon="🔧" color="icon-orange" />
            <StatBadge label="Available"       value={counts.AVAILABLE} icon="🟢" color="icon-blue"   />
          </div>

          {/* Toolbar */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search by reg, make or model…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                flex: 1, minWidth: 200, padding: '8px 14px', borderRadius: 8,
                border: '1.5px solid #e5e7eb', fontSize: '0.85rem', outline: 'none',
                fontFamily: 'inherit', color: '#374151', background: '#fff',
              }}
            />
            {['ALL', 'ACTIVE', 'AVAILABLE', 'SERVICE', 'INACTIVE'].map(s => (
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
                {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
              </button>
            ))}
            <button className="btn btn-primary btn-sm" style={{ whiteSpace: 'nowrap' }}>
              + Add Vehicle
            </button>
          </div>

          {/* Table */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #f0f0f0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1.5px solid #f0f0f0' }}>
                  {['Reg. No.', 'Make / Model', 'Year', 'Fuel', 'Driver', 'Mileage (km)', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#374151', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: 32, textAlign: 'center', color: '#9ca3af' }}>No vehicles found.</td>
                  </tr>
                ) : filtered.map((v, i) => {
                  const s = statusColors[v.status] || {}
                  return (
                    <tr key={v.id} style={{ borderBottom: '1px solid #f3f4f6', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 600, color: '#6366f1' }}>{v.reg}</td>
                      <td style={{ padding: '12px 16px', color: '#374151' }}>{v.make} {v.model}</td>
                      <td style={{ padding: '12px 16px', color: '#6b7280' }}>{v.year}</td>
                      <td style={{ padding: '12px 16px', color: '#6b7280' }}>{v.fuel}</td>
                      <td style={{ padding: '12px 16px', color: '#374151' }}>{v.driver}</td>
                      <td style={{ padding: '12px 16px', color: '#6b7280' }}>{v.mileage.toLocaleString()}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ background: s.bg, color: s.color, padding: '3px 10px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          {v.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff', color: '#374151', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>Edit</button>
                          <button style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #fee2e2', background: '#fff5f5', color: '#dc2626', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>Delete</button>
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

export default VehiclesPage
