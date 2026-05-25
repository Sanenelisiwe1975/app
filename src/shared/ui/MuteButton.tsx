import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useUserStore } from "@/shared/stores/userStore";

interface Props {
  compact?: boolean;
}

export function MuteButton({ compact = false }: Props) {
  const soundEnabled    = useUserStore((s) => s.soundEnabled);
  const setSoundEnabled = useUserStore((s) => s.setSoundEnabled);

  return (
    <motion.button
      type="button"
      aria-label={soundEnabled ? "Mute sounds" : "Unmute sounds"}
      onClick={() => setSoundEnabled(!soundEnabled)}
      whileTap={{ scale: 0.92 }}
      className={`flex items-center gap-1.5 rounded-full transition-colors ${
        compact
          ? "p-1.5 text-muted-foreground hover:text-white hover:bg-white/10"
          : "px-3 py-1.5 text-xs font-medium border border-white/10 bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white"
      }`}
    >
      {soundEnabled
        ? <Volume2 className={compact ? "w-4 h-4" : "w-3.5 h-3.5"} />
        : <VolumeX  className={compact ? "w-4 h-4 text-gold" : "w-3.5 h-3.5 text-gold"} />
      }
      {!compact && <span>{soundEnabled ? "Sound On" : "Muted"}</span>}
    </motion.button>
  );
}
