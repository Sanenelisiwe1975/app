import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, TreePine, Coins } from "lucide-react";
import { useNetWorth } from "@/shared/hooks/useNetWorth";
import { useAudio } from "@/shared/hooks/useAudio";
import { formatCurrency } from "@/shared/lib/formatters";

export default function TimeMachine() {
  const netWorth       = useNetWorth();
  const { playSuccess } = useAudio();

  const [result, setResult]           = useState<string | null>(null);
  const [descendants, setDescendants] = useState(0);

  const runSimulation = () => {
    if (netWorth <= 0) {
      setResult("Start building wealth first! Your time machine needs fuel.");
      return;
    }
    const future = netWorth * Math.pow(1.07, 100);
    const desc   = 4 + Math.floor(Math.random() * 8);
    setDescendants(desc);
    setResult(
      `In the year ${new Date().getFullYear() + 100}, your ${desc} descendants will inherit a fortune of ${formatCurrency(future)}. Compounded at 7% annually, your wealth transcends generations.`
    );
    playSuccess();
  };

  return (
    <div className="page-container pb-24">
      <h2 className="font-serif text-3xl font-bold text-white mb-2 flex items-center gap-3">
        <Clock className="w-6 h-6 text-gold" /> Generational Wealth Time Machine
      </h2>
      <p className="text-muted-foreground text-sm mb-6">
        See what happens when patience meets compound interest across a century.
      </p>

      <div className="glass-card p-6 mb-6 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-gold/20 to-gold/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-gold/20">
          <TreePine className="w-10 h-10 text-gold" />
        </div>
        <h3 className="font-serif text-xl text-white mb-2">Current Net Worth</h3>
        <p className="text-3xl font-bold gold-text mb-4">{formatCurrency(netWorth)}</p>
        <button type="button" className="btn-premium flex items-center justify-center gap-2 mx-auto" onClick={runSimulation}>
          <Coins className="w-4 h-4" /> Project 100 Years
        </button>
      </div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 border-l-4 border-l-gold"
        >
          <p className="text-lg text-white/90 leading-relaxed font-medium">{result}</p>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex -space-x-2">
              {Array.from({ length: Math.min(descendants, 8) }).map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-dark text-xs font-bold border-2 border-dark-card"
                >
                  {i + 1}
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">{descendants} descendants benefiting</p>
          </div>
        </motion.div>
      )}

      <div className="mt-6 glass-card p-5">
        <h4 className="font-semibold text-white mb-3">The Power of 7%</h4>
        <div className="space-y-2 text-sm text-white/70">
          <div className="flex justify-between"><span>After 10 years:</span><span className="text-gold">2.0x</span></div>
          <div className="flex justify-between"><span>After 25 years:</span><span className="text-gold">5.4x</span></div>
          <div className="flex justify-between"><span>After 50 years:</span><span className="text-gold">29.5x</span></div>
          <div className="flex justify-between"><span>After 100 years:</span><span className="text-gold font-bold">867.9x</span></div>
        </div>
      </div>
    </div>
  );
}
