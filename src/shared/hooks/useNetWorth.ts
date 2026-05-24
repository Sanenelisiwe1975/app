import { useMemo } from 'react';
import { useGameStore } from '@/shared/stores/gameStore';
import { useMarketStore } from '@/shared/stores/marketStore';

/**
 * Derived selector — computes net worth from cash + share holdings.
 * Subscribes only to the specific slices it needs (not the full stores),
 * and memoises the result so the reduction only re-runs when cash, shares,
 * or asset prices actually change.
 */
export function useNetWorth(): number {
  const cash   = useGameStore((s) => s.cash);
  const shares = useGameStore((s) => s.shares);
  const assets = useMarketStore((s) => s.assets);

  const sharesValue = useMemo(
    () =>
      Object.entries(shares).reduce((sum, [sym, qty]) => {
        const asset = assets.find((a) => a.symbol === sym);
        return sum + (asset ? qty * asset.price : 0);
      }, 0),
    [shares, assets]
  );

  return cash + sharesValue;
}
