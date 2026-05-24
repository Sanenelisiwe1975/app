import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WelcomeAvatar from "@/widgets/welcome-avatar/WelcomeAvatar";

interface Props {
  onComplete: () => void;
}

const BEAD_COLOURS = ["#D4AF37","#E74C3C","#1ABC9C","#3498DB","#9B59B6","#E67E22","#F1C40F"];

export default function SplashScreen({ onComplete }: Props) {
  const [progress, setProgress] = useState(0);
  const [done, setDone]         = useState(false);
  const [tapped, setTapped]     = useState(false);

  // Auto-advance timer
  useEffect(() => {
    const start    = performance.now();
    const duration = 3400;
    let raf: number;

    const tick = (now: number) => {
      const pct = Math.min((now - start) / duration, 1);
      setProgress(pct);
      if (pct < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => { setDone(true); onComplete(); }, 700);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  // Avatar tap can also advance immediately
  const handleAvatarTap = useCallback(() => {
    if (tapped) return;
    setTapped(true);
    // Let the greeting play for 1.5s then complete
    setTimeout(() => { setDone(true); onComplete(); }, 1500);
  }, [tapped, onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="splash-bg fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden px-4"
        >
          {/* Ambient pulse ring */}
          <motion.div
            className="splash-ambient absolute rounded-full pointer-events-none"
            animate={{ scale: [1, 1.18, 1], opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* ── Brand header ─────────────────────────────────────────────── */}
          <motion.div
            className="text-center mb-6 z-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <h1
              className="text-4xl font-black gold-text tracking-widest"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              FINLIT
            </h1>
            <p className="text-[9px] tracking-[0.38em] text-gold/50 uppercase mt-0.5">
              Xhosa Rise Global Holdings
            </p>
          </motion.div>

          {/* ── Welcome Avatar ───────────────────────────────────────────── */}
          <motion.div
            className="z-10"
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, type: "spring", stiffness: 160, damping: 20 }}
          >
            <WelcomeAvatar onTap={handleAvatarTap} autoGreet={false} />
          </motion.div>

          {/* ── Tagline ──────────────────────────────────────────────────── */}
          <motion.p
            className="text-[11px] text-white/40 italic text-center mt-4 mb-6 max-w-[260px] z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.8 }}
          >
            "Umntu ngumntu ngabantu" — A person is a person through others
          </motion.p>

          {/* ── Beadwork progress bar ────────────────────────────────────── */}
          <motion.div
            className="w-64 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex gap-1.5 justify-center mb-3">
              {BEAD_COLOURS.map((colour, i) => {
                const lit = progress >= (i + 1) / BEAD_COLOURS.length;
                return (
                  <motion.div
                    key={i}
                    className="w-3 h-3 rounded-full border border-white/10"
                    style={{ backgroundColor: lit ? colour : "rgba(255,255,255,0.08)" }}
                    animate={lit ? { scale: [1, 1.5, 1], boxShadow: [`0 0 0px ${colour}`, `0 0 10px ${colour}`, `0 0 4px ${colour}`] } : {}}
                    transition={{ duration: 0.3 }}
                  />
                );
              })}
            </div>
            <div className="h-0.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="splash-progress-bar h-full rounded-full transition-all duration-100"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground text-center mt-2 tracking-widest uppercase">
              {progress < 0.35 ? "Awakening…" : progress < 0.7 ? "Loading wealth engine…" : "Almost ready…"}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
