import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'

const vehicles = [
  { id: 1, reg: 'WP-CAB-1234', driver: 'Kamal Perera',   status: 'MOVING',  speed: 58,   location: 'Colombo 07, Rosmead Pl', lat: 6.902, lng: 79.875, lastUpdate: '2 min ago' },
  { id: 2, reg: 'WP-CAB-5678', driver: 'Nimal Silva',    status: 'IDLE',    speed: 0,    location: 'Nugegoda, High Level Rd', lat: 6.871, lng: 79.896, lastUpdate: '5 min ago' },
  { id: 3, reg: 'SP-7890',     driver: '—',              status: 'PARKED',  speed: 0,    location: 'Kandy City Centre',       lat: 7.291, lng: 80.636, lastUpdate: '1 hr ago'  },
  { id: 4, reg: 'WP-CAB-9012', driver: 'Sunil Fernando', status: 'MOVING',  speed: 72,   location: 'Galle Road, Dehiwala',   lat: 6.848, lng: 79.867, lastUpdate: '1 min ago' },
]

const statusColors = {
  MOVING: { bg: '#d1fae5', color: '#065f46', dot: '#10b981' },
  IDLE:   { bg: '#fef3c7', color: '#92400e', dot: '#f59e0b' },
  PARKED: { bg: '#e0e7ff', color: '#3730a3', dot: '#6366f1' },
}

const LocationPage = () => {
  const [selected, setSelected] = useState(null)

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Location" subtitle="Home / Location" />
        <div className="page-body">

          <div className="welcome-banner">
            <div className="welcome-text">
              <h1>Live Location Tracking 📍</h1>
              <p>Real-time GPS tracking for all fleet vehicles. Monitor routes and locations.</p>
            </div>
            <div className="welcome-icon">📍</div>
          </div>

          {/* Stats row */}
          <div className="stats-grid" style={{ marginBottom: 24 }}>
            {[
              { label: 'Moving',  value: vehicles.filter(v => v.status === 'MOVING').length,  icon: '🚗', color: 'icon-green'  },
              { label: 'Idle',    value: vehicles.filter(v => v.status === 'IDLE').length,    icon: '🟡', color: 'icon-orange' },
              { label: 'Parked',  value: vehicles.filter(v => v.status === 'PARKED').length,  icon: '🅿️', color: 'icon-indigo' },
              { label: 'Tracked', value: vehicles.length,                                      icon: '📡', color: 'icon-purple' },
            ].map(s => (
              <div key={s.label} className="stat-card" style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div><p className="stat-card-label">{s.label}</p><p className="stat-card-value">{s.value}</p></div>
                  <div className={`stat-card-icon ${s.color}`}>{s.icon}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20, alignItems: 'start' }}>
            {/* Vehicle list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <h3 style={{ margin: '0 0 4px', fontWeight: 700, color: '#111827', fontSize: '0.95rem' }}>Fleet Vehicles</h3>
              {vehicles.map(v => {
                const sc = statusColors[v.status]
                const isSelected = selected?.id === v.id
                return (
                  <div
                    key={v.id}
                    onClick={() => setSelected(v)}
                    style={{
                      background: '#fff', borderRadius: 12, border: isSelected ? '2px solid #6366f1' : '1.5px solid #f0f0f0',
                      padding: '14px 16px', cursor: 'pointer', boxShadow: isSelected ? '0 0 0 3px #e0e7ff' : '0 1px 3px rgba(0,0,0,0.05)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#6366f1', fontSize: '0.9rem' }}>{v.reg}</div>
                        <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: 2 }}>{v.driver}</div>
                      </div>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5, background: sc.bg, color: sc.color, padding: '3px 9px', borderRadius: 999, fontSize: '0.7rem', fontWeight: 700 }}>
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: sc.dot, display: 'inline-block' }} />
                        {v.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#374151', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                      <span>📍 {v.location}</span>
                      {v.speed > 0 && <span>🚀 {v.speed} km/h</span>}
                      <span style={{ color: '#9ca3af' }}>🕐 {v.lastUpdate}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Map placeholder */}
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f0f0f0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden', minHeight: 440 }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: 0, fontWeight: 700, color: '#111827', fontSize: '0.95rem' }}>
                    {selected ? `Tracking: ${selected.reg}` : 'Interactive Map'}
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#9ca3af' }}>
                    {selected ? selected.location : 'Select a vehicle to focus on it'}
                  </p>
                </div>
                {selected && (
                  <button onClick={() => setSelected(null)} style={{ padding: '5px 12px', borderRadius: 7, border: '1px solid #e5e7eb', background: '#f9fafb', color: '#6b7280', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600 }}>
                    Clear
                  </button>
                )}
              </div>

              {/* Stylized map with SVG Sri Lanka outline + pins */}
              <div style={{ position: 'relative', background: 'linear-gradient(135deg, #e0e7ff 0%, #f0f9ff 60%, #ecfdf5 100%)', minHeight: 370, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>

                {/* Grid lines for map feel */}
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.2 }}>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <g key={i}>
                      <line x1={`${i * 11}%`} y1="0" x2={`${i * 11}%`} y2="100%" stroke="#6366f1" strokeWidth="1" />
                      <line x1="0" y1={`${i * 11}%`} x2="100%" y2={`${i * 11}%`} stroke="#6366f1" strokeWidth="1" />
                    </g>
                  ))}
                </svg>

                {/* Pins */}
                <div style={{ position: 'relative', width: '100%', height: 300 }}>
                  {vehicles.map(v => {
                    const sc = statusColors[v.status]
                    const isHighlighted = !selected || selected.id === v.id
                    // Normalize lat/lng to container (rough mapping)
                    const left = ((v.lng - 79.5) / 1.5) * 85 + 8
                    const top  = ((8.0 - v.lat)  / 2.0) * 85 + 5
                    return (
                      <div
                        key={v.id}
                        onClick={() => setSelected(v)}
                        style={{
                          position: 'absolute',
                          left: `${left}%`, top: `${top}%`,
                          cursor: 'pointer',
                          opacity: isHighlighted ? 1 : 0.3,
                          transition: 'opacity 0.2s ease',
                          transform: 'translate(-50%, -50%)',
                          zIndex: isHighlighted ? 2 : 1,
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                          <div style={{
                            background: sc.dot, color: '#fff', borderRadius: '50% 50% 50% 0', width: 28, height: 28,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.85rem', boxShadow: `0 2px 8px ${sc.dot}66`,
                            transform: 'rotate(-45deg)',
                            border: selected?.id === v.id ? '3px solid #fff' : 'none',
                          }}>
                            <span style={{ transform: 'rotate(45deg)' }}>🚗</span>
                          </div>
                          <div style={{ background: 'rgba(255,255,255,0.92)', borderRadius: 6, padding: '2px 7px', fontSize: '0.65rem', fontWeight: 700, color: '#374151', whiteSpace: 'nowrap', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
                            {v.reg}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div style={{ position: 'absolute', bottom: 12, right: 14, fontSize: '0.72rem', color: '#9ca3af', background: 'rgba(255,255,255,0.8)', padding: '4px 10px', borderRadius: 6 }}>
                  📍 Live positions — updates every 30s
                </div>
              </div>

              {/* Selected vehicle info */}
              {selected && (
                <div style={{ padding: '14px 20px', borderTop: '1px solid #f3f4f6', background: '#f9fafb', display: 'flex', gap: 20, flexWrap: 'wrap', fontSize: '0.83rem' }}>
                  {[
                    ['Vehicle',  selected.reg],
                    ['Driver',   selected.driver],
                    ['Location', selected.location],
                    ['Speed',    selected.speed > 0 ? `${selected.speed} km/h` : 'Stationary'],
                    ['Updated',  selected.lastUpdate],
                  ].map(([k, vv]) => (
                    <div key={k}>
                      <div style={{ color: '#9ca3af', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{k}</div>
                      <div style={{ color: '#374151', fontWeight: 600, marginTop: 2 }}>{vv}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default LocationPage
