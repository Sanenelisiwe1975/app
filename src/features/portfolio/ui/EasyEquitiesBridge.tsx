import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp, CheckCircle, ArrowRight, Shield, Zap,
  Coins, ExternalLink, X, Loader2, Star,
} from "lucide-react";
import { useGameStore } from "@/shared/stores/gameStore";
import { useUserStore } from "@/shared/stores/userStore";
import { useAudio } from "@/shared/hooks/useAudio";
import { useCurrencyFormatter } from "@/shared/hooks/useCurrencyFormatter";

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = "select" | "confirm" | "processing" | "success";

// ─── Constants ────────────────────────────────────────────────────────────────

const PRESETS = [50, 100, 500, 1000] as const;
const XP_AWARD = 75;
const BADGE = "Real Investor 🏆";

const PROCESSING_STATUSES = [
  "Verifying identity…",
  "Connecting to JSE…",
  "Routing order…",
  "Confirming settlement…",
  "Finalising…",
];

const CONFETTI_COLORS = ["#D4AF37", "#1ABC9C", "#E74C3C", "#9B59B6", "#3498DB", "#E67E22", "#F1C40F"];

const MINDSET_MESSAGES: Record<string, string> = {
  spaza:      "From spaza to stocks — ukutshintshanisa igolide! Your shop taught you patience; now let your money work for you.",
  taxi:       "Every route builds wealth. This is your first route on the real JSE — drive it all the way to your destination.",
  food:       "The streets of Mzansi taught you margins. Now you're earning market margins. Amandla!",
  engineering:"Precision in engineering, precision in investing. Your first real position: calculated, bold, and built to last.",
  accounting: "You know the numbers better than anyone. Now you own them. This investment is your first real balance-sheet win.",
  law:        "Every contract starts with a signature. This is your wealth contract — signed, sealed, and delivered. Hamba kahle.",
  medical:    "You invest daily in your patients' health. Today, invest in your own financial health. It compounds like compound interest.",
  restaurant: "You built a menu that feeds people. Now build a portfolio that feeds generations. A diversified plate lasts longest.",
  salon:      "Style meets strategy — you're cutting into real markets now. Mamelani!",
  logistics:  "You move goods across borders. Now move capital across markets. The route to wealth is clear.",
  ecommerce:  "You converted clicks to cash. Now convert rands to equity. Your LTV just grew beyond any screen.",
  mining:     "From the earth's depth to the market's height. Your ore is now equity. Ngxatsho! Build the empire.",
  realestate: "They aren't making more land — but opportunity? That they're making every day. You just claimed yours.",
  tech:       "Code compounds. Capital compounds. Together they're unstoppable. Welcome to the real cap table.",
  doctor:     "You heal every day. Now your money heals every day too — compounding quietly toward your legacy.",
  dentist:    "From dental chair to executive chair. This investment is your first seat at the real board table.",
  physio:     "Movement is money. Your capital just started moving in the right direction. Qina — keep going!",
};

function getMotivation(mindsetId: string | undefined, amount: number, fmt: (n: number) => string): string {
  const base = mindsetId ? (MINDSET_MESSAGES[mindsetId] ?? "") : "";
  return base || `This ${fmt(amount)} investment is your bridge from simulation to reality. The journey of a thousand rands begins with a single trade. Ukuphila!`;
}

function generateRef(): string {
  const ts  = Date.now().toString(36).toUpperCase();
  const rnd = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `EE-${ts}-${rnd}`;
}

// ─── Animated XP counter ─────────────────────────────────────────────────────

function XPCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const step = Math.ceil(target / 30);
    const timer = setInterval(() => {
      setCount((c) => {
        const next = c + step;
        if (next >= target) { clearInterval(timer); return target; }
        return next;
      });
    }, 35);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count}</span>;
}

// ─── Sub-steps ────────────────────────────────────────────────────────────────

function SelectStep({
  amount, setAmount, custom, setCustom, cash, onNext, onClose,
}: {
  amount: number | "";
  setAmount: (v: number | "") => void;
  custom: string;
  setCustom: (v: string) => void;
  cash: number;
  onNext: () => void;
  onClose: () => void;
}) {
  const formatCurrency = useCurrencyFormatter();
  const selected = typeof amount === "number" ? amount : parseFloat(custom) || 0;
  const canAfford = selected > 0 && selected <= cash;
  const overLimit = selected > cash;

  return (
    <motion.div
      key="select"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className="p-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 rounded-xl bg-gold/15 flex items-center justify-center"
            >
              <Coins className="w-4 h-4 text-gold" />
            </motion.div>
            <span className="text-xs font-semibold text-gold uppercase tracking-widest">Real World Bridge</span>
          </div>
          <h3 className="font-serif text-xl font-bold text-white">Transfer to EasyEquities</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Simulate your first real investment move</p>
        </div>
        <button type="button" onClick={onClose} className="text-muted-foreground hover:text-white transition-colors mt-0.5">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Available balance with pulse animation */}
      <motion.div
        animate={{ boxShadow: ["0 0 0px rgba(212,175,55,0)", "0 0 16px rgba(212,175,55,0.12)", "0 0 0px rgba(212,175,55,0)"] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="bg-white/5 rounded-2xl p-4 mb-5 border border-white/8"
      >
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Simulated balance available</p>
        <p className="text-2xl font-bold gold-text">{formatCurrency(cash)}</p>
      </motion.div>

      {/* Preset amounts */}
      <p className="text-xs text-muted-foreground mb-3 uppercase tracking-widest">Choose amount</p>
      <div className="grid grid-cols-4 gap-2 mb-4">
        {PRESETS.map((p, i) => (
          <motion.button
            key={p}
            type="button"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => { setAmount(p); setCustom(""); }}
            className={`relative rounded-xl py-2.5 text-sm font-bold transition-all border overflow-hidden ${
              amount === p
                ? "bg-gold/20 border-gold text-gold"
                : "bg-white/5 border-white/10 text-muted-foreground hover:border-gold/30 hover:text-white"
            }`}
          >
            {amount === p && (
              <motion.div
                layoutId="preset-glow"
                className="absolute inset-0 bg-gold/10 rounded-xl"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative">R{p}</span>
          </motion.button>
        ))}
      </div>

      {/* Custom amount */}
      <div className="relative mb-5">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">R</span>
        <input
          type="number"
          min="1"
          placeholder="Custom amount"
          value={custom}
          onChange={(e) => { setCustom(e.target.value); setAmount(""); }}
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold/40 text-sm transition-colors"
        />
      </div>

      <AnimatePresence>
        {overLimit && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-xs text-xhosa-red mb-3 flex items-center gap-1"
          >
            <Shield className="w-3 h-3" /> Insufficient balance — reduce amount
          </motion.p>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        disabled={!canAfford}
        onClick={onNext}
        whileHover={canAfford ? { scale: 1.02 } : {}}
        whileTap={canAfford ? { scale: 0.97 } : {}}
        className="btn-premium w-full flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Continue <ArrowRight className="w-4 h-4" />
      </motion.button>

      <p className="text-[10px] text-muted-foreground text-center mt-4 leading-relaxed">
        🔒 Simulation only. No real money moves. Real investing happens on EasyEquities.
      </p>
    </motion.div>
  );
}

function ConfirmStep({
  amount, mindsetName, onConfirm, onBack,
}: {
  amount: number;
  mindsetName: string;
  onConfirm: () => void;
  onBack: () => void;
}) {
  const formatCurrency = useCurrencyFormatter();
  return (
    <motion.div
      key="confirm"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className="p-6"
    >
      <h3 className="font-serif text-xl font-bold text-white mb-1">Confirm Transfer</h3>
      <p className="text-xs text-muted-foreground mb-6">Review your simulated order before confirming</p>

      {/* Transfer card with animated shimmer */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-gold/20 overflow-hidden mb-5"
      >
        {/* From */}
        <div className="bg-white/5 p-4 border-b border-white/8">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">From</p>
          <p className="text-sm font-semibold text-white">FinLit Simulated Account</p>
          <p className="text-xs text-muted-foreground">{mindsetName} path</p>
        </div>
        {/* Amount — pulsing gold */}
        <motion.div
          animate={{ backgroundColor: ["rgba(212,175,55,0.04)", "rgba(212,175,55,0.10)", "rgba(212,175,55,0.04)"] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="p-4 border-b border-white/8 text-center"
        >
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Amount</p>
          <motion.p
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="font-serif text-3xl font-bold gold-text"
          >
            {formatCurrency(amount)}
          </motion.p>
        </motion.div>
        {/* To */}
        <div className="bg-white/5 p-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">To</p>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gold/20 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-gold" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">EasyEquities Account</p>
              <p className="text-xs text-muted-foreground">JSE Market Access</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Awards preview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-xhosa-teal/10 border border-xhosa-teal/20 rounded-xl p-3 mb-5 flex items-center gap-3"
      >
        <motion.div
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 2 }}
        >
          <Zap className="w-4 h-4 text-xhosa-teal shrink-0" />
        </motion.div>
        <p className="text-xs text-white/80">
          You'll earn <span className="text-xhosa-teal font-semibold">+{XP_AWARD} XP</span> and the{" "}
          <span className="text-gold font-semibold">"{BADGE}"</span> badge
        </p>
      </motion.div>

      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="btn-premium w-full flex items-center justify-center gap-2 mb-3"
        onClick={onConfirm}
      >
        Confirm Transfer <CheckCircle className="w-4 h-4" />
      </motion.button>
      <button type="button" className="btn-outline-premium w-full" onClick={onBack}>
        ← Back
      </button>
    </motion.div>
  );
}

function ProcessingStep() {
  const [statusIdx, setStatusIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setStatusIdx((i) => Math.min(i + 1, PROCESSING_STATUSES.length - 1)), 500);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div
      key="processing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-10 flex flex-col items-center justify-center min-h-[340px]"
    >
      {/* Multi-ring animation */}
      <div className="relative w-28 h-28 mb-6">
        {/* Outer rotating ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-transparent"
          style={{ borderTopColor: "#D4AF37", borderRightColor: "rgba(212,175,55,0.3)" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
        />
        {/* Counter-rotating ring */}
        <motion.div
          className="absolute inset-2 rounded-full border-2 border-transparent"
          style={{ borderBottomColor: "#1ABC9C", borderLeftColor: "rgba(26,188,156,0.3)" }}
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        {/* Pulsing rings */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-4 rounded-full border border-gold/20"
            animate={{ scale: [1, 1.5 + i * 0.3], opacity: [0.5, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.5, ease: "easeOut" }}
          />
        ))}
        {/* Center */}
        <motion.div
          className="absolute inset-4 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          <Loader2 className="w-7 h-7 text-gold animate-spin" />
        </motion.div>

        {/* Orbiting gold dot */}
        <motion.div
          className="absolute w-2.5 h-2.5 rounded-full bg-gold shadow-[0_0_8px_rgba(212,175,55,0.8)]"
          style={{ top: "50%", left: "50%", marginTop: -5, marginLeft: -5 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
          transformTemplate={(_, generated) =>
            `${generated} translateX(52px)`
          }
        />
        {/* Orbiting teal dot */}
        <motion.div
          className="absolute w-2 h-2 rounded-full bg-xhosa-teal shadow-[0_0_6px_rgba(26,188,156,0.8)]"
          style={{ top: "50%", left: "50%", marginTop: -4, marginLeft: -4 }}
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          transformTemplate={(_, generated) =>
            `${generated} translateX(42px)`
          }
        />
      </div>

      {/* Cycling status text */}
      <AnimatePresence mode="wait">
        <motion.p
          key={statusIdx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="font-serif text-lg font-semibold text-white mb-1 text-center"
        >
          {PROCESSING_STATUSES[statusIdx]}
        </motion.p>
      </AnimatePresence>
      <p className="text-sm text-muted-foreground text-center">Routing your order to JSE settlement</p>

      {/* Verification tags — staggered fade in */}
      <div className="flex gap-1 mt-5">
        {["KYC", "FICA", "JSE", "EFT"].map((label, i) => (
          <motion.span
            key={label}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.35, type: "spring", stiffness: 300 }}
            className="text-[10px] px-2 py-1 rounded-full bg-gold/10 text-gold/80 border border-gold/20 font-semibold"
          >
            {label} ✓
          </motion.span>
        ))}
      </div>

      {/* Progress bar */}
      <div className="w-48 h-1 bg-white/10 rounded-full mt-5 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-gold/60 to-gold rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2.3, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
}

function SuccessStep({
  amount, refNum, motivation, onClose,
}: {
  amount: number;
  refNum: string;
  motivation: string;
  onClose: () => void;
}) {
  const formatCurrency = useCurrencyFormatter();
  // Generate confetti particles once
  const particles = useRef(
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      x: (Math.random() - 0.5) * 240,
      y: -(60 + Math.random() * 120),
      rotate: Math.random() * 360,
      size: 4 + Math.random() * 5,
      delay: Math.random() * 0.4,
    }))
  ).current;

  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="p-6 relative overflow-hidden"
    >
      {/* Trophy burst */}
      <div className="text-center mb-5 relative">
        {/* Confetti particles */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-sm"
              style={{ width: p.size, height: p.size, backgroundColor: p.color }}
              initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
              animate={{ x: p.x, y: p.y, opacity: 0, rotate: p.rotate }}
              transition={{ duration: 1.1 + Math.random() * 0.4, delay: p.delay, ease: "easeOut" }}
            />
          ))}
        </div>

        {/* Trophy with glow */}
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
          className="relative inline-flex"
        >
          <motion.div
            animate={{ boxShadow: ["0 0 0px rgba(212,175,55,0)", "0 0 32px rgba(212,175,55,0.5)", "0 0 0px rgba(212,175,55,0)"] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: 0.5 }}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-gold/30 to-gold/5 border border-gold/30 flex items-center justify-center mx-auto mb-3"
          >
            <motion.span
              className="text-5xl"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1.5 }}
            >
              🏆
            </motion.span>
          </motion.div>
        </motion.div>

        {/* Floating stars */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${12 + i * 14}%`,
              top: i % 2 === 0 ? "5%" : "15%",
            }}
            initial={{ opacity: 0, y: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], y: -50, scale: [0, 1.3, 0] }}
            transition={{ delay: 0.15 + i * 0.1, duration: 1.4 }}
          >
            <Star className="w-3 h-3 text-gold fill-gold" />
          </motion.div>
        ))}

        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-serif text-2xl font-bold text-white mb-1"
        >
          Order Confirmed!
        </motion.h3>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-muted-foreground"
        >
          Isimile sijabulile — your investment journey is real
        </motion.p>
      </div>

      {/* Confirmation card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="rounded-2xl border border-gold/25 bg-gold/5 p-4 mb-4"
      >
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-muted-foreground">Reference</p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="text-xs font-mono font-semibold text-gold tracking-wider"
          >
            {refNum}
          </motion.p>
        </div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-muted-foreground">Amount invested</p>
          <p className="text-sm font-bold text-white">{formatCurrency(amount)}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Settlement</p>
          <p className="text-xs text-xhosa-teal">T+3 Business Days</p>
        </div>
      </motion.div>

      {/* XP & badge awards with animated counter */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="flex gap-2 mb-4"
      >
        <motion.div
          className="flex-1 bg-xhosa-teal/10 border border-xhosa-teal/20 rounded-xl p-3 text-center"
          animate={{ boxShadow: ["0 0 0px rgba(26,188,156,0)", "0 0 14px rgba(26,188,156,0.25)", "0 0 0px rgba(26,188,156,0)"] }}
          transition={{ duration: 1.6, repeat: 3, delay: 0.6 }}
        >
          <p className="text-lg font-bold text-xhosa-teal">+<XPCounter target={XP_AWARD} /></p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">XP Earned</p>
        </motion.div>
        <motion.div
          className="flex-1 bg-gold/10 border border-gold/20 rounded-xl p-3 text-center"
          animate={{ boxShadow: ["0 0 0px rgba(212,175,55,0)", "0 0 14px rgba(212,175,55,0.25)", "0 0 0px rgba(212,175,55,0)"] }}
          transition={{ duration: 1.6, repeat: 3, delay: 0.9 }}
        >
          <p className="text-sm font-bold text-gold">{BADGE}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Badge Unlocked</p>
        </motion.div>
      </motion.div>

      {/* Motivational message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-white/5 rounded-xl p-4 mb-5 border border-white/8 relative overflow-hidden"
      >
        {/* Subtle shimmer sweep */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent -translate-x-full"
          animate={{ translateX: ["−100%", "200%"] }}
          transition={{ duration: 1.5, delay: 0.8 }}
        />
        <p className="text-xs text-white/75 leading-relaxed italic relative">"{motivation}"</p>
      </motion.div>

      {/* Disclaimer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-[10px] text-muted-foreground text-center mb-4 leading-relaxed"
      >
        ⚠️ This is a simulation. No real money has moved. Real investing happens on EasyEquities — SA's easiest stock market platform.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75 }}
        className="flex gap-2"
      >
        <button type="button" className="btn-outline-premium flex-1" onClick={onClose}>
          Done
        </button>
        <motion.a
          href="https://www.easyequities.co.za"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="btn-premium flex-1 flex items-center justify-center gap-1.5 text-sm"
        >
          Open Real Account <ExternalLink className="w-3.5 h-3.5" />
        </motion.a>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface Props {
  onClose: () => void;
}

export default function EasyEquitiesBridge({ onClose }: Props) {
  const formatCurrency  = useCurrencyFormatter();
  const [step, setStep]     = useState<Step>("select");
  const [amount, setAmount] = useState<number | "">("");
  const [custom, setCustom] = useState("");
  const [refNum, setRefNum] = useState("");

  const cash     = useGameStore((s) => s.cash);
  const addCash  = useGameStore((s) => s.addCash);
  const addXp    = useGameStore((s) => s.addXp);
  const addBadge = useGameStore((s) => s.addBadge);
  const mindset  = useUserStore((s) => s.mindset);

  const { playSuccess } = useAudio();
  const didAward = useRef(false);

  const selectedAmount = typeof amount === "number" ? amount : (parseFloat(custom) || 0);

  const handleConfirm = useCallback(() => {
    if (didAward.current) return;
    setStep("processing");
    const ref = generateRef();
    setRefNum(ref);

    setTimeout(() => {
      if (!didAward.current) {
        didAward.current = true;
        addCash(-selectedAmount);
        addXp(XP_AWARD);
        addBadge(BADGE);
        playSuccess();
      }
      setStep("success");
    }, 2600);
  }, [selectedAmount, addCash, addXp, addBadge, playSuccess]);

  const motivation = getMotivation(mindset?.id, selectedAmount, formatCurrency);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Animated backdrop orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-72 h-72 bg-gold/6 rounded-full blur-3xl pointer-events-none"
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-xhosa-teal/6 rounded-full blur-3xl pointer-events-none"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-1/2 right-1/3 w-32 h-32 bg-xhosa-purple/5 rounded-full blur-2xl pointer-events-none"
        animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <motion.div
        initial={{ y: 100, opacity: 0, scale: 0.94 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 100, opacity: 0, scale: 0.94 }}
        transition={{ type: "spring", stiffness: 240, damping: 26 }}
        className="relative w-full max-w-md bg-dark-card rounded-3xl overflow-hidden"
        style={{
          border: "1px solid rgba(212,175,55,0.3)",
          boxShadow: "0 0 60px rgba(212,175,55,0.08), 0 24px 48px rgba(0,0,0,0.6)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated shimmer top line */}
        <motion.div
          className="h-px"
          style={{ background: "linear-gradient(to right, transparent, #D4AF37, transparent)" }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Beadwork accent strip with entry animation */}
        <div className="flex h-1 overflow-hidden">
          {["#D4AF37", "#E74C3C", "#1ABC9C", "#3498DB", "#9B59B6", "#E67E22", "#F1C40F", "#D4AF37"].map((c, i) => (
            <motion.div
              key={i}
              className="flex-1"
              style={{ backgroundColor: c }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === "select" && (
            <SelectStep
              amount={amount}
              setAmount={setAmount}
              custom={custom}
              setCustom={setCustom}
              cash={cash}
              onNext={() => setStep("confirm")}
              onClose={onClose}
            />
          )}
          {step === "confirm" && (
            <ConfirmStep
              amount={selectedAmount}
              mindsetName={mindset?.name ?? "Your Path"}
              onConfirm={handleConfirm}
              onBack={() => setStep("select")}
            />
          )}
          {step === "processing" && <ProcessingStep />}
          {step === "success" && (
            <SuccessStep
              amount={selectedAmount}
              refNum={refNum}
              motivation={motivation}
              onClose={onClose}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
