import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Brain, Heart, Wind, ShoppingBag, ShieldCheck,
  Zap, Coffee, Users, TrendingDown, AlertCircle, CheckCircle,
  Flame, Sparkles, Clock, ChevronDown,
} from "lucide-react";
import { useGameStore } from "@/shared/stores/gameStore";
import { useCurrencyFormatter } from "@/shared/hooks/useCurrencyFormatter";

// ── Spend triggers ────────────────────────────────────────────────────────────

interface SpendTrigger {
  id: string;
  label: string;
  icon: React.ElementType;
  emotion: string;
  amount: number;
  color: string;
  tip: string;
}

const TRIGGERS: SpendTrigger[] = [
  {
    id: "boredom",
    label: "Boredom Buy",
    icon: Coffee,
    emotion: "😴 Bored",
    amount: 350,
    color: "text-xhosa-blue",
    tip: "Boredom spending accounts for 22% of impulse purchases. Go for a walk instead.",
  },
  {
    id: "fomo",
    label: "FOMO Purchase",
    icon: Users,
    emotion: "😰 FOMO",
    amount: 1200,
    color: "text-xhosa-yellow",
    tip: "Fear of missing out is a marketing tool. Ask: will I care about this in 30 days?",
  },
  {
    id: "stress",
    label: "Stress Relief",
    icon: Zap,
    emotion: "😤 Stressed",
    amount: 600,
    color: "text-xhosa-red",
    tip: "Retail therapy feels good for 20 minutes. Savings feel good forever.",
  },
  {
    id: "social",
    label: "Social Pressure",
    icon: TrendingDown,
    emotion: "😬 Peer Pressure",
    amount: 800,
    color: "text-xhosa-coral",
    tip: "Ukuzigqaja — self-worth is not bought. True friends don't count your rands.",
  },
  {
    id: "celebration",
    label: "Treat Yourself",
    icon: Sparkles,
    emotion: "🥳 Celebratory",
    amount: 2500,
    color: "text-gold",
    tip: "Celebrations deserve rewards — but tie the reward to the milestone, not a random spend. A R2,500 splurge takes 25 days of R100 saving to recover.",
  },
  {
    id: "jealousy",
    label: "Keeping Up",
    icon: TrendingDown,
    emotion: "😒 Jealous",
    amount: 4500,
    color: "text-xhosa-purple",
    tip: "Comparison is the thief of joy and savings. Their Instagram highlights hide their debt.",
  },
  {
    id: "loneliness",
    label: "Lonely Spend",
    icon: Heart,
    emotion: "😔 Lonely",
    amount: 450,
    color: "text-xhosa-teal",
    tip: "Loneliness spending is real. Call a friend instead — human connection is free and lasts longer than any purchase.",
  },
  {
    id: "yolo",
    label: "YOLO Mode",
    icon: Zap,
    emotion: "🤪 YOLO",
    amount: 3000,
    color: "text-xhosa-red",
    tip: "You only live once — but you also only retire once. Future-you will thank present-you for this pause.",
  },
];

// ── Breathing exercise steps ──────────────────────────────────────────────────

const BREATH_STEPS = [
  { label: "Breathe in", duration: 4, scale: 1.4 },
  { label: "Hold", duration: 4, scale: 1.4 },
  { label: "Breathe out", duration: 6, scale: 1.0 },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function EmotionTracker() {
  const { t }                = useTranslation();
  const formatCurrency       = useCurrencyFormatter();
  const heartRate            = useGameStore((s) => s.health.heartRate);
  const impulseSpendsBlocked = useGameStore((s) => s.impulseSpendsBlocked);
  const simulateImpulse      = useGameStore((s) => s.simulateImpulse);
  const blockImpulse         = useGameStore((s) => s.blockImpulse);

  const [activeTrigger, setActiveTrigger] = useState<SpendTrigger | null>(null);
  const [phase, setPhase]                 = useState<"prompt" | "breathe" | "result">("prompt");
  const [decision, setDecision]           = useState<"bought" | "blocked" | null>(null);
  const [breathStep, setBreathStep]       = useState(0);
  const [breathCount, setBreathCount]     = useState(0);
  const [blockStreak, setBlockStreak]     = useState(0);
  const [showLog, setShowLog]             = useState(false);
  const [decisionLog, setDecisionLog]     = useState<{ label: string; action: "blocked" | "bought"; amount: number; ts: number }[]>([]);

  const stress = Math.min(100, (heartRate - 60) * 2);
  const isHighStress = stress > 50;

  const handleTrigger = (trigger: SpendTrigger) => {
    setActiveTrigger(trigger);
    setPhase(isHighStress ? "breathe" : "prompt");
    setDecision(null);
    setBreathStep(0);
    setBreathCount(0);
  };

  const handleBuy = () => {
    if (!activeTrigger) return;
    simulateImpulse();
    setDecision("bought");
    setPhase("result");
    setBlockStreak(0);
    setDecisionLog((prev) => [
      { label: activeTrigger.label, action: "bought", amount: activeTrigger.amount, ts: Date.now() },
      ...prev.slice(0, 9),
    ]);
  };

  const handleBlock = () => {
    if (!activeTrigger) return;
    blockImpulse();
    setDecision("blocked");
    setPhase("result");
    setBlockStreak((s) => s + 1);
    setDecisionLog((prev) => [
      { label: activeTrigger.label, action: "blocked", amount: activeTrigger.amount, ts: Date.now() },
      ...prev.slice(0, 9),
    ]);
  };

  const handleBreathNext = () => {
    if (breathStep < BREATH_STEPS.length - 1) {
      setBreathStep((s) => s + 1);
    } else {
      const next = breathCount + 1;
      setBreathCount(next);
      if (next >= 3) {
        setPhase("prompt");
      } else {
        setBreathStep(0);
      }
    }
  };

  const closeModal = () => {
    setActiveTrigger(null);
    setPhase("prompt");
    setDecision(null);
  };

  const moneySaved = impulseSpendsBlocked * 500;
  const stressColor = isHighStress ? "text-xhosa-red" : stress > 25 ? "text-gold" : "text-xhosa-teal";
  const stressLabel = isHighStress ? "High — pause before spending" : stress > 25 ? "Moderate" : "Low — clear mind";

  return (
    <div className="page-container pb-24">
      <h2 className="font-serif text-3xl font-bold text-white mb-2 flex items-center gap-3">
        <Brain className="w-6 h-6 text-xhosa-purple" /> {t("emotion.title")}
      </h2>
      <p className="text-muted-foreground text-sm mb-6">{t("emotion.subtitle")}</p>

      {/* ── Stress gauge ───────────────────────────────────────────────────── */}
      <div className="glass-card p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isHighStress ? "bg-xhosa-red/20" : "bg-xhosa-teal/20"}`}>
              <Heart className={`w-6 h-6 ${isHighStress ? "text-xhosa-red animate-pulse" : "text-xhosa-teal"}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t("emotion.heartRate")}</p>
              <p className="text-2xl font-bold text-white">{heartRate} <span className="text-sm text-muted-foreground">bpm</span></p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">{t("emotion.stressLevel")}</p>
            <p className={`text-xl font-bold ${stressColor}`}>{stress}%</p>
            <p className={`text-[10px] ${stressColor}`}>{stressLabel}</p>
          </div>
        </div>
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full transition-colors ${isHighStress ? "bg-xhosa-red" : stress > 25 ? "bg-gold" : "bg-xhosa-teal"}`}
            animate={{ width: `${stress}%` }}
            transition={{ duration: 0.6 }}
          />
        </div>
        {isHighStress && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="mt-3 flex items-start gap-2 text-xs text-xhosa-red"
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            High stress detected — you are 3× more likely to make a regretted purchase right now. Breathe first.
          </motion.div>
        )}
      </div>

      {/* ── Stats ──────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="glass-card p-4 text-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{t("emotion.blockedSpends")}</p>
          <p className="text-2xl font-bold text-xhosa-teal">{impulseSpendsBlocked}</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{t("emotion.moneySaved")}</p>
          <p className="text-2xl font-bold gold-text">{formatCurrency(moneySaved)}</p>
        </div>
        <motion.div
          className="glass-card p-4 text-center"
          animate={blockStreak > 0 ? { boxShadow: ["0 0 0px rgba(212,175,55,0)", "0 0 16px rgba(212,175,55,0.35)", "0 0 0px rgba(212,175,55,0)"] } : {}}
          transition={{ duration: 2, repeat: blockStreak > 0 ? Infinity : 0 }}
        >
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Block Streak</p>
          <div className="flex items-center justify-center gap-1">
            <Flame className={`w-4 h-4 ${blockStreak >= 3 ? "text-gold" : "text-muted-foreground"}`} />
            <p className={`text-2xl font-bold ${blockStreak >= 3 ? "gold-text" : "text-white"}`}>{blockStreak}</p>
          </div>
        </motion.div>
      </div>

      {/* ── Trigger cards ──────────────────────────────────────────────────── */}
      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">
        Simulate a spending trigger
      </p>
      <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-6">
        {TRIGGERS.map((trigger) => {
          const Icon = trigger.icon;
          return (
            <motion.button
              key={trigger.id}
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => handleTrigger(trigger)}
              className="glass-card-hover p-3 sm:p-4 text-left"
            >
              <div className={`w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center mb-2 ${trigger.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-xs font-semibold text-white">{trigger.label}</p>
              <p className={`text-[10px] ${trigger.color}`}>{trigger.emotion}</p>
              <p className="text-xs text-muted-foreground mt-1">{formatCurrency(trigger.amount)}</p>
            </motion.button>
          );
        })}
      </div>

      {/* ── Decision log ───────────────────────────────────────────────────── */}
      {decisionLog.length > 0 && (
        <div className="glass-card p-5 mb-6">
          <button
            type="button"
            className="w-full flex items-center justify-between"
            onClick={() => setShowLog((s) => !s)}
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gold" />
              <span className="font-semibold text-white text-sm">Decision Log</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/20">
                {decisionLog.length}
              </span>
            </div>
            <motion.div animate={{ rotate: showLog ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </motion.div>
          </button>

          <AnimatePresence>
            {showLog && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="mt-3 space-y-2">
                  {decisionLog.map((entry, i) => (
                    <motion.div
                      key={entry.ts}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex items-center justify-between text-sm py-2 border-b border-white/5 last:border-0"
                    >
                      <div className="flex items-center gap-2">
                        {entry.action === "blocked"
                          ? <ShieldCheck className="w-3.5 h-3.5 text-xhosa-teal" />
                          : <ShoppingBag className="w-3.5 h-3.5 text-xhosa-red" />}
                        <span className={`text-xs font-semibold ${entry.action === "blocked" ? "text-xhosa-teal" : "text-xhosa-red"}`}>
                          {entry.action === "blocked" ? "BLOCKED" : "BOUGHT"}
                        </span>
                        <span className="text-white text-xs">{entry.label}</span>
                      </div>
                      <div className="text-right">
                        <p className={`text-xs font-medium ${entry.action === "blocked" ? "text-xhosa-teal" : "text-xhosa-red"}`}>
                          {entry.action === "blocked" ? "+" : "−"}{formatCurrency(entry.amount)}
                        </p>
                        <p className="text-[9px] text-muted-foreground">
                          {new Date(entry.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-white/10 flex justify-between text-xs">
                  <span className="text-muted-foreground">Session net</span>
                  <span className={`font-bold ${
                    decisionLog.reduce((s, e) => s + (e.action === "blocked" ? e.amount : -e.amount), 0) >= 0
                      ? "text-xhosa-teal" : "text-xhosa-red"
                  }`}>
                    {decisionLog.reduce((s, e) => s + (e.action === "blocked" ? e.amount : -e.amount), 0) >= 0 ? "+" : ""}
                    {formatCurrency(Math.abs(decisionLog.reduce((s, e) => s + (e.action === "blocked" ? e.amount : -e.amount), 0)))}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ── Wisdom card ────────────────────────────────────────────────────── */}
      <div className="glass-card p-5 border-l-4 border-l-xhosa-purple">
        <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
          <Wind className="w-4 h-4 text-xhosa-purple" /> Phumla — Rest
        </h4>
        <p className="text-sm text-white/70">
          In Xhosa tradition, stillness brings clarity. Before every purchase, ask:
          <span className="text-white font-medium"> "Do I need this, or do I feel this?"</span>
        </p>
        <p className="text-xs text-muted-foreground mt-2 italic">
          The 24-hour rule: wait a day before any unplanned purchase over R200. 80% of the time, the urge passes.
        </p>
      </div>

      {/* ── Spend scenario modal ───────────────────────────────────────────── */}
      <AnimatePresence>
        {activeTrigger && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ y: 60, scale: 0.97 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              className="bg-dark-card border border-white/10 rounded-3xl p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* ── Breathing phase ── */}
              {phase === "breathe" && (
                <div className="text-center">
                  <p className="text-xs text-xhosa-red uppercase tracking-widest mb-4">High Stress Detected — Breathe First</p>
                  <div className="relative flex items-center justify-center mb-6">
                    <motion.div
                      className="w-24 h-24 rounded-full bg-xhosa-teal/20 border-2 border-xhosa-teal/40 flex items-center justify-center"
                      animate={{ scale: BREATH_STEPS[breathStep].scale }}
                      transition={{ duration: BREATH_STEPS[breathStep].duration, ease: "easeInOut" }}
                    >
                      <Wind className="w-8 h-8 text-xhosa-teal" />
                    </motion.div>
                  </div>
                  <p className="text-xl font-semibold text-white mb-1">{BREATH_STEPS[breathStep].label}</p>
                  <p className="text-xs text-muted-foreground mb-6">
                    Cycle {breathCount + 1} of 3 · Step {breathStep + 1} of {BREATH_STEPS.length}
                  </p>
                  <button
                    type="button"
                    className="btn-outline-premium w-full"
                    onClick={handleBreathNext}
                  >
                    {breathStep < BREATH_STEPS.length - 1 ? "Next step" : breathCount < 2 ? "Next cycle" : "I'm calm — continue"}
                  </button>
                </div>
              )}

              {/* ── Spend prompt phase ── */}
              {phase === "prompt" && (
                <div>
                  <button type="button" onClick={closeModal} className="float-right text-muted-foreground hover:text-white">✕</button>
                  <div className="text-center mb-5 pt-2">
                    <p className="text-3xl mb-2">{activeTrigger.emotion}</p>
                    <h3 className="font-serif text-xl font-bold text-white mb-1">{activeTrigger.label}</h3>
                    <p className="text-xs text-muted-foreground">You feel the urge to spend</p>
                    <p className="text-3xl font-bold gold-text mt-3">{formatCurrency(activeTrigger.amount)}</p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-5">
                    <p className="text-xs text-gold uppercase tracking-wider mb-1">Reality check</p>
                    <p className="text-sm text-white/80">{activeTrigger.tip}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={handleBlock}
                      className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-xhosa-teal/10 border border-xhosa-teal/30 text-xhosa-teal hover:bg-xhosa-teal/20 transition-all"
                    >
                      <ShieldCheck className="w-6 h-6" />
                      <span className="text-xs font-semibold">Block It</span>
                      <span className="text-[9px] text-center opacity-70">Save {formatCurrency(activeTrigger.amount)}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleBuy}
                      className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10 transition-all"
                    >
                      <ShoppingBag className="w-6 h-6" />
                      <span className="text-xs font-semibold">Buy It</span>
                      <span className="text-[9px] text-center opacity-70">Spend {formatCurrency(activeTrigger.amount)}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ── Result phase ── */}
              {phase === "result" && decision && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                  {decision === "blocked" ? (
                    <>
                      <div className="w-16 h-16 bg-xhosa-teal/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-xhosa-teal" />
                      </div>
                      <h3 className="font-serif text-xl font-bold text-xhosa-teal mb-2">Emotional Discipline!</h3>
                      <p className="text-sm text-white/70 mb-2">
                        You blocked a {formatCurrency(activeTrigger.amount)} {activeTrigger.label.toLowerCase()}.
                      </p>
                      <div className="bg-gold/5 border border-gold/20 rounded-2xl p-4 mb-5">
                        <p className="text-xs text-gold mb-1">What this saves over time</p>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between"><span className="text-white/60">Monthly (×4)</span><span className="text-gold">{formatCurrency(activeTrigger.amount * 4)}</span></div>
                          <div className="flex justify-between"><span className="text-white/60">Annually</span><span className="text-gold">{formatCurrency(activeTrigger.amount * 48)}</span></div>
                          <div className="flex justify-between"><span className="text-white/60">Invested at 10% for 5 years</span><span className="text-gold font-bold">{formatCurrency(Math.round(activeTrigger.amount * 48 * 5 * 1.1))}</span></div>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-4">+{formatCurrency(200)} cash · +10 XP added to your account</p>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-xhosa-red/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShoppingBag className="w-8 h-8 text-xhosa-red" />
                      </div>
                      <h3 className="font-serif text-xl font-bold text-xhosa-red mb-2">Spent {formatCurrency(activeTrigger.amount)}</h3>
                      <p className="text-sm text-white/70 mb-5">
                        Was this a need or a feeling? Track it. Next time, try the breathing exercise first.
                      </p>
                    </>
                  )}
                  <button type="button" className="btn-premium w-full" onClick={closeModal}>
                    Continue
                  </button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
