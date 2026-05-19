import { useGameStore } from '@/shared/stores/gameStore';
import { useMarketStore } from '@/shared/stores/marketStore';

/**
 * Derived selector — computes net worth from cash + share holdings.
 * Subscribes only to the specific slices it needs so unrelated state
 * changes don't cause re-renders.
 */
export function useNetWorth(): number {
  const cash = useGameStore((s) => s.cash);
  const shares = useGameStore((s) => s.shares);
  const assets = useMarketStore((s) => s.assets);

  const sharesValue = Object.entries(shares).reduce((sum, [sym, qty]) => {
    const asset = assets.find((a) => a.symbol === sym);
    return sum + (asset ? qty * asset.price : 0);
  }, 0);

  return cash + sharesValue;
}
