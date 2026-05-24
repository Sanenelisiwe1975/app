import { useEffect, useRef } from 'react';
import { useMarketStore } from '@/shared/stores/marketStore';
import { useUserStore } from '@/shared/stores/userStore';
import type { WorkerOutMessage } from '@/entities';

/**
 * Spawns the market simulation Web Worker when a user is logged in.
 * Automatically terminates it on logout or component unmount.
 * Mount this once at the app root via providers.tsx.
 */
export function useMarketWorker(): void {
  const workerRef = useRef<Worker | null>(null);
  const applyTick = useMarketStore((s) => s.applyTick);
  const setLive   = useMarketStore((s) => s.setLive);
  const user      = useUserStore((s) => s.user);

  useEffect(() => {
    if (!user) return;

    const worker = new Worker(
      new URL('../workers/market.worker.ts', import.meta.url),
      { type: 'module' }
    );
    workerRef.current = worker;

    worker.onmessage = (e: MessageEvent<WorkerOutMessage>) => {
      if (e.data.type === 'TICK') {
        applyTick(e.data.payload.assets);
      } else if (e.data.type === 'READY') {
        setLive(true);
      }
    };

    worker.onerror = (err) => {
      console.error('[useMarketWorker] Worker error:', err);
    };

    worker.postMessage({
      type: 'START',
      payload: { assets: useMarketStore.getState().assets, seed: Date.now() },
    });

    return () => {
      worker.postMessage({ type: 'STOP' });
      worker.terminate();
      workerRef.current = null;
      setLive(false);
    };
  }, [!!user]); // only restart when login state changes, not on every asset update
}
