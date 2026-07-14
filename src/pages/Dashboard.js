import React, { useState, useEffect } from 'react';
import {
  AlertTriangle, Users, Activity, TrendingDown, Zap,
  Wind, Thermometer, Shield, Clock, CheckCircle, XCircle, Eye
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from 'recharts';
import './Dashboard.css';

const generateSensorData = () =>
  Array.from({ length: 20 }, (_, i) => ({
    t: `${String(i).padStart(2, '0')}:00`,
    h2s: Math.floor(Math.random() * 40 + 20),
    co: Math.floor(Math.random() * 30 + 15),
    temp: Math.floor(Math.random() * 20 + 60),
    risk: Math.floor(Math.random() * 50 + 30),
  }));

const ZONES = [
  { id: 'A1', name: 'Coke Oven Battery A', risk: 78, workers: 12, alerts: 2, status: 'warning' },
  { id: 'B3', name: 'Blast Furnace Zone B', risk: 45, workers: 8, alerts: 0, status: 'normal' },
  { id: 'C4', name: 'Gas Processing Unit C', risk: 91, workers: 6, alerts: 3, status: 'critical' },
  { id: 'D2', name: 'Cooling Tower D', risk: 22, workers: 4, alerts: 0, status: 'safe' },
  { id: 'E5', name: 'Raw Material Yard E', risk: 33, workers: 15, alerts: 1, status: 'normal' },
];

const RECENT_EVENTS = [
  { time: '07:41', type: 'critical', event: 'H2S concentration reached 87% of alarm threshold in Zone C4 during maintenance window', agent: 'Risk Engine' },
  { time: '07:38', type: 'warning', event: 'Hot work permit WP-2341 active within 50m of elevated gas zone — flagged for review', agent: 'Permit Agent' },
  { time: '07:29', type: 'info', event: 'Shift B handover completed — 47 workers checked in, safety brief acknowledged', agent: 'Shift Monitor' },
  { time: '07:15', type: 'success', event: 'Confined space entry cleared — atmospheric checks passed for Zone B3 Tank 7', agent: 'Permit Agent' },
  { time: '06:55', type: 'warning', event: 'SCADA anomaly: pressure deviation +12% on Coke Oven Battery 3 — maintenance notified', agent: 'SCADA AI' },
];

const RADAR_DATA = [
  { subject: 'Gas Safety', value: 72 },
  { subject: 'Fire Risk', value: 45 },
  { subject: 'Permit Compliance', value: 88 },
  { subject: 'Worker PPE', value: 91 },
  { subject: 'Equipment', value: 63 },
  { subject: 'Procedure', value: 79 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-mid)', borderRadius: 8, padding: '10px 14px' }}>
      <p style={{ color: 'var(--text-muted)', fontSize: 11, marginBottom: 6 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color, fontSize: 12, fontFamily: 'var(--font-mono)' }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

export default function Dashboard({ drillActive, sensorData, alerts, onNavigate }) {
  const currentSensor = sensorData[sensorData.length - 1] || { h2s: 24, co: 18, temp: 62, risk: 35 };
  const criticalCount = alerts.filter(a => a.type === 'critical').length;
  const warningCount = alerts.filter(a => a.type === 'warning').length;

  return (
    <div className="dashboard animate-fadeIn">
      {/* Critical Alert Banner */}
      {drillActive ? (
        <div className="critical-banner drill-active animate-pulse" style={{ borderColor: 'var(--accent-red)', background: 'rgba(239, 68, 68, 0.1)' }}>
          <div className="banner-left">
            <AlertTriangle size={18} style={{ color: 'var(--accent-red)' }} />
            <span className="banner-label" style={{ color: 'var(--accent-red)', fontWeight: 700 }}>CRITICAL EMERGENCY DRILL</span>
            <span className="banner-msg">Zone C4 H2S levels spiked to {currentSensor.h2s} ppm (Exceeds 50ppm safe limit). PA alarm active. Permit WP-2341 suspended.</span>
          </div>
          <div className="banner-actions">
            <button className="btn btn-danger btn-sm" onClick={() => onNavigate('emergency')}>View Action Checklist</button>
          </div>
        </div>
      ) : (
        <div className="critical-banner">
          <div className="banner-left">
            <AlertTriangle size={18} />
            <span className="banner-label">CRITICAL COMPOUND RISK DETECTED</span>
            <span className="banner-msg">Zone C4: H2S at 87% threshold + Active maintenance permit + 6 workers present — Intervention required</span>
          </div>
          <div className="banner-actions">
            <button className="btn btn-danger btn-sm" onClick={() => onNavigate('risk')}>Inspect Risk Engine</button>
          </div>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid-4 mb-20">
        <div className="stat-card" style={{ borderColor: drillActive ? 'var(--accent-red)' : 'var(--border-subtle)', borderWidth: 1 }}>
          <div className="stat-eyebrow">Active Alerts</div>
          <div className="stat-value" style={{ color: drillActive ? 'var(--accent-red)' : 'var(--accent-amber)' }}>
            {alerts.length}
          </div>
          <div className="stat-label">
            {criticalCount} Critical · {warningCount} Warning
          </div>
          <div className="stat-delta" style={{ color: drillActive ? 'var(--accent-red)' : 'var(--text-muted)' }}>
            {drillActive ? '↑ Spiked by emergency' : 'Normal level'}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-eyebrow">Workers On-Site</div>
          <div className="stat-value" style={{ color: 'var(--accent-cyan)' }}>
            {drillActive ? 39 : 45}
          </div>
          <div className="stat-label">Across 5 active zones</div>
          <div className="stat-delta">
            {drillActive ? '6 evacuated from Zone C4' : '12 in high-risk areas'}
          </div>
        </div>
        <div className="stat-card" style={{ borderColor: drillActive ? 'var(--accent-red)' : 'var(--border-subtle)', borderWidth: 1 }}>
          <div className="stat-eyebrow">Overall Risk Score</div>
          <div className="stat-value" style={{ color: currentSensor.risk > 80 ? 'var(--accent-red)' : 'var(--accent-amber)' }}>
            {currentSensor.risk}
          </div>
          <div className="stat-label">
            {currentSensor.risk > 80 ? 'CRITICAL - Hazard active' : 'Elevated — review permits'}
          </div>
          <div className="stat-delta">
            {drillActive ? '↑ Spiked in Zone C4' : 'Stable'}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-eyebrow">Days Without Incident</div>
          <div className="stat-value" style={{ color: 'var(--accent-green)' }}>127</div>
          <div className="stat-label">Personal best: 203 days</div>
          <div className="stat-delta">On track</div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="dashboard-main">
        {/* Left: Charts */}
        <div className="dashboard-left">
          {/* Gas Sensor Timeline */}
          <div className="card mb-16">
            <div className="section-header">
              <div>
                <p className="section-eyebrow">Live Sensor Feed</p>
                <h2 className="section-title">Gas Concentration Monitoring — Zone C4</h2>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span className="live-dot" />
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Updates every 3s</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={sensorData}>
                <defs>
                  <linearGradient id="h2sGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="coGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 4" stroke="var(--border-subtle)" />
                <XAxis dataKey="t" tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }} interval={4} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="h2s" name="H2S (ppm)" stroke="#ef4444" fill="url(#h2sGrad)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="co" name="CO (ppm)" stroke="#f59e0b" fill="url(#coGrad)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="sensor-legend">
              <span style={{ color: '#ef4444' }}>● H2S (ppm) — Threshold: 50ppm</span>
              <span style={{ color: '#f59e0b' }}>● CO (ppm) — Threshold: 35ppm</span>
              <span style={{ color: 'var(--accent-cyan)' }}>● Current: 43 ppm / 27 ppm</span>
            </div>
          </div>

          {/* Risk Trend */}
          <div className="card mb-16">
            <div className="section-header">
              <div>
                <p className="section-eyebrow">Compound Risk Score</p>
                <h2 className="section-title">Plant-wide Risk Trajectory</h2>
              </div>
              <span className="badge high">Elevated</span>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={sensorData}>
                <CartesianGrid strokeDasharray="2 4" stroke="var(--border-subtle)" />
                <XAxis dataKey="t" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} interval={4} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="risk" name="Risk Score" stroke="#f59e0b" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Events feed */}
          <div className="card">
            <div className="section-header">
              <div>
                <p className="section-eyebrow">Intelligence Feed</p>
                <h2 className="section-title">Recent AI Agent Actions</h2>
              </div>
              <button className="btn btn-ghost btn-sm">View All</button>
            </div>
            {RECENT_EVENTS.map((ev, i) => (
              <div key={i} className="timeline-item">
                <div className={`timeline-dot`} style={{
                  background: ev.type === 'critical' ? 'var(--accent-red)' :
                    ev.type === 'warning' ? 'var(--accent-amber)' :
                      ev.type === 'success' ? 'var(--accent-green)' : 'var(--accent-cyan)'
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{ev.time}</span>
                    <span style={{ fontSize: 11, color: 'var(--accent-amber)', fontWeight: 600 }}>{ev.agent}</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{ev.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Zone map + radar */}
        <div className="dashboard-right">
          {/* Zone Risk Status */}
          <div className="card mb-16">
            <div className="section-header">
              <div>
                <p className="section-eyebrow">Zone Intelligence</p>
                <h2 className="section-title">Active Plant Zones</h2>
              </div>
              <span className="badge live"><span className="live-dot red" /> Live</span>
            </div>
            {ZONES.map(zone => (
              <div key={zone.id} className={`zone-row ${zone.status}`}>
                <div className="zone-id font-mono">{zone.id}</div>
                <div className="zone-info">
                  <span className="zone-name">{zone.name}</span>
                  <div className="zone-stats">
                    <span><Users size={11} /> {zone.workers} workers</span>
                    {zone.alerts > 0 && <span style={{ color: 'var(--accent-red)' }}><AlertTriangle size={11} /> {zone.alerts} alerts</span>}
                  </div>
                </div>
                <div className="zone-risk-col">
                  <span className="zone-risk-val" style={{
                    color: zone.risk > 80 ? 'var(--accent-red)' : zone.risk > 50 ? 'var(--accent-amber)' : 'var(--accent-green)'
                  }}>{zone.risk}</span>
                  <div className="risk-bar" style={{ width: 60 }}>
                    <div className="risk-bar-fill" style={{
                      width: `${zone.risk}%`,
                      background: zone.risk > 80 ? 'var(--accent-red)' : zone.risk > 50 ? 'var(--accent-amber)' : 'var(--accent-green)'
                    }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Safety Radar */}
          <div className="card mb-16">
            <div className="section-header">
              <div>
                <p className="section-eyebrow">Safety Profile</p>
                <h2 className="section-title">Multi-Dimensional Risk Radar</h2>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={RADAR_DATA}>
                <PolarGrid stroke="var(--border-subtle)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                <Radar dataKey="value" stroke="var(--accent-amber)" fill="var(--accent-amber)" fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Active Permits Quick View */}
          <div className="card">
            <div className="section-header">
              <div>
                <p className="section-eyebrow">Permit Status</p>
                <h2 className="section-title">Active Work Permits</h2>
              </div>
              <span style={{ fontSize: 12, color: 'var(--accent-amber)' }}>7 active</span>
            </div>
            {[
              { id: 'WP-2341', type: 'Hot Work', zone: 'C4', status: 'flagged' },
              { id: 'WP-2339', type: 'Confined Space', zone: 'B3', status: 'clear' },
              { id: 'WP-2337', type: 'Electrical', zone: 'D2', status: 'clear' },
              { id: 'WP-2335', type: 'Height Work', zone: 'A1', status: 'review' },
            ].map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent-cyan)', minWidth: 70 }}>{p.id}</span>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)', flex: 1 }}>{p.type} — Zone {p.zone}</span>
                {p.status === 'flagged' ? <XCircle size={14} color="var(--accent-red)" /> :
                  p.status === 'review' ? <Clock size={14} color="var(--accent-amber)" /> :
                    <CheckCircle size={14} color="var(--accent-green)" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
