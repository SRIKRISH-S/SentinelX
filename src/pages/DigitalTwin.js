import React, { useState, useEffect } from 'react';
import { Box, ZoomIn, ZoomOut, Layers, Wind, Thermometer, Activity, Users, AlertTriangle } from 'lucide-react';
import './DigitalTwin.css';

const PLANT_ZONES = [
  { id: 'A1', x: 60, y: 60, w: 160, h: 100, name: 'Coke Oven Battery A', risk: 78, workers: 12, temp: 680, status: 'warning' },
  { id: 'B3', x: 250, y: 60, w: 140, h: 100, name: 'Blast Furnace B', risk: 45, workers: 8, temp: 1200, status: 'normal' },
  { id: 'C4', x: 60, y: 200, w: 120, h: 120, name: 'Gas Processing C', risk: 91, workers: 6, temp: 45, status: 'critical' },
  { id: 'D2', x: 220, y: 200, w: 100, h: 80, name: 'Cooling Tower D', risk: 22, workers: 4, temp: 32, status: 'safe' },
  { id: 'E5', x: 355, y: 200, w: 130, h: 80, name: 'Raw Material Yard E', risk: 33, workers: 15, temp: 28, status: 'normal' },
  { id: 'CTL', x: 250, y: 310, w: 80, h: 60, name: 'Control Room', risk: 5, workers: 3, temp: 22, status: 'safe' },
  { id: 'MNT', x: 355, y: 310, w: 80, h: 60, name: 'Maintenance Bay', risk: 30, workers: 5, temp: 35, status: 'normal' },
];

const WORKERS = [
  { id: 'W01', x: 110, y: 100, zone: 'A1' },
  { id: 'W02', x: 140, y: 120, zone: 'A1' },
  { id: 'W03', x: 170, y: 90, zone: 'A1' },
  { id: 'W04', x: 290, y: 100, zone: 'B3' },
  { id: 'W05', x: 320, y: 120, zone: 'B3' },
  { id: 'W06', x: 95, y: 240, zone: 'C4' },
  { id: 'W07', x: 130, y: 260, zone: 'C4', alert: true },
  { id: 'W08', x: 260, y: 230, zone: 'D2' },
  { id: 'W09', x: 400, y: 230, zone: 'E5' },
  { id: 'W10', x: 430, y: 250, zone: 'E5' },
];

const GAS_CLOUDS = [
  { cx: 95, cy: 230, rx: 55, ry: 40, opacity: 0.18 },
  { cx: 140, cy: 270, rx: 40, ry: 30, opacity: 0.12 },
];

const STATUS_COLOR = {
  critical: '#ef4444',
  warning: '#f59e0b',
  normal: '#334155',
  safe: '#10b981',
};

export default function DigitalTwin({ drillActive, sensorData, handleToggleDrill }) {
  const [selected, setSelected] = useState(null);
  const [layer, setLayer] = useState('risk');
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick(x => x + 1), 2000);
    return () => clearInterval(t);
  }, []);

  const currentSensor = sensorData[sensorData.length - 1] || { h2s: 24, co: 18, temp: 62, risk: 35 };

  // Calculate dynamic plant zone states based on drill active
  const dynamicZones = PLANT_ZONES.map(z => {
    if (z.id === 'C4') {
      return {
        ...z,
        risk: drillActive ? currentSensor.risk : 91,
        temp: drillActive ? currentSensor.temp : 45,
        workers: drillActive ? 0 : 6, // workers evacuated during drill
        status: 'critical'
      };
    }
    if (z.id === 'A1' && drillActive) {
      return {
        ...z,
        risk: 84,
        status: 'warning'
      };
    }
    return z;
  });

  const selectedZone = dynamicZones.find(z => z.id === selected);

  const getRiskFill = (zone) => {
    if (layer === 'risk') {
      if (zone.risk > 80) return 'rgba(239,68,68,0.25)';
      if (zone.risk > 50) return 'rgba(245,158,11,0.18)';
      return 'rgba(16,185,129,0.1)';
    }
    if (layer === 'temp') {
      const t = Math.min(zone.temp / 1500, 1);
      return `rgba(245,${Math.floor(158 * (1 - t))},${Math.floor(11 * (1 - t))},${0.15 + t * 0.25})`;
    }
    return 'rgba(6,182,212,0.1)';
  };


  return (
    <div className="digital-twin animate-fadeIn">
      <div className="dt-header">
        <div>
          <p className="section-eyebrow">Live Plant Model</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>Plant Digital Twin</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>Real-time geospatial intelligence overlay — Vizag Steel Plant Layout</p>
        </div>
        <div className="layer-tabs">
          <button className={`layer-tab ${layer === 'risk' ? 'active' : ''}`} onClick={() => setLayer('risk')}>
            <AlertTriangle size={13} /> Risk Heat
          </button>
          <button className={`layer-tab ${layer === 'temp' ? 'active' : ''}`} onClick={() => setLayer('temp')}>
            <Thermometer size={13} /> Thermal
          </button>
          <button className={`layer-tab ${layer === 'workers' ? 'active' : ''}`} onClick={() => setLayer('workers')}>
            <Users size={13} /> Workers
          </button>
        </div>
      </div>

      <div className="dt-main">
        {/* SVG Plant Map */}
        <div className="plant-map-wrap">
          <div className="plant-map-toolbar">
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              PLANT-VIZAG-01 · {WORKERS.length} workers tracked · Live
            </span>
            <span className="live-dot" />
          </div>

          <svg viewBox="0 0 520 420" className="plant-svg">
            {/* Background grid */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
              </pattern>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <rect width="520" height="420" fill="url(#grid)" />

            {/* Connector lines (pipes/roads) */}
            <line x1="215" y1="110" x2="250" y2="110" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
            <line x1="180" y1="160" x2="180" y2="200" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
            <line x1="325" y1="200" x2="355" y2="200" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
            <line x1="290" y1="280" x2="290" y2="310" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />

            {/* Gas clouds — animated */}
            {(layer === 'risk') && GAS_CLOUDS.map((g, i) => (
              <ellipse
                key={i}
                cx={g.cx + Math.sin(tick * 0.3 + i) * 3}
                cy={g.cy + Math.cos(tick * 0.2 + i) * 2}
                rx={(g.rx + Math.sin(tick * 0.4) * 4) * (drillActive ? 1.45 : 1)}
                ry={(g.ry + Math.cos(tick * 0.3) * 3) * (drillActive ? 1.45 : 1)}
                fill={drillActive ? "rgba(239,68,68,0.22)" : "rgba(239,68,68,0.15)"}
                stroke={drillActive ? "rgba(239,68,68,0.4)" : "rgba(239,68,68,0.25)"}
                strokeWidth="1"
              />
            ))}

            {/* Zones */}
            {dynamicZones.map(zone => (
              <g key={zone.id} onClick={() => setSelected(zone.id === selected ? null : zone.id)} style={{ cursor: 'pointer' }}>
                <rect
                  x={zone.x} y={zone.y} width={zone.w} height={zone.h}
                  rx="6"
                  fill={getRiskFill(zone)}
                  stroke={selected === zone.id ? 'var(--accent-amber)' : STATUS_COLOR[zone.status]}
                  strokeWidth={selected === zone.id ? 2 : 1}
                  strokeDasharray={zone.status === 'critical' ? '4,3' : 'none'}
                />

                {/* Zone label */}
                <text x={zone.x + zone.w / 2} y={zone.y + 18} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="10" fontFamily="var(--font-mono)" fontWeight="600">
                  {zone.id}
                </text>

                {/* Risk score */}
                {layer === 'risk' && (
                  <text
                    x={zone.x + zone.w / 2}
                    y={zone.y + zone.h / 2 + 5}
                    textAnchor="middle"
                    fill={STATUS_COLOR[zone.status]}
                    fontSize="22"
                    fontFamily="var(--font-display)"
                    fontWeight="700"
                    opacity="0.6"
                  >
                    {zone.risk}
                  </text>
                )}

                {/* Alert indicator */}
                {zone.status === 'critical' && (
                  <circle
                    cx={zone.x + zone.w - 12}
                    cy={zone.y + 12}
                    r="6"
                    fill="var(--accent-red)"
                    opacity={0.5 + Math.sin(tick * 0.8) * 0.5}
                    filter="url(#glow)"
                  />
                )}
              </g>
            ))}

            {/* Workers */}
            {(layer !== 'temp') && WORKERS.map(w => (
              <g key={w.id}>
                <circle
                  cx={w.x}
                  cy={w.y}
                  r={w.alert ? 7 : 5}
                  fill={w.alert ? 'var(--accent-red)' : 'var(--accent-cyan)'}
                  opacity={w.alert ? 0.6 + Math.sin(tick * 1.5) * 0.4 : 0.8}
                  filter={w.alert ? 'url(#glow)' : 'none'}
                />
              </g>
            ))}

            {/* Compass */}
            <text x="490" y="30" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="12">N↑</text>

            {/* Scale bar */}
            <line x1="30" y1="400" x2="110" y2="400" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <text x="70" y="415" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="var(--font-mono)">100m</text>
          </svg>

          {/* Legend */}
          <div className="map-legend">
            <div className="legend-item"><span style={{ background: 'var(--accent-red)', opacity: 0.7 }} className="legend-dot" />Critical Risk</div>
            <div className="legend-item"><span style={{ background: 'var(--accent-amber)', opacity: 0.7 }} className="legend-dot" />Warning</div>
            <div className="legend-item"><span style={{ background: 'var(--accent-green)', opacity: 0.7 }} className="legend-dot" />Safe</div>
            <div className="legend-item"><span style={{ background: 'var(--accent-cyan)' }} className="legend-dot" />Worker</div>
            <div className="legend-item"><span style={{ background: 'var(--accent-red)' }} className="legend-dot" />Alert Worker</div>
          </div>
        </div>

        {/* Side panel */}
        <div className="dt-side">
          {selectedZone ? (
            <div className={`card zone-detail-card ${selectedZone.status}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <span className={`badge ${selectedZone.status === 'critical' ? 'critical' : selectedZone.status === 'warning' ? 'high' : selectedZone.status === 'safe' ? 'low' : 'medium'}`}>{selectedZone.status.toUpperCase()}</span>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, marginTop: 8 }}>{selectedZone.name}</h2>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>Zone {selectedZone.id}</p>
                </div>
                <div className="risk-score-ring" style={{ '--score-color': STATUS_COLOR[selectedZone.status] }}>
                  <span className="risk-score-val">{selectedZone.risk}</span>
                </div>
              </div>

              <div className="zone-metrics">
                <div className="zone-metric">
                  <Users size={14} />
                  <span>{selectedZone.workers} Workers</span>
                </div>
                <div className="zone-metric">
                  <Thermometer size={14} />
                  <span>{selectedZone.temp}°C</span>
                </div>
                <div className="zone-metric">
                  <Activity size={14} />
                  <span>Risk: {selectedZone.risk}/100</span>
                </div>
              </div>

              <div className="divider" />

              <p className="section-eyebrow" style={{ marginBottom: 10 }}>Active Alerts in Zone</p>
              {selectedZone.id === 'C4' ? (
                <>
                  <div className={`zone-alert ${drillActive ? 'critical' : 'warning'}`}>
                    H2S Level: {drillActive ? currentSensor.h2s : 43} ppm {drillActive ? '(EXCEEDS 50ppm safe limit)' : '(87% of alarm threshold)'}
                  </div>
                  <div className={`zone-alert ${drillActive ? 'critical' : 'warning'}`}>
                    CO Level: {drillActive ? currentSensor.co : 27} ppm
                  </div>
                  <div className="zone-alert">
                    {drillActive ? 'Permit WP-2341 (Hot Work) Suspended' : 'Permit WP-2341 flagged for adjacency review'}
                  </div>
                  {drillActive && <div className="zone-alert critical animate-pulse">Worker W07 alarm: Respiratory PPE required</div>}
                </>
              ) : selectedZone.status === 'critical' ? (
                <>
                  <div className="zone-alert">H2S concentration at 87% alarm threshold</div>
                  <div className="zone-alert">Active maintenance permit in zone</div>
                  <div className="zone-alert">Worker W07 proximity alert</div>
                </>
              ) : selectedZone.status === 'warning' ? (
                <>
                  <div className="zone-alert" style={{ borderColor: 'var(--border-amber)' }}>Pressure deviation +12% on battery 3</div>
                </>
              ) : (
                <p style={{ fontSize: 13, color: 'var(--accent-green)' }}>No active alerts in this zone</p>
              )}

              <div className="divider" />
              <button 
                className={`btn ${drillActive ? 'btn-danger animate-pulse' : 'btn-primary'}`} 
                style={{ width: '100%', fontWeight: 700 }}
                onClick={handleToggleDrill}
              >
                {drillActive ? '🛑 Stop Emergency Drill' : '🚨 Trigger Gas Leak Drill'}
              </button>
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: 36 }}>
              <Box size={32} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Click a zone on the plant map to view live data and alerts</p>
            </div>
          )}

          {/* Plant Stats */}
          <div className="card" style={{ marginTop: 14 }}>
            <p className="section-eyebrow" style={{ marginBottom: 12 }}>Plant Overview</p>
            {[
              { label: 'Total Workers Tracked', value: WORKERS.length, icon: Users },
              { label: 'Zones Under Watch', value: PLANT_ZONES.length, icon: Layers },
              { label: 'Active Gas Sensors', value: 12, icon: Wind },
              { label: 'Critical Alerts', value: 3, icon: AlertTriangle },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <s.icon size={16} color="var(--text-muted)" />
                <span style={{ fontSize: 13, color: 'var(--text-secondary)', flex: 1 }}>{s.label}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)' }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
