import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Zap, TrendingDown, Shield, Award, ChevronDown, ChevronUp } from "lucide-react";
import { useCurrencyFormatter } from "@/shared/hooks/useCurrencyFormatter";
import { useGameStore } from "@/shared/stores/gameStore";

// ── Data ─────────────────────────────────────────────────────────────────────

interface BackupSolution {
  name: string;
  upfront: number;
  fuelCostPerHour: number;
  maintenancePerYear: number;
  lifespanYears: number;
}

interface Industry {
  id: string;
  label: string;
  icon: string;
  downtimeCostPerHour: number;
  solutions: BackupSolution[];
}

const INDUSTRIES: Industry[] = [
  {
    id: "mining",
    label: "Mining & Resources",
    icon: "⛏️",
    downtimeCostPerHour: 500_000,
    solutions: [
      { name: "Diesel Gen (2MW)",       upfront: 3_500_000,  fuelCostPerHour: 12_000, maintenancePerYear: 150_000, lifespanYears: 10 },
      { name: "Gas Turbine (2MW)",      upfront: 5_000_000,  fuelCostPerHour:  8_000, maintenancePerYear: 200_000, lifespanYears: 15 },
      { name: "BESS + Solar (2MW/8MWh)",upfront: 18_000_000, fuelCostPerHour:      0, maintenancePerYear: 300_000, lifespanYears: 20 },
    ],
  },
  {
    id: "engineering",
    label: "Engineering & Manufacturing",
    icon: "🏭",
    downtimeCostPerHour: 150_000,
    solutions: [
      { name: "Diesel Gen (500kW)",     upfront:   950_000,  fuelCostPerHour:  3_500, maintenancePerYear:  45_000, lifespanYears: 10 },
      { name: "Gas Gen (500kW)",        upfront: 1_400_000,  fuelCostPerHour:  2_200, maintenancePerYear:  55_000, lifespanYears: 15 },
      { name: "Solar + BESS (500kW)",   upfront: 5_500_000,  fuelCostPerHour:      0, maintenancePerYear:  80_000, lifespanYears: 20 },
    ],
  },
  {
    id: "tech",
    label: "Tech & Data Centres",
    icon: "💻",
    downtimeCostPerHour: 1_000_000,
    solutions: [
      { name: "UPS + Diesel Gen",       upfront: 2_200_000,  fuelCostPerHour:  7_000, maintenancePerYear:  90_000, lifespanYears:  8 },
      { name: "Modular BESS (1MWh)",    upfront: 6_000_000,  fuelCostPerHour:      0, maintenancePerYear: 120_000, lifespanYears: 15 },
      { name: "Solar + BESS (1MW)",     upfront: 9_500_000,  fuelCostPerHour:      0, maintenancePerYear: 180_000, lifespanYears: 20 },
    ],
  },
  {
    id: "logistics",
    label: "Logistics & Transport",
    icon: "🚛",
    downtimeCostPerHour: 80_000,
    solutions: [
      { name: "Diesel Gen (200kW)",     upfront:   420_000,  fuelCostPerHour:  1_400, maintenancePerYear:  20_000, lifespanYears: 10 },
      { name: "Gas Gen (200kW)",        upfront:   620_000,  fuelCostPerHour:    900, maintenancePerYear:  25_000, lifespanYears: 15 },
      { name: "Solar + BESS (200kW)",   upfront: 2_100_000,  fuelCostPerHour:      0, maintenancePerYear:  35_000, lifespanYears: 20 },
    ],
  },
  {
    id: "corporate",
    label: "Corporate Offices",
    icon: "🏢",
    downtimeCostPerHour: 50_000,
    solutions: [
      { name: "Diesel Gen (100kW)",     upfront:   220_000,  fuelCostPerHour:    700, maintenancePerYear:  12_000, lifespanYears: 10 },
      { name: "UPS + Solar (50kW)",     upfront:   480_000,  fuelCostPerHour:      0, maintenancePerYear:   8_000, lifespanYears: 15 },
      { name: "Solar + BESS (100kW)",   upfront: 1_100_000,  fuelCostPerHour:      0, maintenancePerYear:  15_000, lifespanYears: 20 },
    ],
  },
  {
    id: "restaurant",
    label: "Restaurants & Hospitality",
    icon: "🍽️",
    downtimeCostPerHour: 15_000,
    solutions: [
      { name: "Diesel Gen (30kW)",      upfront:    68_000,  fuelCostPerHour:    210, maintenancePerYear:   4_000, lifespanYears:  8 },
      { name: "LPG Gas Backup",         upfront:    22_000,  fuelCostPerHour:     90, maintenancePerYear:   1_500, lifespanYears: 10 },
      { name: "Solar + BESS (30kW)",    upfront:   310_000,  fuelCostPerHour:      0, maintenancePerYear:   5_000, lifespanYears: 20 },
    ],
  },
  {
    id: "salon",
    label: "Salons & Beauty",
    icon: "💇",
    downtimeCostPerHour: 5_000,
    solutions: [
      { name: "Inverter + Battery",     upfront:    18_000,  fuelCostPerHour:      0, maintenancePerYear:   1_200, lifespanYears:  5 },
      { name: "Small Diesel Gen (5kW)", upfront:    12_000,  fuelCostPerHour:     35, maintenancePerYear:   1_000, lifespanYears:  7 },
      { name: "Solar + Battery (5kW)",  upfront:    95_000,  fuelCostPerHour:      0, maintenancePerYear:   1_500, lifespanYears: 20 },
    ],
  },
  {
    id: "medical",
    label: "Medical & Healthcare",
    icon: "🏥",
    downtimeCostPerHour: 75_000,
    solutions: [
      { name: "Medical-grade UPS",      upfront:   180_000,  fuelCostPerHour:      0, maintenancePerYear:  10_000, lifespanYears:  8 },
      { name: "Diesel Gen (150kW)",     upfront:   310_000,  fuelCostPerHour:  1_050, maintenancePerYear:  18_000, lifespanYears: 10 },
      { name: "Solar + BESS (150kW)",   upfront: 1_600_000,  fuelCostPerHour:      0, maintenancePerYear:  22_000, lifespanYears: 20 },
    ],
  },
  {
    id: "ecommerce",
    label: "E-commerce & Retail Online",
    icon: "🛒",
    downtimeCostPerHour: 120_000,
    solutions: [
      { name: "UPS + Diesel (80kW)",    upfront:   175_000,  fuelCostPerHour:    560, maintenancePerYear:   9_000, lifespanYears:  8 },
      { name: "Solar + BESS (80kW)",    upfront:   870_000,  fuelCostPerHour:      0, maintenancePerYear:  12_000, lifespanYears: 20 },
      { name: "Cloud Failover + UPS",   upfront:   240_000,  fuelCostPerHour:      0, maintenancePerYear:  30_000, lifespanYears:  5 },
    ],
  },
  {
    id: "retail",
    label: "Retail & Spaza Shops",
    icon: "🏪",
    downtimeCostPerHour: 40_000,
    solutions: [
      { name: "Small Inverter (3kW)",   upfront:    14_000,  fuelCostPerHour:      0, maintenancePerYear:   1_000, lifespanYears:  5 },
      { name: "Diesel Gen (20kW)",      upfront:    45_000,  fuelCostPerHour:    140, maintenancePerYear:   3_000, lifespanYears:  8 },
      { name: "Solar + BESS (20kW)",    upfront:   215_000,  fuelCostPerHour:      0, maintenancePerYear:   3_500, lifespanYears: 20 },
    ],
  },
];

const BADGES = [
  { id: "first_calc",    label: "First Analysis",    icon: "🔍", desc: "Run your first ROI calculation" },
  { id: "solar_choice",  label: "Green Champion",    icon: "☀️", desc: "Choose a solar + BESS solution" },
  { id: "all_industries",label: "Industry Expert",   icon: "🏆", desc: "Explore all 10 industries" },
  { id: "cost_saver",    label: "Cost Saver",        icon: "💰", desc: "Find a solution with positive ROI" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function calcTCO(sol: BackupSolution, weeklyHours: number, years: number) {
  const totalHours = weeklyHours * 52 * years;
  return sol.upfront + sol.fuelCostPerHour * totalHours + sol.maintenancePerYear * years;
}

function calcLoss(downtimeCostPerHour: number, weeklyHours: number, years: number) {
  return downtimeCostPerHour * weeklyHours * 52 * years;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function EnergyResilience() {
  const { t }          = useTranslation();
  const formatCurrency = useCurrencyFormatter();
  const addBadge       = useGameStore((s) => s.addBadge);
  const storedBadges   = useGameStore((s) => s.badges);

  const [industryId,   setIndustryId]   = useState(INDUSTRIES[0].id);
  const [solutionIdx,  setSolutionIdx]  = useState(0);
  const [weeklyHours,  setWeeklyHours]  = useState(8);
  const [years,        setYears]        = useState(3);
  const [explored,     setExplored]     = useState<Set<string>>(new Set([INDUSTRIES[0].id]));
  const [showDetails,  setShowDetails]  = useState(false);

  // Derive local earned set from persisted gameStore badges
  const earnedBadges = new Set(
    BADGES.filter((b) => storedBadges.includes(`${b.icon} ${b.label}`)).map((b) => b.id)
  );

  const industry = INDUSTRIES.find((i) => i.id === industryId) ?? INDUSTRIES[0];
  const solution = industry.solutions[solutionIdx] ?? industry.solutions[0];

  const tco       = useMemo(() => calcTCO(solution, weeklyHours, years),  [solution, weeklyHours, years]);
  const lossAvoid = useMemo(() => calcLoss(industry.downtimeCostPerHour, weeklyHours, years), [industry, weeklyHours, years]);
  const netSaving = lossAvoid - tco;
  const roi       = tco > 0 ? ((netSaving / tco) * 100) : 0;

  const handleIndustry = (id: string) => {
    setIndustryId(id);
    setSolutionIdx(0);
    const next = new Set([...explored, id]);
    setExplored(next);
    if (next.size >= 10) awardBadge("all_industries");
  };

  const handleCalculate = () => {
    awardBadge("first_calc");
    if (solution.fuelCostPerHour === 0) awardBadge("solar_choice");
    if (netSaving > 0) awardBadge("cost_saver");
  };

  const awardBadge = (id: string) => {
    const badge = BADGES.find((b) => b.id === id);
    if (badge) addBadge(`${badge.icon} ${badge.label}`);
  };

  const roiColour = roi >= 100 ? "text-xhosa-teal" : roi >= 0 ? "text-xhosa-yellow" : "text-xhosa-red";

  return (
    <div className="page-container pb-24">
      <h2 className="font-serif text-3xl font-bold text-white mb-2 flex items-center gap-3">
        <Zap className="w-6 h-6 text-gold" /> {t("energy.title")}
      </h2>
      <p className="text-muted-foreground text-sm mb-6">{t("energy.subtitle")}</p>

      {/* ── Badges ───────────────────────────────────────────────────────── */}
      {earnedBadges.size > 0 && (
        <motion.div
          className="glass-card p-4 mb-6 border-l-4 border-l-gold"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
            <Award className="w-3 h-3" /> Achievements Unlocked
          </p>
          <div className="flex flex-wrap gap-2">
            {BADGES.filter((b) => earnedBadges.has(b.id)).map((b) => (
              <div key={b.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold/15 border border-gold/30 text-xs font-medium text-gold">
                <span>{b.icon}</span> {b.label}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Industry Selector ─────────────────────────────────────────────── */}
      <div className="glass-card p-4 mb-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Select Industry</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {INDUSTRIES.map((ind) => (
            <button
              key={ind.id}
              type="button"
              onClick={() => handleIndustry(ind.id)}
              className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl text-xs font-medium transition-all ${
                industryId === ind.id
                  ? "bg-gold/15 text-gold border border-gold/30"
                  : "bg-white/5 text-muted-foreground border border-white/10 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="text-xl">{ind.icon}</span>
              <span className="text-center leading-tight">{ind.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Downtime Cost Banner ──────────────────────────────────────────── */}
      <div className="glass-card p-4 mb-4 border-l-4 border-l-xhosa-red">
        <div className="flex items-start gap-3">
          <TrendingDown className="w-5 h-5 text-xhosa-red shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground leading-snug">Estimated downtime cost for {industry.label}</p>
            <p className="text-lg font-bold text-xhosa-red break-words mt-0.5">
              {formatCurrency(industry.downtimeCostPerHour)}<span className="text-sm font-normal"> / hr</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── Backup Solution Picker ────────────────────────────────────────── */}
      <div className="glass-card p-4 mb-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
          <Shield className="w-3 h-3 inline mr-1" /> Backup Solutions
        </p>
        <div className="flex flex-col gap-2">
          {industry.solutions.map((sol, i) => (
            <button
              key={sol.name}
              type="button"
              onClick={() => setSolutionIdx(i)}
              className={`text-left p-3 rounded-xl border transition-all ${
                solutionIdx === i
                  ? "bg-gold/10 border-gold/30 text-white"
                  : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-medium flex-1 min-w-0 leading-snug">{sol.name}</span>
                <span className="text-xs text-gold font-bold shrink-0">{formatCurrency(sol.upfront)}</span>
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5 text-xs opacity-70">
                <span>Fuel: {sol.fuelCostPerHour === 0 ? "Free" : `${formatCurrency(sol.fuelCostPerHour)}/hr`}</span>
                <span>Maint: {formatCurrency(sol.maintenancePerYear)}/yr</span>
                <span>Life: {sol.lifespanYears}yr</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── ROI Sliders ──────────────────────────────────────────────────── */}
      <div className="glass-card p-4 mb-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">ROI Calculator</p>
        <div className="space-y-5">
          <div>
            <div className="flex justify-between mb-2">
              <label htmlFor="weekly-hours" className="text-sm text-white">Load-shedding hours per week</label>
              <span className="text-sm font-bold text-gold">{weeklyHours} hrs</span>
            </div>
            <input
              id="weekly-hours"
              type="range"
              min={1}
              max={40}
              value={weeklyHours}
              onChange={(e) => setWeeklyHours(Number(e.target.value))}
              className="w-full accent-yellow-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
              <span>1 hr</span><span>40 hrs</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label htmlFor="planning-years" className="text-sm text-white">Planning horizon</label>
              <span className="text-sm font-bold text-gold">{years} years</span>
            </div>
            <input
              id="planning-years"
              type="range"
              min={1}
              max={10}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full accent-yellow-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
              <span>1 yr</span><span>10 yrs</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Results ──────────────────────────────────────────────────────── */}
      <div className="glass-card p-5 mb-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">Analysis Results ({years}yr horizon)</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          <div className="flex items-center justify-between sm:flex-col sm:items-start gap-1">
            <p className="text-xs text-muted-foreground shrink-0">Total TCO</p>
            <p className="text-sm font-bold text-xhosa-red text-right sm:text-left">{formatCurrency(tco)}</p>
          </div>
          <div className="flex items-center justify-between sm:flex-col sm:items-start gap-1">
            <p className="text-xs text-muted-foreground shrink-0">Loss Avoided</p>
            <p className="text-sm font-bold text-xhosa-teal text-right sm:text-left">{formatCurrency(lossAvoid)}</p>
          </div>
          <div className="flex items-center justify-between sm:flex-col sm:items-start gap-1">
            <p className="text-xs text-muted-foreground shrink-0">Net Saving</p>
            <p className={`text-sm font-bold text-right sm:text-left ${netSaving >= 0 ? "text-xhosa-teal" : "text-xhosa-red"}`}>
              {netSaving >= 0 ? "+" : ""}{formatCurrency(netSaving)}
            </p>
          </div>
          <div className="flex items-center justify-between sm:flex-col sm:items-start gap-1">
            <p className="text-xs text-muted-foreground shrink-0">ROI</p>
            <p className={`text-sm font-bold ${roiColour}`}>{roi.toFixed(1)}%</p>
          </div>
        </div>

        {/* ROI bar */}
        <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-4">
          <motion.div
            className={`h-full rounded-full ${roi >= 100 ? "bg-xhosa-teal" : roi >= 0 ? "bg-xhosa-yellow" : "bg-xhosa-red"}`}
            animate={{ width: `${Math.min(Math.max(roi, 0), 300) / 3}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Details toggle */}
        <button
          type="button"
          onClick={() => setShowDetails((v) => !v)}
          className="text-xs text-muted-foreground flex items-center gap-1 hover:text-white transition-colors mb-2"
        >
          {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {showDetails ? "Hide" : "Show"} detailed breakdown
        </button>

        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-white/10">
                <div className="text-muted-foreground">Total load-shedding hours</div>
                <div className="text-white font-medium text-right">{(weeklyHours * 52 * years).toLocaleString()} hrs</div>
                <div className="text-muted-foreground">Upfront capital</div>
                <div className="text-white font-medium text-right">{formatCurrency(solution.upfront)}</div>
                <div className="text-muted-foreground">Fuel cost (total)</div>
                <div className="text-white font-medium text-right">{formatCurrency(solution.fuelCostPerHour * weeklyHours * 52 * years)}</div>
                <div className="text-muted-foreground">Maintenance (total)</div>
                <div className="text-white font-medium text-right">{formatCurrency(solution.maintenancePerYear * years)}</div>
                <div className="text-muted-foreground">Downtime cost/hr</div>
                <div className="text-xhosa-red font-medium text-right">{formatCurrency(industry.downtimeCostPerHour)}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <button
        type="button"
        className="btn-premium w-full flex items-center justify-center gap-2 mb-4"
        onClick={handleCalculate}
      >
        <Zap className="w-4 h-4" /> Analyse & Earn Badge
      </button>

      {/* ── Tax tip ──────────────────────────────────────────────────────── */}
      <div className="glass-card p-4 border-l-4 border-l-gold mb-4">
        <p className="text-sm font-semibold text-gold mb-1">Section 12B Tax Incentive</p>
        <p className="text-xs text-white/70">
          South African businesses may claim a 125% deduction in year one on qualifying renewable energy assets
          (solar PV, BESS) under Section 12B of the Income Tax Act. This significantly reduces the effective upfront
          cost shown above — consult your tax practitioner.
        </p>
      </div>

      {/* ── Badge progress ───────────────────────────────────────────────── */}
      <div className="glass-card p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Badge Progress</p>
        <div className="grid grid-cols-2 gap-3">
          {BADGES.map((b) => {
            const earned = earnedBadges.has(b.id);
            return (
              <div
                key={b.id}
                className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${
                  earned
                    ? "bg-gold/10 border-gold/30 text-white"
                    : "bg-white/5 border-white/10 text-muted-foreground opacity-50"
                }`}
              >
                <span className="text-xl">{b.icon}</span>
                <div>
                  <p className="text-xs font-semibold leading-tight">{b.label}</p>
                  <p className="text-[10px] opacity-70 leading-tight">{b.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-3 text-center">
          {explored.size}/10 industries explored
        </p>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mt-1.5">
          <motion.div
            className="h-full bg-gold rounded-full"
            animate={{ width: `${(explored.size / 10) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>
    </div>
  );
}
