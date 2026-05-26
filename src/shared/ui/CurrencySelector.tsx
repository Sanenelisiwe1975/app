import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { useUserStore, type CurrencyCode } from "@/shared/stores/userStore";
import { CURRENCY_LABELS, CURRENCY_SYMBOLS } from "@/shared/lib/formatters";

const CURRENCIES: CurrencyCode[] = ["ZAR", "USD", "EUR", "GBP", "AED"];

interface Props {
  compact?: boolean;
}

export function CurrencySelector({ compact = false }: Props) {
  const currency    = useUserStore((s) => s.currency);
  const setCurrency = useUserStore((s) => s.setCurrency);
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Select currency"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 rounded-full transition-colors ${
          compact
            ? "p-1.5 text-muted-foreground hover:text-white hover:bg-white/10 text-xs font-bold"
            : "px-3 py-1.5 text-xs font-medium border border-white/10 bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white"
        }`}
      >
        <span className="text-gold font-bold">{CURRENCY_SYMBOLS[currency]}</span>
        {!compact && <span>{currency}</span>}
        <ChevronDown className="w-3 h-3" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-[998]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className={`absolute bottom-full mb-2 z-[999] min-w-[140px] bg-dark-card border border-gold/20 rounded-2xl p-1.5 shadow-xl shadow-black/60 ${compact ? "right-0" : "left-0"}`}
            >
              {CURRENCIES.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => { setCurrency(code); setOpen(false); }}
                  className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    currency === code
                      ? "bg-gold/15 text-gold"
                      : "text-muted-foreground hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>{CURRENCY_LABELS[code]}</span>
                  {currency === code && <Check className="w-3 h-3" />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
