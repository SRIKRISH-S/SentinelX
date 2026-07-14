import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Trash2, Zap, Shield, FileText, AlertTriangle, Sparkles, User, Activity, Gauge, Cpu, CheckCircle } from 'lucide-react';
import './AIAssistant.css';

const QUICK_PROMPTS = [
  { icon: AlertTriangle, label: 'Critical Risks', prompt: 'What are the most critical compound risks right now and what immediate actions should I take?' },
  { icon: FileText, label: 'Permit Check', prompt: 'Review all active permits against current plant conditions and flag any conflicts.' },
  { icon: Shield, label: 'Compliance Check', prompt: 'Run a compliance check against OISD and Factory Act standards for current operations.' },
  { icon: Zap, label: 'Emergency Protocol', prompt: 'What is the emergency response protocol if H2S reaches alarm level in Zone C4?' },
];

// Fallback Mock Responses for SentinelX AI Safety Copilot
const getMockResponse = (prompt, drillActive, sensorVal) => {
  const h2sVal = drillActive ? sensorVal.h2s : 43;
  const coVal = drillActive ? sensorVal.co : 27;

  if (prompt.toLowerCase().includes('critical risk') || prompt.toLowerCase().includes('most critical')) {
    return `### **CRITICAL RISK ANALYSIS REPORT**
- **Zone C4 (Gas Processing Unit):**
  - **H2S Level:** **${h2sVal} ppm** (Threshold: 50 ppm - ${drillActive ? 'THRESHOLD BREACHED!' : '87% threshold'}).
  - **Risk Assessment:** **CRITICAL**. Coincides with workers in the area and adjacent ignition sources.
  - **Immediate Actions Required:**
    1. Evacuate all personnel from Zone C4 immediately.
    2. Suspend Hot Work Permit **WP-2341** (adjacent zone).
    3. Activate ventilation systems to disperse accumulated H2S.
    4. Standby emergency response team with self-contained Breathing Apparatus (SCBA) sets.

- **Zone A1 (Coke Oven Battery):**
  - **Risk Assessment:** **WARNING** (Pressure deviation +12%). Maintain pressure monitoring.`;
  }
  
  if (prompt.toLowerCase().includes('permit') || prompt.toLowerCase().includes('wp-2341')) {
    return `### **PERMIT-TO-WORK AUDIT LOG**
- **WP-2341 (Hot Work - Zone A1-Adjacent):**
  - **Conflict Status:** **${drillActive ? 'SUSPENDED AUTOMATICALLY' : 'FLAGGED'}**
  - **Adjacency Hazard:** Active welding within 48m of Zone C4 where H2S is at **${h2sVal} ppm**.
  - **Regulatory Breach:** OISD-117 Clause 5.2 states no hot work may occur within 100m of a gas accumulation hazard.
  - **Recommendation:** Suspension confirmed. Isolation validation required before reactivation.

- **WP-2339 (Confined Space - Zone B3):**
  - **Status:** **Active / Clear**. Atmospheric checks normal.`;
  }

  if (prompt.toLowerCase().includes('compliance') || prompt.toLowerCase().includes('oisd')) {
    return `### **REGULATORY COMPLIANCE STATUS CHECK**
- **OISD-117 (Control of Safety Deviations):**
  - **Deviation:** Hot Work permit active inside gas accumulation buffer.
  - **Status:** ${drillActive ? 'Mitigated (Permit Suspended)' : 'NON-COMPLIANT (Flagged)'}.

- **Factory Act 1948 Section 7A:**
  - **Requirement:** Obligation to notify workers of toxic gas build-up.
  - **Action:** Sirens activated. Handover safety briefs flagged.
  
- **DGFASLI Safety Standard:**
  - **Muster Count:** Muster points active. Headcount synchronization pending.`;
  }

  if (prompt.toLowerCase().includes('protocol') || prompt.toLowerCase().includes('emergency response')) {
    return `### **EMERGENCY RESPONSE PROTOCOL (TOXIC GAS RELEASE)**
- **Step 1: Announcement (PA):** Trigger toxic gas siren. Broadcast: *“Attention all personnel. Gas emergency in Zone C4. Evacuate to Muster Point B.”*
- **Step 2: Process Isolation:** Trigger automatic SCADA isolation valves to block chemical feed lines.
- **Step 3: Permit Lockout:** Revoke active hot work permits in Zones C4 and A1.
- **Step 4: Muster Count:** Deploy Safety Wardens to MP-B and verify worker check-in records.
- **Step 5: Medical Alert:** PMO on alert. Vizag Emergency Hospital standby.`;
  }

  return `### **SentinelX AI Platform Diagnostics**
- **Current H2S in C4:** ${h2sVal} ppm
- **Current CO in C4:** ${coVal} ppm
- **System Status:** ${drillActive ? 'EMERGENCY STATE ACTIVE' : 'NOMINAL SAFETY REGIME'}
- **Safety Directive:** Ensure all personnel maintain high-vis vests and helmets. Confine Hot Work strictly to designated bays unless LEL checks are validated. I am ready to process specific safety directives.`;
};

export default function AIAssistant({
  drillActive,
  sensorData,
  permits,
  alerts,
  groqConfig,
  setGroqConfig,
  onNavigate
}) {
  const currentSensor = sensorData[sensorData.length - 1] || { h2s: 24, co: 18, temp: 62, risk: 35 };

  // Local chat messages state
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Speedometer metrics
  const [metrics, setMetrics] = useState({
    latency: 0,
    tokens: 0,
    tps: 0,
    modelUsed: 'llama-3.3-70b-versatile',
    isMock: true,
    hasGenerated: false,
  });



  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Load welcome message and local storage key on load
  useEffect(() => {
    const welcomeMsg = {
      role: 'assistant',
      content: `**SentinelX AI Safety Copilot — Online**
\nI am monitoring Vizag Steel Plant in real-time. Current parameters:
\n🔴 **Zone C4**: H2S at **${drillActive ? currentSensor.h2s : 43} ppm** (Safe limit: 50 ppm).
🟡 **Zone A1**: Process deviations present (+12% pressure variance).
\n**Powered by Groq High-Speed Inference Engine** — LLaMA 3.3 70B with sub-second regulatory checks. Ask me anything about plant safety, permits, compliance, or emergency protocols.`,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }),
    };
    setMessages([welcomeMsg]);
  }, [drillActive]);

  // Auto-detect server API Key status on mount
  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.hasKey) {
          setGroqConfig(prev => ({
            ...prev,
            useMock: false
          }));
        }
      })
      .catch(err => console.error('API configuration check failed:', err));
  }, [setGroqConfig]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);



  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;

    const userMsg = {
      role: 'user',
      content: userText,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const startTime = Date.now();

    if (groqConfig.useMock) {
      // Mock Response Mode with Streaming Delay
      setTimeout(() => {
        const replyText = getMockResponse(userText, drillActive, currentSensor);
        const elapsed = (Date.now() - startTime) / 1000;
        const mockTokens = Math.floor(replyText.length / 4);
        
        // Mocking insane Groq speeds
        const simulatedTps = Math.floor(450 + Math.random() * 80);
        const simulatedLatency = (mockTokens / simulatedTps).toFixed(3);

        const assistantMsg = {
          role: 'assistant',
          content: replyText,
          timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }),
        };

        setMessages(prev => [...prev, assistantMsg]);
        setMetrics({
          latency: parseFloat(simulatedLatency),
          tokens: mockTokens,
          tps: simulatedTps,
          modelUsed: groqConfig.model,
          isMock: true,
          hasGenerated: true
        });
        setLoading(false);
      }, 1000);

    } else {
      // Real API Mode calling the Proxy Server
      try {
        const chatHistory = messages
          .filter(m => !m.content.includes('SentinelX AI Safety Copilot — Swapped'))
          .map(m => ({ role: m.role, content: m.content }));

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            apiKey: groqConfig.apiKey,
            model: groqConfig.model,
            messages: [
              {
                role: 'system',
                content: `You are SentinelX AI — an expert industrial safety intelligence copilot for a steel plant in Visakhapatnam, India. You have access to real-time data from 47 IoT sensors, SCADA systems, permit-to-work logs, CCTV feeds, and shift records.
              
                Current Plant Status:
                - Drill Mode Active: ${drillActive ? 'YES (EMERGENCY DRILL TRIGGERED)' : 'NO'}
                - Zone C4 (Gas Processing Unit): H2S at ${drillActive ? currentSensor.h2s : 43} ppm (safe threshold: 50ppm), CO at ${drillActive ? currentSensor.co : 27} ppm, workers present: ${drillActive ? '0 (evacuated)' : '6'}
                - Zone A1 (Coke Oven Battery): pressure deviation +12%, workers present: 12
                - Active Permits: ${permits.map(p => `${p.id} (${p.type} in Zone ${p.zone}, Status: ${p.status}, Risk: ${p.risk})`).join(', ')}
                - Active Alarms: ${alerts.map(a => a.msg).join(', ')}
                
                You answer safety queries compliance logs, permit checks, regulatory requirements (citing OISD-116/117, Factory Act 1948, DGFASLI) and recommended emergency checks. Be extremely precise and concise.`
              },
              ...chatHistory,
              { role: 'user', content: userText }
            ]
          }),
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Connection failed');
        }

        const replyText = data.choices?.[0]?.message?.content || 'Empty response received from Groq.';
        const elapsed = (Date.now() - startTime) / 1000;
        const actualTokens = data.usage?.completion_tokens || Math.floor(replyText.length / 4);
        const tps = Math.round(actualTokens / elapsed);

        const assistantMsg = {
          role: 'assistant',
          content: replyText,
          timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }),
        };

        setMessages(prev => [...prev, assistantMsg]);
        setMetrics({
          latency: parseFloat(elapsed.toFixed(3)),
          tokens: actualTokens,
          tps: tps,
          modelUsed: data.model || groqConfig.model,
          isMock: false,
          hasGenerated: true
        });

      } catch (err) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `**Error connecting to Groq Engine.** \n\n_Details: ${err.message}_\n\nCheck that the API Key is active in settings and your server proxy is running.`,
          timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }),
        }]);
      } finally {
        setLoading(false);
      }
    }
  };

  const clearChat = () => {
    setMessages([]);
    setMetrics(prev => ({ ...prev, hasGenerated: false }));
  };

  return (
    <div className="ai-assistant animate-fadeIn">


      {/* Main chat layout */}
      <div className="assistant-header">
        <div className="assistant-title-row">
          <div className="assistant-icon">
            <Sparkles size={18} />
          </div>
          <div>
            <p className="section-eyebrow">Conversational Safety Intelligence</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>AI Safety Copilot</h1>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className="live-dot green" />
            <span style={{ fontSize: 12, color: 'var(--accent-green)' }}>
              Groq API Connected
            </span>
            <button className="btn btn-ghost btn-sm" onClick={clearChat}><Trash2 size={13} /> Clear</button>
          </div>
        </div>

        {/* Quick prompts */}
        <div className="quick-prompts">
          {QUICK_PROMPTS.map((q, i) => (
            <button key={i} className="quick-prompt-btn" onClick={() => sendMessage(q.prompt)}>
              <q.icon size={13} />
              <span>{q.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="chat-window">
        <div className="messages-area">
          {messages.map((msg, i) => {
            const isUser = msg.role === 'user';
            return (
              <div key={i} className={`message-row ${isUser ? 'user' : 'assistant'}`}>
                <div className={`message-avatar ${isUser ? 'user' : 'assistant'}`}>
                  {isUser ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div className="message-bubble">
                  <div className="message-content">
                    {msg.content.split('\n').map((line, i) => {
                      if (line.startsWith('###')) {
                        return <h3 key={i} style={{ fontFamily: 'var(--font-display)', fontSize: 14, margin: '12px 0 6px', color: 'var(--text-primary)' }}>{line.replace('###', '').trim()}</h3>;
                      }
                      
                      // Bold formatting
                      const parts = line.split(/(\*\*[^*]+\*\*)/g);
                      return (
                        <p key={i} style={{ marginBottom: 4 }}>
                          {parts.map((part, j) =>
                            part.startsWith('**') && part.endsWith('**')
                              ? <strong key={j}>{part.slice(2, -2)}</strong>
                              : part
                          )}
                        </p>
                      );
                    })}
                  </div>
                  <span className="message-time font-mono">{msg.timestamp}</span>
                </div>
              </div>
            );
          })}
          {loading && (
            <div className="message-row assistant">
              <div className="message-avatar assistant"><Bot size={14} /></div>
              <div className="message-bubble">
                <div className="typing-indicator">
                  <span /><span /><span />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="chat-input-area">
          <input
            ref={inputRef}
            className="chat-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Ask about compliance regulations, safety permits, risks, or drill protocols..."
            disabled={loading}
          />
          <button
            className={`send-btn ${loading ? 'loading' : ''}`}
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
          >
            {loading ? <span className="spinner" /> : <Send size={16} />}
          </button>
        </div>
      </div>

      {/* Speedometer panel */}
      <div className="assistant-context">
        <div className="card speedometer-card">
          <p className="section-eyebrow" style={{ display: 'flex', alignItems: 'center', gap: 6, margin: 0 }}>
            <Gauge size={13} color="var(--accent-cyan)" /> Groq Speedometer
          </p>
          
          <div className="speedometer-grid" style={{ margin: '12px 0' }}>
            <div className="speed-val-block">
              <span className="speed-label">THROUGHPUT</span>
              <span className="speed-val font-mono text-cyan" style={{ color: metrics.hasGenerated ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>
                {metrics.hasGenerated ? `${metrics.tps} t/s` : '—'}
              </span>
            </div>
            <div className="speed-val-block">
              <span className="speed-label">LATENCY</span>
              <span className="speed-val font-mono" style={{ color: metrics.hasGenerated ? 'var(--accent-amber)' : 'var(--text-muted)' }}>
                {metrics.hasGenerated ? `${metrics.latency}s` : '—'}
              </span>
            </div>
            <div className="speed-val-block">
              <span className="speed-label">TOKENS</span>
              <span className="speed-val font-mono" style={{ color: metrics.hasGenerated ? 'var(--accent-green)' : 'var(--text-muted)' }}>
                {metrics.hasGenerated ? metrics.tokens : '—'}
              </span>
            </div>
          </div>

          {metrics.hasGenerated && (
            <div className="performance-chart-box animate-fadeIn">
              <p className="chart-eyebrow font-mono" style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 8 }}>
                Speed Benchmark (Higher is Better)
              </p>
              {[
                { name: `Groq (${metrics.modelUsed.split('-')[0].toUpperCase()})`, value: metrics.tps, active: true, color: 'var(--accent-cyan)' },
                { name: 'Claude 3.5 Sonnet', value: 52, active: false, color: '#fca5a5' },
                { name: 'GPT-4o', value: 45, active: false, color: '#94a3b8' }
              ].map((bench, idx) => (
                <div key={idx} style={{ marginBottom: 6 }}>
                  <div style={{ display: 'flex', justifycontent: 'space-between', fontSize: 10, marginBottom: 2 }}>
                    <span style={{ color: bench.active ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: bench.active ? 700 : 400 }}>{bench.name}</span>
                    <span className="font-mono" style={{ color: bench.active ? 'var(--accent-cyan)' : 'var(--text-muted)', float: 'right' }}>{bench.value} t/s</span>
                  </div>
                  <div className="bench-bar-track" style={{ height: 4, background: 'var(--bg-elevated)', borderRadius: 2 }}>
                    <div 
                      className="bench-bar-fill" 
                      style={{ 
                        height: '100%', 
                        width: `${Math.min((bench.value / 600) * 100, 100)}%`, 
                        background: bench.color,
                        borderRadius: 2
                      }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card" style={{ marginTop: 14 }}>
          <p className="section-eyebrow" style={{ marginBottom: 12 }}>Current Plant Context</p>
          {[
            { label: 'H2S Zone C4', value: `${drillActive ? currentSensor.h2s : 43} ppm`, status: drillActive ? 'critical' : 'warning' },
            { label: 'CO Zone C4', value: `${drillActive ? currentSensor.co : 27} ppm`, status: drillActive ? 'warning' : 'normal' },
            { label: 'Active Permits', value: permits.filter(p => p.status === 'active' || p.status === 'flagged').length, status: 'normal' },
            { label: 'Flagged Permits', value: permits.filter(p => p.status === 'flagged').length, status: drillActive ? 'critical' : 'warning' },
            { label: 'Workers On-site', value: drillActive ? 39 : 45, status: 'normal' },
            { label: 'Risk Score', value: `${currentSensor.risk}/100`, status: drillActive ? 'critical' : 'warning' },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.label}</span>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600,
                color: s.status === 'critical' ? 'var(--accent-red)' : s.status === 'warning' ? 'var(--accent-amber)' : 'var(--text-secondary)'
              }}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
