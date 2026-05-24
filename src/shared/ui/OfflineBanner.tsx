import { motion, AnimatePresence } from "framer-motion";
import { WifiOff, ShieldCheck } from "lucide-react";
import { useNetworkStatus } from "@/shared/hooks/useNetworkStatus";

export function OfflineBanner() {
  const { isOffline } = useNetworkStatus();

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          key="offline-banner"
          initial={{ opacity: 0, y: -48 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -48 }}
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
          className="fixed top-0 left-0 right-0 z-[9997] flex items-center justify-center gap-3 px-4 py-2"
          style={{
            background: "rgba(10, 10, 15, 0.88)",
            backdropFilter: "blur(14px)",
            borderBottom: "1px solid rgba(212,175,55,0.22)",
            WebkitBackdropFilter: "blur(14px)",
          }}
          role="status"
          aria-live="polite"
        >
          <WifiOff className="w-3.5 h-3.5 text-gold flex-shrink-0" />
          <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-white/80">
            Working Offline
          </span>
          <span className="text-white/20 text-[10px]" aria-hidden>•</span>
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          <span className="text-[11px] text-white/55 tracking-wide">
            Progress saved locally
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
