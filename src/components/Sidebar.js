import React from 'react';
import {
  LayoutDashboard, Zap, Box, FileCheck, AlertTriangle,
  FileSearch, Camera, Bot, ChevronLeft, ChevronRight,
  Shield, Activity
} from 'lucide-react';
import './Sidebar.css';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard, group: 'OVERVIEW' },
  { id: 'risk', label: 'Risk Engine', icon: Zap, group: 'INTELLIGENCE' },
  { id: 'twin', label: 'Digital Twin', icon: Box, group: 'INTELLIGENCE' },
  { id: 'cctv', label: 'CCTV Monitor', icon: Camera, group: 'INTELLIGENCE' },
  { id: 'permits', label: 'Permit Intelligence', icon: FileCheck, group: 'OPERATIONS' },
  { id: 'emergency', label: 'Emergency Response', icon: AlertTriangle, group: 'OPERATIONS' },
  { id: 'incidents', label: 'Incident Analysis', icon: FileSearch, group: 'ANALYTICS' },
  { id: 'assistant', label: 'AI Safety Copilot', icon: Bot, group: 'ANALYTICS' },
];

export default function Sidebar({ activePage, onNavigate, isOpen, onToggle, drillActive }) {
  const groups = [...new Set(NAV_ITEMS.map(i => i.group))];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <Shield size={20} />
        </div>
        {isOpen && (
          <div className="logo-text">
            <span className="logo-name">SentinelX</span>
            <span className="logo-sub">AI Safety Platform</span>
          </div>
        )}
        <button className="sidebar-toggle" onClick={onToggle} title={isOpen ? 'Collapse' : 'Expand'}>
          {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      {/* Live status */}
      <div className={`sidebar-status ${drillActive ? 'drill-warning' : ''}`}>
        <span className={`live-dot ${drillActive ? 'red animate-pulse' : 'green'}`} />
        {isOpen && (
          <span className="status-text font-display" style={{ fontWeight: 700, letterSpacing: '0.05em' }}>
            {drillActive ? 'EMERGENCY DRILL' : 'LIVE MONITORING'}
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {groups.map(group => (
          <div key={group} className="nav-group">
            {isOpen && <span className="nav-group-label">{group}</span>}
            {NAV_ITEMS.filter(i => i.group === group).map(item => (
              <button
                key={item.id}
                className={`nav-item ${activePage === item.id ? 'active' : ''}`}
                onClick={() => onNavigate(item.id)}
                title={!isOpen ? item.label : undefined}
              >
                <item.icon size={18} className="nav-icon" />
                {isOpen && <span className="nav-label">{item.label}</span>}
                {item.id === 'risk' && isOpen && (
                  <span className="nav-badge">3</span>
                )}
                {item.id === 'emergency' && isOpen && (
                  <span className="nav-badge alert">!</span>
                )}
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* Bottom info */}
      {isOpen && (
        <div className="sidebar-footer">
          <div className="system-health">
            <Activity size={13} />
            <span>System Nominal</span>
          </div>
          <div className="version-tag font-mono">v2.1.0 — ET AI 2026</div>
        </div>
      )}
    </aside>
  );
}
