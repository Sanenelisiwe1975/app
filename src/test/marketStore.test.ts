import { describe, it, expect, beforeEach } from 'vitest';
import { useMarketStore } from '@/shared/stores/marketStore';
import type { MarketAsset } from '@/entities';

const MOCK_ASSETS: MarketAsset[] = [
  { symbol: 'JSE', name: 'JSE All Share', price: 78000, history: [77000, 78000], basePrice: 78000, volatility: 0.008, priceChangePct: 0 },
  { symbol: 'GLD', name: 'Gold Rand',     price: 1850,  history: [1800, 1850],   basePrice: 1850,  volatility: 0.012, priceChangePct: 0 },
];

beforeEach(() => {
  useMarketStore.getState().resetAssets();
});

//setActiveSymbol

describe('setActiveSymbol', () => {
  it('updates the active symbol', () => {
    useMarketStore.getState().setActiveSymbol('GLD');
    expect(useMarketStore.getState().activeSymbol).toBe('GLD');
  });
});

// applyTick

describe('applyTick', () => {
  it('replaces assets and increments tickCount', () => {
    const before = useMarketStore.getState().tickCount;
    useMarketStore.getState().applyTick(MOCK_ASSETS);
    const { assets, tickCount } = useMarketStore.getState();
    expect(tickCount).toBe(before + 1);
    expect(assets[0].symbol).toBe('JSE');
    expect(assets[0].price).toBe(78000);
  });
});

// resetAssets

describe('resetAssets', () => {
  it('resets tickCount to 0 and regenerates assets', () => {
    useMarketStore.getState().applyTick(MOCK_ASSETS);
    useMarketStore.getState().resetAssets();
    expect(useMarketStore.getState().tickCount).toBe(0);
    // Assets should be re-initialised from the static marketAssets list
    expect(useMarketStore.getState().assets.length).toBeGreaterThan(0);
  });
});

// setLive

describe('setLive', () => {
  it('toggles the live flag', () => {
    expect(useMarketStore.getState().isLive).toBe(false);
    useMarketStore.getState().setLive(true);
    expect(useMarketStore.getState().isLive).toBe(true);
    useMarketStore.getState().setLive(false);
    expect(useMarketStore.getState().isLive).toBe(false);
  });
});

// selectActiveAsset

describe('selectActiveAsset', () => {
  it('returns the asset matching activeSymbol', async () => {
    const { selectActiveAsset } = await import('@/shared/stores/marketStore');
    useMarketStore.getState().applyTick(MOCK_ASSETS);
    useMarketStore.getState().setActiveSymbol('GLD');
    const active = selectActiveAsset(useMarketStore.getState());
    expect(active.symbol).toBe('GLD');
  });

  it('falls back to the first asset if symbol not found', async () => {
    const { selectActiveAsset } = await import('@/shared/stores/marketStore');
    useMarketStore.getState().applyTick(MOCK_ASSETS);
    useMarketStore.getState().setActiveSymbol('UNKNOWN');
    const active = selectActiveAsset(useMarketStore.getState());
    expect(active.symbol).toBe('JSE');
  });
});
