import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, X, ExternalLink, Coins } from "lucide-react";
import { useCurrencyFormatter } from "@/shared/hooks/useCurrencyFormatter";

type Trigger =
  | "trade"         // after a buy/sell
  | "module"        // after completing a module
  | "networth"      // after crossing R10k net worth
  | "stokvel"       // after stokvel payout
  | "idle";         // general contextual nudge

interface Props {
  trigger: Trigger;
  netWorth?: number;
  /** If true, renders inline (e.g. inside a card). Default = modal overlay. */
  inline?: boolean;
  onDismiss?: () => void;
}

const MESSAGES: Record<Trigger, { headline: string; body: string; cta: string }> = {
  trade: {
    headline: "You're thinking like an investor!",
    body: "Real JSE shares start from R1 on EasyEquities. Your simulated gains could be real gains.",
    cta: "Start Investing from R1",
  },
  module: {
    headline: "Knowledge = Power = Money",
    body: "You've just learned what most South Africans never will. Now put it to work with real money on EasyEquities.",
    cta: "Open a Free Account",
  },
  networth: {
    headline: "R10,000+ simulated net worth!",
    body: "If this were real money on EasyEquities, you'd already be building generational wealth. Why not start?",
    cta: "Turn Simulation into Reality",
  },
  stokvel: {
    headline: "Your stokvel paid out!",
    body: "Traditional stokvels are powerful. EasyEquities Stokvel lets your group invest in real stocks together.",
    cta: "Explore EasyEquities Stokvel",
  },
  idle: {
    headline: "South Africa's easiest stock market",
    body: "Naspers, MTN, FirstRand — all available from R1 on EasyEquities. No minimums, no jargon.",
    cta: "Start with R1 Today",
  },
};

// EasyEquities referral / landing page URL
const EE_URL = "https://www.easyequities.co.za";

export function EasyEquitiesPrompt({ trigger, netWorth, inline = false, onDismiss }: Props) {
  const [dismissed, setDismissed] = useState(false);
  const formatCurrency = useCurrencyFormatter();
  const msg = MESSAGES[trigger];

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  const handleCta = () => {
    window.open(EE_URL, "_blank", "noopener,noreferrer");
  };

  if (dismissed) return null;

  if (inline) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-4 border border-gold/20 mt-4"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4 text-gold" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white mb-0.5">{msg.headline}</p>
              <p className="text-xs text-muted-foreground mb-2">{msg.body}</p>
              <button
                type="button"
                onClick={handleCta}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold hover:underline"
              >
                {msg.cta} <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDismiss}
            className="text-muted-foreground hover:text-white mt-0.5 shrink-0"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    );
  }

  // Full overlay modal
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
        onClick={handleDismiss}
      >
        <motion.div
          initial={{ y: 60, scale: 0.96 }}
          animate={{ y: 0, scale: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="bg-dark-card border border-gold/20 rounded-3xl p-6 max-w-sm w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center mb-4 mx-auto border border-gold/20">
            <Coins className="w-7 h-7 text-gold" />
          </div>

          <h3 className="font-serif text-xl font-bold text-white text-center mb-2">{msg.headline}</h3>
          <p className="text-sm text-muted-foreground text-center mb-5">{msg.body}</p>

          {netWorth !== undefined && (
            <div className="bg-gold/5 border border-gold/15 rounded-xl p-3 mb-5 text-center">
              <p className="text-xs text-muted-foreground mb-0.5">Your simulated net worth</p>
              <p className="text-xl font-bold gold-text">
                {formatCurrency(netWorth)}
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={handleCta}
            className="btn-premium w-full flex items-center justify-center gap-2 mb-3"
          >
            {msg.cta} <ExternalLink className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            className="w-full text-xs text-muted-foreground hover:text-white transition-colors py-1"
          >
            Maybe later
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Standalone persistent CTA button — drop it anywhere in the UI.
 * Always visible; clicking opens EasyEquities in a new tab.
 */
export function EasyEquitiesButton({ label = "Invest from R1 on EasyEquities", compact = false }: { label?: string; compact?: boolean }) {
  return (
    <a
      href={EE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 font-semibold transition-all hover:opacity-90 ${
        compact
          ? "text-xs text-gold hover:underline"
          : "btn-premium text-sm px-5 py-2.5"
      }`}
    >
      <TrendingUp className={compact ? "w-3.5 h-3.5" : "w-4 h-4"} />
      {label}
      <ExternalLink className={compact ? "w-3 h-3" : "w-3.5 h-3.5"} />
    </a>
  );
}
