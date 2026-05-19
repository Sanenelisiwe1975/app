import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Heart, Wind, ShoppingBag, ShieldCheck } from "lucide-react";
import type { GameState } from "@/hooks/useGameState";

export default function EmotionTracker({
  state,
  onSimulateImpulse,
  onBlockImpulse,
}: {
  state: GameState;
  onSimulateImpulse: () => void;
  onBlockImpulse: () => void;
}) {
  const [calming, setCalming] = useState(false);
  const [spendResult, setSpendResult] = useState<string | null>(null);
  const stress = Math.min(100, (state.heartRate - 60) * 2);

  const handleSimulate = () => {
    setSpendResult(null);
    if (stress > 50) {
      setCalming(true);
      setSpendResult("⚠️ High stress detected. Your heart rate suggests impulsive decision risk. Calm down first.");
      return;
    }
    const buy = window.confirm(`Heart rate ${state.heartRate} bpm. Buy R500 item?`);
    if (buy) {
      onSimulateImpulse();
      setSpendResult("Purchased R500 item. Track if this was need or emotion.");
    } else {
      setSpendResult("Saved R500. Emotional discipline builds wealth.");
    }
  };

  const handleCalm = () => {
    setCalming(false);
    onBlockImpulse();
    setSpendResult("🧘 Calm restored. R200 bonus for emotional discipline. +10 XP.");
  };

  return (
    <div className="page-container pb-24">
      <h2 className="font-serif text-3xl font-bold text-white mb-2 flex items-center gap-3">
        <Brain className="w-6 h-6 text-xhosa-purple" /> Emotional Spend Tracker
      </h2>
      <p className="text-muted-foreground text-sm mb-6">
        Master your emotions before they master your wallet.
      </p>

      <div className="glass-card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-xhosa-red/20 flex items-center justify-center">
              <Heart className="w-6 h-6 text-xhosa-red" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Heart Rate</p>
              <p className="text-2xl font-bold text-white">{state.heartRate} bpm</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Stress Level</p>
            <p className={`text-xl font-bold ${stress > 50 ? "text-xhosa-red" : "text-xhosa-teal"}`}>
              {stress}%
            </p>
          </div>
        </div>
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${stress > 50 ? "bg-xhosa-red" : "bg-xhosa-teal"}`}
            animate={{ width: `${stress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <button
        className="btn-premium w-full mb-4 flex items-center justify-center gap-2"
        onClick={handleSimulate}
      >
        <ShoppingBag className="w-4 h-4" /> Simulate Impulse Purchase
      </button>

      <AnimatePresence>
        {calming && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="glass-card p-6 mb-4 border-xhosa-teal/30"
          >
            <div className="flex items-center gap-3 mb-4">
              <Wind className="w-6 h-6 text-xhosa-teal animate-pulse" />
              <h3 className="font-semibold text-white">Take a Deep Breath</h3>
            </div>
            <p className="text-sm text-white/70 mb-4">
              Phumla — Rest. In Xhosa tradition, stillness brings clarity. Count to 10. Ask: "Do I need this, or do I feel this?"
            </p>
            <button
              className="btn-outline-premium w-full flex items-center justify-center gap-2"
              onClick={handleCalm}
            >
              <ShieldCheck className="w-4 h-4" /> I Feel Calm Now
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {spendResult && !calming && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-4"
        >
          <p className="text-sm text-white">{spendResult}</p>
        </motion.div>
      )}

      <div className="mt-6 glass-card p-5">
        <h4 className="font-semibold text-white mb-2">Impulse Stats</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Blocked Spends</p>
            <p className="text-xl font-bold text-xhosa-teal">{state.impulseSpendsBlocked}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Money Saved</p>
            <p className="text-xl font-bold text-gold">R{state.impulseSpendsBlocked * 500}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
