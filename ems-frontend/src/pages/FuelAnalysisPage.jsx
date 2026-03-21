import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'

const monthlyData = [
  { month: 'Oct', diesel: 820, petrol: 240 },
  { month: 'Nov', diesel: 760, petrol: 210 },
  { month: 'Dec', diesel: 910, petrol: 280 },
  { month: 'Jan', diesel: 870, petrol: 260 },
  { month: 'Feb', diesel: 790, petrol: 230 },
  { month: 'Mar', diesel: 840, petrol: 250 },
]

const vehicleFuel = [
  { reg: 'WP-CAB-1234', make: 'Toyota Prado',   jan: 120, feb: 110, mar: 130, total: 360, cost: 198000 },
  { reg: 'WP-CAB-5678', make: 'Nissan Navara',  jan: 95,  feb: 88,  mar: 102, total: 285, cost: 156750 },
  { reg: 'CP-2345',     make: 'Mitsubishi L200', jan: 140, feb: 135, mar: 0,   total: 275, cost: 151250 },
  { reg: 'SP-7890',     make: 'Toyota Hilux',   jan: 60,  feb: 55,  mar: 72,  total: 187, cost: 102850 },
  { reg: 'WP-CAB-9012', make: 'Isuzu D-Max',    jan: 80,  feb: 78,  mar: 85,  total: 243, cost: 133650 },
]

const BAR_COLORS = { diesel: '#6366f1', petrol: '#f59e0b' }

const maxVal = Math.max(...monthlyData.flatMap(d => [d.diesel, d.petrol]))

const FuelAnalysisPage = () => {
  const [period, setPeriod] = useState('6M')

  const totalDiesel = monthlyData.reduce((s, d) => s + d.diesel, 0)
  const totalPetrol = monthlyData.reduce((s, d) => s + d.petrol, 0)
  const totalLitres = totalDiesel + totalPetrol
  const totalCost   = totalLitres * 550  // avg LKR 550/L

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Topbar title="Fuel Analysis" subtitle="Home / Fuel Analysis" />
        <div className="page-body">

          <div className="welcome-banner">
            <div className="welcome-text">
              <h1>Fuel Analysis ⛽</h1>
              <p>Monitor fuel consumption trends and cost analysis across the entire fleet.</p>
            </div>
            <div className="welcome-icon">⛽</div>
          </div>

          {/* Stats */}
          <div className="stats-grid" style={{ marginBottom: 24 }}>
            {[
              { label: 'Total Diesel (L)', value: totalDiesel.toLocaleString(), icon: '🛢️', color: 'icon-indigo' },
              { label: 'Total Petrol (L)', value: totalPetrol.toLocaleString(), icon: '⛽', color: 'icon-orange' },
              { label: 'Total Volume (L)', value: totalLitres.toLocaleString(), icon: '📊', color: 'icon-purple' },
              { label: 'Est. Cost (LKR)',  value: totalCost.toLocaleString(),   icon: '💰', color: 'icon-green'  },
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
                {['3M', '6M'].map(p => (
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
              {(period === '3M' ? monthlyData.slice(-3) : monthlyData).map(d => (
                <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 150, width: '100%', justifyContent: 'center' }}>
                    <div style={{ width: 18, height: `${(d.diesel / maxVal) * 150}px`, background: BAR_COLORS.diesel, borderRadius: '4px 4px 0 0', transition: 'height 0.4s ease' }} title={`Diesel: ${d.diesel}L`} />
                    <div style={{ width: 18, height: `${(d.petrol / maxVal) * 150}px`, background: BAR_COLORS.petrol, borderRadius: '4px 4px 0 0', transition: 'height 0.4s ease' }} title={`Petrol: ${d.petrol}L`} />
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 600 }}>{d.month}</span>
                </div>
              ))}
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

          {/* Per-vehicle table */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #f0f0f0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ padding: '18px 22px 14px', borderBottom: '1px solid #f3f4f6' }}>
              <h3 style={{ margin: 0, fontWeight: 700, color: '#111827', fontSize: '0.95rem' }}>Per-Vehicle Consumption (Jan–Mar 2026)</h3>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1.5px solid #f0f0f0' }}>
                  {['Vehicle', 'Jan (L)', 'Feb (L)', 'Mar (L)', 'Total (L)', 'Est. Cost (LKR)'].map(h => (
                    <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontWeight: 700, color: '#374151', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vehicleFuel.map((v, i) => (
                  <tr key={v.reg} style={{ borderBottom: '1px solid #f3f4f6', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                    <td style={{ padding: '11px 16px' }}>
                      <div style={{ fontWeight: 600, color: '#6366f1' }}>{v.reg}</div>
                      <div style={{ fontSize: '0.76rem', color: '#9ca3af' }}>{v.make}</div>
                    </td>
                    <td style={{ padding: '11px 16px', color: '#374151' }}>{v.jan}</td>
                    <td style={{ padding: '11px 16px', color: '#374151' }}>{v.feb}</td>
                    <td style={{ padding: '11px 16px', color: v.mar === 0 ? '#9ca3af' : '#374151' }}>{v.mar || '—'}</td>
                    <td style={{ padding: '11px 16px', fontWeight: 700, color: '#111827' }}>{v.total}</td>
                    <td style={{ padding: '11px 16px', fontWeight: 700, color: '#6366f1' }}>{v.cost.toLocaleString()}</td>
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

export default FuelAnalysisPage
