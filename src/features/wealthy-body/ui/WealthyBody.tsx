import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Heart, Activity, Watch, TrendingUp,
  Footprints, Moon, Zap, CheckCircle,
} from "lucide-react";
import { useGameStore, selectHealthMultiplier } from "@/shared/stores/gameStore";
import { useCurrencyFormatter } from "@/shared/hooks/useCurrencyFormatter";

// ── Daily challenges ──────────────────────────────────────────────────────────

const CHALLENGES = [
  { id: "steps",  label: "Walk 8,000 steps",      icon: Footprints, target: 8000,  unit: "steps", metric: "steps"    as const },
  { id: "sleep",  label: "Sleep 7+ hours",         icon: Moon,       target: 7,     unit: "hrs",   metric: "sleep"    as const },
  { id: "heart",  label: "Resting HR under 75 bpm",icon: Heart,      target: 75,    unit: "bpm",   metric: "heartRate"as const },
];

// Pill colour based on health score
function scoreColor(pct: number) {
  if (pct >= 80) return "text-xhosa-teal";
  if (pct >= 50) return "text-gold";
  return "text-xhosa-red";
}

function scoreLabel(pct: number) {
  if (pct >= 80) return "Excellent";
  if (pct >= 60) return "Good";
  if (pct >= 40) return "Fair";
  return "Needs work";
}

// ── SVG ring component ────────────────────────────────────────────────────────

function Ring({ pct, color, size = 80 }: { pct: number; color: string; size?: number }) {
  const r   = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * Math.min(1, pct / 100);

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={8} />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={8}
        strokeLinecap="round"
        className={color}
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - dash }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
    </svg>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function WealthyBody() {
  const { t }          = useTranslation();
  const formatCurrency = useCurrencyFormatter();
  const health         = useGameStore((s) => s.health);
  const syncHealth = useGameStore((s) => s.syncHealth);
  const healthMult = useGameStore(selectHealthMultiplier);

  const basePremium = 500;
  const premium     = Math.round(basePremium / healthMult);
  const saving      = basePremium - premium;

  // Scores per metric (0–100)
  const stepsPct = Math.min(100, (health.steps / 10000) * 100);
  const sleepPct = Math.min(100, (health.sleep / 8) * 100);
  // Heart rate: 60 bpm = 100%, 100 bpm = 0%
  const hrPct    = Math.max(0, Math.min(100, ((100 - health.heartRate) / 40) * 100));
  const overall  = Math.round((stepsPct + sleepPct + hrPct) / 3);

  const metrics = [
    { label: t("wealthyBody.steps"),    value: health.steps.toLocaleString(), sub: "steps",  pct: stepsPct, icon: Activity, color: "text-xhosa-teal" },
    { label: t("wealthyBody.sleep"),    value: `${health.sleep.toFixed(1)} hrs`, sub: "/ 8 hrs", pct: sleepPct, icon: Moon,     color: "text-xhosa-blue"  },
    { label: t("wealthyBody.heartRate"),value: `${health.heartRate} bpm`,    sub: "resting",pct: hrPct,    icon: Heart,    color: "text-xhosa-red"   },
    { label: t("wealthyBody.multiplier"),value: `${healthMult.toFixed(2)}×`, sub: "wealth boost", pct: Math.min(100, (healthMult - 1) * 200), icon: TrendingUp, color: "text-gold" },
  ];

  return (
    <div className="page-container pb-24">
      <h2 className="font-serif text-3xl font-bold text-white mb-2 flex items-center gap-3">
        <Heart className="w-6 h-6 text-xhosa-red" /> {t("wealthyBody.title")}
      </h2>
      <p className="text-muted-foreground text-sm mb-6">{t("wealthyBody.subtitle")}</p>

      {/* ── Overall health score ────────────────────────────────────────────── */}
      <div className="glass-card p-6 mb-6 flex items-center gap-6">
        <div className="relative shrink-0">
          <Ring pct={overall} color={scoreColor(overall)} size={88} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-lg font-black ${scoreColor(overall)}`}>{overall}</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Health Score</p>
          <p className={`text-2xl font-bold ${scoreColor(overall)}`}>{scoreLabel(overall)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Sync your wearable to update your score and lower insurance premiums.
          </p>
          <button
            type="button"
            className="btn-premium mt-3 flex items-center gap-2 py-2 px-4 text-xs"
            onClick={syncHealth}
          >
            <Watch className="w-3.5 h-3.5" /> {t("wealthyBody.sync")}
          </button>
        </div>
      </div>

      {/* ── Metric rings ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {metrics.map(({ label, value, sub, pct, icon: Icon, color }) => (
          <div key={label} className="glass-card p-4 flex flex-col items-center text-center">
            <div className="relative mb-2">
              <Ring pct={pct} color={color} size={64} />
              <div className="absolute inset-0 flex items-center justify-center">
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
            <p className="text-base font-bold text-white leading-tight">{value}</p>
            <p className="text-[9px] text-muted-foreground">{sub}</p>
          </div>
        ))}
      </div>

      {/* ── Insurance premium card ─────────────────────────────────────────── */}
      <div className="glass-card p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold text-white">{t("wealthyBody.premium")}</h3>
            <p className="text-xs text-muted-foreground">{t("wealthyBody.premiumSub")}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-xhosa-teal">{formatCurrency(premium)}<span className="text-sm text-muted-foreground">/mo</span></p>
            {saving > 0 && <p className="text-[10px] text-xhosa-teal">You save {formatCurrency(saving)}/mo vs base</p>}
          </div>
        </div>
        <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-xhosa-teal to-xhosa-blue rounded-full"
            animate={{ width: `${Math.min(100, healthMult * 40)}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground mt-1.5">
          <span>Base premium: {formatCurrency(basePremium)}/mo</span>
          <span>Annual saving: {formatCurrency(saving * 12)}</span>
        </div>
      </div>

      {/* ── Daily challenges ───────────────────────────────────────────────── */}
      <div className="glass-card p-5 mb-6">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-gold" /> Daily Challenges
        </h3>
        <div className="space-y-3">
          {CHALLENGES.map(({ id, label, icon: Icon, target, unit, metric }) => {
            const current = health[metric];
            const met     = metric === "heartRate" ? current <= target : current >= target;
            const pct     = metric === "heartRate"
              ? Math.min(100, Math.max(0, ((target + 20 - current) / 20) * 100))
              : Math.min(100, (current / target) * 100);

            return (
              <div key={id} className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${met ? "bg-xhosa-teal/20" : "bg-white/5"}`}>
                  {met
                    ? <CheckCircle className="w-4 h-4 text-xhosa-teal" />
                    : <Icon className="w-4 h-4 text-muted-foreground" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between text-xs mb-1">
                    <span className={met ? "text-xhosa-teal font-medium" : "text-white"}>{label}</span>
                    <span className="text-muted-foreground">
                      {metric === "heartRate" ? `${current} ${unit}` : `${typeof current === "number" && current > 100 ? current.toLocaleString() : current} / ${target.toLocaleString()} ${unit}`}
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${met ? "bg-xhosa-teal" : "bg-gold/60"}`}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <button
          type="button"
          className="btn-outline-premium w-full mt-4 flex items-center justify-center gap-2 text-sm"
          onClick={syncHealth}
        >
          <Watch className="w-4 h-4" /> Sync Wearable to Update
        </button>
      </div>

      {/* ── Wealth connection ──────────────────────────────────────────────── */}
      <div className="glass-card p-5 border-l-4 border-l-xhosa-teal">
        <h4 className="font-semibold text-white mb-2">Impilo yobutyebi — Health is Wealth</h4>
        <div className="space-y-2 text-sm text-white/70">
          <div className="flex justify-between items-center">
            <span>Healthy SA employee misses fewer work days</span>
            <span className="text-xhosa-teal font-semibold">+{formatCurrency(18_000)}/yr</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Lower health insurance premiums</span>
            <span className="text-xhosa-teal font-semibold">+{formatCurrency(saving * 12)}/yr</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Longer compound interest timeline</span>
            <span className="text-xhosa-teal font-semibold">Priceless</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3 italic">
          Your health multiplier ({healthMult.toFixed(2)}×) is applied to all net worth calculations in FINLIT.
        </p>
      </div>
    </div>
  );
}
