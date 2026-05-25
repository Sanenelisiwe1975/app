import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WelcomeAvatar from "@/widgets/welcome-avatar/WelcomeAvatar";

interface Props {
  onComplete: () => void;
}

const BEAD_COLOURS = ["#D4AF37","#E74C3C","#1ABC9C","#3498DB","#9B59B6","#E67E22","#F1C40F"];
const SPLASH_DURATION = 5200;

// Floating orb positions (relative to center)
const ORBS = [
  { size: 340, blur: 80, x: -160, y: -120, opacity: 0.12, color: "#D4AF37", dur: 8 },
  { size: 200, blur: 50, x:  180, y:  100, opacity: 0.09, color: "#F0D699", dur: 11 },
  { size: 150, blur: 40, x: -100, y:  200, opacity: 0.07, color: "#E67E22", dur: 9  },
];

const PHRASES = [
  "Awakening your wealth potential…",
  "Loading the wealth engine…",
  "Almost ready to rise…",
];

export default function SplashScreen({ onComplete }: Props) {
  const [progress, setProgress] = useState(0);
  const [done, setDone]         = useState(false);
  const [loaded, setLoaded]     = useState(false);
  const [tapped, setTapped]     = useState(false);

  useEffect(() => {
    const start = performance.now();
    let raf: number;

    const tick = (now: number) => {
      const pct = Math.min((now - start) / SPLASH_DURATION, 1);
      setProgress(pct);
      if (pct < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setLoaded(true);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleSkip = useCallback(() => {
    setDone(true);
    onComplete();
  }, [onComplete]);

  const handleAvatarTap = useCallback(() => {
    if (tapped) return;
    setTapped(true);
    // Avatar tap only shows the greeting — navigation requires the explicit button
  }, [tapped]);

  const phraseIndex = progress < 0.33 ? 0 : progress < 0.66 ? 1 : 2;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.65, ease: "easeInOut" }}
          className="splash-bg fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden px-4"
        >
          {/* ── Floating ambient orbs ─────────────────────────────────────── */}
          {ORBS.map((orb, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: orb.size,
                height: orb.size,
                left: `calc(50% + ${orb.x}px)`,
                top: `calc(50% + ${orb.y}px)`,
                transform: "translate(-50%, -50%)",
                background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
                filter: `blur(${orb.blur}px)`,
                opacity: orb.opacity,
              }}
              animate={{
                x: [0, 30, -20, 10, 0],
                y: [0, -20, 15, -10, 0],
                scale: [1, 1.1, 0.95, 1.05, 1],
              }}
              transition={{
                duration: orb.dur,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 1.5,
              }}
            />
          ))}

          {/* ── Ambient pulse ring ────────────────────────────────────────── */}
          <motion.div
            className="splash-ambient absolute rounded-full pointer-events-none"
            animate={{ scale: [1, 1.22, 1], opacity: [0.3, 0.85, 0.3] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* ── Brand header ─────────────────────────────────────────────── */}
          <motion.div
            className="text-center mb-6 z-10"
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <motion.h1
              className="text-5xl font-black gold-text tracking-widest"
              style={{ fontFamily: "'Playfair Display', serif" }}
              animate={{ textShadow: ["0 0 20px rgba(212,175,55,0.3)", "0 0 40px rgba(212,175,55,0.7)", "0 0 20px rgba(212,175,55,0.3)"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              FINLIT
            </motion.h1>
            <p className="text-[10px] tracking-[0.38em] text-gold/50 uppercase mt-1">
              Xhosa Rise Global Holdings
            </p>
          </motion.div>

          {/* ── Welcome Avatar ───────────────────────────────────────────── */}
          <motion.div
            className="z-10"
            initial={{ opacity: 0, scale: 0.82, y: 36 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.9, type: "spring", stiffness: 140, damping: 18 }}
          >
            <WelcomeAvatar onTap={handleAvatarTap} autoGreet={false} />
          </motion.div>

          {/* ── Cultural quote ───────────────────────────────────────────── */}
          <motion.div
            className="z-10 text-center mt-5 mb-6 max-w-[280px]"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <p className="text-[12px] text-white/60 italic leading-relaxed">
              "Umntu ngumntu ngabantu"
            </p>
            <p className="text-[10px] text-gold/40 mt-1 tracking-wide">
              A person is a person through others
            </p>
          </motion.div>

          {/* ── Beadwork progress bar ────────────────────────────────────── */}
          <motion.div
            className="w-72 z-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            {/* Bead dots */}
            <div className="flex gap-2 justify-center mb-3">
              {BEAD_COLOURS.map((colour, i) => {
                const lit = progress >= (i + 1) / BEAD_COLOURS.length;
                return (
                  <motion.div
                    key={i}
                    className="w-3.5 h-3.5 rounded-full border border-white/10"
                    style={{ backgroundColor: lit ? colour : "rgba(255,255,255,0.06)" }}
                    animate={lit
                      ? { scale: [1, 1.5, 1], boxShadow: [`0 0 0px ${colour}`, `0 0 12px ${colour}`, `0 0 4px ${colour}`] }
                      : {}
                    }
                    transition={{ duration: 0.35 }}
                  />
                );
              })}
            </div>

            {/* Progress bar */}
            <div className="h-0.5 bg-white/10 rounded-full overflow-hidden mb-2">
              <motion.div
                className="splash-progress-bar h-full rounded-full"
                style={{ width: `${progress * 100}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>

            {/* Status phrase / CTA */}
            <AnimatePresence mode="wait">
              {loaded ? (
                <motion.button
                  key="enter"
                  type="button"
                  onClick={handleSkip}
                  initial={{ opacity: 0, scale: 0.92, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 22 }}
                  className="btn-premium w-full mt-2 text-sm font-bold tracking-widest"
                >
                  Enter App →
                </motion.button>
              ) : (
                <motion.p
                  key={phraseIndex}
                  className="text-[10px] text-muted-foreground text-center tracking-widest uppercase"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  {PHRASES[phraseIndex]}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ── Always-visible skip link ──────────────────────────────────── */}
          {!loaded && (
            <motion.button
              type="button"
              onClick={handleSkip}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="absolute bottom-8 right-6 z-10 text-[10px] text-white/30 hover:text-white/60 transition-colors tracking-widest uppercase"
            >
              Skip
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
