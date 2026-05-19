import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, Coins, CheckCircle, TrendingUp } from "lucide-react";
import type { GameState } from "@/hooks/useGameState";

export default function MarketProphet({
  state,
  onPlaceBet,
  onSettle,
}: {
  state: GameState;
  onPlaceBet: (id: number, option: number, amount: number) => void;
  onSettle: () => void;
}) {
  const [betAmount, setBetAmount] = useState(100);

  return (
    <div className="page-container pb-24">
      <h2 className="font-serif text-3xl font-bold text-white mb-2 flex items-center gap-3">
        <Eye className="w-6 h-6 text-xhosa-purple" /> Market Prophet
      </h2>
      <p className="text-muted-foreground text-sm mb-6">
        Predict market outcomes. Bet with wisdom. Profit from foresight.
      </p>

      <div className="glass-card p-5 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Prophet Balance</p>
            <p className="text-2xl font-bold gold-text">R{state.prophetBalance.toLocaleString()}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
            <Coins className="w-6 h-6 text-gold" />
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {state.predictions.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-5"
          >
            <h3 className="font-semibold text-white mb-3">{p.question}</h3>
            <div className="flex gap-4 mb-3">
              {p.options.map((opt, i) => (
                <div key={i} className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">{opt}</p>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-gold to-gold-dark rounded-full"
                      style={{ width: `${p.odds[i] * 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-gold mt-1">{(p.odds[i] * 100).toFixed(0)}% implied</p>
                </div>
              ))}
            </div>

            {p.userBet === null ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  className="input-premium w-24 py-2 text-sm"
                  value={betAmount}
                  onChange={(e) => setBetAmount(Number(e.target.value))}
                  min={10}
                  max={state.prophetBalance}
                />
                <button
                  className="btn-premium py-2 px-4 text-xs flex-1"
                  onClick={() => onPlaceBet(p.id, 0, betAmount)}
                  disabled={betAmount > state.prophetBalance}
                >
                  Bet {p.options[0]}
                </button>
                <button
                  className="btn-outline-premium py-2 px-4 text-xs flex-1"
                  onClick={() => onPlaceBet(p.id, 1, betAmount)}
                  disabled={betAmount > state.prophetBalance}
                >
                  Bet {p.options[1]}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-xhosa-teal" />
                <span className="text-white">
                  Bet R{p.userBetAmount} on {p.options[p.userBet]} {p.resolved ? "(Resolved)" : "(Pending)"}
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <button
        className="btn-outline-premium w-full flex items-center justify-center gap-2"
        onClick={onSettle}
      >
        <TrendingUp className="w-4 h-4" /> Settle Markets (Simulate Outcome)
      </button>
    </div>
  );
}
