import { useState, useCallback, useEffect } from "react";
import { audiences, marketAssets } from "@/data/mindsets";
import type { Mindset, Module } from "@/data/mindsets";

export interface User {
  name: string;
  surname: string;
  age: string;
  location: string;
  audience: string;
  mindset: string;
}

export interface Community {
  type: string;
  members: number;
  pot: number;
  nextPayout: number;
}

export interface Prediction {
  id: number;
  question: string;
  options: string[];
  odds: number[];
  userBet: number | null;
  userBetAmount: number;
  resolved: boolean;
}

export interface ScamAttempt {
  text: string;
  sender: string;
  correctAction: string;
}

export interface MarketAssetState {
  symbol: string;
  name: string;
  price: number;
  history: number[];
  basePrice: number;
  volatility: number;
}

export interface GameState {
  user: User | null;
  selectedAudience: string | null;
  selectedMindsetObj: Mindset | null;
  cash: number;
  shares: Record<string, number>;
  xp: number;
  badges: string[];
  completedModules: number[];
  currentLevel: string;
  healthSteps: number;
  healthSleep: number;
  heartRate: number;
  community: Community;
  phishingTotal: number;
  phishingCaught: number;
  customScams: ScamAttempt[];
  prophetBalance: number;
  predictions: Prediction[];
  marketAssetsState: MarketAssetState[];
  currentAssetSymbol: string;
  currentModules: Module[];
  totalTrades: number;
  profitableTrades: number;
  impulseSpendsBlocked: number;
}

const defaultPredictions: Prediction[] = [
  { id: 0, question: "Will SARB raise rates next month?", options: ["Yes", "No"], odds: [0.6, 0.4], userBet: null, userBetAmount: 0, resolved: false },
  { id: 1, question: "Will JSE close above 80,000 Friday?", options: ["Yes", "No"], odds: [0.5, 0.5], userBet: null, userBetAmount: 0, resolved: false },
  { id: 2, question: "Will Gold break R2,000/oz this month?", options: ["Yes", "No"], odds: [0.45, 0.55], userBet: null, userBetAmount: 0, resolved: false },
  { id: 3, question: "Will USD/ZAR reach 19.50?", options: ["Yes", "No"], odds: [0.35, 0.65], userBet: null, userBetAmount: 0, resolved: false },
];

function initMarketAssets(): MarketAssetState[] {
  return marketAssets.map(a => ({
    symbol: a.symbol,
    name: a.name,
    price: a.basePrice + (Math.random() - 0.5) * a.basePrice * 0.02,
    history: Array(40).fill(0).map(() => a.basePrice + (Math.random() - 0.5) * a.basePrice * 0.04),
    basePrice: a.basePrice,
    volatility: a.volatility,
  }));
}

const defaultState: GameState = {
  user: null,
  selectedAudience: null,
  selectedMindsetObj: null,
  cash: 0,
  shares: {},
  xp: 0,
  badges: [],
  completedModules: [],
  currentLevel: "beginner",
  healthSteps: 5000,
  healthSleep: 7,
  heartRate: 72,
  community: { type: "rotating", members: 3, pot: 0, nextPayout: 0 },
  phishingTotal: 0,
  phishingCaught: 0,
  customScams: [],
  prophetBalance: 1000,
  predictions: defaultPredictions.map(p => ({ ...p })),
  marketAssetsState: initMarketAssets(),
  currentAssetSymbol: "JSE",
  currentModules: [],
  totalTrades: 0,
  profitableTrades: 0,
  impulseSpendsBlocked: 0,
};

export function useGameState() {
  const [state, setState] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem("finlit_save_v2");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Restore mindset object from ID
        if (parsed.selectedAudience && parsed.selectedMindsetObj?.id) {
          const aud = audiences[parsed.selectedAudience];
          if (aud) {
            const mindset = aud.mindsets.find(m => m.id === parsed.selectedMindsetObj.id);
            if (mindset) {
              parsed.selectedMindsetObj = mindset;
              parsed.currentModules = mindset.modules;
            }
          }
        }
        if (!parsed.marketAssetsState || parsed.marketAssetsState.length === 0) {
          parsed.marketAssetsState = initMarketAssets();
        }
        if (!parsed.predictions || parsed.predictions.length === 0) {
          parsed.predictions = defaultPredictions.map(p => ({ ...p }));
        }
        return { ...defaultState, ...parsed };
      }
    } catch (e) {
      console.error("Failed to load save", e);
    }
    return defaultState;
  });

  useEffect(() => {
    localStorage.setItem("finlit_save_v2", JSON.stringify(state));
  }, [state]);

  const setUser = useCallback((user: User | null) => setState(s => ({ ...s, user })), []);
  const setAudience = useCallback((selectedAudience: string | null) => setState(s => ({ ...s, selectedAudience })), []);
  const setMindset = useCallback((selectedMindsetObj: Mindset | null) => {
    setState(s => ({
      ...s,
      selectedMindsetObj,
      currentModules: selectedMindsetObj ? selectedMindsetObj.modules.map(m => ({ ...m })) : [],
      cash: selectedMindsetObj ? selectedMindsetObj.startCash : s.cash,
      shares: selectedMindsetObj ? {} : s.shares,
      completedModules: [],
      badges: [],
      xp: 0,
      prophetBalance: 1000,
      totalTrades: 0,
      profitableTrades: 0,
      impulseSpendsBlocked: 0,
      marketAssetsState: initMarketAssets(),
      currentAssetSymbol: "JSE",
    }));
  }, []);

  const updateCash = useCallback((delta: number) => setState(s => ({ ...s, cash: Math.max(0, s.cash + delta) })), []);
  const updateXp = useCallback((delta: number) => setState(s => ({ ...s, xp: Math.max(0, s.xp + delta) })), []);
  const addBadge = useCallback((badge: string) => setState(s => {
    if (s.badges.includes(badge)) return s;
    return { ...s, badges: [...s.badges, badge] };
  }), []);
  const completeModule = useCallback((moduleId: number) => setState(s => {
    if (s.completedModules.includes(moduleId)) return s;
    return { ...s, completedModules: [...s.completedModules, moduleId], xp: s.xp + 100 };
  }), []);

  const buyShares = useCallback((symbol: string, amount: number, price: number) => {
    setState(s => {
      const cost = amount * price;
      if (s.cash < cost) return s;
      const current = s.shares[symbol] || 0;
      return {
        ...s,
        cash: s.cash - cost,
        shares: { ...s.shares, [symbol]: current + amount },
        totalTrades: s.totalTrades + 1,
      };
    });
  }, []);

  const sellShares = useCallback((symbol: string, amount: number, price: number) => {
    setState(s => {
      const current = s.shares[symbol] || 0;
      if (current < amount) return s;
      const revenue = amount * price;
      const newShares = { ...s.shares, [symbol]: current - amount };
      if (newShares[symbol] === 0) delete newShares[symbol];
      return {
        ...s,
        cash: s.cash + revenue,
        shares: newShares,
        totalTrades: s.totalTrades + 1,
      };
    });
  }, []);

  const updateMarketPrices = useCallback(() => {
    setState(s => {
      const updated = s.marketAssetsState.map(asset => {
        const change = (Math.random() - 0.5) * 2 * asset.volatility * asset.price;
        const newPrice = Math.max(asset.basePrice * 0.3, asset.price + change);
        const newHistory = [...asset.history.slice(-59), newPrice];
        return { ...asset, price: newPrice, history: newHistory };
      });
      return { ...s, marketAssetsState: updated };
    });
  }, []);

  const setCurrentAsset = useCallback((symbol: string) => setState(s => ({ ...s, currentAssetSymbol: symbol })), []);

  const contributeStokvel = useCallback(() => {
    setState(s => {
      if (s.cash < 100) return s;
      const newPot = s.community.pot + 100 * s.community.members;
      let newCash = s.cash - 100;
      let newNext = s.community.nextPayout;
      if (newPot >= 2000 && s.community.type === "rotating") {
        const payout = newPot / s.community.members;
        newCash += payout;
        newNext = (s.community.nextPayout + 1) % s.community.members;
        return {
          ...s,
          cash: newCash,
          community: { ...s.community, pot: 0, nextPayout: newNext },
          xp: s.xp + 20,
        };
      }
      return {
        ...s,
        cash: newCash,
        community: { ...s.community, pot: newPot, nextPayout: newNext },
      };
    });
  }, []);

  const voteStokvel = useCallback(() => {
    setState(s => {
      if (s.community.pot <= 0) return s;
      const payout = s.community.pot / s.community.members;
      return {
        ...s,
        cash: s.cash + payout,
        community: { ...s.community, pot: 0, nextPayout: (s.community.nextPayout + 1) % s.community.members },
        xp: s.xp + 10,
      };
    });
  }, []);

  const recordPhishing = useCallback((correct: boolean) => {
    setState(s => ({
      ...s,
      phishingTotal: s.phishingTotal + 1,
      phishingCaught: s.phishingCaught + (correct ? 1 : 0),
      cash: correct ? s.cash + 200 : Math.max(0, s.cash - 500),
      xp: correct ? s.xp + 15 : Math.max(0, s.xp - 10),
    }));
  }, []);

  const addCustomScam = useCallback((scam: ScamAttempt) => {
    setState(s => ({ ...s, customScams: [...s.customScams, scam] }));
  }, []);

  const syncHealth = useCallback(() => {
    setState(s => ({
      ...s,
      healthSteps: Math.floor(Math.random() * 12000),
      healthSleep: 4 + Math.random() * 5,
      heartRate: 60 + Math.floor(Math.random() * 40),
      xp: s.xp + 5,
    }));
  }, []);

  const placeBet = useCallback((id: number, option: number, amount: number) => {
    setState(s => {
      if (amount > s.prophetBalance) return s;
      const preds = s.predictions.map(p =>
        p.id === id ? { ...p, userBet: option, userBetAmount: amount } : p
      );
      return { ...s, prophetBalance: s.prophetBalance - amount, predictions: preds };
    });
  }, []);

  const settlePredictions = useCallback(() => {
    setState(s => {
      let balance = s.prophetBalance;
      const preds = s.predictions.map(p => {
        if (p.userBet === null || p.resolved) return p;
        const outcome = Math.random() < p.odds[0] ? 0 : 1;
        if (p.userBet === outcome) {
          const win = p.userBetAmount * (1 / p.odds[outcome]);
          balance += win;
        }
        return { ...p, resolved: true };
      });
      return { ...s, prophetBalance: balance, predictions: preds, xp: s.xp + 20 };
    });
  }, []);

  const blockImpulse = useCallback(() => {
    setState(s => ({ ...s, impulseSpendsBlocked: s.impulseSpendsBlocked + 1, cash: s.cash + 200, xp: s.xp + 10 }));
  }, []);

  const simulateImpulse = useCallback(() => {
    setState(s => {
      const stress = Math.min(100, (s.heartRate - 60) * 2);
      if (stress > 50) {
        return { ...s };
      }
      return { ...s, cash: s.cash - 500 };
    });
  }, []);

  const hardReset = useCallback(() => {
    localStorage.removeItem("finlit_save_v2");
    setState(defaultState);
  }, []);

  const getNetWorth = useCallback(() => {
    const sharesValue = Object.entries(state.shares).reduce((sum, [sym, amt]) => {
      const asset = state.marketAssetsState.find(a => a.symbol === sym);
      return sum + (asset ? amt * asset.price : 0);
    }, 0);
    return state.cash + sharesValue;
  }, [state.cash, state.shares, state.marketAssetsState]);

  const getHealthMultiplier = useCallback(() => {
    return 1 + (Math.min(10000, state.healthSteps) / 10000) * 0.2 + (Math.min(8, state.healthSleep) / 8) * 0.1;
  }, [state.healthSteps, state.healthSleep]);

  return {
    state,
    setUser,
    setAudience,
    setMindset,
    updateCash,
    updateXp,
    addBadge,
    completeModule,
    buyShares,
    sellShares,
    updateMarketPrices,
    setCurrentAsset,
    contributeStokvel,
    voteStokvel,
    recordPhishing,
    addCustomScam,
    syncHealth,
    placeBet,
    settlePredictions,
    blockImpulse,
    simulateImpulse,
    hardReset,
    getNetWorth,
    getHealthMultiplier,
  };
}
