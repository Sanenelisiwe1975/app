import Dexie, { type Table } from 'dexie';
import type { TradeRecord } from '@/entities';

interface SavedState {
  key: string;
  value: unknown;
}

class FinLitDatabase extends Dexie {
  trades!: Table<TradeRecord, string>;
  state!: Table<SavedState, string>;

  constructor() {
    super('FinLitDB');
    this.version(1).stores({
      trades: 'id, symbol, type, timestamp',
      state: 'key',
    });
  }
}

export const db = new FinLitDatabase();

export async function persistState(key: string, value: unknown): Promise<void> {
  await db.state.put({ key, value });
}

export async function loadState<T>(key: string): Promise<T | null> {
  const row = await db.state.get(key);
  return (row?.value as T) ?? null;
}

export async function logTrade(trade: TradeRecord): Promise<void> {
  await db.trades.put(trade);
}

export async function getTradeHistory(symbol?: string): Promise<TradeRecord[]> {
  return symbol
    ? db.trades.where('symbol').equals(symbol).sortBy('timestamp')
    : db.trades.orderBy('timestamp').toArray();
}
