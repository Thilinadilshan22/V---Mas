import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'

const reportTypes = [
  {
    id: 'vehicle-summary',
    icon: '🚗',
    title: 'Vehicle Summary Report',
    desc: 'Overview of all fleet vehicles including status, mileage, and assignments.',
    category: 'Fleet',
    color: '#6366f1',
    bg: '#eef2ff',
  },
  {
    id: 'fuel-report',
    icon: '⛽',
    title: 'Fuel Consumption Report',
    desc: 'Detailed fuel usage breakdown per vehicle, driver, and time period.',
    category: 'Fuel',
    color: '#f59e0b',
    bg: '#fffbeb',
  },
  {
    id: 'service-report',
    icon: '🔧',
    title: 'Service & Maintenance Report',
    desc: 'Summary of all service records, costs, and upcoming maintenance schedules.',
    category: 'Maintenance',
    color: '#10b981',
    bg: '#ecfdf5',
  },
  {
    id: 'user-report',
    icon: '👥',
    title: 'User Activity Report',
    desc: 'User registration, role distribution, login history, and account statuses.',
    category: 'Users',
    color: '#3b82f6',
    bg: '#eff6ff',
  },
  {
    id: 'location-report',
    icon: '📍',
    title: 'Location & Route Report',
    desc: 'Vehicle location history, routes taken, and distance covered per vehicle.',
    category: 'Fleet',
    color: '#8b5cf6',
    bg: '#f5f3ff',
  },
  {
    id: 'cost-report',
    icon: '💰',
    title: 'Cost Analysis Report',
    desc: 'Full cost breakdown including fuel, maintenance, and operational expenses.',
    category: 'Finance',
    color: '#ec4899',
    bg: '#fdf2f8',
  },
]

const recentReports = [
  { name: 'Vehicle Summary – Mar 2026',   generated: '2026-03-20', format: 'PDF',  size: '245 KB' },
  { name: 'Fuel Consumption – Feb 2026',  generated: '2026-03-01', format: 'Excel', size: '118 KB' },
  { name: 'User Activity – Q1 2026',      generated: '2026-03-15', format: 'PDF',  size: '312 KB' },
  { name: 'Service Summary – Feb 2026',   generated: '2026-03-02', format: 'PDF',  size: '198 KB' },
]

const ReportsPage = () => {
  const [generating, setGenerating] = useState(null)

  const handleGenerate = (id) => {
    setGenerating(id)
    setTimeout(() => setGenerating(null), 1800)
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Reports" subtitle="Home / Reports" />
        <div className="page-body">

          <div className="welcome-banner">
            <div className="welcome-text">
              <h1>Reports & Analytics 📊</h1>
              <p>Generate comprehensive reports on fleet performance, fuel usage, and system activity.</p>
            </div>
            <div className="welcome-icon">📊</div>
          </div>

          {/* Quick stats */}
          <div className="stats-grid" style={{ marginBottom: 24 }}>
            {[
              { label: 'Reports Generated', value: '38',    icon: '📄', color: 'icon-purple' },
              { label: 'This Month',        value: '12',    icon: '📅', color: 'icon-blue'   },
              { label: 'Total Downloads',   value: '127',   icon: '⬇️', color: 'icon-green'  },
              { label: 'Report Types',      value: reportTypes.length.toString(), icon: '📋', color: 'icon-indigo' },
            ].map(s => (
              <div key={s.label} className="stat-card" style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div><p className="stat-card-label">{s.label}</p><p className="stat-card-value">{s.value}</p></div>
                  <div className={`stat-card-icon ${s.color}`}>{s.icon}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Generate Reports */}
          <div className="section-header" style={{ marginBottom: 14 }}>
            <h2 className="section-title">Generate Reports</h2>
            <div className="section-divider" />
          </div>
          <div className="features-grid" style={{ marginBottom: 32 }}>
            {reportTypes.map(r => (
              <div key={r.id} className="feature-card" style={{ position: 'relative', overflow: 'hidden' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: r.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', marginBottom: 12 }}>
                  {r.icon}
                </div>
                <span style={{ background: r.bg, color: r.color, fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'inline-block', marginBottom: 8 }}>
                  {r.category}
                </span>
                <h3 style={{ marginBottom: 6, fontSize: '0.9rem', fontWeight: 700 }}>{r.title}</h3>
                <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: 14 }}>{r.desc}</p>
                <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                  <button
                    onClick={() => handleGenerate(r.id)}
                    disabled={generating === r.id}
                    style={{
                      flex: 1, padding: '7px 12px', borderRadius: 8, border: 'none',
                      background: generating === r.id ? '#e0e7ff' : r.color,
                      color: generating === r.id ? r.color : '#fff',
                      fontSize: '0.8rem', fontWeight: 700, cursor: generating === r.id ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {generating === r.id ? '⏳ Generating…' : '⬇ Generate PDF'}
                  </button>
                  <button style={{ padding: '7px 12px', borderRadius: 8, border: `1.5px solid ${r.color}30`, background: r.bg, color: r.color, fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
                    Excel
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Reports */}
          <div className="section-header" style={{ marginBottom: 14 }}>
            <h2 className="section-title">Recent Reports</h2>
            <div className="section-divider" />
          </div>
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #f0f0f0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1.5px solid #f0f0f0' }}>
                  {['Report Name', 'Generated Date', 'Format', 'Size', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#374151', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentReports.map((r, i) => (
                  <tr key={r.name} style={{ borderBottom: '1px solid #f3f4f6', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: '#374151' }}>
                      <span style={{ marginRight: 8 }}>📄</span>{r.name}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#6b7280' }}>{r.generated}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ background: r.format === 'PDF' ? '#fee2e2' : '#d1fae5', color: r.format === 'PDF' ? '#991b1b' : '#065f46', padding: '2px 9px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700 }}>
                        {r.format}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#6b7280' }}>{r.size}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff', color: '#374151', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>⬇ Download</button>
                        <button style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #fee2e2', background: '#fff5f5', color: '#dc2626', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ReportsPage
