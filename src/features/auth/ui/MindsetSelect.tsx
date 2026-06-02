import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Sparkles, BookOpen, Zap, Trophy, ChevronRight, Shield } from "lucide-react";
import { audiences } from "@/data/mindsets";
import type { Mindset } from "@/data/mindsets";
import { useUserStore } from "@/shared/stores/userStore";
import { useGameStore } from "@/shared/stores/gameStore";
import { useMarketStore } from "@/shared/stores/marketStore";
import { useUiStore } from "@/shared/stores/uiStore";
import { useAudio } from "@/shared/hooks/useAudio";
import { useCurrencyFormatter } from "@/shared/hooks/useCurrencyFormatter";

// Difficulty tier derived from startCash
function getTier(startCash: number): { label: string; color: string } {
  if (startCash >= 1_000_000) return { label: "Elite", color: "text-gold border-gold/40 bg-gold/10" };
  if (startCash >= 50_000)    return { label: "Advanced", color: "text-xhosa-purple border-xhosa-purple/40 bg-xhosa-purple/10" };
  if (startCash >= 10_000)    return { label: "Intermediate", color: "text-xhosa-blue border-xhosa-blue/40 bg-xhosa-blue/10" };
  return { label: "Starter", color: "text-xhosa-teal border-xhosa-teal/40 bg-xhosa-teal/10" };
}

export default function MindsetSelect() {
  const formatCurrency = useCurrencyFormatter();
  const audienceKey    = useUserStore((s) => s.audienceKey);
  const user        = useUserStore((s) => s.user);
  const setMindset  = useUserStore((s) => s.setMindset);
  const setUser     = useUserStore((s) => s.setUser);

  const initMindset = useGameStore((s) => s.initMindset);
  const resetAssets = useMarketStore((s) => s.resetAssets);

  const navigate     = useUiStore((s) => s.navigate);
  const { playHymn } = useAudio();

  const [hovered, setHovered] = useState<string | null>(null);

  const audience = audienceKey ? audiences[audienceKey] : null;
  if (!audience) return <></>;


  const handleSelect = (mindset: Mindset) => {
    setMindset(mindset);
    if (user) setUser({ ...user, mindset: mindset.id });
    initMindset(mindset.startCash);
    resetAssets();
    playHymn();
    navigate("dashboard");
  };

  return (
    <div className="page-container pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-1.5 mb-4"
          >
            <Sparkles className="w-3 h-3 text-gold" />
            <span className="text-xs font-semibold text-gold uppercase tracking-widest">{audience.name}</span>
          </motion.div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">
            Choose Your Wealth Path
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
            Each mindset is a distinct universe — different starting cash, different challenges, different modules. Pick the one closest to your reality.
          </p>
        </div>

        {/* Mindset grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {/* ── Standard mindset cards ── */}
          {audience.mindsets.map((mindset, i) => {
            const tier       = getTier(mindset.startCash);
            const moduleCount = mindset.modules.length;
            const xpPotential = moduleCount * 100;
            const isHovered  = hovered === mindset.id;

            return (
              <motion.button
                key={mindset.id}
                type="button"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.09, type: "spring", stiffness: 200, damping: 22 }}
                onClick={() => handleSelect(mindset)}
                onMouseEnter={() => setHovered(mindset.id)}
                onMouseLeave={() => setHovered(null)}
                className="relative text-left rounded-3xl border border-white/10 overflow-hidden group transition-all duration-300 hover:border-gold/40 hover:shadow-[0_0_32px_rgba(212,175,55,0.12)] touch-manipulation"
                style={{ background: "rgba(15,13,11,0.85)" }}
                whileHover={{ y: -5, scale: 1.015 }}
                whileTap={{ scale: 0.97 }}
              >
                {/* Colour glow orb */}
                <motion.div
                  className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-2xl pointer-events-none"
                  style={{ backgroundColor: mindset.color }}
                  animate={{ opacity: isHovered ? 0.22 : 0.08 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Shimmer top line — colour-keyed */}
                <div
                  className="absolute top-0 left-0 right-0 h-px opacity-60"
                  style={{ background: `linear-gradient(to right, transparent, ${mindset.color}, transparent)` }}
                />

                <div className="relative p-6">
                  {/* Tier badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${tier.color}`}>
                      {tier.label}
                    </span>
                    <motion.div
                      animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="w-4 h-4 text-gold" />
                    </motion.div>
                  </div>

                  {/* Icon + name */}
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 border border-white/10"
                      style={{ backgroundColor: `${mindset.color}18` }}
                    >
                      {mindset.icon}
                    </div>
                    <div>
                      <h3 className="font-serif text-base font-bold text-white leading-tight">{mindset.name}</h3>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">{mindset.desc}</p>
                    </div>
                  </div>

                  {/* Tagline */}
                  <div className="flex items-center gap-1.5 mb-4">
                    <Sparkles className="w-3 h-3 text-gold shrink-0" />
                    <span className="text-[11px] text-gold italic">{mindset.tagline}</span>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-white/5 rounded-xl p-2.5 text-center border border-white/8">
                      <p className="text-xs font-bold text-white">{formatCurrency(mindset.startCash)}</p>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-wider mt-0.5">Start Cash</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-2.5 text-center border border-white/8">
                      <div className="flex items-center justify-center gap-1">
                        <BookOpen className="w-3 h-3 text-xhosa-teal" />
                        <p className="text-xs font-bold text-white">{moduleCount}</p>
                      </div>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-wider mt-0.5">Modules</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-2.5 text-center border border-white/8">
                      <div className="flex items-center justify-center gap-1">
                        <Zap className="w-3 h-3 text-gold" />
                        <p className="text-xs font-bold text-white">{xpPotential}</p>
                      </div>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-wider mt-0.5">Max XP</p>
                    </div>
                  </div>

                  {/* Asset tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {mindset.assets.slice(0, 4).map((a) => (
                      <span
                        key={a}
                        className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-muted-foreground border border-white/10 font-medium"
                      >
                        {a}
                      </span>
                    ))}
                  </div>

                  {/* CTA row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[...Array(Math.min(5, moduleCount))].map((_, j) => (
                        <div
                          key={j}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: j < moduleCount ? mindset.color : "rgba(255,255,255,0.1)" }}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5 text-gold text-xs font-semibold group-hover:gap-2.5 transition-all">
                      Start Path <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}

          {/* ── SAPS SynchroLearn card ── */}
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: audience.mindsets.length * 0.09, type: "spring", stiffness: 200, damping: 22 }}
            onClick={() => navigate("synchrolearn")}
            onMouseEnter={() => setHovered("saps")}
            onMouseLeave={() => setHovered(null)}
            className="relative text-left rounded-3xl overflow-hidden group transition-all duration-300 hover:border-gold/40 hover:shadow-[0_0_32px_rgba(212,175,55,0.12)] touch-manipulation"
            style={{ background: "rgba(8,14,28,0.92)", border: "1px solid rgba(30,58,95,0.5)" }}
            whileHover={{ y: -5, scale: 1.015 }}
            whileTap={{ scale: 0.97 }}
          >
            {/* Shimmer top line — two-tone SAPS blue/gold */}
            <div
              className="absolute top-0 left-0 right-0 h-px opacity-70"
              style={{ background: "linear-gradient(to right, transparent, #1E3A5F, #D4AF37, #1E3A5F, transparent)" }}
            />

            {/* Glow orb */}
            <motion.div
              className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-2xl pointer-events-none"
              style={{ backgroundColor: "#1E3A5F" }}
              animate={{ opacity: hovered === "saps" ? 0.35 : 0.12 }}
              transition={{ duration: 0.3 }}
            />

            <div className="relative p-6">
              {/* Tier badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border text-gold border-gold/40 bg-gold/10">
                  Institutional
                </span>
                <motion.div
                  animate={{ opacity: hovered === "saps" ? 1 : 0, x: hovered === "saps" ? 0 : 8 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="w-4 h-4 text-gold" />
                </motion.div>
              </div>

              {/* Icon + name */}
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 border border-white/10"
                  style={{ backgroundColor: "rgba(30,58,95,0.3)" }}
                >
                  ⚖️
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-white leading-tight">SAPS SynchroLearn</h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">Crime Prevention &amp; Financial Intelligence</p>
                </div>
              </div>

              {/* Tagline */}
              <div className="flex items-center gap-1.5 mb-4">
                <Shield className="w-3 h-3 text-gold shrink-0" />
                <span className="text-[11px] text-gold italic">Reintegration through financial literacy</span>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-white/5 rounded-xl p-2.5 text-center border border-white/8">
                  <p className="text-xs font-bold text-white">Portal</p>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-wider mt-0.5">Access</p>
                </div>
                <div className="bg-white/5 rounded-xl p-2.5 text-center border border-white/8">
                  <div className="flex items-center justify-center gap-1">
                    <BookOpen className="w-3 h-3 text-xhosa-teal" />
                    <p className="text-xs font-bold text-white">5</p>
                  </div>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-wider mt-0.5">Modules</p>
                </div>
                <div className="bg-white/5 rounded-xl p-2.5 text-center border border-white/8">
                  <p className="text-xs font-bold text-white">100</p>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-wider mt-0.5">Max Pts</p>
                </div>
              </div>

              {/* JSE concept tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {["JSE", "Opportunity Cost", "Cash Flow", "Diversification"].map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-muted-foreground border border-white/10 font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTA row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#1E3A5F" }} />
                  ))}
                </div>
                <div className="flex items-center gap-1.5 text-gold text-xs font-semibold group-hover:gap-2.5 transition-all">
                  Enter Portal <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </motion.button>
        </div>

        {/* Bottom info strip */}
        <AnimatePresence>
          {hovered && (() => {
            const m = audience.mindsets.find((x) => x.id === hovered);
            if (!m) return null;
            return (
              <motion.div
                key={hovered}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="glass-card p-4 mb-6 flex items-center gap-4"
              >
                <Trophy className="w-5 h-5 text-gold shrink-0" />
                <p className="text-sm text-white/80">
                  <span className="font-semibold text-white">{m.name}:</span>{" "}
                  {m.modules.length} modules · {m.modules.reduce((s, mod) => s + mod.quiz.length, 0)} quiz questions ·{" "}
                  <span className="text-gold">{m.modules.length * 100} XP potential</span>
                </p>
              </motion.div>
            );
          })()}
        </AnimatePresence>

        <button
          type="button"
          className="btn-outline-premium flex items-center gap-2 mx-auto"
          onClick={() => navigate("register")}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Audience Selection
        </button>
      </motion.div>
    </div>
  );
}
