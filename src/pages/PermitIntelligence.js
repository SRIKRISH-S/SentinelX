import React, { useState } from 'react';
import { FileCheck, AlertTriangle, Clock, CheckCircle, XCircle, Filter, Plus, Eye, Zap } from 'lucide-react';
import './PermitIntelligence.css';

const PERMITS = [
  {
    id: 'WP-2341', type: 'Hot Work', zone: 'A1-Adjacent', issuer: 'Rajesh Kumar',
    start: '06:00', end: '14:00', workers: 3, status: 'flagged',
    flags: ['Within 48m of Zone C4 gas accumulation', 'No LEL isolation confirmed in buffer zone', 'Wind direction carries vapors toward work site'],
    risk: 89,
    description: 'Welding and cutting operations on pipe section near boundary fence'
  },
  {
    id: 'WP-2339', type: 'Confined Space Entry', zone: 'B3-Tank7', issuer: 'Priya Sharma',
    start: '07:30', end: '15:30', workers: 2, status: 'active',
    flags: [],
    risk: 42,
    description: 'Internal inspection of storage tank 7 — atmospheric conditions verified'
  },
  {
    id: 'WP-2337', type: 'Electrical Isolation', zone: 'D2-Panel3', issuer: 'Suresh Nair',
    start: '08:00', end: '16:00', workers: 2, status: 'active',
    flags: [],
    risk: 18,
    description: 'LOTO on panel board 3 for scheduled maintenance'
  },
  {
    id: 'WP-2335', type: 'Work at Height', zone: 'A1-Stack', issuer: 'Mohammed Ali',
    start: '05:30', end: '13:30', workers: 4, status: 'review',
    flags: ['Safety harness inspection overdue for 1 worker'],
    risk: 55,
    description: 'Inspection and minor repair on coke oven stack at 24m elevation'
  },
  {
    id: 'WP-2333', type: 'Chemical Handling', zone: 'E5-Store2', issuer: 'Anjali Singh',
    start: '09:00', end: '17:00', workers: 3, status: 'active',
    flags: [],
    risk: 26,
    description: 'Transfer of coolant chemicals from storage to processing unit'
  },
  {
    id: 'WP-2330', type: 'Excavation', zone: 'E5-North', issuer: 'Vikram Patel',
    start: '06:00', end: '18:00', workers: 6, status: 'completed',
    flags: [],
    risk: 30,
    description: 'Trench excavation for new water pipeline installation — completed'
  },
  {
    id: 'WP-2328', type: 'Radiography', zone: 'B3-Pipe12', issuer: 'Deepak Rao',
    start: '22:00', end: '06:00', workers: 2, status: 'scheduled',
    flags: [],
    risk: 40,
    description: 'NDT radiography inspection on critical weld joints — night shift'
  },
];

const STATUS_CONFIG = {
  flagged: { label: 'AI Flagged', color: 'var(--accent-red)', bg: 'rgba(239,68,68,0.12)' },
  active: { label: 'Active', color: 'var(--accent-green)', bg: 'rgba(16,185,129,0.1)' },
  review: { label: 'Under Review', color: 'var(--accent-amber)', bg: 'rgba(245,158,11,0.12)' },
  completed: { label: 'Completed', color: 'var(--text-muted)', bg: 'rgba(71,85,105,0.2)' },
  scheduled: { label: 'Scheduled', color: 'var(--accent-cyan)', bg: 'rgba(6,182,212,0.1)' },
  suspended: { label: 'AI Suspended', color: 'var(--accent-red)', bg: 'rgba(239,68,68,0.2)' },
};

export default function PermitIntelligence({ permits, setPermits, drillActive }) {
  const [selectedId, setSelectedId] = useState(permits[0]?.id || 'WP-2341');
  const [filter, setFilter] = useState('all');

  const selected = permits.find(p => p.id === selectedId) || permits[0];
  const filtered = filter === 'all' ? permits : permits.filter(p => p.status === filter);

  const handleSuspend = (id) => {
    setPermits(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, status: 'suspended', flags: ['Permit manually suspended by operator for safety compliance.'], risk: 0 }
          : p
      )
    );
  };

  const handleOverride = (id) => {
    setPermits(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, status: 'active', flags: [], risk: 45 }
          : p
      )
    );
  };


  return (
    <div className="permit-intel animate-fadeIn">
      <div className="pi-header">
        <div>
          <p className="section-eyebrow">AI-Powered Permit-to-Work Management</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>Permit Intelligence Agent</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
            Real-time cross-analysis of permits against plant conditions, gas readings, and simultaneous operations
          </p>
        </div>
        <button className="btn btn-primary"><Plus size={14} /> New Permit</button>
      </div>

      {/* Filter tabs */}
      <div className="filter-tabs">
        {['all', 'flagged', 'active', 'review', 'scheduled', 'completed', 'suspended'].map(f => (
          <button
            key={f}
            className={`filter-tab ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? `All (${permits.length})` : `${STATUS_CONFIG[f]?.label || f} (${permits.filter(p => p.status === f).length})`}
          </button>
        ))}
      </div>

      <div className="pi-main">
        {/* Permit List */}
        <div className="permit-list">
          {filtered.map(permit => (
            <div
              key={permit.id}
              className={`permit-row ${permit.status} ${selected?.id === permit.id ? 'selected' : ''}`}
              onClick={() => setSelectedId(permit.id)}
            >
              <div className="permit-row-left">
                <div className="permit-type-icon" style={{ background: STATUS_CONFIG[permit.status]?.bg }}>
                  <FileCheck size={14} style={{ color: STATUS_CONFIG[permit.status]?.color }} />
                </div>
                <div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 3 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent-cyan)' }}>{permit.id}</span>
                    <span style={{
                      fontSize: 11, fontWeight: 600,
                      color: STATUS_CONFIG[permit.status]?.color,
                      background: STATUS_CONFIG[permit.status]?.bg,
                      padding: '2px 8px', borderRadius: 99
                    }}>{STATUS_CONFIG[permit.status]?.label}</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{permit.type}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Zone {permit.zone} · {permit.start}–{permit.end}</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 700,
                  color: permit.risk > 80 ? 'var(--accent-red)' : permit.risk > 50 ? 'var(--accent-amber)' : 'var(--text-secondary)'
                }}>{permit.risk}</span>
                {permit.flags.length > 0 && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--accent-red)' }}>
                    <AlertTriangle size={11} /> {permit.flags.length} flag{permit.flags.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Detail panel */}
        <div className="permit-detail">
          {selected && (
            <div className={`card ${selected.status === 'flagged' ? 'alert' : selected.status === 'review' ? 'warning' : ''}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', fontSize: 14, fontWeight: 700 }}>{selected.id}</span>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 99,
                      color: STATUS_CONFIG[selected.status]?.color,
                      background: STATUS_CONFIG[selected.status]?.bg
                    }}>{STATUS_CONFIG[selected.status]?.label}</span>
                  </div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700 }}>{selected.type}</h2>
                </div>
                <div className="risk-score-ring" style={{
                  '--score-color': selected.risk > 80 ? '#ef4444' : selected.risk > 50 ? '#f59e0b' : '#10b981'
                }}>
                  <span className="risk-score-val">{selected.risk}</span>
                </div>
              </div>

              <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.5 }}>{selected.description}</p>

              <div className="permit-meta-grid">
                <div className="permit-meta-item">
                  <span className="pmi-label">Zone</span>
                  <span className="pmi-value">{selected.zone}</span>
                </div>
                <div className="permit-meta-item">
                  <span className="pmi-label">Duration</span>
                  <span className="pmi-value">{selected.start} – {selected.end}</span>
                </div>
                <div className="permit-meta-item">
                  <span className="pmi-label">Issuing Officer</span>
                  <span className="pmi-value">{selected.issuer}</span>
                </div>
                <div className="permit-meta-item">
                  <span className="pmi-label">Workers Authorized</span>
                  <span className="pmi-value">{selected.workers}</span>
                </div>
              </div>

              <div className="divider" />

              {selected.flags.length > 0 ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <Zap size={15} color="var(--accent-red)" />
                    <p className="section-eyebrow" style={{ color: 'var(--accent-red)', marginBottom: 0 }}>AI-Detected Conflicts ({selected.flags.length})</p>
                  </div>
                  {selected.flags.map((f, i) => (
                    <div key={i} className="flag-item">
                      <AlertTriangle size={13} color="var(--accent-red)" />
                      <p style={{ fontSize: 13, color: '#fca5a5', lineHeight: 1.4 }}>{f}</p>
                    </div>
                  ))}
                  <div className="divider" />
                  <div style={{ display: 'flex', gap: 8, width: '100%' }}>
                    {selected.status === 'suspended' ? (
                      <button 
                        className="btn btn-success" 
                        style={{ flex: 1, background: 'var(--accent-green)', borderColor: 'var(--accent-green)', fontWeight: 600 }} 
                        onClick={() => handleOverride(selected.id)}
                      >
                        ✅ Re-Activate Permit
                      </button>
                    ) : (
                      <>
                        <button className="btn btn-danger" style={{ flex: 1, fontWeight: 600 }} onClick={() => handleSuspend(selected.id)}>
                          Suspend Permit
                        </button>
                        <button className="btn btn-secondary" onClick={() => handleOverride(selected.id)}>
                          Override with Justification
                        </button>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8 }}>
                  <CheckCircle size={16} color="var(--accent-green)" />
                  <p style={{ fontSize: 13, color: 'var(--accent-green)' }}>No conflicts detected — permit conditions verified against current plant state</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
