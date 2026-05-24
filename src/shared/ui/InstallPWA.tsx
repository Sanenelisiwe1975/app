import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "finlit_pwa_install_dismissed";
// Show prompt 10 s after splash clears — avoids competing with onboarding
const SHOW_DELAY_MS = 10_000;

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY)) return;

    let timer: ReturnType<typeof setTimeout>;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      timer = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      clearTimeout(timer);
    };
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setVisible(false);
      setDeferredPrompt(null);
    }
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="install-pwa"
          initial={{ opacity: 0, y: 72, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 72, scale: 0.92 }}
          transition={{ type: "spring", stiffness: 280, damping: 22 }}
          className="fixed bottom-20 left-4 right-4 z-[9990] md:left-auto md:right-6 md:bottom-6 md:w-80"
        >
          <div
            className="relative rounded-2xl p-4 overflow-hidden"
            style={{
              background: "rgba(18, 16, 14, 0.94)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(212,175,55,0.32)",
              boxShadow: "0 12px 40px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(212,175,55,0.08)",
            }}
          >
            {/* Gold shimmer line */}
            <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent" />

            <button
              type="button"
              onClick={handleDismiss}
              className="absolute top-3 right-3 text-white/25 hover:text-white/60 transition-colors"
              aria-label="Dismiss install prompt"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-3 pr-5">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, rgba(212,175,55,0.22), rgba(212,175,55,0.06))",
                  border: "1px solid rgba(212,175,55,0.2)",
                }}
              >
                <Download className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white/90 leading-tight">
                  Add FinLit to Home Screen
                </p>
                <p className="text-[11px] text-white/40 mt-0.5 leading-snug">
                  Faka uhlelo lwezimali zakho — instant offline access, no app store needed
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleInstall}
              className="mt-3.5 w-full rounded-xl py-2.5 text-[13px] font-bold tracking-wide transition-opacity hover:opacity-90 active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #D4AF37, #F0D699)",
                color: "#0A0A0F",
              }}
            >
              Install App • Yifake Ngoku
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
