import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Eye, Coins, CheckCircle, TrendingUp, XCircle,
  Clock, BarChart3, Landmark, DollarSign, Sparkles,
} from "lucide-react";
import { useGameStore } from "@/shared/stores/gameStore";
import { formatCurrency } from "@/shared/lib/formatters";
import type { Prediction } from "@/entities";

// ── Category metadata ─────────────────────────────────────────────────────────

const CATEGORIES: Record<number, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  0: { label: "Monetary Policy", icon: Landmark,   color: "text-xhosa-purple", bg: "bg-xhosa-purple/10" },
  1: { label: "Equity Market",   icon: BarChart3,  color: "text-gold",         bg: "bg-gold/10"         },
  2: { label: "Commodities",     icon: Sparkles,   color: "text-xhosa-yellow", bg: "bg-xhosa-yellow/10" },
  3: { label: "Forex",           icon: DollarSign, color: "text-xhosa-teal",   bg: "bg-xhosa-teal/10"   },
};

// ── Prediction card ───────────────────────────────────────────────────────────

function PredictionCard({
  pred, betAmount, prophetBalance, onBet,
}: { pred: Prediction; betAmount: number; prophetBalance: number; onBet: (id: number, option: 0 | 1) => void }) {
  const cat     = CATEGORIES[pred.id] ?? CATEGORIES[0];
  const CatIcon = cat.icon;

  const isOpen     = pred.userBet === null && !pred.resolved;
  const isPending  = pred.userBet !== null && !pred.resolved;
  const isResolved = pred.resolved;
  const userWon    = isResolved && pred.userBet === pred.outcome;
  const userLost   = isResolved && pred.userBet !== null && pred.userBet !== pred.outcome;
  const payout     = isResolved && userWon
    ? pred.userBetAmount * (1 / (pred.odds[pred.outcome as 0 | 1] ?? 0.5))
    : 0;
  const profit = payout - pred.userBetAmount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-card p-5 border-l-4 transition-colors ${
        userWon  ? "border-l-xhosa-teal" :
        userLost ? "border-l-xhosa-red"  :
        isPending ? "border-l-gold"      :
        "border-l-white/10"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${cat.bg}`}>
            <CatIcon className={`w-4 h-4 ${cat.color}`} />
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-wider ${cat.color}`}>{cat.label}</span>
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
          isResolved
            ? userWon  ? "bg-xhosa-teal/15 text-xhosa-teal border border-xhosa-teal/25"
                       : "bg-xhosa-red/15 text-xhosa-red border border-xhosa-red/25"
            : isPending ? "bg-gold/10 text-gold border border-gold/20"
                        : "bg-white/8 text-muted-foreground border border-white/10"
        }`}>
          {isResolved ? (userWon ? "Won" : "Lost") : isPending ? "Pending" : "Open"}
        </span>
      </div>

      <h3 className="font-semibold text-white text-sm mb-4 leading-snug">{pred.question}</h3>

      {/* Odds stacked bar */}
      <div className="mb-3">
        <div className="flex h-2.5 rounded-full overflow-hidden gap-px mb-1.5">
          <motion.div
            className="bg-xhosa-teal/70 rounded-l-full"
            initial={{ width: 0 }}
            animate={{ width: `${pred.odds[0] * 100}%` }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
          <motion.div
            className="bg-white/20 rounded-r-full"
            initial={{ width: 0 }}
            animate={{ width: `${pred.odds[1] * 100}%` }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
        </div>
        <div className="flex justify-between text-[10px]">
          <span className="text-xhosa-teal font-semibold">{pred.options[0]} {(pred.odds[0] * 100).toFixed(0)}%</span>
          <span className="text-muted-foreground">{pred.options[1]} {(pred.odds[1] * 100).toFixed(0)}%</span>
        </div>
      </div>

      {/* Outcome banner */}
      <AnimatePresence>
        {isResolved && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className={`rounded-xl p-3 mb-3 ${userWon ? "bg-xhosa-teal/10 border border-xhosa-teal/20" : "bg-xhosa-red/10 border border-xhosa-red/20"}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {userWon
                  ? <CheckCircle className="w-4 h-4 text-xhosa-teal" />
                  : <XCircle    className="w-4 h-4 text-xhosa-red" />}
                <span className={`text-xs font-semibold ${userWon ? "text-xhosa-teal" : "text-xhosa-red"}`}>
                  Outcome: {pred.options[pred.outcome as 0 | 1]}
                </span>
              </div>
              {pred.userBet !== null && (
                <span className={`text-xs font-bold ${userWon ? "text-xhosa-teal" : "text-xhosa-red"}`}>
                  {userWon ? `+${formatCurrency(profit)}` : `-${formatCurrency(pred.userBetAmount)}`}
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pending status */}
      {isPending && (
        <div className="flex items-center gap-2 text-xs text-gold bg-gold/5 border border-gold/15 rounded-xl px-3 py-2 mb-3">
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span>Bet R{pred.userBetAmount} on <strong>{pred.options[pred.userBet as 0 | 1]}</strong> — awaiting settlement</span>
        </div>
      )}

      {/* Bet buttons */}
      {isOpen && (
        <div className="flex items-center gap-2">
          <motion.button
            type="button"
            className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold bg-xhosa-teal/10 text-xhosa-teal border border-xhosa-teal/25 hover:bg-xhosa-teal/20 transition-all"
            onClick={() => onBet(pred.id, 0)}
            disabled={betAmount > prophetBalance}
            whileTap={{ scale: 0.95 }}
          >
            Bet {pred.options[0]}
            <span className="ml-1 opacity-60 text-[10px]">× {(1 / pred.odds[0]).toFixed(1)}</span>
          </motion.button>
          <motion.button
            type="button"
            className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold bg-white/5 text-muted-foreground border border-white/10 hover:bg-white/10 transition-all"
            onClick={() => onBet(pred.id, 1)}
            disabled={betAmount > prophetBalance}
            whileTap={{ scale: 0.95 }}
          >
            Bet {pred.options[1]}
            <span className="ml-1 opacity-60 text-[10px]">× {(1 / pred.odds[1]).toFixed(1)}</span>
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function MarketProphet() {
  const { t } = useTranslation();
  const prophetBalance    = useGameStore((s) => s.prophetBalance);
  const predictions       = useGameStore((s) => s.predictions);
  const placeBet          = useGameStore((s) => s.placeBet);
  const settlePredictions = useGameStore((s) => s.settlePredictions);

  const [betAmount, setBetAmount]   = useState(100);
  const [settling, setSettling]     = useState(false);
  const [lastResult, setLastResult] = useState<"win" | "loss" | null>(null);

  const resolved = predictions.filter((p) => p.resolved);
  const pending  = predictions.filter((p) => p.userBet !== null && !p.resolved);
  const open     = predictions.filter((p) => p.userBet === null && !p.resolved);
  const won      = resolved.filter((p) => p.userBet === p.outcome);
  const winRate  = resolved.length > 0 ? Math.round((won.length / resolved.length) * 100) : 0;

  const totalProfit = resolved.reduce((sum, p) => {
    if (p.userBet === null) return sum;
    if (p.userBet === p.outcome) {
      return sum + p.userBetAmount * (1 / (p.odds[p.outcome as 0 | 1] ?? 0.5)) - p.userBetAmount;
    }
    return sum - p.userBetAmount;
  }, 0);

  const handleBet = (id: number, option: 0 | 1) => {
    placeBet(id, option, betAmount);
  };

  const handleSettle = async () => {
    setSettling(true);
    const wonBefore = predictions.filter((p) => p.resolved && p.userBet === p.outcome).length;
    settlePredictions();
    await new Promise((r) => setTimeout(r, 400));
    const wonAfter = predictions.filter((p) => p.resolved && p.userBet === p.outcome).length;
    setLastResult(wonAfter > wonBefore ? "win" : pending.length > 0 ? "loss" : null);
    setSettling(false);
    setTimeout(() => setLastResult(null), 3000);
  };

  return (
    <div className="page-container pb-24">
      <h2 className="font-serif text-3xl font-bold text-white mb-2 flex items-center gap-3">
        <Eye className="w-6 h-6 text-xhosa-purple" /> {t("prophet.title")}
      </h2>
      <p className="text-muted-foreground text-sm mb-6">{t("prophet.subtitle")}</p>

      {/* ── Stats row ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <motion.div className="glass-card p-4 text-center" whileHover={{ scale: 1.03 }}>
          <div className="flex items-center justify-center gap-1 mb-1">
            <Coins className="w-3.5 h-3.5 text-gold" />
          </div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{t("prophet.balance")}</p>
          <p className="text-lg font-bold gold-text">{formatCurrency(prophetBalance)}</p>
        </motion.div>

        <div className="glass-card p-4 text-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Win Rate</p>
          <p className={`text-lg font-bold ${winRate >= 50 ? "text-xhosa-teal" : resolved.length === 0 ? "text-white" : "text-xhosa-red"}`}>
            {resolved.length === 0 ? "—" : `${winRate}%`}
          </p>
          <p className="text-[9px] text-muted-foreground">{won.length}/{resolved.length} resolved</p>
        </div>

        <div className="glass-card p-4 text-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">P&L</p>
          <p className={`text-lg font-bold ${totalProfit >= 0 ? "text-xhosa-teal" : "text-xhosa-red"}`}>
            {resolved.length === 0 ? "—" : `${totalProfit >= 0 ? "+" : ""}${formatCurrency(totalProfit)}`}
          </p>
        </div>
      </div>

      {/* ── Bet amount control ────────────────────────────────────────────── */}
      <div className="glass-card p-4 mb-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-white">Stake per prediction</p>
          <p className="text-sm font-bold gold-text">{formatCurrency(betAmount)}</p>
        </div>
        <input
          type="range"
          min={10}
          max={Math.max(10, Math.floor(prophetBalance / 10) * 10)}
          step={10}
          value={Math.min(betAmount, prophetBalance)}
          onChange={(e) => setBetAmount(Number(e.target.value))}
          className="w-full accent-gold"
          aria-label="Bet amount"
        />
        <div className="flex justify-between text-[9px] text-muted-foreground mt-0.5">
          <span>R10</span>
          <span>Payout = stake × odds multiplier</span>
          <span>{formatCurrency(prophetBalance)}</span>
        </div>
      </div>

      {/* ── Settlement flash ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {lastResult && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`rounded-2xl p-4 mb-4 flex items-center gap-3 border ${
              lastResult === "win"
                ? "bg-xhosa-teal/10 border-xhosa-teal/25 text-xhosa-teal"
                : "bg-xhosa-red/10 border-xhosa-red/25 text-xhosa-red"
            }`}
          >
            {lastResult === "win"
              ? <CheckCircle className="w-5 h-5 shrink-0" />
              : <XCircle    className="w-5 h-5 shrink-0" />}
            <p className="text-sm font-semibold">
              {lastResult === "win" ? "Prediction correct! Winnings added to balance." : "Prediction wrong — stake lost."}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Open predictions ──────────────────────────────────────────────── */}
      {open.length > 0 && (
        <>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-xhosa-teal inline-block" /> Open — place your bet
          </p>
          <div className="space-y-4 mb-6">
            {open.map((p) => (
              <PredictionCard
                key={p.id}
                pred={p}
                betAmount={betAmount}
                prophetBalance={prophetBalance}
                onBet={handleBet}
              />
            ))}
          </div>
        </>
      )}

      {/* ── Pending predictions ───────────────────────────────────────────── */}
      {pending.length > 0 && (
        <>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
            <Clock className="w-3 h-3 text-gold" /> Pending settlement
          </p>
          <div className="space-y-4 mb-6">
            {pending.map((p) => (
              <PredictionCard
                key={p.id}
                pred={p}
                betAmount={betAmount}
                prophetBalance={prophetBalance}
                onBet={handleBet}
              />
            ))}
          </div>
        </>
      )}

      {/* ── Settle button ─────────────────────────────────────────────────── */}
      {pending.length > 0 && (
        <motion.button
          type="button"
          className="btn-premium w-full flex items-center justify-center gap-2 mb-6"
          onClick={handleSettle}
          disabled={settling}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.97 }}
        >
          {settling
            ? <><TrendingUp className="w-4 h-4 animate-pulse" /> Settling…</>
            : <><TrendingUp className="w-4 h-4" /> {t("prophet.settle")}</>
          }
        </motion.button>
      )}

      {/* ── Resolved predictions ──────────────────────────────────────────── */}
      {resolved.length > 0 && (
        <>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
            <CheckCircle className="w-3 h-3 text-muted-foreground" /> Resolved
          </p>
          <div className="space-y-3 mb-6">
            {resolved.map((p) => (
              <PredictionCard
                key={p.id}
                pred={p}
                betAmount={betAmount}
                prophetBalance={prophetBalance}
                onBet={handleBet}
              />
            ))}
          </div>
        </>
      )}

      {/* ── Education card ────────────────────────────────────────────────── */}
      <div className="glass-card p-5 border-l-4 border-l-xhosa-purple">
        <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
          <Eye className="w-4 h-4 text-xhosa-purple" /> What are prediction markets?
        </h4>
        <div className="space-y-2 text-xs text-white/70">
          <p>Prediction markets aggregate crowd wisdom to price real-world events. The odds reflect the collective probability assessment — like futures markets but for discrete outcomes.</p>
          <p>In SA finance, platforms like <span className="text-white font-medium">Betway</span> and <span className="text-white font-medium">Hollywoodbets</span> offer financial event markets, while the JSE's derivatives market prices options on exactly these kinds of binary outcomes.</p>
          <p className="text-gold/80 italic">Simulated only — no real money involved. This teaches you to read implied probability and expected value.</p>
        </div>
      </div>
    </div>
  );
}
