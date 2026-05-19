import { motion } from "framer-motion";
import { TrendingUp, Award, Heart, BookOpen, ArrowRight, Zap } from "lucide-react";
import { useGameStore, selectHealthMultiplier } from "@/shared/stores/gameStore";
import { useUserStore } from "@/shared/stores/userStore";
import { useUiStore } from "@/shared/stores/uiStore";
import { useNetWorth } from "@/shared/hooks/useNetWorth";
import { formatCurrency } from "@/shared/lib/formatters";

export default function Dashboard() {
  const navigate = useUiStore((s) => s.navigate);

  const xp                   = useGameStore((s) => s.xp);
  const badges               = useGameStore((s) => s.badges);
  const cash                 = useGameStore((s) => s.cash);
  const completedModules     = useGameStore((s) => s.completedModules);
  const totalTrades          = useGameStore((s) => s.totalTrades);
  const impulseSpendsBlocked = useGameStore((s) => s.impulseSpendsBlocked);
  const phishingTotal        = useGameStore((s) => s.phishingTotal);
  const phishingCaught       = useGameStore((s) => s.phishingCaught);
  const healthMult           = useGameStore(selectHealthMultiplier);

  const currentModules = useUserStore((s) => s.mindset?.modules ?? []);

  const netWorth = useNetWorth();

  const completedCount = completedModules.length;
  const totalModules   = currentModules.length;
  const progressPct    = totalModules > 0 ? (completedCount / totalModules) * 100 : 0;
  const scamAwareness  = phishingTotal > 0 ? Math.round((phishingCaught / phishingTotal) * 100) : 0;

  const stats = [
    { label: "Cash",           value: `R${cash.toLocaleString()}`,          icon: <Zap       className="w-4 h-4" />, color: "text-gold"       },
    { label: "Trades",         value: totalTrades.toString(),                icon: <TrendingUp className="w-4 h-4" />, color: "text-xhosa-blue" },
    { label: "Impulse Blocks", value: impulseSpendsBlocked.toString(),       icon: <Heart     className="w-4 h-4" />, color: "text-xhosa-red"  },
    { label: "Scam Awareness", value: `${scamAwareness}%`,                  icon: <Award     className="w-4 h-4" />, color: "text-xhosa-teal" },
  ];

  return (
    <div className="page-container pb-24">

      {/* ── Wealth Card ───────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-6 md:p-8 mb-6"
        style={{
          background: "linear-gradient(135deg, #1a1520 0%, #2d2415 50%, #1a1520 100%)",
          border: "1px solid rgba(212,175,55,0.25)",
        }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-gold/80 text-xs tracking-widest uppercase mb-2">
            <TrendingUp className="w-3 h-3" /> Net Worth
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold gold-text mb-4">
            {formatCurrency(netWorth)}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <p className="text-xs text-muted-foreground mb-1">XP</p>
              <p className="text-lg font-bold text-white">{xp.toLocaleString()}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <p className="text-xs text-muted-foreground mb-1">Badges</p>
              <p className="text-lg font-bold text-white">{badges.length}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <p className="text-xs text-muted-foreground mb-1">Health Boost</p>
              <p className="text-lg font-bold text-xhosa-teal">+{Math.round((healthMult - 1) * 100)}%</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <p className="text-xs text-muted-foreground mb-1">Modules</p>
              <p className="text-lg font-bold text-white">{completedCount}/{totalModules}</p>
            </div>
          </div>
          <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-gold-light to-gold rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>
        </div>
      </motion.div>

      {/* ── Quick Stats ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="glass-card p-4"
          >
            <div className={`${stat.color} mb-1`}>{stat.icon}</div>
            <p className="text-xl font-bold text-white">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Continue Learning ─────────────────────────────────────────────── */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-xl font-semibold text-white">Continue Learning</h3>
          <button
            onClick={() => navigate("learn")}
            className="text-xs text-gold flex items-center gap-1 hover:underline"
          >
            View All <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {currentModules.slice(0, 3).map((m, i) => (
            <motion.button
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              onClick={() => navigate("learn")}
              className="glass-card-hover p-5 text-left"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-gold" />
                <span className="text-xs text-gold uppercase tracking-wider">Module {m.id}</span>
              </div>
              <h4 className="font-semibold text-white mb-2">{m.name}</h4>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-gold-light to-gold rounded-full transition-all"
                  style={{ width: `${completedModules.includes(m.id) ? 100 : 0}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-2">
                {completedModules.includes(m.id) ? "Completed ✓" : "Not started"}
              </p>
            </motion.button>
          ))}
          {currentModules.length === 0 && (
            <div className="glass-card p-5 text-center text-muted-foreground text-sm">
              Select a mindset to unlock modules
            </div>
          )}
        </div>
      </div>

      {/* ── Insight Card ──────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="glass-card p-5 border-l-4 border-l-gold"
      >
        <p className="text-sm text-white/80 italic">
          "Umntu ngumntu ngabantu" — A person is a person through others. Your wealth journey is shaped by community, knowledge, and disciplined action.
        </p>
      </motion.div>
    </div>
  );
}
