import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import RiskEngine from './pages/RiskEngine';
import DigitalTwin from './pages/DigitalTwin';
import PermitIntelligence from './pages/PermitIntelligence';
import EmergencyResponse from './pages/EmergencyResponse';
import IncidentAnalysis from './pages/IncidentAnalysis';
import CCTVMonitor from './pages/CCTVMonitor';
import AIAssistant from './pages/AIAssistant';
import './App.css';

// Initial data templates
const INITIAL_PERMITS = [
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

const INITIAL_ALERTS = [
  { id: 1, type: 'critical', msg: 'Zone C4: Gas sensor H2S at 87% threshold — 2 active permits flagged', time: '2m ago' },
  { id: 2, type: 'warning', msg: 'Hot work permit WP-2341 overlaps with elevated gas zone', time: '7m ago' },
  { id: 3, type: 'info', msg: 'Shift changeover detected — Safety brief initiated', time: '12m ago' },
];

const generateInitialSensorData = () =>
  Array.from({ length: 20 }, (_, i) => {
    const min = new Date();
    min.setMinutes(min.getMinutes() - (20 - i) * 3);
    return {
      t: min.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }),
      h2s: Math.floor(Math.random() * 15 + 20), // normal range 20-35
      co: Math.floor(Math.random() * 10 + 15),  // normal range 15-25
      temp: Math.floor(Math.random() * 5 + 60),  // normal range 60-65
      risk: Math.floor(Math.random() * 15 + 30), // normal risk 30-45
    };
  });

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Global settings / API Configuration state
  const [groqConfig, setGroqConfig] = useState(() => {
    const savedKey = localStorage.getItem('sentinelx_groq_api_key') || '';
    const savedModel = localStorage.getItem('sentinelx_groq_model') || 'llama-3.3-70b-versatile';
    return {
      apiKey: savedKey,
      model: savedModel,
      useMock: savedKey.trim() === '',
    };
  });

  // Global state for Emergency Drill
  const [drillActive, setDrillActive] = useState(false);
  const [sensorHistory, setSensorHistory] = useState(generateInitialSensorData());
  const [permits, setPermits] = useState(INITIAL_PERMITS);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [activeProtocolId, setActiveProtocolId] = useState(null);
  const [emergencySteps, setEmergencySteps] = useState({});
  const [emergencyTimer, setEmergencyTimer] = useState(0);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);

  // Interval reference for live sensor updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSensorHistory(prev => {
        const next = [...prev.slice(1)];
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

        let h2s, co, temp, risk;
        if (drillActive) {
          // In drill mode, readings spike
          h2s = Math.floor(Math.random() * 5 + 56); // 56 - 60 ppm (Threshold: 50)
          co = Math.floor(Math.random() * 6 + 42);   // 42 - 48 ppm (Threshold: 35)
          temp = Math.floor(Math.random() * 10 + 72); // elevated temperature
          risk = Math.floor(Math.random() * 4 + 92);  // risk score 92 - 96
        } else {
          // Normal fluctuating values
          h2s = Math.floor(Math.random() * 8 + 24);   // 24 - 32 ppm
          co = Math.floor(Math.random() * 6 + 18);    // 18 - 24 ppm
          temp = Math.floor(Math.random() * 4 + 61);  // 61 - 65 degrees
          risk = Math.floor(Math.random() * 10 + 32); // risk score 32 - 42
        }

        next.push({ t: timeStr, h2s, co, temp, risk });
        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [drillActive]);

  // Handle drill toggling
  const handleToggleDrill = () => {
    if (!drillActive) {
      // Start the drill
      setDrillActive(true);
      
      // Auto-suspend Hot Work permit WP-2341
      setPermits(prev =>
        prev.map(p =>
          p.id === 'WP-2341'
            ? { ...p, status: 'flagged', risk: 96, flags: ['CRITICAL: Zone C4 H2S levels at 58ppm (EXCEEDS 50ppm LIMIT)', 'Conflicting active maintenance nearby', 'Wind direction hazardous'] }
            : p
        )
      );

      // Add a critical drill alert
      const newAlert = {
        id: Date.now(),
        type: 'critical',
        msg: '🚨 EMERGENCY DRILL: Gas sensor H2S at 58 ppm in Zone C4 — Evacuate Immediately!',
        time: 'Just now',
      };
      setAlerts(prev => [newAlert, ...prev]);

      // Automatically trigger Gas Leak emergency protocol
      setActiveProtocolId('GAS_LEAK');
      setEmergencySteps({
        1: true, // PA Announcement
        2: true, // SCADA Gas Isolation
        6: true, // Medical Standby Alert
        7: true, // Save Logs
      });
      setEmergencyTimer(0);
    } else {
      // End the drill
      setDrillActive(false);
      setPermits(INITIAL_PERMITS);
      setAlerts(INITIAL_ALERTS);
      setActiveProtocolId(null);
      setEmergencySteps({});
      setEmergencyTimer(0);
    }
  };

  // Safe page getter
  const pagesProps = {
    drillActive,
    sensorData: sensorHistory,
    permits,
    setPermits,
    alerts,
    setAlerts,
    activeProtocolId,
    setActiveProtocolId,
    emergencySteps,
    setEmergencySteps,
    emergencyTimer,
    setEmergencyTimer,
    groqConfig,
    setGroqConfig,
    showSettingsDrawer,
    setShowSettingsDrawer,
    handleToggleDrill,
    onNavigate: setActivePage
  };

  const PAGES = {
    dashboard: Dashboard,
    risk: RiskEngine,
    twin: DigitalTwin,
    cctv: CCTVMonitor,
    permits: PermitIntelligence,
    emergency: EmergencyResponse,
    incidents: IncidentAnalysis,
    assistant: AIAssistant,
  };

  const PageComponent = PAGES[activePage] || Dashboard;

  return (
    <div className="app-shell">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(o => !o)}
        drillActive={drillActive}
      />
      <div className={`main-area ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
        <Header
          activePage={activePage}
          onMenuToggle={() => setSidebarOpen(o => !o)}
          drillActive={drillActive}
          onToggleDrill={handleToggleDrill}
          onOpenSettings={() => setShowSettingsDrawer(true)}
          alerts={alerts}
        />
        <main className="page-content">
          <PageComponent {...pagesProps} />
        </main>
      </div>
    </div>
  );
}

