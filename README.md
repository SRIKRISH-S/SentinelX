<p align="center">
  <h1 align="center">🛡️ SentinelX AI</h1>
  <p align="center"><strong>AI-Powered Industrial Safety Intelligence Platform for Zero-Harm Operations</strong></p>
  <p align="center">
    <em>ET AI Hackathon 2.0 · 2026 · Problem Statement #1</em>
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/Groq-LLaMA_3.3_70B-F55036?style=flat-square" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" />
</p>

---

## 🧠 The Problem

> *"The problem is not the absence of technology. It is the absence of a unified intelligence layer."*
> — ET AI Hackathon Problem Statement #1

Industrial plants have **gas sensors, SCADA systems, CCTV cameras, work permits, and worker tracking** — but these systems operate in **complete isolation**. Each one says "OK" individually, yet **78% of preventable industrial accidents** occur when multiple risk factors coincide undetected.

**Example of a compound risk no single system catches:**
- Gas sensor: H2S at 87% threshold ✅ *(still below alarm)*
- Permit system: Hot work (welding) active nearby ✅ *(permit approved)*
- Worker tracking: 6 workers in zone ✅ *(within capacity)*
- SCADA: Pressure deviation +12% ✅ *(within tolerance)*

**Each system says OK. Together, this is a disaster waiting to happen.**

SentinelX is the AI brain that **connects all these systems** and catches compound risks before they kill.

---

## 🚀 Solution — SentinelX AI Platform

SentinelX unifies IoT sensors, SCADA data, CCTV feeds, permit-to-work logs, worker tracking, and historical incident records into a **single AI-powered intelligence layer** that:

1. **Detects compound risks** that no individual system can identify
2. **Orchestrates emergency response** automatically within seconds
3. **Provides AI-assisted decision making** with real-time plant context
4. **Generates regulatory compliance reports** (OISD-116, DGFASLI, Factory Act 1948)

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                             │
│                                                                     │
│   Command     Digital    CCTV      Permit      Emergency   AI       │
│   Center      Twin       Monitor   Intelligence Response   Copilot  │
│   Dashboard   (SVG Map)  (Vision)  (Audit)     (Orchestr.) (Chat)   │
│                                                                     │
│   React 18 · Recharts · Framer Motion · Custom CSS Design System    │
├─────────────────────────────────────────────────────────────────────┤
│                       ACTION LAYER                                  │
│                                                                     │
│   🚨 Emergency Response     📄 Regulatory Report    🤖 AI Safety   |
│      Orchestrator               Generator               Copilot     │
│   (Auto-evacuate, suspend   (OISD-116, DGFASLI     (Groq LLaMA      │
│    permits, alert teams)     Form 16, Factory Act)   3.3 70B)       │
├─────────────────────────────────────────────────────────────────────┤
│                   INTELLIGENCE LAYER (Multi-Agent)                  │
│                                                                     │
│   ⚡ Compound Risk    📋 Permit         📹 CCTV Vision   📊 RAG   │
│      Detection           Intelligence      Agent            Agent   │
│      Engine              Agent                                      │
│                                                                     │
│   Correlates gas +    Cross-checks      PPE detection,   Historical │
│   permits + workers   permits vs live   unauthorized     incident   │
│   + SCADA + weather   plant conditions  entry alerts     patterns   │
├─────────────────────────────────────────────────────────────────────┤
│                    DATA INGESTION LAYER                             │
│                                                                     │
│   🔌 IoT/SCADA        📹 CCTV Feeds     📋 Permit/Shift            |
│      Connectors           (AI Vision)       Management APIs         │
│      (Simulated)          (Simulated)       (Simulated)             │
│                                                                     │
│   H2S, CO, Temp,      8 camera feeds     7 work permits,            │
│   Pressure sensors    with AI detection  shift records              │
└─────────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
Sensors/SCADA ──┐
CCTV Feeds ─────┼──► Intelligence Layer ──► Compound Risk Score ──► Dashboard
Permit System ──┤        (Multi-Agent)           │                    │
Shift Records ──┘                                ▼                    ▼
                                          Risk > Threshold?    AI Copilot
                                                │              (Context-Aware)
                                                ▼
                                    Emergency Response Orchestrator
                                    ├── Evacuate workers
                                    ├── Suspend permits
                                    ├── Alert emergency teams
                                    └── Generate compliance reports
```

---

## ✨ Features

### 1. 🖥️ Command Center Dashboard
Real-time KPI overview with live sensor visualization, zone-level risk status, multi-dimensional safety radar, and AI agent action feed. Updates every 3 seconds.

### 2. ⚡ Compound Risk Engine (Multi-Agent)
The core innovation. Correlates gas readings + permit activity + SCADA state + shift records simultaneously. Identifies dangerous combinations no single sensor would flag alone. Includes risk matrix (probability vs. severity) and predicted incident timelines.

### 3. 🏭 Plant Digital Twin
Interactive SVG-based plant layout with switchable layers: Risk Heatmap, Thermal View, Worker Tracking. Features animated gas cloud visualization and click-to-inspect zone details.

### 4. 📹 CCTV Vision Monitor
AI computer vision across 8 simulated camera feeds. Real-time PPE compliance detection (helmet, vest, respiratory protection), unauthorized entry detection, and behavioral safety analytics.

### 5. 📋 Permit Intelligence Agent
All 7 active permits cross-analyzed against real-time plant conditions. AI-flagged permit conflicts with specific reasons. One-click permit suspension with geofence and gas-level conflict detection.

### 6. 🚨 Emergency Response Orchestrator
3 pre-built emergency protocols (Gas Leak, Fire, Medical Emergency). Automated step tracking with auto-completion for AI-driven steps. Live incident timer, emergency contact directory, and OISD-116/DGFASLI compliant auto-report generation.

### 7. 📊 Incident Pattern Analysis (RAG)
5-year incident corpus cross-referenced with OISD, DGFASLI, Factory Act standards. AI-identified recurring patterns with regulatory citations and actionable prevention recommendations.

### 8. 🤖 AI Safety Copilot
Real AI integration via Groq API (LLaMA 3.3 70B). Context-aware responses about current plant state — knows live sensor values, active permits, and drill status. Regulatory guidance citing OISD-116/117, Factory Act 1948, DGFASLI, and DGMS.

### 🔴 Emergency Drill Simulation
One-click emergency drill that transforms the entire platform simultaneously — gas readings spike, permits auto-suspend, emergency protocols activate, workers evacuate, and the AI Copilot switches to emergency context. Demonstrates real-time coordinated response across all modules.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18, Recharts, Lucide Icons, Framer Motion | UI components, data visualization, animations |
| **AI Engine** | Groq API (LLaMA 3.3 70B Versatile) | Sub-second AI inference for safety copilot |
| **Backend** | Node.js, Express.js | API proxy server for Groq, static file serving |
| **Styling** | Custom CSS Design System (Space Grotesk + JetBrains Mono) | Industrial dark theme, responsive layout |
| **Visualization** | Recharts, Custom SVG Digital Twin | Live charts, interactive plant map |
| **State** | React Hooks (useState, useEffect, useRef) | Global state management across modules |

---

## 📦 Setup & Running

### Prerequisites
- Node.js 18+ and npm 9+
- Groq API Key ([Get one free at console.groq.com](https://console.groq.com/keys))

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/SRIKRISH-S/SentinelX.git
cd SentinelX

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env and add your Groq API key

# 4. Build the production app
npm run build

# 5. Start the server
npm run server
```

Open **http://localhost:5000** in your browser.

### Development Mode

```bash
# Terminal 1: API server
npm run server

# Terminal 2: React dev server (with hot reload)
set PORT=3000 && npm start
```

---

## 🏆 Judging Criteria Alignment

| Criterion | Weight | How SentinelX Addresses It |
|---|---|---|
| **Innovation** | 25% | Multi-agent compound risk detection — catches dangers no single sensor can see. Digital Twin with live gas cloud visualization. AI Copilot with full plant context. |
| **Business Impact** | 25% | Targets the 78% of industrial incidents caused by unconnected data (VISP pattern). Reduces incident detection from 15-30 min to < 3 seconds. |
| **Technical Excellence** | 20% | Real Groq LLaMA 3.3 70B integration, live sensor simulation, multi-layer architecture, emergency drill simulation. |
| **Scalability** | 15% | Component-based React architecture, REST API pattern, cloud-ready Express server, modular intelligence agents. |
| **User Experience** | 15% | Purpose-built industrial dark theme, responsive design, one-click interventions, real-time updates every 3 seconds. |

---

## 📐 Key Innovation: Compound Risk Detection

Traditional safety systems monitor **individual thresholds** — if gas is below 50 ppm, it says "OK".

SentinelX's multi-agent system asks: **"What ELSE is happening at the same time?"**

```
TRADITIONAL (Isolated)          SENTINELX (Compound)
─────────────────────           ─────────────────────
Gas: 43 ppm → OK ✅            Gas: 43 ppm (87% threshold)
Permit: Active → OK ✅    +    Permit: Hot work 48m away
Workers: 6 → OK ✅        +    Workers: 6 in blast radius
SCADA: +12% → OK ✅       +    SCADA: Pressure climbing
                                ────────────────────────
Result: No alarm                Result: COMPOUND RISK 91/100
                                → Auto-evacuate
                                → Suspend permit WP-2341
                                → Alert emergency teams
```

### The Mathematical Formula

SentinelX calculates compound risk using an interaction-based risk scoring algorithm that multiplies threat vectors rather than simply adding them, reflecting how hazards compound in reality:

$$R_{\text{compound}} = \min \left( 100, \, R_{\text{sensor\_base}} \times \left( 1 + \sum_{i=1}^{n} \omega_i \cdot \delta_i \right) \times \Phi_{\text{spatial}} \right)$$

Where:
*   **$R_{\text{sensor\_base}}$**: The primary sensor hazard value normalized to a $0\text{-}100$ scale:
    $$R_{\text{sensor\_base}} = \max \left( \frac{\text{H2S}_{\text{current}}}{\text{H2S}_{\text{threshold}}}, \, \frac{\text{CO}_{\text{current}}}{\text{CO}_{\text{threshold}}} \right) \times 50$$
*   **$\omega_i$**: Weight coefficient assigned to compounding factor $i$ (e.g., Worker presence = $0.35$, Process deviation = $0.25$, Active permits = $0.40$).
*   **$\delta_i$**: Normalized metric or presence indicator ($0$ or $1$) of compounding factor $i$.
*   **$\Phi_{\text{spatial}}$**: Spatial proximity penalty multiplier based on distance $d$ to hot work locations:
    $$\Phi_{\text{spatial}} = \begin{cases} 
      1.5 & \text{if } d < 50\text{m} \\
      1.2 & \text{if } 50\text{m} \le d \le 100\text{m} \\
      1.0 & \text{if } d > 100\text{m}
   \end{cases}$$

---

---

## 📄 Regulatory Compliance

SentinelX references and generates reports compliant with:
- **OISD-116/117** — Oil Industry Safety Directorate standards
- **Factory Act 1948** — Section 7A (duty to inform on hazardous conditions)
- **DGFASLI** — Directorate General, Factory Advice Service & Labour Institutes
- **DGMS** — Directorate General of Mines Safety

---

## 👥 Team

**SentinelX AI** — Built for ET AI Hackathon 2.0, 2026

---

<p align="center">
  <em>"The problem is not the absence of technology. It is the absence of a unified intelligence layer."</em>
</p>
