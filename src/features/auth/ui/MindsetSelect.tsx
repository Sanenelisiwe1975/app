import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { audiences } from "@/data/mindsets";
import type { Mindset } from "@/data/mindsets";

export default function MindsetSelect({
  audienceKey,
  onSelect,
  onBack,
}: {
  audienceKey: string;
  onSelect: (mindset: Mindset) => void;
  onBack: () => void;
}) {
  const audience = audiences[audienceKey];
  if (!audience) return null;

  return (
    <div className="page-container pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-8">
          <h2 className="font-serif text-3xl font-bold text-white mb-2">{audience.name}</h2>
          <p className="text-muted-foreground text-sm">Select your mindset. Each path is distinct, relevant, and built for your reality.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {audience.mindsets.map((mindset, i) => (
            <motion.button
              key={mindset.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => onSelect(mindset)}
              className="glass-card-hover p-6 text-left relative overflow-hidden group"
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div
                className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"
                style={{ backgroundColor: mindset.color }}
              />
              <div className="text-4xl mb-3">{mindset.icon}</div>
              <h3 className="font-serif text-lg font-semibold text-white mb-1">{mindset.name}</h3>
              <p className="text-xs text-muted-foreground mb-3">{mindset.desc}</p>
              <div className="flex items-center gap-2 text-xs text-gold mb-3">
                <Sparkles className="w-3 h-3" />
                <span>{mindset.tagline}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">
                  R{mindset.startCash.toLocaleString()} start
                </span>
                <ArrowRight className="w-4 h-4 text-gold opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {mindset.assets.slice(0, 3).map((a) => (
                  <span key={a} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-muted-foreground border border-white/10">
                    {a}
                  </span>
                ))}
              </div>
            </motion.button>
          ))}
        </div>

        <button className="btn-outline-premium mt-6 mx-auto block" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 inline mr-2" /> Back to Paths
        </button>
      </motion.div>
    </div>
  );
}
