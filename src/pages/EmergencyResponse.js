import React, { useState, useEffect } from 'react';
import { AlertTriangle, Phone, Radio, Shield, Clock, CheckSquare, Square, Siren, Users, MapPin, FileText } from 'lucide-react';
import './EmergencyResponse.css';

const PROTOCOLS = [
  {
    id: 'GAS_LEAK',
    title: 'Gas Leak / Toxic Release',
    trigger: 'H2S > 50 ppm OR CO > 35 ppm',
    color: '#ef4444',
    steps: [
      { id: 1, action: 'Activate plant PA system — Gas Emergency announcement', auto: true, done: false },
      { id: 2, action: 'Isolate gas supply to affected zone via SCADA auto-shutoff', auto: true, done: false },
      { id: 3, action: 'Alert all workers in Zone C4 and 100m buffer to evacuate', auto: false, done: false },
      { id: 4, action: 'Dispatch emergency response team with BA sets to muster point', auto: false, done: false },
      { id: 5, action: 'Contact DGFASLI and State Fire Services', auto: false, done: false },
      { id: 6, action: 'Notify Plant Medical Officer and standby ambulance', auto: true, done: false },
      { id: 7, action: 'Preserve sensor logs and SCADA records for investigation', auto: true, done: false },
      { id: 8, action: 'Generate OISD-116 compliant preliminary incident report', auto: true, done: false },
    ],
  },
  {
    id: 'FIRE',
    title: 'Fire / Explosion',
    trigger: 'Smoke sensor + thermal camera detection',
    color: '#f59e0b',
    steps: [
      { id: 1, action: 'Trigger fire alarm and initiate plant-wide evacuation', auto: true, done: false },
      { id: 2, action: 'Activate deluge and fire suppression systems', auto: true, done: false },
      { id: 3, action: 'Call Vizag Fire Services (+91-891-2754000)', auto: false, done: false },
      { id: 4, action: 'Account for all workers at designated muster points', auto: false, done: false },
      { id: 5, action: 'Isolate electrical supply to affected sections', auto: false, done: false },
      { id: 6, action: 'Establish ICP (Incident Command Post) at Gate 2', auto: false, done: false },
    ],
  },
  {
    id: 'INJURY',
    title: 'Medical Emergency',
    trigger: 'Manual trigger or CCTV person-down detection',
    color: '#06b6d4',
    steps: [
      { id: 1, action: 'Alert plant medical team and dispatch to location', auto: true, done: false },
      { id: 2, action: 'Call ambulance and notify nearest hospital (KGH Vizag)', auto: false, done: false },
      { id: 3, action: 'Preserve scene — restrict area access via barriers', auto: false, done: false },
      { id: 4, action: 'Notify DGFASLI Form 16 filing within 12 hours if serious', auto: false, done: false },
    ],
  },
];

const CONTACTS = [
  { name: 'Plant Emergency Controller', role: 'PEC', phone: '+91-891-XXXX-001', status: 'available' },
  { name: 'Shift Safety Officer', role: 'SSO', phone: '+91-891-XXXX-002', status: 'available' },
  { name: 'Plant Medical Officer', role: 'PMO', phone: '+91-891-XXXX-003', status: 'available' },
  { name: 'Fire Brigade Station', role: 'Fire', phone: '+91-891-2754000', status: 'external' },
  { name: 'DGFASLI Regional Office', role: 'Regulator', phone: '+91-40-XXXX-XXXX', status: 'external' },
  { name: 'KGH Hospital Emergency', role: 'Medical', phone: '+91-891-XXXX-100', status: 'external' },
];

export default function EmergencyResponse({
  drillActive,
  activeProtocolId,
  setActiveProtocolId,
  emergencySteps,
  setEmergencySteps,
  emergencyTimer,
  setEmergencyTimer
}) {
  const activeProtocol = PROTOCOLS.find(p => p.id === activeProtocolId);

  useEffect(() => {
    if (!activeProtocolId) return;
    const t = setInterval(() => setEmergencyTimer(e => e + 1), 1000);
    return () => clearInterval(t);
  }, [activeProtocolId, setEmergencyTimer]);

  const formatElapsed = (s) => {
    const m = Math.floor(s / 60), sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const activateProtocol = (protocol) => {
    setActiveProtocolId(protocol.id);
    const initial = {};
    protocol.steps.forEach(s => { initial[s.id] = s.auto; });
    setEmergencySteps(initial);
    setEmergencyTimer(0);
  };

  const toggleStep = (id) => {
    setEmergencySteps(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(emergencySteps).filter(Boolean).length;
  const totalSteps = activeProtocol?.steps.length || 0;


  const [showReport, setShowReport] = useState(false);

  return (
    <div className="emergency-response animate-fadeIn">
      <div className="er-header">
        <div>
          <p className="section-eyebrow">Autonomous Incident Orchestration</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>Emergency Response System</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
            AI-coordinated response — reduces critical first 10 minutes from chaos to coordinated action
          </p>
        </div>
        {(activeProtocolId || drillActive) && (
          <div className="er-timer">
            <span className="live-dot red" />
            <span className="er-timer-label">INCIDENT ACTIVE</span>
            <span className="er-timer-val font-mono">{formatElapsed(emergencyTimer)}</span>
          </div>
        )}
      </div>

      {/* Active protocol tracker */}
      {activeProtocol && (
        <div className="active-protocol-banner" style={{ borderColor: activeProtocol.color }}>
          <div className="apb-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <AlertTriangle size={20} style={{ color: activeProtocol.color }} />
              <div>
                <p style={{ fontSize: 11, color: activeProtocol.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>ACTIVE PROTOCOL</p>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700 }}>{activeProtocol.title}</h2>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: activeProtocol.color }}>{completedCount}/{totalSteps}</p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>steps complete</p>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => { setActiveProtocolId(null); setEmergencySteps({}); setEmergencyTimer(0); }}>
                End Incident
              </button>
            </div>
          </div>

          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" style={{ width: `${(completedCount / totalSteps) * 100}%`, background: activeProtocol.color }} />
          </div>

          <div className="protocol-steps">
            {activeProtocol.steps.map(step => (
              <div
                key={step.id}
                className={`protocol-step ${emergencySteps[step.id] ? 'done' : ''}`}
                onClick={() => toggleStep(step.id)}
              >
                <div className="step-check">
                  {emergencySteps[step.id] ? <CheckSquare size={18} style={{ color: 'var(--accent-green)' }} /> : <Square size={18} style={{ color: 'var(--text-muted)' }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <p className={`step-action ${emergencySteps[step.id] ? 'done' : ''}`}>{step.action}</p>
                </div>
                {step.auto && (
                  <span className="auto-badge">AUTO</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Printable Report Modal overlay */}
      {showReport && (
        <div className="report-modal-overlay" onClick={() => setShowReport(false)}>
          <div className="report-modal" onClick={e => e.stopPropagation()}>
            <div className="report-modal-header no-print">
              <h3 style={{ fontFamily: 'var(--font-display)' }}>Regulatory Incident Audit Report</h3>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-primary btn-sm" onClick={() => window.print()}>🖨 Print / PDF</button>
                <button className="btn btn-ghost btn-sm" onClick={() => setShowReport(false)}>Close</button>
              </div>
            </div>
            
            {/* OISD Standard Printable Area */}
            <div className="oisd-report-sheet">
              <div className="oisd-header">
                <div className="oisd-logo"><Shield size={24} color="#000" /></div>
                <div className="oisd-title">
                  <h2>FORM OISD-116</h2>
                  <h3>PRELIMINARY ACCIDENT REPORT</h3>
                  <p>In accordance with OISD Standard 116 — Oil & Gas Industry Safety Standards</p>
                </div>
              </div>
              
              <div className="oisd-meta-table">
                <div className="omt-row">
                  <div className="omt-cell header">Organization</div>
                  <div className="omt-cell">Sentinel Steel & Safety Platform, Vizag</div>
                  <div className="omt-cell header">Report Date</div>
                  <div className="omt-cell font-mono">{new Date().toLocaleDateString('en-IN')}</div>
                </div>
                <div className="omt-row">
                  <div className="omt-cell header">Location</div>
                  <div className="omt-cell">Gas Processing Unit, Zone C4</div>
                  <div className="omt-cell header">Incident ID</div>
                  <div className="omt-cell font-mono">INC-DRILL-{new Date().getFullYear()}-01</div>
                </div>
                <div className="omt-row">
                  <div className="omt-cell header">Incident Classification</div>
                  <div className="omt-cell critical-text">Class A Toxic Gas Release (H2S)</div>
                  <div className="omt-cell header">Reporting Rule</div>
                  <div className="omt-cell">OISD-116 Clause 7.4.2</div>
                </div>
              </div>

              <div className="oisd-section-title">1. INCIDENT DESCRIPTION</div>
              <div className="oisd-text-box">
                On {new Date().toLocaleDateString('en-IN')} at {new Date().toLocaleTimeString('en-IN')}, a simulated safety incident drill was triggered. 
                Gas sensor inputs in Zone C4 recorded H2S concentration peaking at <strong className="font-mono">58 ppm</strong> (exceeding the critical safety threshold of 50 ppm).
                Simultaneously, carbon monoxide (CO) levels surged to <strong className="font-mono">44 ppm</strong>. 
                At the time of the release, worker positioning systems tracked 6 workers on-site, and active Hot Work Permit <strong className="font-mono">WP-2341</strong> was active in adjacent boundaries.
              </div>

              <div className="oisd-section-title">2. EMERGENCY MITIGATION ACTION TAKEN</div>
              <div className="oisd-actions-list">
                <div className="oisd-act-item">
                  <div className="oisd-act-check">✓</div>
                  <div><strong>PA Safety Announcement:</strong> Activated plant-wide toxic gas warning sirens within 1.2 seconds of detection.</div>
                </div>
                <div className="oisd-act-item">
                  <div className="oisd-act-check">✓</div>
                  <div><strong>SCADA Automatic Isolation:</strong> Triggered automatic shutoff valves, isolating the gas feed to the processing block.</div>
                </div>
                <div className="oisd-act-item">
                  <div className="oisd-act-check">✓</div>
                  <div><strong>Permit Suspend / Lockout:</strong> Permit Intelligence Agent automatically revoked Hot Work Permit WP-2341, halting ignition hazard work.</div>
                </div>
                <div className="oisd-act-item">
                  <div className="oisd-act-check">✓</div>
                  <div><strong>Personnel Evacuation:</strong> CCTV Vision system confirmed muster headcount evacuation. Incident response time: <strong>{formatElapsed(emergencyTimer)}</strong>.</div>
                </div>
              </div>

              <div className="oisd-section-title">3. REGULATORY COMPLIANCE REFERENCES</div>
              <table className="oisd-compliance-table">
                <thead>
                  <tr>
                    <th>Act / Standard</th>
                    <th>Section Reference</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>OISD-116</strong></td>
                    <td>Clause 7.4.2 - Action log preservation and sensor records audit</td>
                    <td className="status-ok">Compliant</td>
                  </tr>
                  <tr>
                    <td><strong>Factory Act 1948</strong></td>
                    <td>Section 7A - Employer duty of information and safety layout check</td>
                    <td className="status-ok">Compliant</td>
                  </tr>
                  <tr>
                    <td><strong>DGFASLI Guidelines</strong></td>
                    <td>Clause 4.3 - Emergency response times & drill registers</td>
                    <td className="status-ok">Compliant</td>
                  </tr>
                </tbody>
              </table>

              <div className="oisd-footer">
                <div className="oisd-sign-box">
                  <div className="sign-line"></div>
                  <span>Plant Safety Controller</span>
                </div>
                <div className="oisd-sign-box">
                  <div className="sign-line"></div>
                  <span>AI Safety Engine Auditor (SentinelX)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="er-main">
        {/* Protocol Cards */}
        <div className="er-left">
          <p className="section-eyebrow" style={{ marginBottom: 14 }}>Emergency Protocols</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {PROTOCOLS.map(protocol => (
              <div
                key={protocol.id}
                className={`protocol-card ${activeProtocol?.id === protocol.id ? 'active' : ''}`}
                style={{ borderLeftColor: protocol.color }}
              >
                <div className="protocol-card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="protocol-icon" style={{ background: `${protocol.color}20`, color: protocol.color }}>
                      <AlertTriangle size={16} />
                    </div>
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700 }}>{protocol.title}</h3>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Trigger: {protocol.trigger}</p>
                    </div>
                  </div>
                  <button
                    className="btn btn-sm"
                    style={{
                      background: activeProtocol?.id === protocol.id ? 'rgba(16,185,129,0.12)' : `${protocol.color}18`,
                      color: activeProtocol?.id === protocol.id ? 'var(--accent-green)' : protocol.color,
                      border: `1px solid ${activeProtocol?.id === protocol.id ? 'rgba(16,185,129,0.3)' : protocol.color + '40'}`,
                    }}
                    onClick={() => activateProtocol(protocol)}
                  >
                    {activeProtocol?.id === protocol.id ? '● Active' : 'Activate'}
                  </button>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{protocol.steps.length} response steps</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>·</span>
                  <span style={{ fontSize: 11, color: protocol.color }}>{protocol.steps.filter(s => s.auto).length} automated</span>
                </div>
              </div>
            ))}
          </div>

          {/* Report Generator */}
          <div className="card" style={{ marginTop: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <FileText size={16} color="var(--accent-amber)" />
              <div>
                <p className="section-eyebrow" style={{ marginBottom: 0 }}>Incident Report Generator</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Auto-generate OISD/DGFASLI compliant reports</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowReport(true)}>OISD-116 Report</button>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowReport(true)}>DGFASLI Form 16</button>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowReport(true)}>Factory Act Notice</button>
            </div>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="er-right">
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <Phone size={16} color="var(--accent-amber)" />
              <p className="section-title">Emergency Contacts</p>
            </div>
            {CONTACTS.map((c, i) => (
              <div key={i} className="contact-row">
                <div className={`contact-status ${c.status}`} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{c.name}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.role}</p>
                </div>
                <a href={`tel:${c.phone}`} className="call-btn">
                  <Phone size={13} />
                  <span>Call</span>
                </a>
              </div>
            ))}
          </div>

          {/* Muster Point Status */}
          <div className="card" style={{ marginTop: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <MapPin size={16} color="var(--accent-cyan)" />
              <p className="section-title">Muster Point Status</p>
            </div>
            {[
              { point: 'MP-A', location: 'Main Gate Area', capacity: 80, present: 0 },
              { point: 'MP-B', location: 'Admin Block West', capacity: 60, present: 0 },
              { point: 'MP-C', location: 'Gate 3 Open Ground', capacity: 100, present: 0 },
            ].map((mp, i) => (
              <div key={i} className="muster-row">
                <div className="muster-id font-mono">{mp.point}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, color: 'var(--text-primary)' }}>{mp.location}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Capacity: {mp.capacity}</p>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: activeProtocolId ? 'var(--accent-amber)' : 'var(--text-muted)' }}>
                  {activeProtocolId ? '...' : '—'}
                </span>
              </div>
            ))}
            {activeProtocolId && (
              <p style={{ fontSize: 12, color: 'var(--accent-amber)', marginTop: 10 }}>
                ⚠ Evacuation in progress — headcount pending confirmation
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
