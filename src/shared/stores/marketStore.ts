import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { marketAssets } from '@/data/mindsets';
import type { MarketAsset } from '@/entities';

function buildInitialAssets(): MarketAsset[] {
  return marketAssets.map((a) => ({
    symbol: a.symbol,
    name: a.name,
    basePrice: a.basePrice,
    volatility: a.volatility,
    price: a.basePrice * (1 + (Math.random() - 0.5) * 0.02),
    history: Array.from({ length: 40 }, () =>
      a.basePrice * (1 + (Math.random() - 0.5) * 0.04)
    ),
    priceChangePct: 0,
  }));
}

interface MarketState {
  assets: MarketAsset[];
  activeSymbol: string;
  isLive: boolean;
  tickCount: number;
}

interface MarketActions {
  applyTick: (updated: MarketAsset[]) => void;
  setActiveSymbol: (symbol: string) => void;
  setLive: (live: boolean) => void;
  resetAssets: () => void;
}

export const useMarketStore = create<MarketState & MarketActions>()(
  devtools(
    immer((set) => ({
      assets: buildInitialAssets(),
      activeSymbol: 'JSE',
      isLive: false,
      tickCount: 0,

      applyTick: (updated) =>
        set((s) => {
          s.assets = updated;
          s.tickCount += 1;
        }, false, 'market/applyTick'),

      setActiveSymbol: (symbol) =>
        set((s) => { s.activeSymbol = symbol; }, false, 'market/setActiveSymbol'),

      setLive: (live) =>
        set((s) => { s.isLive = live; }, false, 'market/setLive'),

      resetAssets: () =>
        set((s) => {
          s.assets = buildInitialAssets();
          s.tickCount = 0;
        }, false, 'market/resetAssets'),
    })),
    { name: 'MarketStore', enabled: import.meta.env.DEV }
  )
);

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectActiveAsset = (s: MarketState & MarketActions): MarketAsset =>
  s.assets.find((a) => a.symbol === s.activeSymbol) ?? s.assets[0];
