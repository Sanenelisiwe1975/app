import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, ChevronRight } from "lucide-react";

interface Props {
  /** Called when the user skips or the video ends */
  onComplete: () => void;
  /**
   * Path/URL to the welcome video file.
   * The actual video file (HD Xhosa individual in traditional regalia)
   * should be placed in /public/video/welcome.mp4.
   * Falls back to a branded still if the file is missing.
   */
  videoSrc?: string;
}

export default function WelcomeVideo({ onComplete, videoSrc = "/video/welcome.mp4" }: Props) {
  const videoRef              = useRef<HTMLVideoElement>(null);
  const [muted, setMuted]     = useState(false);
  const [ready, setReady]     = useState(false);
  const [failed, setFailed]   = useState(false);
  const [ending, setEnding]   = useState(false);

  // Auto-play on mount; flag ready once metadata loads
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const handleReady  = () => setReady(true);
    const handleEnded  = () => handleComplete();
    const handleError  = () => setFailed(true);

    el.addEventListener("loadedmetadata", handleReady);
    el.addEventListener("ended", handleEnded);
    el.addEventListener("error", handleError);
    el.play().catch(() => setFailed(true));

    return () => {
      el.removeEventListener("loadedmetadata", handleReady);
      el.removeEventListener("ended", handleEnded);
      el.removeEventListener("error", handleError);
    };
  }, []);

  const handleComplete = () => {
    if (ending) return;
    setEnding(true);
    setTimeout(onComplete, 700);
  };

  const toggleMute = () => {
    if (videoRef.current) videoRef.current.muted = !muted;
    setMuted((m) => !m);
  };

  return (
    <AnimatePresence>
      {!ending && (
        <motion.div
          key="welcome-video"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[9998] flex items-center justify-center bg-black"
        >
          {/* ── Video layer ───────────────────────────────────────────── */}
          {!failed ? (
            <video
              ref={videoRef}
              src={videoSrc}
              className="absolute inset-0 w-full h-full object-cover"
              playsInline
              preload="auto"
              aria-label="Wamkelekile — Welcome to FINLIT"
            />
          ) : (
            /* Fallback: full-bleed image background */
            <img
              src="/welcome-bg.jpg"
              alt="Wamkelekile — Welcome to FINLIT"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          )}

          {/* Gradient overlay — keeps UI readable over any video */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

          {/* ── Greeting text ─────────────────────────────────────────── */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 px-8 pb-10 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: ready || failed ? 1 : 0, y: ready || failed ? 0 : 30 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            <div className="beadwork-bar w-32 mx-auto mb-4" />
            <h2 className="font-serif text-4xl font-bold text-white mb-2 drop-shadow-lg">
              Wamkelekile
            </h2>
            <p className="text-gold/90 text-base italic mb-1">
              Welcome, Future Wealth Builder
            </p>
            <p className="text-white/50 text-xs">
              "Imbiza yakho ingakhula uma uqala manje" — Your wealth pot grows if you start now.
            </p>
          </motion.div>

          {/* ── Controls ──────────────────────────────────────────────── */}
          <div className="absolute top-4 right-4 flex items-center gap-3">
            {!failed && (
              <button
                type="button"
                onClick={toggleMute}
                className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                aria-label={muted ? "Unmute" : "Mute"}
              >
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            )}
            <button
              type="button"
              onClick={handleComplete}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-semibold hover:bg-gold/25 transition-all backdrop-blur-sm"
              aria-label="Skip welcome video"
            >
              Skip <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
