import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Clock, TreePine, Coins, TrendingUp, Home, Landmark, AlertCircle } from "lucide-react";
import { useNetWorth } from "@/shared/hooks/useNetWorth";
import { useAudio } from "@/shared/hooks/useAudio";
import { useCurrencyFormatter } from "@/shared/hooks/useCurrencyFormatter";

// ── Investment scenarios ──────────────────────────────────────────────────────

const SCENARIOS = [
  { id: "jse",      label: "JSE ETF",         icon: TrendingUp, rate: 0.10, color: "text-gold"         },
  { id: "property", label: "SA Property",      icon: Home,       rate: 0.08, color: "text-xhosa-teal"   },
  { id: "savings",  label: "Savings Account",  icon: Landmark,   rate: 0.085, color: "text-xhosa-blue" },
  { id: "custom",   label: "Custom Rate",      icon: Coins,      rate: 0,    color: "text-xhosa-purple" },
] as const;

type ScenarioId = typeof SCENARIOS[number]["id"];

function compound(principal: number, monthlyContrib: number, annualRate: number, years: number) {
  const r = annualRate / 12;
  const n = years * 12;
  const futureOfPrincipal = principal * Math.pow(1 + r, n);
  const futureOfContribs  = r > 0
    ? monthlyContrib * ((Math.pow(1 + r, n) - 1) / r)
    : monthlyContrib * n;
  return futureOfPrincipal + futureOfContribs;
}

// ── Growth chart ─────────────────────────────────────────────────────────────

function GrowthChart({
  principal, monthlyContrib, rate, maxYears,
}: { principal: number; monthlyContrib: number; rate: number; maxYears: number }) {
  const formatCurrency = useCurrencyFormatter();
  const step = maxYears <= 10 ? 1 : maxYears <= 30 ? 5 : 10;

  const bars = useMemo(() => {
    const pts: { label: string; value: number }[] = [];
    for (let y = step; y <= maxYears; y += step) {
      pts.push({ label: `${y}y`, value: compound(principal, monthlyContrib, rate, y) });
    }
    return pts;
  }, [principal, monthlyContrib, rate, maxYears, step]);

  const maxVal = bars[bars.length - 1]?.value ?? 1;

  return (
    <div className="flex items-end gap-1 h-20">
      {bars.map(({ label, value }, i) => {
        const barH = Math.max(3, Math.round((value / maxVal) * 80));
        return (
          <div key={label} className="flex-1 flex flex-col items-center justify-end gap-0.5">
            <motion.div
              className="w-full rounded-t-sm"
              style={{ background: "linear-gradient(to top, rgba(212,175,55,0.5), #F5D78E)" }}
              initial={{ height: 0 }}
              animate={{ height: barH }}
              transition={{ duration: 0.7, delay: i * 0.05, ease: "easeOut" }}
              title={`${label}: ${formatCurrency(value)}`}
            />
            <span className="text-[8px] text-muted-foreground leading-none">{label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function TimeMachine() {
  const { t }           = useTranslation();
  const formatCurrency  = useCurrencyFormatter();
  const netWorth        = useNetWorth();
  const { playSuccess } = useAudio();

  const [scenarioId, setScenarioId]     = useState<ScenarioId>("jse");
  const [years, setYears]               = useState(30);
  const [monthlyContrib, setMonthlyContrib] = useState(500);
  const [customRate, setCustomRate]     = useState(10);
  const [projected, setProjected]       = useState(false);

  const scenario    = SCENARIOS.find((s) => s.id === scenarioId)!;
  const rate        = scenarioId === "custom" ? customRate / 100 : scenario.rate;
  const principal   = Math.max(netWorth, 0);
  const futureValue = compound(principal, monthlyContrib, rate, years);
  const totalContributed = principal + monthlyContrib * years * 12;
  const interestEarned   = futureValue - totalContributed;
  const descendants      = 4 + Math.floor((years / 100) * 8);

  const handleProject = () => {
    setProjected(true);
    playSuccess();
  };

  const multiplier = principal > 0 ? futureValue / principal : 0;

  // Reference table rows: how much 1x today grows to
  const refRows = [10, 20, 30, 50].map((y) => ({
    years: y,
    value: compound(principal || 10000, monthlyContrib, rate, y),
  }));

  return (
    <div className="page-container pb-24">
      <h2 className="font-serif text-3xl font-bold text-white mb-2 flex items-center gap-3">
        <Clock className="w-6 h-6 text-gold" /> {t("timeMachine.title")}
      </h2>
      <p className="text-muted-foreground text-sm mb-6">{t("timeMachine.subtitle")}</p>

      {/* ── Scenario selector ──────────────────────────────────────────────── */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {SCENARIOS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => { setScenarioId(id); setProjected(false); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              scenarioId === id
                ? "bg-gold/15 text-gold border-gold/30"
                : "bg-white/5 text-muted-foreground border-white/10 hover:bg-white/10"
            }`}
          >
            <Icon className="w-3.5 h-3.5" /> {label}
          </button>
        ))}
      </div>

      {/* ── Controls ───────────────────────────────────────────────────────── */}
      <div className="glass-card p-5 mb-5">
        <div className="grid grid-cols-1 gap-5">
          {/* Starting amount */}
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Starting amount</span>
              <span className="font-semibold text-white">{formatCurrency(principal)}</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-gold-light to-gold rounded-full"
                animate={{ width: `${Math.min(100, (principal / 100000) * 100)}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">Your current simulated net worth</p>
          </div>

          {/* Monthly contribution slider */}
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Monthly contribution</span>
              <span className="font-semibold text-white">R{monthlyContrib.toLocaleString()}/mo</span>
            </div>
            <input
              type="range"
              min={0}
              max={10000}
              step={100}
              value={monthlyContrib}
              onChange={(e) => { setMonthlyContrib(Number(e.target.value)); setProjected(false); }}
              className="w-full accent-gold"
              aria-label="Monthly contribution"
            />
            <div className="flex justify-between text-[9px] text-muted-foreground mt-0.5">
              <span>R0</span><span>R10,000</span>
            </div>
          </div>

          {/* Years slider */}
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Time horizon</span>
              <span className="font-semibold text-white">{years} years</span>
            </div>
            <input
              type="range"
              min={1}
              max={100}
              step={1}
              value={years}
              onChange={(e) => { setYears(Number(e.target.value)); setProjected(false); }}
              className="w-full accent-gold"
              aria-label="Investment time horizon in years"
            />
            <div className="flex justify-between text-[9px] text-muted-foreground mt-0.5">
              <span>1 year</span><span>100 years</span>
            </div>
          </div>

          {/* Custom rate (only shown when custom scenario) */}
          {scenarioId === "custom" && (
            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Annual return rate</span>
                <span className="font-semibold text-white">{customRate}%</span>
              </div>
              <input
                type="range"
                min={1}
                max={30}
                step={0.5}
                value={customRate}
                onChange={(e) => { setCustomRate(Number(e.target.value)); setProjected(false); }}
                className="w-full accent-gold"
                aria-label="Annual return rate"
              />
              <div className="flex justify-between text-[9px] text-muted-foreground mt-0.5">
                <span>1% (savings account)</span><span>30% (high risk)</span>
              </div>
            </div>
          )}

          {/* Rate display (non-custom) */}
          {scenarioId !== "custom" && (
            <div className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3">
              <span className="text-xs text-muted-foreground">Annual return ({scenario.label})</span>
              <span className={`font-bold text-sm ${scenario.color}`}>{(rate * 100).toFixed(1)}% p.a.</span>
            </div>
          )}
        </div>

        <button
          type="button"
          className="btn-premium w-full mt-5 flex items-center justify-center gap-2"
          onClick={handleProject}
        >
          <Coins className="w-4 h-4" /> {t("timeMachine.project")}
        </button>
      </div>

      {/* ── Result ─────────────────────────────────────────────────────────── */}
      <motion.div
        key={`${scenarioId}-${years}-${monthlyContrib}-${rate}`}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: projected ? 1 : 0.5, y: 0 }}
        className="glass-card p-6 mb-5 border border-gold/20"
      >
        <div className="text-center mb-5">
          <div className="w-16 h-16 bg-gradient-to-br from-gold/20 to-gold/5 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-gold/20">
            <TreePine className="w-8 h-8 text-gold" />
          </div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
            In {years} year{years !== 1 ? "s" : ""} · {new Date().getFullYear() + years}
          </p>
          <p className="font-serif text-4xl font-bold gold-text">{formatCurrency(futureValue)}</p>
          {multiplier > 0 && (
            <p className="text-xs text-muted-foreground mt-1">{multiplier.toFixed(1)}× your starting wealth</p>
          )}
        </div>

        {/* Growth chart */}
        {years >= 2 && (
          <div className="bg-white/3 rounded-xl p-3 border border-white/8 mb-4">
            <p className="text-[10px] text-muted-foreground mb-2">Year-over-year growth curve</p>
            <GrowthChart
              principal={principal || 10000}
              monthlyContrib={monthlyContrib}
              rate={rate}
              maxYears={years}
            />
          </div>
        )}

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <p className="text-[10px] text-muted-foreground mb-1">Total invested</p>
            <p className="text-sm font-bold text-white">{formatCurrency(totalContributed)}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <p className="text-[10px] text-muted-foreground mb-1">Interest earned</p>
            <p className="text-sm font-bold text-xhosa-teal">{formatCurrency(Math.max(0, interestEarned))}</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <p className="text-[10px] text-muted-foreground mb-1">Descendants</p>
            <p className="text-sm font-bold text-white">{years >= 30 ? descendants : "—"}</p>
          </div>
        </div>

        {/* Descendant avatars */}
        {projected && years >= 30 && (
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {Array.from({ length: Math.min(descendants, 8) }).map((_, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-dark text-[9px] font-bold border-2 border-dark-card"
                >
                  {i + 1}
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">{descendants} descendants will inherit this legacy</p>
          </div>
        )}
      </motion.div>

      {/* ── Comparison table ───────────────────────────────────────────────── */}
      <div className="glass-card p-5">
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-gold" /> {t("timeMachine.powerOf7")}
        </h4>
        <div className="space-y-2">
          {refRows.map(({ years: y, value }) => (
            <div key={y} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">After {y} years</span>
              <div className="flex items-center gap-3">
                <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gold rounded-full"
                    animate={{ width: `${Math.min(100, (value / (refRows[refRows.length - 1].value || 1)) * 100)}%` }}
                    transition={{ duration: 0.8, delay: 0.1 * refRows.findIndex(r => r.years === y) }}
                  />
                </div>
                <span className="text-gold font-semibold w-28 text-right">{formatCurrency(value)}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground mt-3">
          Based on {(rate * 100).toFixed(1)}% annual return · R{monthlyContrib.toLocaleString()}/mo contribution · Starting {formatCurrency(principal || 10000)}
        </p>
      </div>

      {/* ── Cost of delay ──────────────────────────────────────────────────── */}
      {years >= 5 && (
        <div className="glass-card p-5 mt-4 border-l-4 border-l-xhosa-red">
          <h4 className="font-semibold text-white mb-1 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-xhosa-red" /> Cost of Starting Late
          </h4>
          <p className="text-[11px] text-muted-foreground mb-4">
            Every year you delay, compounding loses a year of its most powerful gains.
          </p>
          <div className="space-y-3">
            {[1, 5, 10].filter((delay) => delay < years).map((delay, i) => {
              const lateValue  = compound(principal || 10000, monthlyContrib, rate, years - delay);
              const costAmount = futureValue - lateValue;
              const costPct    = futureValue > 0 ? ((costAmount / futureValue) * 100).toFixed(0) : "0";
              return (
                <motion.div
                  key={delay}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-xhosa-red/5 border border-xhosa-red/15 rounded-xl p-3"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-white font-semibold">
                      Wait {delay} year{delay > 1 ? "s" : ""} to start
                    </span>
                    <span className="text-xs font-bold text-xhosa-red">−{costPct}%</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">You'd end up with</span>
                    <span className="text-white font-semibold">{formatCurrency(lateValue)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">Lost to delay</span>
                    <span className="text-xhosa-red font-bold">−{formatCurrency(costAmount)}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <p className="text-[10px] text-muted-foreground mt-3 italic">
            The best time to start was yesterday. The second best time is today.
          </p>
        </div>
      )}
    </div>
  );
}
