/**
 * Market simulation Web Worker.
 * Runs the price tick loop entirely off the main thread so it never
 * blocks rendering or user interactions.
 *
 * Uses a seeded xorshift32 PRNG — deterministic and fast, no Math.random().
 */
import type { MarketAsset, WorkerInMessage, WorkerOutMessage } from '@/entities';

// Seeded PRNG — same seed produces identical price sequences (useful for replays)
function xorshift32(seed: number) {
  let s = seed >>> 0 || 1;
  return (): number => {
    s ^= s << 13;
    s ^= s >> 17;
    s ^= s << 5;
    return (s >>> 0) / 0xffffffff; // [0, 1)
  };
}

const TICK_MS = 5_000;
const HISTORY_LIMIT = 60;

let assets: MarketAsset[] = [];
let rand = xorshift32(Date.now());
let timer: ReturnType<typeof setInterval> | null = null;

function tick(): void {
  assets = assets.map((asset) => {
    const change = (rand() - 0.5) * 2 * asset.volatility * asset.price;
    const newPrice = Math.max(asset.basePrice * 0.3, asset.price + change);
    const priceChangePct = ((newPrice - asset.price) / asset.price) * 100;
    const history = [...asset.history.slice(-(HISTORY_LIMIT - 1)), newPrice];
    return { ...asset, price: newPrice, priceChangePct, history };
  });

  const msg: WorkerOutMessage = { type: 'TICK', payload: { assets } };
  self.postMessage(msg);
}

self.onmessage = (e: MessageEvent<WorkerInMessage>): void => {
  const msg = e.data;

  switch (msg.type) {
    case 'START': {
      assets = msg.payload.assets;
      rand = xorshift32(msg.payload.seed);
      if (!timer) timer = setInterval(tick, TICK_MS);
      const ready: WorkerOutMessage = { type: 'READY' };
      self.postMessage(ready);
      break;
    }
    case 'STOP': {
      if (timer) { clearInterval(timer); timer = null; }
      break;
    }
    case 'RESET': {
      assets = msg.payload.assets;
      break;
    }
    default: {
      // Exhaustiveness check — TS will error here if a new message type is added without handling it
      const _exhaustive: never = msg;
      console.warn('[market.worker] Unknown message type', _exhaustive);
    }
  }
};
