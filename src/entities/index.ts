// ─── User Domain ──────────────────────────────────────────────────────────────

export type AudienceKey = 'youth' | 'university' | 'corporate' | 'wealthy' | 'health';
export type Level = 'beginner' | 'intermediate' | 'advanced';

export interface User {
  readonly name: string;
  readonly surname: string;
  readonly age: string;
  readonly location: string;
  readonly audience: AudienceKey;
  readonly mindset: string;
}

// ─── Market Domain ────────────────────────────────────────────────────────────

export interface MarketAsset {
  readonly symbol: string;
  readonly name: string;
  price: number;
  history: number[];
  readonly basePrice: number;
  readonly volatility: number;
  priceChangePct: number;
}

export type TradeType = 'buy' | 'sell';

export interface TradeRecord {
  readonly id: string;
  readonly symbol: string;
  readonly type: TradeType;
  readonly amount: number;
  readonly price: number;
  readonly timestamp: number;
}

// ─── Game Domain ──────────────────────────────────────────────────────────────

export type CommunityType = 'rotating' | 'savings' | 'investment';

export interface Community {
  type: CommunityType;
  members: number;
  pot: number;
  nextPayout: number;
}

export interface HealthMetrics {
  steps: number;
  sleep: number;
  heartRate: number;
}

export interface Prediction {
  readonly id: number;
  readonly question: string;
  readonly options: readonly [string, string];
  readonly odds: readonly [number, number];
  userBet: 0 | 1 | null;
  userBetAmount: number;
  resolved: boolean;
  outcome?: 0 | 1;
}

export interface ScamAttempt {
  text: string;
  sender: string;
  correctAction: string;
}

// ─── Worker Message Protocol ──────────────────────────────────────────────────

export type WorkerInMessage =
  | { type: 'START'; payload: { assets: MarketAsset[]; seed: number } }
  | { type: 'STOP' }
  | { type: 'RESET'; payload: { assets: MarketAsset[] } };

export type WorkerOutMessage =
  | { type: 'TICK'; payload: { assets: MarketAsset[] } }
  | { type: 'READY' };
