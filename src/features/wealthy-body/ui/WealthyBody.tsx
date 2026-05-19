import { motion } from "framer-motion";
import { Heart, Activity, Watch, TrendingUp } from "lucide-react";
import type { GameState } from "@/hooks/useGameState";

export default function WealthyBody({
  state,
  healthMult,
  onSync,
}: {
  state: GameState;
  healthMult: number;
  onSync: () => void;
}) {
  const premium = Math.round(500 / healthMult);

  return (
    <div className="page-container pb-24">
      <h2 className="font-serif text-3xl font-bold text-white mb-2 flex items-center gap-3">
        <Heart className="w-6 h-6 text-xhosa-red" /> Wealthy Body
      </h2>
      <p className="text-muted-foreground text-sm mb-6">
        Your body is your most valuable asset. Health multiplies wealth.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-4 text-center">
          <Activity className="w-5 h-5 text-xhosa-teal mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">Steps</p>
          <p className="text-xl font-bold text-white">{state.healthSteps.toLocaleString()}</p>
        </div>
        <div className="glass-card p-4 text-center">
          <Watch className="w-5 h-5 text-xhosa-blue mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">Sleep</p>
          <p className="text-xl font-bold text-white">{state.healthSleep.toFixed(1)} hrs</p>
        </div>
        <div className="glass-card p-4 text-center">
          <Heart className="w-5 h-5 text-xhosa-red mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">Heart Rate</p>
          <p className="text-xl font-bold text-white">{state.heartRate} bpm</p>
        </div>
        <div className="glass-card p-4 text-center">
          <TrendingUp className="w-5 h-5 text-gold mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">Multiplier</p>
          <p className="text-xl font-bold gold-text">{healthMult.toFixed(2)}x</p>
        </div>
      </div>

      <div className="glass-card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-white">Insurance Premium</h3>
            <p className="text-sm text-muted-foreground">Linked to your health score</p>
          </div>
          <p className="text-2xl font-bold text-xhosa-teal">R{premium}/mo</p>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-xhosa-teal to-xhosa-blue rounded-full"
            animate={{ width: `${Math.min(100, healthMult * 40)}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Base premium R500. Healthier lifestyle = lower premiums. Sync your wearable to update.
        </p>
      </div>

      <button
        className="btn-premium w-full flex items-center justify-center gap-2"
        onClick={onSync}
      >
        <Watch className="w-4 h-4" /> Sync Wearable (Mock)
      </button>

      <div className="mt-6 glass-card p-5 border-l-4 border-l-xhosa-teal">
        <p className="text-sm text-white/70">
          In the FINLIT ecosystem, your health data directly impacts your financial simulations. 
          A healthier body means lower insurance costs, higher productivity multipliers, and longer compound interest timelines.
        </p>
      </div>
    </div>
  );
}
