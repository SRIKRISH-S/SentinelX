import React, { useState, useEffect } from 'react';
import { Camera, Eye, AlertTriangle, HardHat, Shield, Activity, ZoomIn } from 'lucide-react';
import './CCTVMonitor.css';

const CAMERAS = [
  { id: 'CAM-C4-01', name: 'Gas Unit C4 — Entry', zone: 'C4', status: 'alert', detections: ['Worker without BA set detected', 'Unauthorized entry — no permit badge'], workers: 2, ppeCompliance: 60 },
  { id: 'CAM-A1-01', name: 'Coke Battery A — North', zone: 'A1', status: 'warning', detections: ['Safety helmet removed — Worker 3'], workers: 5, ppeCompliance: 80 },
  { id: 'CAM-A1-02', name: 'Coke Battery A — South', zone: 'A1', status: 'normal', detections: [], workers: 7, ppeCompliance: 100 },
  { id: 'CAM-B3-01', name: 'Blast Furnace — Platform', zone: 'B3', status: 'normal', detections: [], workers: 4, ppeCompliance: 100 },
  { id: 'CAM-B3-02', name: 'Blast Furnace — Taphole', zone: 'B3', status: 'normal', detections: [], workers: 4, ppeCompliance: 95 },
  { id: 'CAM-D2-01', name: 'Cooling Tower — Base', zone: 'D2', status: 'normal', detections: [], workers: 4, ppeCompliance: 100 },
  { id: 'CAM-E5-01', name: 'Yard Entry Gate', zone: 'E5', status: 'normal', detections: [], workers: 8, ppeCompliance: 88 },
  { id: 'CAM-CTL-01', name: 'Control Room — Main', zone: 'CTL', status: 'normal', detections: [], workers: 3, ppeCompliance: 100 },
];

const AI_EVENTS = [
  { time: '07:43', cam: 'CAM-C4-01', type: 'critical', event: 'Worker W07 detected without respiratory BA set in H2S-risk zone', confidence: 97 },
  { time: '07:39', cam: 'CAM-C4-01', type: 'critical', event: 'Unauthorized zone entry detected — no permit badge visible', confidence: 94 },
  { time: '07:31', cam: 'CAM-A1-01', type: 'warning', event: 'PPE non-compliance: safety helmet removed by worker on platform', confidence: 91 },
  { time: '07:18', cam: 'CAM-E5-01', type: 'info', event: 'Vehicle speed violation — forklift exceeding 10 km/h limit in pedestrian zone', confidence: 88 },
  { time: '07:05', cam: 'CAM-B3-01', type: 'info', event: 'Slip/trip hazard detected — oil spill at platform access point', confidence: 83 },
];

const PPE_ITEMS = [
  { name: 'Safety Helmet', compliant: 42, total: 45 },
  { name: 'High-Vis Vest', compliant: 44, total: 45 },
  { name: 'Safety Boots', compliant: 45, total: 45 },
  { name: 'Respiratory PPE', compliant: 38, total: 45 },
  { name: 'Safety Gloves', compliant: 41, total: 45 },
];

// Simulated camera feed using SVG canvas
function CameraFeed({ camera, selected, onClick }) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick(x => x + 1), 1500);
    return () => clearInterval(t);
  }, []);

  const statusColor = camera.status === 'alert' ? '#ef4444' : camera.status === 'warning' ? '#f59e0b' : '#10b981';

  return (
    <div className={`camera-feed ${camera.status} ${selected ? 'selected' : ''}`} onClick={onClick}>
      {/* SVG simulated feed */}
      <div className="camera-canvas">
        <svg viewBox="0 0 240 135" style={{ width: '100%', height: '100%' }}>
          {/* Simulated scene background */}
          <rect width="240" height="135" fill="#0a1020" />
          {/* Floor */}
          <rect x="0" y="90" width="240" height="45" fill="#111830" />
          {/* Equipment silhouettes */}
          <rect x="20" y="40" width="60" height="60" rx="4" fill="#1a2840" stroke="#1e3a5a" strokeWidth="1" />
          <rect x="100" y="55" width="40" height="45" rx="2" fill="#152035" stroke="#1e3050" strokeWidth="1" />
          <rect x="170" y="30" width="50" height="70" rx="4" fill="#1a2840" stroke="#1e3a5a" strokeWidth="1" />
          {/* Pipes */}
          <line x1="80" y1="60" x2="100" y2="60" stroke="#0d2035" strokeWidth="8" />
          <line x1="140" y1="60" x2="170" y2="60" stroke="#0d2035" strokeWidth="8" />

          {/* Workers */}
          {Array.from({ length: Math.min(camera.workers, 4) }).map((_, i) => (
            <g key={i} transform={`translate(${40 + i * 50}, ${camera.status === 'alert' && i === 0 ? 85 : 88})`}>
              {/* Body */}
              <rect x="-6" y="0" width="12" height="16" rx="2" fill={camera.status === 'alert' && i === 0 ? '#ef4444' : '#f59e0b'} fillOpacity="0.7" />
              {/* Head */}
              {(camera.ppeCompliance === 100 || i > 0) && (
                <rect x="-5" y="-10" width="10" height="8" rx="3" fill="#f59e0b" fillOpacity="0.8" />
              )}
              {camera.status === 'alert' && i === 0 && (
                <circle cx="0" cy="-15" r="5" fill="none" stroke="#ef4444" strokeWidth="1.5"
                  strokeDasharray="2,1" opacity={0.5 + Math.sin(tick) * 0.5} />
              )}
            </g>
          ))}

          {/* Alert overlay */}
          {camera.status === 'alert' && (
            <rect width="240" height="135" fill="rgba(239,68,68,0.07)"
              stroke="#ef4444" strokeWidth="2"
              opacity={0.4 + Math.sin(tick * 0.8) * 0.3} />
          )}

          {/* Gas cloud visualization for C4 */}
          {camera.zone === 'C4' && (
            <ellipse cx={120 + Math.sin(tick * 0.3) * 5} cy={70 + Math.cos(tick * 0.2) * 3}
              rx={50 + Math.sin(tick * 0.4) * 5} ry={30 + Math.cos(tick * 0.3) * 3}
              fill="rgba(239,68,68,0.08)" stroke="rgba(239,68,68,0.15)" strokeWidth="0.5" />
          )}

          {/* Camera HUD */}
          <text x="6" y="12" fill="rgba(255,255,255,0.5)" fontSize="7" fontFamily="monospace">{camera.id}</text>
          <text x="6" y="21" fill="rgba(255,255,255,0.35)" fontSize="6" fontFamily="monospace">
            {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
          </text>
          {/* REC indicator */}
          <circle cx="228" cy="10" r="4" fill={statusColor} opacity={0.6 + Math.sin(tick) * 0.4} />
          <text x="220" y="12" fill={statusColor} fontSize="6" fontFamily="monospace" textAnchor="end">REC</text>

          {/* Detection box on alert */}
          {camera.status === 'alert' && (
            <rect x="15" y="73" width="56" height="34"
              fill="none" stroke="#ef4444" strokeWidth="1.5"
              strokeDasharray="3,2"
              opacity={0.6 + Math.sin(tick * 1.2) * 0.4} />
          )}
        </svg>
      </div>

      <div className="camera-info">
        <div className="camera-name-row">
          <span className="camera-name">{camera.name}</span>
          <div className={`cam-status-dot ${camera.status}`} />
        </div>
        <div className="camera-meta">
          <span>{camera.workers} workers</span>
          <span style={{ color: camera.ppeCompliance < 85 ? 'var(--accent-amber)' : 'var(--accent-green)' }}>
            PPE {camera.ppeCompliance}%
          </span>
        </div>
        {camera.detections.length > 0 && (
          <p className="camera-alert-text">{camera.detections[0]}</p>
        )}
      </div>
    </div>
  );
}

export default function CCTVMonitor({ drillActive }) {
  const dynamicCameras = CAMERAS.map(cam => {
    if (cam.id === 'CAM-C4-01') {
      return {
        ...cam,
        status: drillActive ? 'alert' : 'alert',
        detections: drillActive 
          ? ['🚨 DRILL ALERT: Worker W07 detected without respiratory BA set in H2S hazard area', 'Evacuation order: Zone gas accumulation active']
          : ['Worker without BA set detected', 'Unauthorized entry — no permit badge'],
        workers: drillActive ? 1 : 2,
        ppeCompliance: drillActive ? 40 : 60
      };
    }
    return cam;
  });

  const [selectedCamId, setSelectedCamId] = useState(dynamicCameras[0].id);
  const selectedCam = dynamicCameras.find(c => c.id === selectedCamId) || dynamicCameras[0];

  const dynamicEvents = drillActive ? [
    { time: 'Just now', cam: 'CAM-C4-01', type: 'critical', event: 'DRILL MODE: Gas sensor alert triggers emergency PA announcement', confidence: 99 },
    { time: '1m ago', cam: 'CAM-C4-01', type: 'critical', event: 'PPE ALARM: Worker W07 detected in Zone C4 without breathing apparatus mask', confidence: 97 },
    ...AI_EVENTS
  ] : AI_EVENTS;

  return (
    <div className="cctv-monitor animate-fadeIn">
      <div className="cctv-header">
        <div>
          <p className="section-eyebrow">AI Computer Vision Safety Monitoring</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>CCTV Vision Monitor</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
            Real-time PPE detection · Unauthorized entry · Behavioral safety analytics
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span className="badge critical">
            <span className="live-dot red" />
            {drillActive ? '3 Alerts' : '2 Alerts'}
          </span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{dynamicCameras.length} cameras online</span>
        </div>
      </div>

      <div className="cctv-main">
        {/* Camera grid */}
        <div className="camera-grid">
          {dynamicCameras.map(cam => (
            <CameraFeed
              key={cam.id}
              camera={cam}
              selected={selectedCam?.id === cam.id}
              onClick={() => setSelectedCamId(cam.id)}
            />
          ))}
        </div>

        {/* Side panel */}
        <div className="cctv-side">
          {/* AI Events */}
          <div className="card mb-16">
            <div className="section-header">
              <div>
                <p className="section-eyebrow">Vision AI Events</p>
                <h3 className="section-title">Recent Detections</h3>
              </div>
              <span className="live-dot" />
            </div>
            {dynamicEvents.map((ev, i) => (
              <div key={i} className="ai-event">
                <div className={`ai-event-dot ${ev.type}`} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>{ev.time}</span>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{ev.cam}</span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{ev.event}</p>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Confidence: {ev.confidence}%</span>
                </div>
              </div>
            ))}
          </div>

          {/* PPE compliance */}
          <div className="card">
            <p className="section-eyebrow" style={{ marginBottom: 12 }}>PPE Compliance Overview</p>
            {PPE_ITEMS.map((item, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{item.name}</span>
                  <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: (item.compliant / item.total) < 0.9 ? 'var(--accent-amber)' : 'var(--accent-green)' }}>
                    {item.compliant}/{item.total}
                  </span>
                </div>
                <div className="risk-bar">
                  <div className="risk-bar-fill" style={{
                    width: `${(item.compliant / item.total) * 100}%`,
                    background: (item.compliant / item.total) < 0.9 ? 'var(--accent-amber)' : 'var(--accent-green)'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
