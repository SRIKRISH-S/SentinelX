import React, { useState, useEffect } from 'react';
import { Zap, AlertTriangle, TrendingUp, Clock, ChevronRight, RefreshCw, Filter } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from 'recharts';
import './RiskEngine.css';

const COMPOUND_RISKS = [
  {
    id: 'CR-001',
    severity: 'critical',
    score: 91,
    title: 'Gas Accumulation + Active Maintenance',
    description: 'H2S at 87% alarm threshold in Zone C4 coincides with active confined space permit WP-2339 and 3 maintenance workers on-site. Historical pattern matches 4 of last 7 VISP-class incidents.',
    factors: [
      { label: 'H2S Level', value: '43 ppm', threshold: '50 ppm', pct: 86 },
      { label: 'CO Level', value: '27 ppm', threshold: '35 ppm', pct: 77 },
      { label: 'Active Permits', value: '2 active', threshold: '0 in gas zone', pct: 100 },
      { label: 'Worker Exposure', value: '3 workers', threshold: '0 in zone', pct: 100 },
    ],
    predictedIncident: '2h 40m',
    intervention: 'Evacuate Zone C4, suspend WP-2341, activate ventilation protocol',
    agents: ['Gas Sensor Agent', 'Permit Intelligence Agent', 'Historical Pattern RAG'],
  },
  {
    id: 'CR-002',
    severity: 'high',
    score: 74,
    title: 'Simultaneous Hot Work Near Flammable Zone',
    description: 'Permit WP-2341 (hot work) active within 48m of Zone C4 boundary where flammable gas levels are elevated. No LEL isolation confirmed in the buffer zone.',
    factors: [
      { label: 'Hot Work Distance', value: '48m', threshold: '100m min', pct: 52 },
      { label: 'LEL Reading', value: '12%', threshold: '5%', pct: 100 },
      { label: 'Wind Direction', value: 'NE 8 km/h', threshold: 'Away from HW', pct: 60 },
      { label: 'Fire Suppression', value: 'Standby', threshold: 'Active', pct: 50 },
    ],
    predictedIncident: '6h 15m',
    intervention: 'Suspend WP-2341 until LEL isolation confirmed or gas levels normal',
    agents: ['Permit Intelligence Agent', 'SCADA Agent', 'Weather Integration'],
  },
  {
    id: 'CR-003',
    severity: 'medium',
    score: 52,
    title: 'Shift Changeover During Abnormal Process',
    description: 'Coke Oven Battery A is in abnormal operating state (pressure deviation +12%) and a shift changeover is occurring — high risk period for procedural errors and missed warnings.',
    factors: [
      { label: 'Process Deviation', value: '+12%', threshold: '±5%', pct: 70 },
      { label: 'Changeover Risk', value: 'In progress', threshold: 'Completed', pct: 80 },
      { label: 'Overlap Period', value: '14 min', threshold: '30 min min', pct: 50 },
      { label: 'Brief Completed', value: 'Partial', threshold: 'Full', pct: 40 },
    ],
    predictedIncident: '12h+',
    intervention: 'Extend handover period, mandatory re-brief on current deviations',
    agents: ['Shift Monitor Agent', 'SCADA Agent'],
  },
];

const RISK_MATRIX = [
  { zone: 'A1', probability: 35, severity: 60, label: 'Coke A' },
  { zone: 'B3', probability: 20, severity: 40, label: 'Furnace B' },
  { zone: 'C4', probability: 85, severity: 95, label: 'Gas C4' },
  { zone: 'D2', probability: 15, severity: 30, label: 'Cooling D' },
  { zone: 'E5', probability: 30, severity: 45, label: 'Yard E' },
];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-mid)', borderRadius: 8, padding: '10px 14px' }}>
      <p style={{ color: 'var(--text-primary)', fontSize: 13, fontWeight: 600 }}>{d?.label}</p>
      <p style={{ color: 'var(--accent-amber)', fontSize: 12 }}>Probability: {d?.probability}%</p>
      <p style={{ color: '#f87171', fontSize: 12 }}>Severity: {d?.severity}</p>
    </div>
  );
};

export default function RiskEngine({ drillActive, sensorData }) {
  const currentSensor = sensorData[sensorData.length - 1] || { h2s: 24, co: 18, temp: 62, risk: 35 };

  const dynamicCompoundRisks = COMPOUND_RISKS.map(cr => {
    if (cr.id === 'CR-001') {
      return {
        ...cr,
        score: drillActive ? currentSensor.risk : 91,
        description: drillActive 
          ? `🚨 DRILL HAZARD ENGAGED: H2S level at ${currentSensor.h2s} ppm has breached the alarm threshold of 50 ppm in Zone C4. Active welding permit WP-2341 suspended. Evacuation protocol active.` 
          : cr.description,
        factors: cr.factors.map(f => {
          if (f.label === 'H2S Level') {
            return {
              ...f,
              value: `${drillActive ? currentSensor.h2s : 43} ppm`,
              pct: drillActive ? 100 : 86
            };
          }
          if (f.label === 'CO Level') {
            return {
              ...f,
              value: `${drillActive ? currentSensor.co : 27} ppm`,
              pct: drillActive ? 100 : 77
            };
          }
          return f;
        })
      };
    }
    return cr;
  });

  const [selectedId, setSelectedId] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [lastScan, setLastScan] = useState('Just now');

  const selected = dynamicCompoundRisks.find(r => r.id === selectedId) || null;

  const handleRescan = () => {
    setScanning(true);
    setTimeout(() => { setScanning(false); setLastScan('Just now'); }, 2200);
  };


  return (
    <div className="risk-engine animate-fadeIn">
      {/* Header bar */}
      <div className="re-header">
        <div>
          <p className="section-eyebrow">Multi-Agent Compound Risk Detection</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>Risk Intelligence Engine</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
            Correlating 47 sensors · 7 permits · SCADA feeds · Shift records in real-time
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <button className="btn btn-secondary btn-sm"><Filter size={13} /> Filter</button>
          <button className="btn btn-primary btn-sm" onClick={handleRescan} disabled={scanning}>
            {scanning ? <><span className="spinner" style={{ width: 14, height: 14 }} /> Scanning...</> : <><RefreshCw size={13} /> Re-scan Now</>}
          </button>
        </div>
      </div>

      {/* Summary bar */}
      <div className="risk-summary-bar">
        <div className="risk-summary-item">
          <span className="rsi-value" style={{ color: 'var(--accent-red)' }}>1</span>
          <span className="rsi-label">Critical</span>
        </div>
        <div className="risk-summary-item">
          <span className="rsi-value" style={{ color: 'var(--accent-amber)' }}>1</span>
          <span className="rsi-label">High</span>
        </div>
        <div className="risk-summary-item">
          <span className="rsi-value" style={{ color: 'var(--accent-cyan)' }}>1</span>
          <span className="rsi-label">Medium</span>
        </div>
        <div className="risk-summary-item">
          <span className="rsi-value" style={{ color: 'var(--text-muted)' }}>3</span>
          <span className="rsi-label">Total Compound Risks</span>
        </div>
        <div style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Clock size={12} /> Last scan: {lastScan}
        </div>
      </div>

      <div className="re-main">
        {/* Risk list */}
        <div className="risk-list">
          {dynamicCompoundRisks.map(risk => (
            <div
              key={risk.id}
              className={`risk-card ${risk.severity} ${selectedId === risk.id ? 'selected' : ''}`}
              onClick={() => setSelectedId(risk.id === selectedId ? null : risk.id)}
            >
              <div className="risk-card-header">
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span className={`badge ${risk.severity}`}>{risk.severity.toUpperCase()}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>{risk.id}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="risk-score-ring" style={{
                    '--score-color': risk.severity === 'critical' ? '#ef4444' : risk.severity === 'high' ? '#f59e0b' : '#06b6d4'
                  }}>
                    <span className="risk-score-val">{risk.score}</span>
                  </div>
                  <ChevronRight size={16} color="var(--text-muted)" />
                </div>
              </div>

              <h3 className="risk-title">{risk.title}</h3>
              <p className="risk-desc">{risk.description}</p>

              <div className="risk-factors">
                {risk.factors.slice(0, 2).map((f, i) => (
                  <div key={i} className="factor-row">
                    <span className="factor-label">{f.label}</span>
                    <div className="risk-bar" style={{ flex: 1, maxWidth: 80 }}>
                      <div className="risk-bar-fill" style={{
                        width: `${f.pct}%`,
                        background: f.pct > 80 ? 'var(--accent-red)' : f.pct > 50 ? 'var(--accent-amber)' : 'var(--accent-cyan)'
                      }} />
                    </div>
                    <span className="factor-val font-mono">{f.value}</span>
                  </div>
                ))}
              </div>

              <div className="risk-footer">
                <div className="risk-agents">
                  {risk.agents.map((a, i) => (
                    <span key={i} className="agent-tag">{a}</span>
                  ))}
                </div>
                <div className="risk-time">
                  <Clock size={11} />
                  <span>~{risk.predictedIncident} to threshold</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detail panel */}
        <div className="risk-detail">
          {selected ? (
            <div className="card" style={{ position: 'sticky', top: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <span className={`badge ${selected.severity}`} style={{ marginBottom: 8 }}>{selected.severity.toUpperCase()}</span>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700 }}>{selected.title}</h2>
                </div>
                <div className="risk-score-ring large" style={{
                  '--score-color': selected.severity === 'critical' ? '#ef4444' : selected.severity === 'high' ? '#f59e0b' : '#06b6d4'
                }}>
                  <span className="risk-score-val">{selected.score}</span>
                </div>
              </div>

              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>{selected.description}</p>

              <p className="section-eyebrow" style={{ marginBottom: 10 }}>Contributing Factors</p>
              {selected.factors.map((f, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{f.label}</span>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: f.pct > 80 ? 'var(--accent-red)' : 'var(--accent-amber)' }}>{f.value}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>/ {f.threshold}</span>
                    </div>
                  </div>
                  <div className="risk-bar">
                    <div className="risk-bar-fill" style={{
                      width: `${f.pct}%`,
                      background: f.pct > 80 ? 'var(--accent-red)' : f.pct > 50 ? 'var(--accent-amber)' : 'var(--accent-cyan)'
                    }} />
                  </div>
                </div>
              ))}

              <div className="divider" />

              <p className="section-eyebrow" style={{ marginBottom: 10 }}>Recommended Intervention</p>
              <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid var(--border-amber)', borderRadius: 10, padding: '12px 14px', marginBottom: 16 }}>
                <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.5 }}>{selected.intervention}</p>
              </div>

              <p className="section-eyebrow" style={{ marginBottom: 10 }}>Detecting Agents</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
                {selected.agents.map((a, i) => (
                  <span key={i} className="agent-tag" style={{ fontSize: 12, padding: '4px 10px' }}>{a}</span>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-danger" style={{ flex: 1 }}>Initiate Intervention</button>
                <button className="btn btn-secondary">Generate Report</button>
              </div>
            </div>
          ) : (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 48, textAlign: 'center', minHeight: 300 }}>
              <Zap size={40} color="var(--text-muted)" style={{ marginBottom: 16 }} />
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Select a compound risk to view full analysis and recommended intervention</p>
            </div>
          )}

          {/* Risk Matrix */}
          <div className="card" style={{ marginTop: 16 }}>
            <p className="section-eyebrow" style={{ marginBottom: 4 }}>Risk Matrix</p>
            <h3 className="section-title" style={{ marginBottom: 16 }}>Probability vs Severity</h3>
            <ResponsiveContainer width="100%" height={200}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="2 4" stroke="var(--border-subtle)" />
                <XAxis type="number" dataKey="probability" name="Probability %" domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} label={{ value: 'Probability %', position: 'insideBottom', offset: -5, style: { fontSize: 10, fill: 'var(--text-muted)' } }} />
                <YAxis type="number" dataKey="severity" name="Severity" domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                <ZAxis range={[60, 200]} />
                <Tooltip content={<CustomTooltip />} />
                <Scatter data={RISK_MATRIX} fill="var(--accent-amber)" fillOpacity={0.7} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
