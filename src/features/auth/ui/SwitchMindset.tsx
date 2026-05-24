import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  RefreshCw, AlertTriangle, Trash2, ArrowLeft,
  History, Trophy, BookOpen, Zap, TrendingUp, ChevronDown,
} from "lucide-react";
import { useUserStore } from "@/shared/stores/userStore";
import { useGameStore } from "@/shared/stores/gameStore";
import { useMarketStore } from "@/shared/stores/marketStore";
import { useUiStore } from "@/shared/stores/uiStore";
import { formatCurrency } from "@/shared/lib/formatters";
import type { MindsetRecord } from "@/shared/stores/gameStore";

// ─── Legacy timeline entry ────────────────────────────────────────────────────

function LegacyCard({ record, index }: { record: MindsetRecord; index: number }) {
  const completionPct = record.completedModules.length > 0
    ? Math.round((record.completedModules.length / Math.max(record.completedModules.length, 5)) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      className="relative pl-8 pb-6 last:pb-0"
    >
      {/* Timeline line */}
      <div className="absolute left-3 top-3 bottom-0 w-px bg-gold/15 last:hidden" />
      {/* Timeline dot */}
      <div className="absolute left-1.5 top-2 w-3 h-3 rounded-full border-2 border-gold/60 bg-dark-card" />

      <div className="glass-card p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-semibold text-white text-sm">{record.mindsetName}</h4>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {new Date(record.savedAt).toLocaleDateString("en-ZA", {
                day: "numeric", month: "short", year: "numeric",
              })}
            </p>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/20 font-semibold">
            Archived
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-white/5 rounded-xl p-2 text-center border border-white/8">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <BookOpen className="w-3 h-3 text-xhosa-teal" />
              <span className="text-xs font-bold text-white">{record.completedModules.length}</span>
            </div>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Modules</p>
          </div>
          <div className="bg-white/5 rounded-xl p-2 text-center border border-white/8">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <Zap className="w-3 h-3 text-gold" />
              <span className="text-xs font-bold text-white">{record.xpEarned.toLocaleString()}</span>
            </div>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider">XP</p>
          </div>
          <div className="bg-white/5 rounded-xl p-2 text-center border border-white/8">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <TrendingUp className="w-3 h-3 text-xhosa-blue" />
              <span className="text-xs font-bold text-white">{record.totalTrades}</span>
            </div>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Trades</p>
          </div>
        </div>

        {/* Completion bar */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] text-muted-foreground">Path completion</p>
            <p className="text-[10px] text-gold font-semibold">{completionPct}%</p>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold-light to-gold rounded-full transition-[width] duration-700"
              style={{ width: `${completionPct}%` }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function SwitchMindset() {
  const { t }            = useTranslation();
  const clearUser        = useUserStore((s) => s.clear);
  const mindset          = useUserStore((s) => s.mindset);
  const gameReset        = useGameStore((s) => s.reset);
  const resetAssets      = useMarketStore((s) => s.resetAssets);
  const saveMindsetProgress = useGameStore((s) => s.saveMindsetProgress);
  const mindsetHistory   = useGameStore((s) => s.mindsetHistory);
  const navigate         = useUiStore((s) => s.navigate);

  const [historyOpen, setHistoryOpen] = useState(false);
  const [saving, setSaving]           = useState(false);

  const handleNewMindset = () => {
    if (mindset?.id && mindset?.name) {
      setSaving(true);
      saveMindsetProgress(mindset.id, mindset.name);
      setTimeout(() => {
        clearUser();
        navigate("register");
      }, 400);
    } else {
      clearUser();
      navigate("register");
    }
  };

  const handleHardReset = () => {
    if (!confirm(t("switchMindset.resetConfirm"))) return;
    clearUser();
    gameReset();
    resetAssets();
    navigate("register");
  };

  return (
    <div className="page-container pb-24">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>

        <h2 className="font-serif text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <RefreshCw className="w-6 h-6 text-gold" /> {t("switchMindset.title")}
        </h2>
        <p className="text-muted-foreground text-sm mb-6">{t("switchMindset.subtitle")}</p>

        {/* ── Current mindset reminder ──────────────────────────────────────── */}
        {mindset && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-4 mb-4 flex items-center gap-3 border-l-4 border-l-gold"
          >
            <span className="text-3xl">{mindset.icon}</span>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Currently active</p>
              <p className="font-semibold text-white">{mindset.name}</p>
              <p className="text-xs text-muted-foreground">{mindset.tagline}</p>
            </div>
          </motion.div>
        )}

        {/* ── New Mindset (saves progress first) ───────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card p-6 mb-4"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
              <RefreshCw className="w-6 h-6 text-gold" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white mb-1">{t("switchMindset.newTitle")}</h3>
              <p className="text-sm text-muted-foreground mb-1">{t("switchMindset.newDesc")}</p>
              <p className="text-xs text-xhosa-teal mb-4 flex items-center gap-1">
                <Trophy className="w-3 h-3" />
                Your current progress will be saved to your Legacy Timeline
              </p>
              <AnimatePresence mode="wait">
                {saving ? (
                  <motion.div
                    key="saving"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 text-sm text-gold"
                  >
                    <RefreshCw className="w-4 h-4 animate-spin" /> Saving legacy record…
                  </motion.div>
                ) : (
                  <motion.button
                    key="btn"
                    type="button"
                    className="btn-premium flex items-center gap-2"
                    onClick={handleNewMindset}
                  >
                    <RefreshCw className="w-4 h-4" /> {t("switchMindset.newButton")}
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* ── Legacy Timeline ───────────────────────────────────────────────── */}
        {mindsetHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-5 mb-4"
          >
            <button
              type="button"
              className="w-full flex items-center justify-between"
              onClick={() => setHistoryOpen((o) => !o)}
            >
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-gold" />
                <span className="font-semibold text-white">Legacy Timeline</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/25">
                  {mindsetHistory.length} path{mindsetHistory.length !== 1 ? "s" : ""}
                </span>
              </div>
              <motion.div animate={{ rotate: historyOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </motion.div>
            </button>

            <AnimatePresence>
              {historyOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mt-5">
                    {[...mindsetHistory].reverse().map((record, i) => (
                      <LegacyCard key={record.mindsetId + record.savedAt} record={record} index={i} />
                    ))}
                  </div>

                  {/* Total stats across all paths */}
                  <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-3 gap-2">
                    <div className="text-center">
                      <p className="text-lg font-bold text-white">
                        {mindsetHistory.reduce((s, r) => s + r.completedModules.length, 0)}
                      </p>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Total Modules</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold gold-text">
                        {mindsetHistory.reduce((s, r) => s + r.xpEarned, 0).toLocaleString()}
                      </p>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Total XP</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-xhosa-blue">
                        {mindsetHistory.reduce((s, r) => s + r.totalTrades, 0)}
                      </p>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Total Trades</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── Hard Reset ────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-card p-6 mb-6 border-xhosa-red/20"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-xhosa-red/10 flex items-center justify-center shrink-0">
              <Trash2 className="w-6 h-6 text-xhosa-red" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">{t("switchMindset.resetTitle")}</h3>
              <p className="text-sm text-muted-foreground mb-1">{t("switchMindset.resetDesc")}</p>
              <p className="text-xs text-xhosa-red/80 mb-4">Legacy Timeline will be permanently erased.</p>
              <button
                type="button"
                className="px-4 py-2 rounded-full text-sm font-medium bg-xhosa-red/10 text-xhosa-red border border-xhosa-red/30 hover:bg-xhosa-red/20 transition-all flex items-center gap-2"
                onClick={handleHardReset}
              >
                <AlertTriangle className="w-4 h-4" /> {t("switchMindset.resetButton")}
              </button>
            </div>
          </div>
        </motion.div>

        <button
          type="button"
          className="btn-outline-premium flex items-center gap-2"
          onClick={() => navigate("dashboard")}
        >
          <ArrowLeft className="w-4 h-4" /> {t("common.back")}
        </button>
      </motion.div>
    </div>
  );
}
