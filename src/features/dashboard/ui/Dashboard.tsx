import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { TrendingUp, Award, Heart, BookOpen, ArrowRight, Zap } from "lucide-react";
import { useGameStore, selectHealthMultiplier } from "@/shared/stores/gameStore";
import { useUserStore } from "@/shared/stores/userStore";
import { useUiStore } from "@/shared/stores/uiStore";
import { useNetWorth } from "@/shared/hooks/useNetWorth";
import { useCurrencyFormatter } from "@/shared/hooks/useCurrencyFormatter";
import { EasyEquitiesPrompt } from "@/shared/ui/EasyEquitiesPrompt";

export default function Dashboard() {
  const { t }          = useTranslation();
  const formatCurrency = useCurrencyFormatter();
  const navigate       = useUiStore((s) => s.navigate);
  const [eePromptDismissed, setEePromptDismissed] = useState(false);

  const xp                   = useGameStore((s) => s.xp);
  const badges               = useGameStore((s) => s.badges);
  const cash                 = useGameStore((s) => s.cash);
  const completedModules     = useGameStore((s) => s.completedModules);
  const totalTrades          = useGameStore((s) => s.totalTrades);
  const impulseSpendsBlocked = useGameStore((s) => s.impulseSpendsBlocked);
  const phishingTotal        = useGameStore((s) => s.phishingTotal);
  const phishingCaught       = useGameStore((s) => s.phishingCaught);
  const healthMult           = useGameStore(selectHealthMultiplier);
  const mindset              = useUserStore((s) => s.mindset);
  const currentModules       = mindset?.modules ?? [];
  const netWorth             = useNetWorth();

  const completedCount = completedModules.length;
  const totalModules   = currentModules.length;
  const progressPct    = totalModules > 0 ? (completedCount / totalModules) * 100 : 0;
  const scamAwareness  = phishingTotal > 0 ? Math.round((phishingCaught / phishingTotal) * 100) : 0;

  const stats = [
    { labelKey: "dashboard.cash",           value: formatCurrency(cash),             icon: <Zap        className="w-4 h-4" />, color: "text-gold"       },
    { labelKey: "dashboard.trades",         value: totalTrades.toString(),            icon: <TrendingUp className="w-4 h-4" />, color: "text-xhosa-blue" },
    { labelKey: "dashboard.impulseBlocks",  value: impulseSpendsBlocked.toString(),   icon: <Heart      className="w-4 h-4" />, color: "text-xhosa-red"  },
    { labelKey: "dashboard.scamAwareness",  value: `${scamAwareness}%`,              icon: <Award      className="w-4 h-4" />, color: "text-xhosa-teal" },
  ];

  return (
    <div className="page-container pb-24">

      {/* ── Wealth Card ───────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="wealth-card-bg relative overflow-hidden rounded-3xl p-6 md:p-8 mb-6"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-gold/80 text-xs tracking-widest uppercase mb-2">
            <TrendingUp className="w-3 h-3" /> {t("dashboard.netWorth")}
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold gold-text mb-4">
            {formatCurrency(netWorth)}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <p className="text-xs text-muted-foreground mb-1">{t("dashboard.xp")}</p>
              <p className="text-lg font-bold text-white">{xp.toLocaleString()}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <p className="text-xs text-muted-foreground mb-1">{t("dashboard.badges")}</p>
              <p className="text-lg font-bold text-white">{badges.length}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <p className="text-xs text-muted-foreground mb-1">{t("dashboard.healthBoost")}</p>
              <p className="text-lg font-bold text-xhosa-teal">+{Math.round((healthMult - 1) * 100)}%</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <p className="text-xs text-muted-foreground mb-1">{t("dashboard.modules")}</p>
              <p className="text-lg font-bold text-white">{completedCount}/{totalModules}</p>
            </div>
          </div>
          <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold-light to-gold rounded-full transition-[width] duration-1000 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </motion.div>

      {/* ── Quick Stats ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.labelKey}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="glass-card p-4"
          >
            <div className={`${stat.color} mb-1`}>{stat.icon}</div>
            <p className="text-xl font-bold text-white">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t(stat.labelKey)}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Continue Learning ─────────────────────────────────────────────── */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-xl font-semibold text-white">{t("dashboard.continueLearning")}</h3>
          <button
            type="button"
            onClick={() => navigate("learn")}
            className="text-xs text-gold flex items-center gap-1 hover:underline"
          >
            {t("dashboard.viewAll")} <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {currentModules.slice(0, 3).map((m, i) => {
            const done = completedModules.includes(m.id);
            return (
              <motion.button
                key={m.id}
                type="button"
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
                  <span className="text-xs text-gold uppercase tracking-wider">{t("learn.module")} {m.id}</span>
                </div>
                <h4 className="font-semibold text-white mb-2">{m.name}</h4>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-gold-light to-gold rounded-full transition-[width] duration-500"
                    style={{ width: done ? "100%" : "0%" }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground mt-2">
                  {done ? t("learn.completed") : t("learn.notStarted")}
                </p>
              </motion.button>
            );
          })}
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
        <p className="text-sm text-white/80 italic">{t("dashboard.quote")}</p>
      </motion.div>

      {netWorth >= 10_000 && !eePromptDismissed && (
        <EasyEquitiesPrompt
          trigger="networth"
          netWorth={netWorth}
          inline
          onDismiss={() => setEePromptDismissed(true)}
        />
      )}
    </div>
  );
}
