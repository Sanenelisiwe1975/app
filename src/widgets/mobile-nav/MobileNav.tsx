import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import i18n from "@/shared/i18n";
import {
  LayoutDashboard, BookOpen, TrendingUp, Users, MoreHorizontal,
  Briefcase, Clock, Shield, Heart, Brain, Award, RefreshCw, Globe, X, Zap, Share2,
} from "lucide-react";
import { MuteButton } from "@/shared/ui/MuteButton";
import { CurrencySelector } from "@/shared/ui/CurrencySelector";
import { useUiStore, type Page } from "@/shared/stores/uiStore";

// ── Primary nav (always visible in bottom bar) ────────────────────────────────
const PRIMARY_NAV: { id: Page; icon: React.ElementType; labelKey: string }[] = [
  { id: "dashboard", icon: LayoutDashboard, labelKey: "nav.dashboard" },
  { id: "learn",     icon: BookOpen,        labelKey: "nav.learn"     },
  { id: "market",    icon: TrendingUp,      labelKey: "nav.market"    },
  { id: "stokvel",   icon: Users,           labelKey: "nav.stokvel"   },
];

// ── Secondary nav (lives in the "More" drawer) ────────────────────────────────
const MORE_NAV: { id: Page; icon: React.ElementType; labelKey: string }[] = [
  { id: "portfolio",   icon: Briefcase,   labelKey: "nav.portfolio"   },
  { id: "timemachine", icon: Clock,       labelKey: "nav.timeMachine" },
  { id: "antiscam",    icon: Shield,      labelKey: "nav.antiScam"    },
  { id: "wealthybody", icon: Heart,       labelKey: "nav.wealthyBody" },
  { id: "emotion",     icon: Brain,       labelKey: "nav.emotion"     },
  { id: "prophet",     icon: TrendingUp,  labelKey: "nav.prophet"     },
  { id: "certificate", icon: Award,       labelKey: "nav.certificate" },
  { id: "energy",      icon: Zap,         labelKey: "nav.energy"      },
  { id: "invite",      icon: Share2,      labelKey: "nav.invite"      },
  { id: "switch",      icon: RefreshCw,   labelKey: "nav.switch"      },
];

const LANGUAGES = [
  { code: "en", label: "EN", title: "English"   },
  { code: "zu", label: "ZU", title: "isiZulu"   },
  { code: "xh", label: "XH", title: "isiXhosa" },
  { code: "st", label: "ST", title: "Sesotho"   },
  { code: "af", label: "AF", title: "Afrikaans" },
] as const;

export default memo(function MobileNav() {
  const { t, i18n: i18nInstance } = useTranslation();
  const page     = useUiStore((s) => s.page);
  const navigate = useUiStore((s) => s.navigate);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleNavigate = (id: Page) => {
    navigate(id);
    setDrawerOpen(false);
  };

  const isMoreActive = MORE_NAV.some((item) => item.id === page);

  return (
    <>
      {/* ── More drawer ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm"
              onClick={() => setDrawerOpen(false)}
            />

            {/* Drawer panel */}
            <motion.div
              key="drawer-panel"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="md:hidden fixed bottom-[72px] left-0 right-0 z-[95] bg-dark-card border-t border-gold/20 rounded-t-3xl px-4 pt-4 pb-6"
            >
              {/* Handle + header */}
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4" />
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
                  More Pages
                </p>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="text-muted-foreground hover:text-white transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Grid of secondary pages */}
              <div className="grid grid-cols-4 gap-2">
                {MORE_NAV.map(({ id, icon: Icon, labelKey }) => {
                  const isActive = page === id;
                  return (
                    <motion.button
                      key={id}
                      type="button"
                      onClick={() => handleNavigate(id)}
                      aria-current={isActive ? "page" : undefined}
                      whileTap={{ scale: 0.92 }}
                      className={`flex flex-col items-center gap-1.5 py-3 px-1 rounded-2xl transition-all ${
                        isActive
                          ? "bg-gold/15 text-gold border border-gold/30"
                          : "bg-white/5 text-muted-foreground border border-white/5 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-[8px] font-medium uppercase tracking-wide text-center leading-tight">
                        {t(labelKey)}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Bottom nav bar ───────────────────────────────────────────────── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-dark-card/95 backdrop-blur-xl border-t border-gold/20 pb-safe"
        aria-label="Mobile navigation"
      >
        {/* Controls strip: Language + Mute + Currency */}
        <div className="flex items-center justify-between gap-1 px-3 pt-1.5">
          <div className="flex items-center gap-0.5">
            <Globe className="w-3 h-3 text-muted-foreground mr-0.5 shrink-0" />
            {LANGUAGES.map(({ code, label, title }) => (
              <button
                key={code}
                type="button"
                onClick={() => i18n.changeLanguage(code)}
                aria-label={`Switch to ${title}`}
                title={title}
                className={`px-1 py-0.5 rounded text-[8px] font-bold uppercase tracking-wide transition-all touch-manipulation ${
                  i18nInstance.language === code
                    ? "bg-gold/20 text-gold border border-gold/30"
                    : "text-muted-foreground hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <MuteButton compact />
            <CurrencySelector compact />
          </div>
        </div>

        {/* Nav items */}
        <div className="flex justify-around items-center px-2 pt-1 pb-2">
          {PRIMARY_NAV.map(({ id, icon: Icon, labelKey }) => {
            const isActive = page === id;
            return (
              <motion.button
                key={id}
                type="button"
                onClick={() => handleNavigate(id)}
                aria-current={isActive ? "page" : undefined}
                className={`flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all ${
                  isActive ? "text-gold" : "text-muted-foreground"
                }`}
                whileTap={{ scale: 0.9 }}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[9px] font-medium uppercase tracking-wider">
                  {t(labelKey)}
                </span>
              </motion.button>
            );
          })}

          {/* More button */}
          <motion.button
            type="button"
            onClick={() => setDrawerOpen((o) => !o)}
            aria-expanded={drawerOpen}
            aria-label="More pages"
            className={`flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all ${
              drawerOpen || isMoreActive ? "text-gold" : "text-muted-foreground"
            }`}
            whileTap={{ scale: 0.9 }}
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-[9px] font-medium uppercase tracking-wider">More</span>
          </motion.button>
        </div>
      </nav>
    </>
  );
});
