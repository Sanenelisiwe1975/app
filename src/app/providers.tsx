import { type ReactNode, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import { Toaster } from 'sonner';
import i18n from '@/shared/i18n';
import { useMarketWorker } from '@/shared/hooks/useMarketWorker';
import { usePWA } from '@/shared/hooks/usePWA';
import { useUserStore } from '@/shared/stores/userStore';
import { useGameStore } from '@/shared/stores/gameStore';
import { useMarketStore } from '@/shared/stores/marketStore';
import { audiences } from '@/data/mindsets';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, staleTime: Infinity },
  },
});

/**
 * On boot, the userStore persists only the mindset ID (not the full object).
 * This component restores the full Mindset object from static data.
 */
function HydrationGuard() {
  const rawMindset = useUserStore((s) => s.mindset) as { id: string } | null;
  const audienceKey = useUserStore((s) => s.audienceKey);
  const setMindset = useUserStore((s) => s.setMindset);
  const cash = useGameStore((s) => s.cash);
  const initMindset = useGameStore((s) => s.initMindset);
  const resetAssets = useMarketStore((s) => s.resetAssets);

  useEffect(() => {
    if (!rawMindset?.id || !audienceKey) return;
    // Already a full object (has modules array) — no hydration needed
    if ('modules' in (rawMindset as object)) return;

    const audience = audiences[audienceKey];
    const full = audience?.mindsets.find((m) => m.id === rawMindset.id);
    if (full) {
      setMindset(full);
      // Only reset cash if it's at the uninitialized default
      if (cash === 0) initMindset(full.startCash);
      resetAssets();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally runs once on mount only

  return null;
}

/** Mounts/terminates the market Web Worker based on login state */
function MarketWorkerMount() {
  useMarketWorker();
  return null;
}

/** Registers the service worker and shows Sonner toasts for offline-ready / update-available events */
function PWAMount() {
  usePWA();
  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <HydrationGuard />
        <MarketWorkerMount />
        <PWAMount />
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            classNames: {
              toast: 'bg-dark-card border border-gold/20 text-white',
              title: 'font-semibold text-yellow-400',
            },
          }}
        />
      </QueryClientProvider>
    </I18nextProvider>
  );
}
