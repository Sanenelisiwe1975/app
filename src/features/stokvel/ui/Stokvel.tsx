import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Users, PiggyBank, Vote, TrendingUp, Sparkles,
  ShoppingCart, CheckCircle, Clock, Calculator,
  BarChart3, BookOpen, ChevronDown,
} from "lucide-react";
import { useGameStore } from "@/shared/stores/gameStore";
import { useAudio } from "@/shared/hooks/useAudio";
import { EasyEquitiesPrompt } from "@/shared/ui/EasyEquitiesPrompt";
import { formatCurrency } from "@/shared/lib/formatters";

// ── Types ─────────────────────────────────────────────────────────────────────

type StokvelTab = "savings" | "grocery" | "investment";

interface PayoutEvent {
  round: number;
  amount: number;
  member: number;
  ts: number;
}

const STOKVEL_TYPES: { id: StokvelTab; label: string; icon: React.ElementType; accent: string }[] = [
  { id: "savings",    label: "Savings",    icon: PiggyBank,    accent: "#D4AF37" },
  { id: "grocery",    label: "Grocery",    icon: ShoppingCart, accent: "#1ABC9C" },
  { id: "investment", label: "Investment", icon: TrendingUp,   accent: "#3498DB" },
];

const MEMBER_NAMES  = ["Sipho", "Nomsa", "Thabo", "Zanele", "Kagiso", "Lerato", "Bongani", "Ayanda"];
const MEMBER_COLORS = [
  "bg-gold/20 border-gold/40 text-gold",
  "bg-xhosa-teal/20 border-xhosa-teal/40 text-xhosa-teal",
  "bg-xhosa-blue/20 border-xhosa-blue/40 text-xhosa-blue",
  "bg-xhosa-purple/20 border-xhosa-purple/40 text-xhosa-purple",
  "bg-xhosa-red/20 border-xhosa-red/40 text-xhosa-red",
  "bg-white/10 border-white/20 text-white",
  "bg-gold/15 border-gold/30 text-gold",
  "bg-xhosa-teal/15 border-xhosa-teal/30 text-xhosa-teal",
];

const CONSTITUTION_RULES = [
  { num: "01", rule: "Each member contributes R100 on or before the 1st of every month." },
  { num: "02", rule: "The pot rotates in order of registration. No member may receive twice before all have received once." },
  { num: "03", rule: "Late payment incurs a R20 fine. Three missed payments = removal from the stokvel." },
  { num: "04", rule: "Decisions are made by majority vote. A quorum of 60% is required." },
  { num: "05", rule: "Members may not transfer their position without group approval." },
  { num: "06", rule: "An elected treasurer handles all funds. A deputy co-signs withdrawals above R500." },
];

const GROCERY_ITEMS = [
  { name: "Maize Meal 10kg",   retail: 120, bulk: 78 },
  { name: "Cooking Oil 5L",    retail: 95,  bulk: 62 },
  { name: "Rice 10kg",         retail: 145, bulk: 94 },
  { name: "Soap (×10)",        retail: 85,  bulk: 54 },
  { name: "Sugar 5kg",         retail: 75,  bulk: 49 },
  { name: "Bread (×4 loaves)", retail: 68,  bulk: 44 },
];

function getRandomMember(exclude?: number) {
  let idx = Math.floor(Math.random() * MEMBER_NAMES.length);
  while (idx === exclude) idx = Math.floor(Math.random() * MEMBER_NAMES.length);
  return idx;
}

function compoundGrowth(principal: number, monthlyRate: number, months: number) {
  return principal * Math.pow(1 + monthlyRate, months);
}

function memberColor(name: string) {
  const idx = MEMBER_NAMES.indexOf(name);
  return MEMBER_COLORS[(idx >= 0 ? idx : name.charCodeAt(0)) % MEMBER_COLORS.length];
}

// ── Sub-components ────────────────────────────────────────────────────────────

function PotRing({ pct, pot, target }: { pct: number; pot: number; target: number }) {
  const r = 52;
  const circumference = 2 * Math.PI * r;
  const dashOffset = circumference * (1 - pct / 100);
  const nearFull = pct >= 80;

  return (
    <div className="relative flex items-center justify-center w-36 h-36 mx-auto mb-5">
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
        <motion.circle
          cx="60" cy="60" r={r}
          fill="none"
          stroke="url(#potGold)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="potGold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F5D78E" />
            <stop offset="100%" stopColor="#D4AF37" />
          </linearGradient>
        </defs>
      </svg>

      <div className="text-center z-10">
        <motion.p key={pot} initial={{ scale: 1.15, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-lg font-black text-white leading-none">
          R{pot.toLocaleString()}
        </motion.p>
        <p className="text-[10px] text-muted-foreground mt-0.5">of R{target.toLocaleString()}</p>
        <p className="text-[10px] font-bold text-gold mt-0.5">{Math.round(pct)}%</p>
        {nearFull && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            className="text-[9px] text-gold font-bold mt-0.5 uppercase tracking-wide"
          >
            Almost full!
          </motion.p>
        )}
      </div>

      {nearFull && (
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          animate={{ boxShadow: ["0 0 0px rgba(212,175,55,0)", "0 0 28px rgba(212,175,55,0.45)", "0 0 0px rgba(212,175,55,0)"] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </div>
  );
}

function MemberGrid({ members, contributed, nextPayout }: { members: number; contributed: Set<number>; nextPayout: number }) {
  return (
    <div className="grid grid-cols-4 gap-2 mb-4">
      {MEMBER_NAMES.slice(0, members).map((name, i) => {
        const hasPaid = contributed.has(i);
        const isNext  = nextPayout === i;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05, type: "spring", stiffness: 260, damping: 22 }}
            className="flex flex-col items-center gap-1"
          >
            <div className={`relative w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors ${
              hasPaid ? "border-xhosa-teal bg-xhosa-teal/15" : "border-white/20 bg-white/5"
            } ${isNext ? "ring-2 ring-gold/60 ring-offset-1 ring-offset-black" : ""}`}>
              <span className="text-xs font-bold text-white">{name[0]}</span>
              {hasPaid && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-xhosa-teal flex items-center justify-center"
                >
                  <CheckCircle className="w-2.5 h-2.5 text-black" />
                </motion.div>
              )}
              {isNext && (
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-gold flex items-center justify-center">
                  <span className="text-[7px] font-black text-black">★</span>
                </div>
              )}
            </div>
            <p className="text-[9px] text-muted-foreground">{i === 0 ? "You" : name.slice(0, 4)}</p>
          </motion.div>
        );
      })}
    </div>
  );
}

function InvestmentChart({ principal, months }: { principal: number; months: number }) {
  const years = Math.min(Math.ceil(months / 12), 10);
  const CHART_H = 72;

  const bars = useMemo(
    () => Array.from({ length: years }, (_, i) => ({
      year: i + 1,
      value: compoundGrowth(principal, 0.008, (i + 1) * 12),
    })),
    [principal, years],
  );

  const maxVal = bars[bars.length - 1]?.value ?? principal;

  return (
    <div className="flex items-end gap-1" style={{ height: `${CHART_H}px` }}>
      {bars.map(({ year, value }, i) => {
        const barH = Math.max(4, Math.round((value / maxVal) * CHART_H));
        return (
          <div key={year} className="flex-1 flex flex-col items-center justify-end gap-0.5">
            <motion.div
              className="w-full rounded-t-sm"
              style={{ background: "linear-gradient(to top, rgba(52,152,219,0.55), #1ABC9C)" }}
              initial={{ height: 0 }}
              animate={{ height: barH }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: "easeOut" }}
              title={`Year ${year}: ${formatCurrency(value)}`}
            />
            <span className="text-[8px] text-muted-foreground">{year}y</span>
          </div>
        );
      })}
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Stokvel() {
  const { t } = useTranslation();
  const cash              = useGameStore((s) => s.cash);
  const community         = useGameStore((s) => s.community);
  const contributeStokvel = useGameStore((s) => s.contributeStokvel);
  const voteStokvel       = useGameStore((s) => s.voteStokvel);
  const { playDrum, playSuccess } = useAudio();

  const [activeTab, setActiveTab]               = useState<StokvelTab>("savings");
  const [showEEPrompt, setShowEEPrompt]         = useState(false);
  const [payoutHistory, setPayoutHistory]       = useState<PayoutEvent[]>([]);
  const [roundsCompleted, setRoundsCompleted]   = useState(0);
  const [activity, setActivity]                 = useState<{ name: string; action: string; ts: number }[]>([]);
  const [investMonths, setInvestMonths]         = useState(24);
  const [contributed, setContributed]           = useState<Set<number>>(new Set());
  const [showConstitution, setShowConstitution] = useState(false);
  const [showGroceryItems, setShowGroceryItems] = useState(false);
  const [groceryMembers, setGroceryMembers]     = useState(community.members);
  const [groceryContrib, setGroceryContrib]     = useState(100);

  const prevPot    = useRef(community.pot);
  const potPct     = Math.min(100, (community.pot / 2000) * 100);
  const memberName = MEMBER_NAMES[0];

  const groceryPool   = groceryMembers * groceryContrib;
  const groceryHamper = Math.round(groceryContrib * 1.35);
  const grocerySaving = groceryHamper - groceryContrib;
  const groceryAnnual = grocerySaving * 12;

  const investmentPrincipal  = Math.max(community.pot, 1000);
  const investmentProjection = compoundGrowth(investmentPrincipal, 0.008, investMonths);
  const investmentGain       = investmentProjection - investmentPrincipal;
  const investmentGainPct    = ((investmentProjection / investmentPrincipal - 1) * 100).toFixed(1);

  useEffect(() => {
    if (prevPot.current > 0 && community.pot === 0) {
      const payoutAmt = prevPot.current / community.members;
      setPayoutHistory((h) => [
        { round: roundsCompleted + 1, amount: payoutAmt, member: community.nextPayout, ts: Date.now() },
        ...h,
      ]);
      setRoundsCompleted((r) => r + 1);
      setContributed(new Set());
      addActivity(MEMBER_NAMES[community.nextPayout] ?? `Member ${community.nextPayout + 1}`, "received the payout 🎉");
    }
    prevPot.current = community.pot;
  }, [community.pot]);

  const addActivity = (name: string, action: string) => {
    setActivity((prev) => [{ name, action, ts: Date.now() }, ...prev.slice(0, 9)]);
  };

  const handleContribute = () => {
    if (contributeStokvel()) {
      playDrum();
      setContributed((s) => new Set(s).add(0));
      addActivity(memberName, "contributed R100 ✓");
      const others = Math.min(community.members - 1, 3);
      for (let i = 0; i < others; i++) {
        const idx = getRandomMember(0);
        setTimeout(() => {
          setContributed((s) => new Set(s).add(idx));
          addActivity(MEMBER_NAMES[idx], "contributed R100 ✓");
        }, 600 + i * 450);
      }
    }
  };

  const handleVote = () => {
    const potBeforeVote = community.pot;
    voteStokvel();
    playSuccess();
    if (potBeforeVote >= 2000) setShowEEPrompt(true);
    addActivity(memberName, "voted to release pot");
  };

  return (
    <div className="page-container pb-24">
      <h2 className="font-serif text-3xl font-bold text-white mb-1 flex items-center gap-3">
        <Users className="w-6 h-6 text-gold" /> {t("stokvel.title")}
      </h2>
      <p className="text-muted-foreground text-sm mb-1 italic">{t("stokvel.quote")}</p>
      <p className="text-[11px] text-gold/60 mb-6">
        Over <span className="text-gold font-semibold">R50 billion</span> flows through SA stokvels every year
      </p>

      {/* ── Animated tab pill bar ─────────────────────────────────────────── */}
      <div className="relative flex gap-1 mb-6 p-1 bg-white/5 rounded-2xl border border-white/10">
        {STOKVEL_TYPES.map(({ id, label, icon: Icon, accent }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className="relative flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-colors z-10"
          >
            {activeTab === id && (
              <motion.div
                layoutId="tab-pill"
                className="absolute inset-0 rounded-xl"
                style={{ backgroundColor: `${accent}18`, border: `1px solid ${accent}35` }}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <Icon
              className="w-3.5 h-3.5 relative z-10 transition-colors"
              style={{ color: activeTab === id ? accent : undefined }}
            />
            <span
              className={`relative z-10 transition-colors ${activeTab !== id ? "text-muted-foreground" : ""}`}
              style={{ color: activeTab === id ? accent : undefined }}
            >
              {label}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* ── Savings Stokvel ───────────────────────────────────────────────── */}
        {activeTab === "savings" && (
          <motion.div key="savings" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label: t("stokvel.members"), value: community.members, color: "text-white" },
                { label: t("stokvel.pot"),     value: `R${community.pot.toLocaleString()}`, color: "gold-text" },
                { label: "Rounds Done",         value: roundsCompleted,  color: "text-xhosa-teal" },
              ].map(({ label, value, color }) => (
                <motion.div key={label} className="glass-card p-4 text-center" whileHover={{ scale: 1.03 }}>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
                  <p className={`text-2xl font-bold ${color}`}>{value}</p>
                </motion.div>
              ))}
            </div>

            {/* Pot ring + member grid */}
            <div className="glass-card p-5 mb-4">
              <p className="text-sm font-semibold text-white text-center mb-0.5">Communal Pot</p>
              <p className="text-[10px] text-muted-foreground text-center mb-4">
                Next payout → <span className="text-gold font-semibold">{MEMBER_NAMES[community.nextPayout] ?? `Member ${community.nextPayout + 1}`}</span>
              </p>

              <PotRing pct={potPct} pot={community.pot} target={2000} />

              <p className="text-[10px] text-muted-foreground text-center mb-3">Member contributions this round</p>
              <MemberGrid members={community.members} contributed={contributed} nextPayout={community.nextPayout} />

              <div className="flex gap-3 mt-1">
                <motion.button
                  type="button"
                  className="btn-premium flex-1 flex items-center justify-center gap-2"
                  onClick={handleContribute}
                  disabled={cash < 100}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <PiggyBank className="w-4 h-4" /> {t("stokvel.contribute")} (R100)
                </motion.button>
                <motion.button
                  type="button"
                  className="btn-outline-premium flex-1 flex items-center justify-center gap-2"
                  onClick={handleVote}
                  disabled={community.pot <= 0}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <Vote className="w-4 h-4" /> {t("stokvel.votePayout")}
                </motion.button>
              </div>
            </div>

            {/* Activity feed */}
            <div className="glass-card p-5 mb-4">
              <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-gold" /> Recent Activity
              </h3>
              {activity.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">Contribute to see group activity here</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  <AnimatePresence initial={false}>
                    {activity.map((item, i) => (
                      <motion.div
                        key={item.ts + i}
                        initial={{ opacity: 0, x: -10, height: 0 }}
                        animate={{ opacity: 1, x: 0, height: "auto" }}
                        className="flex items-center gap-3 text-sm"
                      >
                        <div className={`w-7 h-7 rounded-full border flex items-center justify-center shrink-0 ${memberColor(item.name)}`}>
                          <span className="text-[10px] font-bold">{item.name[0]}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-white font-medium">{item.name}</span>
                          <span className="text-muted-foreground text-xs"> {item.action}</span>
                        </div>
                        <span className="text-[9px] text-muted-foreground whitespace-nowrap">
                          {new Date(item.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Payout history */}
            {payoutHistory.length > 0 && (
              <div className="glass-card p-5 mb-4">
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-xhosa-teal" /> Payout History
                </h3>
                <div className="space-y-2">
                  {payoutHistory.map((event, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xhosa-teal text-xs font-bold">Round {event.round}</span>
                        <span className="text-muted-foreground">→ {MEMBER_NAMES[event.member] ?? `Member ${event.member + 1}`}</span>
                      </div>
                      <span className="font-semibold text-white">{formatCurrency(event.amount)}</span>
                    </motion.div>
                  ))}
                </div>
                <div className="border-t border-white/10 mt-3 pt-3 flex justify-between text-sm">
                  <span className="text-muted-foreground">Total distributed</span>
                  <span className="font-bold gold-text">{formatCurrency(payoutHistory.reduce((s, e) => s + e.amount, 0))}</span>
                </div>
              </div>
            )}

            {/* Stokvel Constitution accordion */}
            <div className="glass-card p-5">
              <button
                type="button"
                className="w-full flex items-center justify-between"
                onClick={() => setShowConstitution((s) => !s)}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-gold" />
                  <span className="font-semibold text-white text-sm">Stokvel Constitution</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/20">
                    {CONSTITUTION_RULES.length} rules
                  </span>
                </div>
                <motion.div animate={{ rotate: showConstitution ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </motion.div>
              </button>

              <AnimatePresence>
                {showConstitution && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 space-y-3">
                      {CONSTITUTION_RULES.map(({ num, rule }, i) => (
                        <motion.div
                          key={num}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.06 }}
                          className="flex items-start gap-3"
                        >
                          <span className="text-[10px] font-black text-gold bg-gold/10 border border-gold/20 rounded-lg px-2 py-1 shrink-0">
                            {num}
                          </span>
                          <p className="text-xs text-white/70 leading-relaxed">{rule}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* ── Grocery Stokvel ───────────────────────────────────────────────── */}
        {activeTab === "grocery" && (
          <motion.div key="grocery" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>

            {/* Interactive calculator */}
            <div className="glass-card p-5 mb-4 border-l-4 border-l-xhosa-teal">
              <div className="flex items-center gap-2 mb-4">
                <Calculator className="w-5 h-5 text-xhosa-teal" />
                <h3 className="font-semibold text-white">Bulk-Buy Calculator</h3>
              </div>

              <div className="space-y-4 mb-5">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Group size</span>
                    <span className="text-white font-semibold">{groceryMembers} members</span>
                  </div>
                  <input
                    type="range" min={4} max={20} step={1}
                    value={groceryMembers}
                    onChange={(e) => setGroceryMembers(Number(e.target.value))}
                    className="w-full accent-gold"
                    aria-label="Group size"
                  />
                  <div className="flex justify-between text-[9px] text-muted-foreground mt-0.5">
                    <span>4 members</span><span>20 members</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Monthly contribution</span>
                    <span className="text-white font-semibold">{formatCurrency(groceryContrib)}</span>
                  </div>
                  <input
                    type="range" min={50} max={500} step={50}
                    value={groceryContrib}
                    onChange={(e) => setGroceryContrib(Number(e.target.value))}
                    className="w-full accent-gold"
                    aria-label="Monthly contribution"
                  />
                  <div className="flex justify-between text-[9px] text-muted-foreground mt-0.5">
                    <span>R50</span><span>R500</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { label: "Monthly Pool",    value: formatCurrency(groceryPool),   color: "text-white"      },
                  { label: "Bulk Discount",   value: "~35%",                        color: "text-xhosa-teal" },
                  { label: "Your Hamper",     value: formatCurrency(groceryHamper), color: "text-gold"       },
                  { label: "Annual Saving",   value: formatCurrency(groceryAnnual), color: "text-xhosa-teal" },
                ].map(({ label, value, color }) => (
                  <motion.div
                    key={label}
                    className="bg-white/5 rounded-xl p-3 text-center border border-white/8"
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                  >
                    <p className="text-[10px] text-muted-foreground mb-1">{label}</p>
                    <motion.p key={value} initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`text-base font-bold ${color}`}>
                      {value}
                    </motion.p>
                  </motion.div>
                ))}
              </div>

              <motion.button
                type="button"
                className="btn-premium w-full flex items-center justify-center gap-2"
                onClick={handleContribute}
                disabled={cash < 100}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
              >
                <PiggyBank className="w-4 h-4" /> Contribute R100 to Grocery Pool
              </motion.button>
            </div>

            {/* Price comparison accordion */}
            <div className="glass-card p-5 mb-4">
              <button
                type="button"
                className="w-full flex items-center justify-between"
                onClick={() => setShowGroceryItems((s) => !s)}
              >
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-xhosa-teal" />
                  <span className="font-semibold text-white text-sm">Item Price Comparison</span>
                  <span className="text-[10px] text-xhosa-teal/80">Retail vs Bulk</span>
                </div>
                <motion.div animate={{ rotate: showGroceryItems ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </motion.div>
              </button>

              <AnimatePresence>
                {showGroceryItems && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3">
                      {GROCERY_ITEMS.map((item, i) => {
                        const saving = item.retail - item.bulk;
                        const pct    = Math.round((saving / item.retail) * 100);
                        return (
                          <motion.div
                            key={item.name}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-0"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-white">{item.name}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] text-muted-foreground line-through">R{item.retail}</span>
                                <span className="text-[10px] text-xhosa-teal font-semibold">R{item.bulk}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-bold text-xhosa-teal">−{pct}%</span>
                              <p className="text-[9px] text-muted-foreground">save R{saving}</p>
                            </div>
                          </motion.div>
                        );
                      })}
                      <div className="pt-3 mt-1 space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Total retail</span>
                          <span className="text-white font-semibold">R{GROCERY_ITEMS.reduce((s, i) => s + i.retail, 0)}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Total bulk</span>
                          <span className="text-xhosa-teal font-semibold">R{GROCERY_ITEMS.reduce((s, i) => s + i.bulk, 0)}</span>
                        </div>
                        <div className="flex justify-between text-xs pt-1 border-t border-white/8">
                          <span className="text-muted-foreground">You save</span>
                          <span className="text-gold font-bold">R{GROCERY_ITEMS.reduce((s, i) => s + (i.retail - i.bulk), 0)}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* How it works */}
            <div className="glass-card p-5 border-l-4 border-l-xhosa-teal">
              <h3 className="font-semibold text-white mb-3">How Grocery Stokvels Work</h3>
              <ul className="text-sm text-white/70 space-y-3">
                {[
                  "Members each contribute R100/month to the shared pot",
                  "A designated shopper buys in bulk at Makro or similar wholesalers",
                  "Bulk buying unlocks 25–40% discounts unavailable to individual shoppers",
                  "Each member receives a hamper worth significantly more than R100",
                  "Over R50 billion flows through SA stokvels annually — now you're part of it",
                ].map((text, i) => (
                  <motion.li
                    key={i}
                    className="flex items-start gap-2"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    <span className="text-xhosa-teal font-bold shrink-0 w-5">{i + 1}.</span>
                    {text}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}

        {/* ── Investment Stokvel ────────────────────────────────────────────── */}
        {activeTab === "investment" && (
          <motion.div key="investment" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>

            <div className="glass-card p-5 mb-4 border-l-4 border-l-xhosa-blue">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-xhosa-blue" />
                <h3 className="font-semibold text-white">Growth Projection</h3>
                <span className="text-[10px] text-muted-foreground">10% p.a. JSE ETF estimate</span>
              </div>

              {/* Time slider */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Time horizon</span>
                  <span className="font-semibold text-white">
                    {investMonths >= 12
                      ? `${Math.floor(investMonths / 12)}y${investMonths % 12 > 0 ? ` ${investMonths % 12}m` : ""}`
                      : `${investMonths}m`}
                  </span>
                </div>
                <input
                  type="range" min={6} max={120} step={6}
                  value={investMonths}
                  onChange={(e) => setInvestMonths(Number(e.target.value))}
                  className="w-full accent-gold"
                  aria-label="Investment time horizon in months"
                />
                <div className="flex justify-between text-[9px] text-muted-foreground mt-0.5">
                  <span>6 months</span><span>10 years</span>
                </div>
              </div>

              {/* Year-by-year bar chart */}
              <div className="bg-white/3 rounded-xl p-3 border border-white/8 mb-4">
                <p className="text-[10px] text-muted-foreground mb-2">Year-by-year growth</p>
                <InvestmentChart principal={investmentPrincipal} months={investMonths} />
              </div>

              {/* Value cards */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-white/5 rounded-xl p-3 text-center border border-white/8">
                  <p className="text-[10px] text-muted-foreground mb-1">Starting value</p>
                  <p className="text-lg font-bold text-white">{formatCurrency(investmentPrincipal)}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center border border-white/8">
                  <p className="text-[10px] text-muted-foreground mb-1">Projected value</p>
                  <motion.p
                    key={investmentProjection.toFixed(0)}
                    initial={{ scale: 0.88, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-lg font-bold text-xhosa-teal"
                  >
                    {formatCurrency(investmentProjection)}
                  </motion.p>
                </div>
              </div>

              {/* Growth highlight */}
              <div className="bg-gold/5 border border-gold/15 rounded-xl p-3 mb-5 text-center">
                <p className="text-[10px] text-muted-foreground mb-0.5">Total growth</p>
                <motion.p
                  key={investmentGain.toFixed(0)}
                  initial={{ scale: 0.88, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-2xl font-bold gold-text"
                >
                  +{formatCurrency(investmentGain)}
                </motion.p>
                <p className="text-[10px] text-muted-foreground mt-0.5">+{investmentGainPct}% over {investMonths} months</p>
              </div>

              <motion.button
                type="button"
                className="btn-premium w-full flex items-center justify-center gap-2 mb-3"
                onClick={handleContribute}
                disabled={cash < 100}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
              >
                <TrendingUp className="w-4 h-4" /> Invest R100 with the Group
              </motion.button>
              <p className="text-[10px] text-muted-foreground text-center">
                Projections are illustrative. Real returns vary. Past JSE performance does not guarantee future results.
              </p>
            </div>

            <div className="glass-card p-5 border-l-4 border-l-xhosa-blue">
              <h3 className="font-semibold text-white mb-3">Why Investment Stokvels Work</h3>
              <ul className="text-sm text-white/70 space-y-3">
                {[
                  "Group investing pools capital for diversified JSE ETF exposure from R1/share",
                  "Peer accountability keeps members contributing — social contract is powerful",
                  "EasyEquities Stokvel allows groups to invest collectively in real JSE stocks",
                  "Compound growth means the longer you stay, the faster it compounds",
                ].map((point, i) => (
                  <motion.li
                    key={i}
                    className="flex items-start gap-2"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    <span className="text-xhosa-blue font-bold shrink-0">•</span>
                    {point}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── How it works (shared) ─────────────────────────────────────────────── */}
      <div className="glass-card p-5 mt-4 border-l-4 border-l-gold">
        <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-gold" /> {t("stokvel.howItWorks")}
        </h3>
        <ul className="text-sm text-white/70 space-y-1.5">
          <li>• Each member contributes R100 to the communal pot</li>
          <li>• When the pot reaches R2,000, it rotates to the next member</li>
          <li>• The Stokvel tradition has built wealth in SA communities for generations</li>
          <li>• Over R50 billion flows through South African stokvels every year</li>
        </ul>
      </div>

      {showEEPrompt && (
        <EasyEquitiesPrompt
          trigger="stokvel"
          inline
          onDismiss={() => setShowEEPrompt(false)}
        />
      )}
    </div>
  );
}
