import React, { useState } from 'react';
import { FileSearch, TrendingUp, Calendar, AlertCircle, ChevronDown, ChevronRight, BookOpen, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import './IncidentAnalysis.css';

const INCIDENTS = [
  { id: 'INC-2025-089', date: '2025-11-14', type: 'Near Miss', zone: 'C4', severity: 'High', cause: 'Gas accumulation undetected during maintenance window', pattern: 'Compound Risk', days_ago: 237 },
  { id: 'INC-2025-067', date: '2025-08-22', type: 'First Aid', zone: 'A1', severity: 'Medium', cause: 'Permit conflict — hot work near flammable material', pattern: 'Permit Failure', days_ago: 321 },
  { id: 'INC-2025-041', date: '2025-05-03', type: 'Near Miss', zone: 'B3', severity: 'Medium', cause: 'Shift handover gap — abnormal condition not communicated', pattern: 'Communication', days_ago: 432 },
  { id: 'INC-2024-198', date: '2024-12-18', type: 'LTI', zone: 'C4', severity: 'Critical', cause: 'Confined space entry without atmospheric check during process deviation', pattern: 'Compound Risk', days_ago: 568 },
  { id: 'INC-2024-134', date: '2024-09-07', type: 'Near Miss', zone: 'D2', severity: 'Low', cause: 'PPE non-compliance — worker entered hazardous area without respiratory protection', pattern: 'PPE', days_ago: 670 },
];

const PATTERNS = [
  {
    id: 'P1',
    name: 'Compound Risk — Gas + Maintenance',
    frequency: 4,
    risk: 'Critical',
    description: 'RAG analysis of last 3 years identifies a recurring pattern: gas concentration rise during maintenance windows. Seen in 4 incidents including the Vizag 2025 fatalities pattern. Occurs predominantly during 06:00-09:00 shift start.',
    recommendation: 'Mandatory gas hold on maintenance permits when any sensor in zone > 60% threshold. Implement AI pre-permit check as blocking step.',
    regulation: 'OISD-116 Clause 7.4.2 — Permit isolation requirements during concurrent operations',
    incidents: ['INC-2025-089', 'INC-2024-198'],
  },
  {
    id: 'P2',
    name: 'Hot Work Permit Proximity Failures',
    frequency: 3,
    risk: 'High',
    description: 'Hot work permits issued without adequate verification of gas levels in adjacent zones. The 100m exclusion zone requirement (OISD-117) is consistently under-enforced during multi-zone operations.',
    recommendation: 'Automate geofence check at permit issuance — block hot work permits within 150m of any zone with LEL > 5%.',
    regulation: 'OISD-117 Clause 5.2 — Hot work exclusion zones and gas testing intervals',
    incidents: ['INC-2025-067'],
  },
  {
    id: 'P3',
    name: 'Shift Changeover Communication Gap',
    frequency: 3,
    risk: 'Medium',
    description: 'Abnormal process conditions not adequately communicated during shift handovers. Incoming shift unaware of elevated risk states, leading to operations that experienced operators would have paused.',
    recommendation: 'Mandatory AI-generated shift brief based on current SCADA state. Auto-flag any handover occurring during active compound risk.',
    regulation: 'Factory Act 1948 S.7A — Duty to inform on hazardous conditions',
    incidents: ['INC-2025-041'],
  },
];

const MONTHLY_DATA = [
  { month: 'Jan', nearMiss: 3, firstAid: 1, lti: 0 },
  { month: 'Feb', nearMiss: 2, firstAid: 0, lti: 0 },
  { month: 'Mar', nearMiss: 4, firstAid: 1, lti: 0 },
  { month: 'Apr', nearMiss: 1, firstAid: 0, lti: 0 },
  { month: 'May', nearMiss: 3, firstAid: 1, lti: 0 },
  { month: 'Jun', nearMiss: 2, firstAid: 0, lti: 0 },
  { month: 'Jul', nearMiss: 5, firstAid: 2, lti: 0 },
  { month: 'Aug', nearMiss: 2, firstAid: 1, lti: 0 },
  { month: 'Sep', nearMiss: 1, firstAid: 0, lti: 0 },
  { month: 'Oct', nearMiss: 3, firstAid: 1, lti: 0 },
  { month: 'Nov', nearMiss: 4, firstAid: 0, lti: 1 },
  { month: 'Dec', nearMiss: 2, firstAid: 0, lti: 0 },
];

const PIE_DATA = [
  { name: 'Compound Risk', value: 4, color: '#ef4444' },
  { name: 'Permit Failure', value: 3, color: '#f59e0b' },
  { name: 'Communication', value: 3, color: '#06b6d4' },
  { name: 'PPE', value: 2, color: '#10b981' },
  { name: 'Equipment', value: 1, color: '#8b5cf6' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-mid)', borderRadius: 8, padding: '10px 14px' }}>
      <p style={{ color: 'var(--text-muted)', fontSize: 11, marginBottom: 6 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, fontSize: 12, fontFamily: 'var(--font-mono)' }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function IncidentAnalysis() {
  const [selectedPattern, setSelectedPattern] = useState(PATTERNS[0]);

  return (
    <div className="incident-analysis animate-fadeIn">
      <div className="ia-header">
        <div>
          <p className="section-eyebrow">RAG-Powered Pattern Intelligence</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>Incident Pattern Analysis</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
            Cross-referencing 5 years of incidents against OISD, DGFASLI, and Factory Act regulatory corpus
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary btn-sm"><BookOpen size={13} /> Access RAG Corpus</button>
          <button className="btn btn-primary btn-sm"><BarChart2 size={13} /> Export Report</button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid-4 mb-20">
        <div className="stat-card"><div className="stat-eyebrow">Total Incidents (5yr)</div><div className="stat-value" style={{ color: 'var(--accent-amber)' }}>127</div><div className="stat-label">Incl. near-misses</div></div>
        <div className="stat-card"><div className="stat-eyebrow">Recurring Patterns</div><div className="stat-value" style={{ color: 'var(--accent-red)' }}>3</div><div className="stat-label">AI-identified</div></div>
        <div className="stat-card"><div className="stat-eyebrow">Preventable (%)</div><div className="stat-value" style={{ color: 'var(--accent-green)' }}>78%</div><div className="stat-label">With early intervention</div></div>
        <div className="stat-card"><div className="stat-eyebrow">Days Since LTI</div><div className="stat-value" style={{ color: 'var(--accent-cyan)' }}>127</div><div className="stat-label">Last: INC-2024-198</div></div>
      </div>

      <div className="ia-main">
        <div className="ia-left">
          {/* Charts */}
          <div className="card mb-16">
            <p className="section-eyebrow" style={{ marginBottom: 4 }}>Incident Trend</p>
            <h3 className="section-title" style={{ marginBottom: 16 }}>Monthly Incident Distribution — FY2025</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={MONTHLY_DATA}>
                <CartesianGrid strokeDasharray="2 4" stroke="var(--border-subtle)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="nearMiss" name="Near Miss" fill="#f59e0b" fillOpacity={0.7} radius={[3,3,0,0]} />
                <Bar dataKey="firstAid" name="First Aid" fill="#06b6d4" fillOpacity={0.7} radius={[3,3,0,0]} />
                <Bar dataKey="lti" name="LTI" fill="#ef4444" fillOpacity={0.8} radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pattern cards */}
          <p className="section-eyebrow" style={{ marginBottom: 14 }}>AI-Identified Recurring Patterns</p>
          {PATTERNS.map(pattern => (
            <div
              key={pattern.id}
              className={`pattern-card ${selectedPattern?.id === pattern.id ? 'selected' : ''} ${pattern.risk.toLowerCase()}`}
              onClick={() => setSelectedPattern(pattern)}
            >
              <div className="pattern-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className={`badge ${pattern.risk === 'Critical' ? 'critical' : pattern.risk === 'High' ? 'high' : 'medium'}`}>{pattern.risk}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{pattern.frequency} occurrences</span>
                </div>
                <ChevronRight size={16} color="var(--text-muted)" />
              </div>
              <h3 className="pattern-name">{pattern.name}</h3>
              <p className="pattern-desc">{pattern.description.substring(0, 120)}...</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                <BookOpen size={11} color="var(--accent-amber)" />
                <span style={{ fontSize: 11, color: 'var(--accent-amber)' }}>{pattern.regulation.split('—')[0].trim()}</span>
              </div>
            </div>
          ))}

          {/* Incident log */}
          <div className="card" style={{ marginTop: 16 }}>
            <p className="section-eyebrow" style={{ marginBottom: 12 }}>Incident Log</p>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th><th>Type</th><th>Zone</th><th>Severity</th><th>Pattern</th><th>Days Ago</th>
                </tr>
              </thead>
              <tbody>
                {INCIDENTS.map(inc => (
                  <tr key={inc.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', fontSize: 12 }}>{inc.id}</td>
                    <td>{inc.type}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{inc.zone}</td>
                    <td><span className={`badge ${inc.severity === 'Critical' ? 'critical' : inc.severity === 'High' ? 'high' : inc.severity === 'Medium' ? 'medium' : 'low'}`}>{inc.severity}</span></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{inc.pattern}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{inc.days_ago}d</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="ia-right">
          {/* Pie chart */}
          <div className="card mb-16">
            <p className="section-eyebrow" style={{ marginBottom: 4 }}>Cause Distribution</p>
            <h3 className="section-title" style={{ marginBottom: 10 }}>Incident Root Causes</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={PIE_DATA} dataKey="value" cx="50%" cy="50%" outerRadius={70} innerRadius={35}>
                  {PIE_DATA.map((entry, i) => <Cell key={i} fill={entry.color} fillOpacity={0.8} />)}
                </Pie>
                <Tooltip formatter={(v, n) => [v + ' incidents', n]} contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-mid)', borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {PIE_DATA.map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)', flex: 1 }}>{d.name}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pattern detail */}
          {selectedPattern && (
            <div className="card">
              <p className="section-eyebrow" style={{ marginBottom: 10 }}>Pattern Deep-Dive</p>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, marginBottom: 10 }}>{selectedPattern.name}</h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 14 }}>{selectedPattern.description}</p>

              <p className="section-eyebrow" style={{ marginBottom: 8 }}>Recommendation</p>
              <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid var(--border-amber)', borderRadius: 8, padding: '12px', marginBottom: 14 }}>
                <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.5 }}>{selectedPattern.recommendation}</p>
              </div>

              <p className="section-eyebrow" style={{ marginBottom: 8 }}>Regulatory Reference</p>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 8, padding: '10px 12px' }}>
                <BookOpen size={14} color="var(--accent-cyan)" style={{ flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: 12, color: 'var(--accent-cyan)', lineHeight: 1.5 }}>{selectedPattern.regulation}</p>
              </div>

              <div className="divider" />
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-primary btn-sm" style={{ flex: 1 }}>Create Action Item</button>
                <button className="btn btn-secondary btn-sm">Export Finding</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
