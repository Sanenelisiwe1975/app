# Premium FinLit App

A gamified financial literacy simulator built for the South African market. Users learn financial management, investing, and wealth-building through interactive gameplay with culturally relevant scenarios, personas, and languages.

> "Umntu ngumntu ngabantu" — A person is a person through others.

---

## Getting Started

```bash
npm install
npm run dev        # dev server at http://localhost:5173
npm run build      # production build → dist/
npm run preview    # preview production build locally
npm run test       # run all tests
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19.2 + TypeScript 5.9 |
| Build Tool | Vite 7.2 |
| Styling | Tailwind CSS 3.4 + shadcn/ui |
| Animations | Framer Motion 12 |
| State | Zustand 5 (immer + persist + devtools) |
| Server State | TanStack Query 5 |
| Persistence | Dexie.js (IndexedDB) + Zustand persist (localStorage) |
| Charts | Chart.js 4.5 |
| i18n | i18next + react-i18next (EN, ZU, XH, ST, AF) |
| PWA | vite-plugin-pwa + Workbox (44 precached entries) |
| Audio | Web Audio API (procedural, no library) |
| Testing | Vitest + Testing Library + fake-indexeddb |
| Icons | Lucide React |
| Fonts | Playfair Display + Inter |

**Fully client-side — no backend or external API.**

---

## Key Features

| Screen | Purpose |
|---|---|
| Splash Screen | Animated golden orb + 7-bead beadwork progress bar |
| Welcome Video | First-time Wamkelekile greeting (video or branded fallback) |
| Register | Onboarding — name, age, location, audience selection |
| Mindset Select | Choose one of 17 learning paths across 5 audience categories; each includes a load shedding module |
| Dashboard | Net worth, XP, badges, health multiplier, module progress |
| Learn | Educational modules + scenario-based quizzes with instant feedback |
| Market | Buy/sell simulated JSE stocks; live chart; MA signal indicator |
| Portfolio | Holdings, trade history (from IndexedDB), performance stats |
| Stokvel | Community rotating savings simulator with payout voting |
| Time Machine | 100-year compound interest wealth projection |
| B2B Shield | 20 phishing and scam detection scenarios across 6 categories |
| Wealthy Body | Health tracking (steps, sleep, heart rate) — boosts net worth |
| Emotion Tracker | Blocks impulse spending, tracks emotional discipline |
| Market Prophet | Bet on financial market predictions |
| Certificate | Verified achievement certificate with SHA-256 ID + expiring QR code |
| Energy Resilience | 10-industry load-shedding cost modeller — backup solution TCO, ROI calculator, Section 12B tax tip |
| Invite & Earn | Generate shareable QR codes + deep links; rewards R500 + 50 XP per successful referral |
| Switch Mindset | Change learning path or hard reset |

---

## Architecture

### Feature-Sliced Design (FSD)

```
src/
├── app/
│   └── providers.tsx          # QueryClient, i18n, MarketWorker, Toaster
├── entities/
│   └── index.ts               # Core domain types (User, MarketAsset, TradeRecord, …)
├── features/
│   ├── auth/ui/               # Register, MindsetSelect, SwitchMindset
│   ├── certificate/ui/        # Certificate (SHA-256 + QR)
│   ├── dashboard/ui/          # Dashboard
│   ├── learn/ui/              # Learn (modules + quizzes)
│   ├── market/ui/             # Market (chart, buy/sell)
│   ├── portfolio/ui/          # Portfolio (holdings + trade history)
│   ├── stokvel/ui/            # Stokvel
│   ├── time-machine/ui/       # TimeMachine
│   ├── anti-scam/ui/          # AntiScam
│   ├── wealthy-body/ui/       # WealthyBody
│   ├── emotion-tracker/ui/    # EmotionTracker
│   ├── market-prophet/ui/     # MarketProphet
│   ├── energy-resilience/ui/  # EnergyResilience (load-shedding ROI modeller)
│   └── invite/ui/             # InviteQR (QR code referral system)
├── widgets/
│   ├── sidebar/               # Desktop navigation (5-language switcher)
│   ├── mobile-nav/            # Mobile bottom nav (5-language switcher)
│   ├── splash/                # SplashScreen
│   └── welcome-video/         # WelcomeVideo (Wamkelekile)
├── shared/
│   ├── stores/                # gameStore, userStore, marketStore, uiStore
│   ├── hooks/                 # useNetWorth, useTradeHistory, useMarketWorker, useAudio, useInviteSystem
│   ├── workers/               # market.worker.ts (Web Worker price simulation)
│   ├── lib/                   # db.ts (Dexie), formatters.ts
│   ├── i18n/                  # i18next setup + en/zu/xh/st/af locale files
│   └── ui/                    # ErrorBoundary, EasyEquitiesPrompt
└── data/
    └── mindsets.ts            # 17 mindsets, 530 quiz questions, market assets
```

### State Management — 4 Zustand Stores

| Store | Owns |
|---|---|
| `userStore` | User profile, selected mindset, audienceKey, `hasSeenWelcome` |
| `gameStore` | Cash, shares, XP, badges, health, stokvel, predictions, trade stats |
| `marketStore` | Assets, active symbol, price history, tick count |
| `uiStore` | Current page, sidebar state, active modal |

All stores use `immer` (immutable updates) + `persist` (localStorage) + `devtools`.

### Market Simulation

Prices are generated in a **Web Worker** (`market.worker.ts`) using an xorshift32 seeded PRNG, keeping simulation off the main thread. The worker handles `START`, `STOP`, and `RESET` messages. It is spawned and terminated based on user login state via `useMarketWorker`.

### Trade History

Every buy/sell calls `logTrade()` (fire-and-forget) which writes to **Dexie.js IndexedDB**. The Portfolio page reads this via `useTradeHistory()` — a TanStack Query hook that revalidates on every market tick.

### Certificate

- **SHA-256 fingerprint** generated via `crypto.subtle.digest` (Web Crypto API — no library)
- **QR code** (qrcode.react) encodes a JSON payload: certId, hash, holder, mindset, timestamps, issuer
- QR expires **1 hour** after issue; a Refresh button regenerates it
- Certificate downloads as PNG via html2canvas

### EasyEquities Integration

`EasyEquitiesPrompt` (inline and modal variants) appears at strategic moments:

| Trigger | Where |
|---|---|
| `trade` | Market page — after every 3rd buy or sell |
| `module` | Learn page — after a perfect quiz score |
| `networth` | Dashboard — once net worth crosses R10,000 |
| `stokvel` | Stokvel page — after a vote-payout action |

### Mindsets

**17 mindsets** across 5 audience paths, each with **6 modules** (5 business/finance modules + 1 load shedding impact module) and 5 quiz questions per module — **510 mindset quiz questions** plus 20 shared module questions = **530 total**.

| Audience | Mindsets |
|---|---|
| Youth Entrepreneur | Spaza Shop Owner, Taxi Owner, Street Food Vendor |
| University Student | Engineering, Accounting, Law, Medical |
| Corporate Professional | Restaurateur, Salon Owner, Logistics Director, E-commerce CEO |
| Wealth Builder | Mining Magnate, Property Tycoon, Tech Titan |
| Professional Health | Doctor, Dentist, Physiotherapist |

Each load shedding module (IDs 201-217) covers cost impact on the specific business type, practical workarounds, and tax treatment of backup power infrastructure.

### Internationalisation

Five locale files: EN (English), ZU (isiZulu), XH (isiXhosa), ST (Sesotho), AF (Afrikaans). Language toggle available in the desktop sidebar and mobile bottom nav. Falls back to English for any missing key.

### PWA

Configured with vite-plugin-pwa + Workbox. 44 entries precached. Installable on Android and desktop. Offline-capable for all precached pages.

---

## Design System

- **Theme**: Dark (`#0A0A0F` background) with gold accents (`#D4AF37`)
- **Style**: Glass-morphism cards with `backdrop-blur` and semi-transparent borders
- **Cultural palette**: Xhosa-inspired — red, blue, yellow, teal, coral, purple, orange
- **Key utilities**: `.glass-card`, `.btn-premium`, `.gold-text`, `.beadwork-bar`, `.splash-orb`

---

## Testing

```bash
npm run test            # run all tests once
npm run test:watch      # watch mode
npm run test:coverage   # coverage report
```

32 tests across 4 store test files (`gameStore`, `userStore`, `marketStore`, `uiStore`). `fake-indexeddb` provides IndexedDB in the jsdom test environment.

---

## Project Scale

- ~16,000+ lines of source code
- 17 mindsets × 6 modules × 5 questions = 510 mindset quiz questions + 20 shared = **530 total**
- 20 AntiScam scenarios across 6 scam categories
- 16 lazy-loaded pages (code-split per route)
- 4 Zustand stores, 7 custom hooks
- Main bundle: ~455 kB (151 kB gzip)
- 61 PWA precache entries
