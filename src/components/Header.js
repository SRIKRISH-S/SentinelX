import React, { useState, useEffect } from 'react';
import { Bell, Search, Menu, Wifi, Clock, ShieldAlert } from 'lucide-react';
import './Header.css';

const PAGE_TITLES = {
  dashboard: { title: 'Command Center', sub: 'Real-time safety intelligence overview' },
  risk: { title: 'Compound Risk Engine', sub: 'Multi-agent risk correlation & prediction' },
  twin: { title: 'Plant Digital Twin', sub: 'Live 3D asset & environment model' },
  cctv: { title: 'CCTV Vision Monitor', sub: 'AI-powered computer vision surveillance' },
  permits: { title: 'Permit Intelligence', sub: 'Smart permit-to-work management' },
  emergency: { title: 'Emergency Response', sub: 'Autonomous incident orchestration' },
  incidents: { title: 'Incident Analysis', sub: 'Pattern intelligence & RAG analytics' },
  assistant: { title: 'AI Safety Copilot', sub: 'Conversational safety intelligence' },
};

export default function Header({ activePage, onMenuToggle, drillActive, onToggleDrill, onOpenSettings, alerts = [] }) {
  const [time, setTime] = useState(new Date());
  const [showAlerts, setShowAlerts] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const pageInfo = PAGE_TITLES[activePage] || PAGE_TITLES.dashboard;

  const criticalCount = alerts.filter(a => a.type === 'critical').length;

  return (
    <header className="app-header">
      <div className="header-left">
        <button className="menu-btn" onClick={onMenuToggle}>
          <Menu size={18} />
        </button>
        <div className="page-info">
          <h1 className="page-title">{pageInfo.title}</h1>
          <span className="page-sub">{pageInfo.sub}</span>
        </div>
      </div>

      <div className="header-center">
        {/* Drill Control Button */}
        <button 
          className={`drill-toggle-btn ${drillActive ? 'active' : ''}`}
          onClick={onToggleDrill}
          title={drillActive ? 'Click to stop simulated emergency drill' : 'Click to start simulated emergency drill'}
        >
          <ShieldAlert size={14} className={drillActive ? 'animate-pulse' : ''} />
          <span>{drillActive ? 'STOP EMERGENCY DRILL' : 'START SAFETY DRILL'}</span>
        </button>
      </div>

      <div className="header-right">
        <div className="live-indicator">
          <Wifi size={13} className={drillActive ? 'live-sensor-spiked' : ''} />
          <span style={{ color: drillActive ? 'var(--accent-red)' : 'inherit' }}>
            {drillActive ? 'Sensors Spiked' : '47 sensors live'}
          </span>
        </div>

        <div className="header-time font-mono">
          <Clock size={13} />
          <span>{time.toLocaleTimeString('en-IN', { hour12: false })}</span>
          <span className="header-date">{time.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
        </div>

        <div className="alert-btn-wrap">
          <button
            className={`alert-btn ${showAlerts ? 'active' : ''} ${criticalCount > 0 ? 'critical-active' : ''}`}
            onClick={() => setShowAlerts(s => !s)}
          >
            <Bell size={16} />
            {alerts.length > 0 && <span className="alert-count">{alerts.length}</span>}
          </button>

          {showAlerts && (
            <div className="alerts-dropdown animate-fadeIn">
              <div className="alerts-header">
                <span>Active Alerts</span>
                {alerts.length > 0 && (
                  <span className={`badge ${criticalCount > 0 ? 'critical' : 'warning'}`}>
                    {alerts.length} active
                  </span>
                )}
              </div>
              {alerts.length === 0 ? (
                <div style={{ padding: 16, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                  No active alerts
                </div>
              ) : (
                alerts.map(a => (
                  <div key={a.id} className={`alert-item ${a.type}`}>
                    <div className={`alert-dot ${a.type}`} />
                    <div className="alert-content">
                      <p className="alert-msg">{a.msg}</p>
                      <span className="alert-time font-mono">{a.time}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
