import { motion } from "framer-motion";

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center"
      style={{ background: "radial-gradient(circle at 30% 10%, #1a1a2e, #0a0a0f)" }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 1.2, delay: 2.5, ease: "easeInOut" }}
      onAnimationComplete={onComplete}
    >
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="w-24 h-24 mx-auto mb-6 rounded-full"
          style={{
            background: "linear-gradient(135deg, #f4d03f, #d4af37)",
            boxShadow: "0 0 60px rgba(212,175,55,0.5)",
          }}
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.h1
          className="font-serif text-6xl font-black gold-text tracking-tight"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          FINLIT
        </motion.h1>
        <motion.p
          className="text-gold text-lg tracking-[0.3em] mt-4 font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          WAMKELEKILE
        </motion.p>
        <motion.p
          className="text-muted-foreground text-xs tracking-widest mt-8 uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          Powered by Xhosa Rise Global Holdings
        </motion.p>
      </motion.div>

      {/* Animated beadwork at bottom */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 h-1 rounded-full w-48"
        style={{
          background: "linear-gradient(90deg, #C0392B, #2980B9, #F1C40F, #1ABC9C, #E74C3C, #8E44AD)",
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1, duration: 1.2 }}
      />
    </motion.div>
  );
}
