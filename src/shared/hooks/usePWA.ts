import { useEffect, useRef } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { toast } from "sonner";

export function usePWA() {
  const {
    needRefresh: [needRefresh],
    offlineReady: [offlineReady],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(registration) {
      if (registration) {
        setInterval(() => { registration.update().catch(() => {}); }, 60 * 60 * 1000);
      }
    },
    onRegisterError(err) {
      console.error("[PWA] Service worker registration failed:", err);
    },
  });

  // Keep a stable ref so the effects below don't depend on the function identity
  const updateRef = useRef(updateServiceWorker);
  updateRef.current = updateServiceWorker;

  useEffect(() => {
    if (!offlineReady) return;
    toast.success("Ready to work offline", {
      description: "Isebenza ngaphandle kwenethiwekhi — all features available offline",
      duration: 5000,
    });
  }, [offlineReady]);

  useEffect(() => {
    if (!needRefresh) return;
    toast("New version available", {
      description: "Inguqulo entsha iyatholakala — a fresh update is ready to install.",
      duration: Infinity,
      action: {
        label: "Update now",
        onClick: () => updateRef.current(true),
      },
    });
  }, [needRefresh]);
}
