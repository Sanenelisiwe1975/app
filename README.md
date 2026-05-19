# Premium FinLit App

A gamified financial literacy simulator designed for the South African market. Users learn financial management, investing, and wealth-building through interactive gameplay with culturally relevant scenarios and personas.

> "Umntu ngumntu ngabantu" — A person is a person through others.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19.2 + TypeScript 5.9 |
| Build Tool | Vite 7.2.4 (dev port 3000) |
| Styling | Tailwind CSS 3.4.19 + shadcn/ui (40+ components) |
| Animations | Framer Motion 12.38.0 |
| Charts | Recharts 2.15.4 + Chart.js 4.5.1 |
| Forms | React Hook Form + Zod 4.3.5 |
| Icons | Lucide React |
| Audio | Web Audio API (procedural, no library) |
| Persistence | localStorage (`finlit_save_v2`) |
| Routing | Manual page-state in App.tsx |
| Fonts | Playfair Display + Inter |

**Fully client-side — no backend or external API.**

---

## Getting Started

```bash
npm install
npm run dev       # dev server at http://localhost:3000
npm run build     # production build
npm run lint      # ESLint
```

---

## Key Features

| Screen | Purpose |
|---|---|
| Register | Onboarding — name, age, location |
| Mindset Select | Pick a learning path (Youth, Student, Corporate, etc.) |
| Dashboard | Net worth, XP, badges, health multiplier, progress |
| Learn | Educational modules + quizzes |
| Market | Buy/sell simulated JSE stocks (prices update every 5s) |
| Portfolio | View holdings + trading stats |
| Stokvel | Community rotating savings group simulator |
| Time Machine | 100-year compound interest wealth projection |
| B2B Shield (AntiScam) | Phishing/scam detection training |
| Wealthy Body | Health tracking (steps, sleep, heart rate) — boosts net worth |
| Emotion Tracker | Blocks impulse spending, tracks emotional discipline |
| Market Prophet | Bet on financial market predictions |
| Certificate | Achievement certificate on completion |
| Switch Mindset | Change path or hard reset |

---

## Architecture

### State Management
A single `useGameState` hook manages all app state: cash, shares, XP, badges, health metrics, community savings, market prices, and predictions. State auto-saves to localStorage on every mutation and rehydrates on mount.

### Mindset / Audience System
5 audiences (Youth, University, Corporate, Wealthy, Health-Conscious), each with 2+ mindsets (e.g. "Spaza Shop Owner", "Tech Entrepreneur"). Each mindset has unique modules, quiz questions, and market assets.

### Market Simulation
Stock prices update every 5 seconds using a random-walk model with a floor at 30% of base price to prevent collapse. Price history (last 60 ticks) is tracked for charting.

### Health Multiplier
Fitness metrics (steps, sleep, heart rate) are tracked and used to calculate a health multiplier that scales net worth — "healthy body = wealthy body."

### Audio
Procedural sound generation via the Web Audio API. Four sound types: drum (80 Hz), success chord (C-E-G), hymn (G-C-E), and click (1200 Hz). No audio library dependency.

---

## Project Structure

```
src/
├── components/
│   ├── ui/                  # 40+ shadcn/ui components
│   ├── Dashboard.tsx
│   ├── Learn.tsx
│   ├── Market.tsx
│   ├── Portfolio.tsx
│   ├── Stokvel.tsx
│   ├── TimeMachine.tsx
│   ├── AntiScam.tsx
│   ├── WealthyBody.tsx
│   ├── EmotionTracker.tsx
│   ├── MarketProphet.tsx
│   ├── Certificate.tsx
│   ├── Register.tsx
│   ├── MindsetSelect.tsx
│   ├── Sidebar.tsx
│   ├── MobileNav.tsx
│   ├── SplashScreen.tsx
│   └── SwitchMindset.tsx
├── hooks/
│   ├── useGameState.ts      # Primary state management
│   ├── useAudio.ts          # Web Audio API sounds
│   └── use-mobile.ts        # Responsive breakpoint detection
├── data/
│   └── mindsets.ts          # Audiences, modules, quiz questions, market assets
├── lib/
│   └── utils.ts             # cn() class utility
├── App.tsx                  # Root + page routing logic
├── main.tsx                 # Entry point
└── index.css                # Global styles + Tailwind directives
```

---

## Design System

- **Theme**: Dark (`#0A0A0F` background) with gold accents (`#D4AF37`)
- **Style**: Glass-morphism cards with backdrop-blur and semi-transparent borders
- **Cultural palette**: Xhosa-inspired colors — red, blue, yellow, teal, coral, purple, orange
- **Custom utilities**: `.glass-card`, `.btn-premium`, `.gold-text`, `.gold-gradient`

---

## Project Scale

- ~10,000+ lines of source code
- 50+ components, 3 custom hooks
- 5 audiences, 10+ mindsets
- 100+ quiz questions across all modules
- 25+ runtime dependencies
