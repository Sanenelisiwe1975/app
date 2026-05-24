import { memo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import i18n from "@/shared/i18n";
import {
  LayoutDashboard, BookOpen, TrendingUp, Briefcase,
  Users, Clock, Shield, Heart, Brain, Award, RefreshCw, ChevronRight, Globe,
} from "lucide-react";
import { useUiStore, type Page } from "@/shared/stores/uiStore";
import { useUserStore } from "@/shared/stores/userStore";

const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "zu", label: "ZU" },
] as const;

const NAV_ITEMS: { id: Page; icon: React.ElementType; labelKey: string }[] = [
  { id: "dashboard",   icon: LayoutDashboard, labelKey: "nav.dashboard"   },
  { id: "learn",       icon: BookOpen,        labelKey: "nav.learn"       },
  { id: "market",      icon: TrendingUp,      labelKey: "nav.market"      },
  { id: "portfolio",   icon: Briefcase,       labelKey: "nav.portfolio"   },
  { id: "stokvel",     icon: Users,           labelKey: "nav.stokvel"     },
  { id: "timemachine", icon: Clock,           labelKey: "nav.timeMachine" },
  { id: "antiscam",    icon: Shield,          labelKey: "nav.antiScam"    },
  { id: "wealthybody", icon: Heart,           labelKey: "nav.wealthyBody" },
  { id: "emotion",     icon: Brain,           labelKey: "nav.emotion"     },
  { id: "prophet",     icon: TrendingUp,      labelKey: "nav.prophet"     },
  { id: "certificate", icon: Award,           labelKey: "nav.certificate" },
  { id: "switch",      icon: RefreshCw,       labelKey: "nav.switch"      },
];

// memo: Sidebar reads specific store slices via hooks — only re-renders when
// page, user, or mindset actually changes, not on every unrelated store mutation.
export default memo(function Sidebar() {
  const { t } = useTranslation();
  const page     = useUiStore((s) => s.page);
  const navigate = useUiStore((s) => s.navigate);
  const user     = useUserStore((s) => s.user);
  const mindset  = useUserStore((s) => s.mindset);

  return (
    <aside className="hidden md:flex flex-col w-72 h-full bg-dark-card/90 border-r border-gold/10 backdrop-blur-xl">
      {/* ── Brand header ───────────────────────────────────────────────── */}
      <div className="p-6 border-b border-gold/10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gold-light to-gold flex items-center justify-center text-dark font-bold text-lg shadow-glow">
            XR
          </div>
          <div>
            <h2 className="font-serif text-lg font-semibold text-white leading-tight">FINLIT</h2>
            <p className="text-[10px] tracking-[0.2em] text-gold uppercase">Xhosa Rise Global</p>
          </div>
        </div>
        {user && (
          <div className="mt-4 pt-4 border-t border-gold/10">
            <p className="text-xs text-muted-foreground">Welcome back</p>
            <p className="text-sm font-medium text-white">{user.name}</p>
            {mindset && <p className="text-xs text-gold mt-0.5">{mindset.name}</p>}
          </div>
        )}
      </div>

      {/* ── Navigation ─────────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1" aria-label="Main navigation">
        {NAV_ITEMS.map(({ id, icon: Icon, labelKey }) => {
          const isActive = page === id;
          return (
            <motion.button
              key={id}
              type="button"
              onClick={() => navigate(id)}
              aria-current={isActive ? "page" : undefined}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-gold/10 text-gold border border-gold/20"
                  : "text-muted-foreground hover:bg-white/5 hover:text-white"
              }`}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="w-4 h-4" />
              <span className="flex-1 text-left">{t(labelKey)}</span>
              {isActive && <ChevronRight className="w-3 h-3" />}
            </motion.button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gold/10 space-y-3">
        {/* Language switcher */}
        <div className="flex items-center gap-2">
          <Globe className="w-3 h-3 text-muted-foreground" />
          <div className="flex gap-1">
            {LANGUAGES.map(({ code, label }) => (
              <button
                key={code}
                type="button"
                onClick={() => i18n.changeLanguage(code)}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                  i18n.language === code
                    ? "bg-gold/20 text-gold border border-gold/30"
                    : "text-muted-foreground hover:text-white"
                }`}
                aria-label={`Switch to ${code === "en" ? "English" : "Zulu"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="beadwork-bar w-full" />
        <p className="text-[10px] text-muted-foreground text-center tracking-wider uppercase">
          From South African Roots to Global Markets
        </p>
      </div>
    </aside>
  );
});
