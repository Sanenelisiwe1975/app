import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getTradeHistory } from '@/shared/lib/db';
import { useMarketStore } from '@/shared/stores/marketStore';
import type { TradeRecord } from '@/entities';

/** Cache key for the full trade history list */
export const TRADE_HISTORY_KEY = ['tradeHistory'] as const;

/**
 * Fetches all trade records from IndexedDB via TanStack Query.
 * Automatically refreshes when the market tick count changes (i.e. after
 * each buy/sell that writes a new record).
 */
export function useTradeHistory(symbol?: string) {
  const tickCount = useMarketStore((s) => s.tickCount);

  return useQuery<TradeRecord[]>({
    queryKey: symbol ? [...TRADE_HISTORY_KEY, symbol] : TRADE_HISTORY_KEY,
    queryFn: () => getTradeHistory(symbol),
    // Re-fetch whenever tickCount changes so new trades appear immediately
    // without the user having to refresh. staleTime:0 ensures it always re-runs.
    staleTime: 0,
  });
}

/**
 * Returns a function that invalidates the trade history cache.
 * Call this after a buy or sell if you need an immediate refresh outside
 * of the automatic tickCount dependency.
 */
export function useInvalidateTradeHistory() {
  const client = useQueryClient();
  return () => client.invalidateQueries({ queryKey: TRADE_HISTORY_KEY });
}
