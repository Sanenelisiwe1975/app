import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Props {
  /** Called when the user taps/clicks the avatar */
  onTap?: () => void;
  /** Whether to auto-show the bubble without interaction (e.g. on first mount) */
  autoGreet?: boolean;
}

// ── Particle ring config ──────────────────────────────────────────────────────

const PARTICLE_COUNT = 12;
const PARTICLES = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
  const angle  = (i / PARTICLE_COUNT) * (2 * Math.PI);
  const r      = 200 + (i % 3) * 18;
  const size   = 2 + (i % 3) * 1.5;
  const dur    = 14 + (i % 5) * 2.5;
  const delay  = -(i * (dur / PARTICLE_COUNT));
  // Two points on the orbit for a natural ellipse
  const x1 = Math.cos(angle) * r;
  const y1 = Math.sin(angle) * (r * 0.35);
  const x2 = Math.cos(angle + Math.PI) * r;
  const y2 = Math.sin(angle + Math.PI) * (r * 0.35);
  return { i, size, dur, delay, x1, y1, x2, y2 };
});

// ── Procedural welcome chord ──────────────────────────────────────────────────

function playWelcomeChord() {
  try {
    const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx() as AudioContext;
    const now = ctx.currentTime;

    // Warm C-major pentatonic arpeggio — C4 E4 G4 C5 E5
    const notes = [261.63, 329.63, 392.0, 523.25, 659.25];
    notes.forEach((freq, i) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0, now + i * 0.11);
      gain.gain.linearRampToValueAtTime(0.09, now + i * 0.11 + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.11 + 1.4);
      osc.start(now + i * 0.11);
      osc.stop(now + i * 0.11 + 1.6);
    });

    // Warm pad underneath
    const pad  = ctx.createOscillator();
    const padG = ctx.createGain();
    pad.connect(padG);
    padG.connect(ctx.destination);
    pad.type = "triangle";
    pad.frequency.setValueAtTime(130.81, now); // C3
    padG.gain.setValueAtTime(0, now);
    padG.gain.linearRampToValueAtTime(0.05, now + 0.2);
    padG.gain.exponentialRampToValueAtTime(0.001, now + 2.2);
    pad.start(now);
    pad.stop(now + 2.5);
  } catch {
    // AudioContext unavailable — silent fail
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function WelcomeAvatar({ onTap, autoGreet = false }: Props) {
  const prefersReduced = useReducedMotion();
  const [showBubble, setShowBubble]   = useState(autoGreet);
  const [waving, setWaving]           = useState(autoGreet);
  const [glowing, setGlowing]         = useState(false);
  const [interacted, setInteracted]   = useState(false);
  const bubbleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const waveTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerInteraction = useCallback(() => {
    if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
    if (waveTimer.current)   clearTimeout(waveTimer.current);

    setShowBubble(true);
    setWaving(true);
    setGlowing(true);
    setInteracted(true);
    playWelcomeChord();
    onTap?.();

    bubbleTimer.current = setTimeout(() => setShowBubble(false), 3800);
    waveTimer.current   = setTimeout(() => { setWaving(false); setGlowing(false); }, 2200);
  }, [onTap]);

  const handleHoverStart = () => {
    if (prefersReduced) return;
    setShowBubble(true);
    setWaving(true);
  };

  const handleHoverEnd = () => {
    if (prefersReduced) return;
    setShowBubble(false);
    setWaving(false);
  };

  return (
    <div className="relative flex items-center justify-center" style={{ width: 340, height: 420 }}>

      {/* ── Deep ambient glow ──────────────────────────────────────────── */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{ width: 320, height: 320, background: "radial-gradient(circle, rgba(212,175,55,0.18) 0%, transparent 70%)" }}
        animate={glowing
          ? { scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }
          : { scale: 1, opacity: 0.6 }
        }
        transition={{ duration: 2.4, repeat: glowing ? Infinity : 0, ease: "easeInOut" }}
      />

      {/* ── Orbiting gold particles ────────────────────────────────────── */}
      {!prefersReduced && PARTICLES.map((p) => (
        <motion.div
          key={p.i}
          className="absolute rounded-full bg-gold pointer-events-none"
          style={{ width: p.size, height: p.size, top: "50%", left: "50%" }}
          animate={{ x: [p.x1, p.x2, p.x1], y: [p.y1, p.y2, p.y1], opacity: [0.15, 0.7, 0.15], scale: [0.7, 1.4, 0.7] }}
          transition={{ duration: p.dur, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
        />
      ))}

      {/* ── Speech bubble ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {showBubble && (
          <motion.div
            key="bubble"
            className="absolute z-30 pointer-events-none"
            style={{ top: -12, left: "50%", x: "-50%" }}
            initial={{ opacity: 0, y: 16, scale: 0.75 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.85 }}
            transition={{ type: "spring", stiffness: 420, damping: 24 }}
          >
            <div className="relative bg-[#12100e] border border-gold/50 rounded-2xl px-5 py-3 shadow-xl shadow-gold/20">
              {/* Shimmer line */}
              <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent rounded-full" />
              <p className="font-serif text-xl font-bold gold-text whitespace-nowrap text-center">
                Wamkelekile! 🌟
              </p>
              <p className="text-[11px] text-white/55 text-center mt-0.5 tracking-wide">
                Welcome, Future Wealth Builder
              </p>
              {/* Bubble tail */}
              <div
                className="absolute -bottom-[9px] left-1/2 -translate-x-1/2 w-4 h-4 bg-[#12100e] border-r border-b border-gold/50 rotate-45"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Avatar card ────────────────────────────────────────────────── */}
      <motion.button
        type="button"
        aria-label="Tap Yanga to hear Wamkelekile — your FINLIT wealth guide"
        className="relative z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-3xl"
        whileHover={prefersReduced ? {} : { scale: 1.04, y: -4 }}
        whileTap={prefersReduced ? {}   : { scale: 0.97 }}
        transition={{ type: "spring", stiffness: 280, damping: 18 }}
        onHoverStart={handleHoverStart}
        onHoverEnd={handleHoverEnd}
        onClick={triggerInteraction}
      >
        {/* Animated gold ring border */}
        <motion.div
          className="absolute -inset-1 rounded-3xl pointer-events-none"
          style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.6), rgba(240,214,153,0.1), rgba(212,175,55,0.6))" }}
          animate={glowing
            ? { opacity: [0.5, 1, 0.5], rotate: [0, 360] }
            : { opacity: 0.35 }
          }
          transition={glowing
            ? { opacity: { duration: 1.5, repeat: Infinity }, rotate: { duration: 8, repeat: Infinity, ease: "linear" } }
            : {}
          }
        />

        {/* Image container */}
        <div className="relative overflow-hidden rounded-3xl border border-gold/25 shadow-2xl shadow-black/60" style={{ width: 300, height: 360 }}>
          <img
            src="/welcome-bg.jpg"
            alt="Yanga — FINLIT Wealth Guide in traditional Xhosa attire"
            className="w-full h-full object-cover object-center"
            draggable={false}
          />

          {/* Overlay: top fade (blends image top into dark bg) */}
          <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black/30 to-transparent pointer-events-none" />

          {/* Overlay: bottom fade + name plate */}
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />
          <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
            <p className="text-xs font-semibold text-gold/90 tracking-widest uppercase">Your FINLIT Guide</p>
          </div>
        </div>
      </motion.button>

      {/* ── Waving hand ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {waving && (
          <motion.div
            key="wave"
            className="absolute z-20 pointer-events-none select-none text-4xl"
            style={{ bottom: 80, right: 50 }}
            initial={{ opacity: 0, scale: 0.4, rotate: -30 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: [0, 18, -12, 20, -8, 15, 0],
            }}
            exit={{ opacity: 0, scale: 0.4, rotate: -20 }}
            transition={{
              opacity: { duration: 0.2 },
              scale:   { type: "spring", stiffness: 350, damping: 18 },
              rotate:  { duration: 1.4, ease: "easeInOut", repeat: 1, repeatDelay: 0.3 },
            }}
          >
            👋
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Tap hint ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {!interacted && (
          <motion.div
            className="absolute z-10 pointer-events-none"
            style={{ bottom: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <p className="text-[10px] font-medium text-gold/50 tracking-[0.3em] uppercase">
              Tap to begin
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
