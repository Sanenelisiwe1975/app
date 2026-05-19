import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type {
  Community,
  HealthMetrics,
  Level,
  Prediction,
  ScamAttempt,
} from '@/entities';

// ─── Default State ─────────────────────────────────────────────────────────────

const DEFAULT_PREDICTIONS: Prediction[] = [
  { id: 0, question: 'Will SARB raise rates next month?',     options: ['Yes', 'No'], odds: [0.6, 0.4],   userBet: null, userBetAmount: 0, resolved: false },
  { id: 1, question: 'Will JSE close above 80,000 Friday?',  options: ['Yes', 'No'], odds: [0.5, 0.5],   userBet: null, userBetAmount: 0, resolved: false },
  { id: 2, question: 'Will Gold break R2,000/oz this month?', options: ['Yes', 'No'], odds: [0.45, 0.55], userBet: null, userBetAmount: 0, resolved: false },
  { id: 3, question: 'Will USD/ZAR reach 19.50?',            options: ['Yes', 'No'], odds: [0.35, 0.65], userBet: null, userBetAmount: 0, resolved: false },
];

const DEFAULT_COMMUNITY: Community = {
  type: 'rotating',
  members: 3,
  pot: 0,
  nextPayout: 0,
};

const DEFAULT_HEALTH: HealthMetrics = {
  steps: 5000,
  sleep: 7,
  heartRate: 72,
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface GameState {
  cash: number;
  shares: Record<string, number>;
  xp: number;
  badges: string[];
  completedModules: number[];
  level: Level;
  health: HealthMetrics;
  community: Community;
  phishingTotal: number;
  phishingCaught: number;
  customScams: ScamAttempt[];
  prophetBalance: number;
  predictions: Prediction[];
  totalTrades: number;
  profitableTrades: number;
  impulseSpendsBlocked: number;
}

interface GameActions {
  initMindset: (startCash: number) => void;
  addCash: (delta: number) => void;
  addXp: (delta: number) => void;
  addBadge: (badge: string) => void;
  completeModule: (id: number) => void;
  buyShares: (symbol: string, amount: number, price: number) => boolean;
  sellShares: (symbol: string, amount: number, price: number) => boolean;
  contributeStokvel: () => boolean;
  voteStokvel: () => void;
  recordPhishing: (correct: boolean) => void;
  addCustomScam: (scam: ScamAttempt) => void;
  syncHealth: () => void;
  placeBet: (id: number, option: 0 | 1, amount: number) => boolean;
  settlePredictions: () => void;
  blockImpulse: () => void;
  simulateImpulse: () => void;
  reset: () => void;
}

const INITIAL: GameState = {
  cash: 0,
  shares: {},
  xp: 0,
  badges: [],
  completedModules: [],
  level: 'beginner',
  health: DEFAULT_HEALTH,
  community: DEFAULT_COMMUNITY,
  phishingTotal: 0,
  phishingCaught: 0,
  customScams: [],
  prophetBalance: 1000,
  predictions: DEFAULT_PREDICTIONS.map((p) => ({ ...p })),
  totalTrades: 0,
  profitableTrades: 0,
  impulseSpendsBlocked: 0,
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useGameStore = create<GameState & GameActions>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...INITIAL,

        initMindset: (startCash) =>
          set(
            () => ({ ...INITIAL, cash: startCash, predictions: DEFAULT_PREDICTIONS.map((p) => ({ ...p })) }),
            false,
            'game/initMindset'
          ),

        addCash: (delta) =>
          set((s) => { s.cash = Math.max(0, s.cash + delta); }, false, 'game/addCash'),

        addXp: (delta) =>
          set((s) => { s.xp = Math.max(0, s.xp + delta); }, false, 'game/addXp'),

        addBadge: (badge) =>
          set((s) => {
            if (!s.badges.includes(badge)) s.badges.push(badge);
          }, false, 'game/addBadge'),

        completeModule: (id) =>
          set((s) => {
            if (!s.completedModules.includes(id)) {
              s.completedModules.push(id);
              s.xp += 100;
            }
          }, false, 'game/completeModule'),

        buyShares: (symbol, amount, price) => {
          const cost = amount * price;
          if (get().cash < cost) return false;
          set((s) => {
            s.cash -= cost;
            s.shares[symbol] = (s.shares[symbol] ?? 0) + amount;
            s.totalTrades += 1;
          }, false, 'game/buyShares');
          return true;
        },

        sellShares: (symbol, amount, price) => {
          if ((get().shares[symbol] ?? 0) < amount) return false;
          set((s) => {
            s.cash += amount * price;
            s.shares[symbol] -= amount;
            if (s.shares[symbol] === 0) delete s.shares[symbol];
            s.totalTrades += 1;
            s.profitableTrades += 1;
          }, false, 'game/sellShares');
          return true;
        },

        contributeStokvel: () => {
          if (get().cash < 100) return false;
          set((s) => {
            s.cash -= 100;
            const newPot = s.community.pot + 100 * s.community.members;
            if (newPot >= 2000 && s.community.type === 'rotating') {
              s.cash += newPot / s.community.members;
              s.community.pot = 0;
              s.community.nextPayout = (s.community.nextPayout + 1) % s.community.members;
              s.xp += 20;
            } else {
              s.community.pot = newPot;
            }
          }, false, 'game/contributeStokvel');
          return true;
        },

        voteStokvel: () =>
          set((s) => {
            if (s.community.pot <= 0) return;
            s.cash += s.community.pot / s.community.members;
            s.community.pot = 0;
            s.community.nextPayout = (s.community.nextPayout + 1) % s.community.members;
            s.xp += 10;
          }, false, 'game/voteStokvel'),

        recordPhishing: (correct) =>
          set((s) => {
            s.phishingTotal += 1;
            if (correct) {
              s.phishingCaught += 1;
              s.cash += 200;
              s.xp += 15;
            } else {
              s.cash = Math.max(0, s.cash - 500);
              s.xp = Math.max(0, s.xp - 10);
            }
          }, false, 'game/recordPhishing'),

        addCustomScam: (scam) =>
          set((s) => { s.customScams.push(scam); }, false, 'game/addCustomScam'),

        syncHealth: () =>
          set((s) => {
            s.health.steps = Math.floor(Math.random() * 12000);
            s.health.sleep = 4 + Math.random() * 5;
            s.health.heartRate = 60 + Math.floor(Math.random() * 40);
            s.xp += 5;
          }, false, 'game/syncHealth'),

        placeBet: (id, option, amount) => {
          if (get().prophetBalance < amount) return false;
          set((s) => {
            s.prophetBalance -= amount;
            const pred = s.predictions.find((p) => p.id === id);
            if (pred) {
              pred.userBet = option;
              pred.userBetAmount = amount;
            }
          }, false, 'game/placeBet');
          return true;
        },

        settlePredictions: () =>
          set((s) => {
            s.predictions.forEach((pred) => {
              if (pred.userBet === null || pred.resolved) return;
              const outcome: 0 | 1 = Math.random() < pred.odds[0] ? 0 : 1;
              pred.outcome = outcome;
              pred.resolved = true;
              if (pred.userBet === outcome) {
                s.prophetBalance += pred.userBetAmount * (1 / pred.odds[outcome]);
              }
            });
            s.xp += 20;
          }, false, 'game/settlePredictions'),

        blockImpulse: () =>
          set((s) => {
            s.impulseSpendsBlocked += 1;
            s.cash += 200;
            s.xp += 10;
          }, false, 'game/blockImpulse'),

        simulateImpulse: () =>
          set((s) => {
            const stress = Math.min(100, (s.health.heartRate - 60) * 2);
            if (stress <= 50) s.cash = Math.max(0, s.cash - 500);
          }, false, 'game/simulateImpulse'),

        reset: () =>
          set(
            () => ({ ...INITIAL, predictions: DEFAULT_PREDICTIONS.map((p) => ({ ...p })) }),
            false,
            'game/reset'
          ),
      })),
      { name: 'finlit-game-v1' }
    ),
    { name: 'GameStore', enabled: import.meta.env.DEV }
  )
);

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectHealthMultiplier = (s: GameState) =>
  1 +
  (Math.min(10_000, s.health.steps) / 10_000) * 0.2 +
  (Math.min(8, s.health.sleep) / 8) * 0.1;
