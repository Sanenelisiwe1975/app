import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Shield, AlertTriangle, CheckCircle, XCircle,
  Download, ChevronRight, Eye, Trash2, BadgeCheck,
} from "lucide-react";
import { useGameStore } from "@/shared/stores/gameStore";
import { useUserStore } from "@/shared/stores/userStore";

// ── Scenario bank ─────────────────────────────────────────────────────────────

type ScamCategory = "phishing" | "ceo-fraud" | "investment" | "sms" | "social" | "advance-fee";

interface Scenario {
  id: string;
  category: ScamCategory;
  sender: string;
  subject: string;
  body: string;
  correctAction: "verify" | "ignore";
  explanation: string;
  redFlags: string[];
}

const CATEGORY_LABELS: Record<ScamCategory, { label: string; color: string }> = {
  "phishing":    { label: "Phishing",     color: "text-xhosa-red"    },
  "ceo-fraud":   { label: "CEO Fraud",    color: "text-xhosa-yellow" },
  "investment":  { label: "Investment",   color: "text-gold"         },
  "sms":         { label: "SMS Scam",     color: "text-xhosa-blue"   },
  "social":      { label: "Social Eng.",  color: "text-xhosa-teal"   },
  "advance-fee": { label: "Advance Fee",  color: "text-xhosa-coral"  },
};

const SCENARIOS: Scenario[] = [
  {
    id: "s1",
    category: "ceo-fraud",
    sender: "ceo@companyza-group.com",
    subject: "URGENT — Confidential transfer needed",
    body: "I'm in a meeting and can't talk. I need you to transfer R85,000 to a new supplier immediately. This is time-sensitive and confidential — do not discuss with anyone. I'll explain later.",
    correctAction: "verify",
    explanation: "This is a classic CEO fraud / Business Email Compromise (BEC). Urgency + secrecy are the two biggest red flags. Always verify financial requests through a known phone number — never reply to the email.",
    redFlags: ["Urgency pressure", "Request for secrecy", "Unverified supplier", "Slightly different email domain"],
  },
  {
    id: "s2",
    category: "phishing",
    sender: "security@nedbank-alerts.co.za",
    subject: "Your account has been suspended",
    body: "We detected unusual activity on your Nedbank account. Your account has been suspended. Click the link below to verify your identity and restore access within 24 hours or your account will be closed.",
    correctAction: "ignore",
    explanation: "Real banks never ask you to click a link to restore access. The domain 'nedbank-alerts.co.za' is not Nedbank's official domain (nedbank.co.za). Go directly to the bank's official website or call their number on your card.",
    redFlags: ["Fake domain", "Threat of account closure", "Click link to verify", "24-hour deadline pressure"],
  },
  {
    id: "s3",
    category: "investment",
    sender: "returns@crypto-profit-za.net",
    subject: "Earn 40% monthly — Join our investment pool",
    body: "Our AI trading bot guarantees 40% monthly returns on crypto. Minimum investment R5,000. Over 2,000 South Africans already earning. Limited spots available. WhatsApp us now to join.",
    correctAction: "ignore",
    explanation: "No legitimate investment guarantees 40% monthly returns — that's 480% annually. This is a Ponzi scheme. If it sounds too good to be true, it is. Legitimate investments are registered with the FSCA.",
    redFlags: ["Guaranteed returns", "Unrealistic % (40%/month)", "WhatsApp-based", "Urgency (limited spots)"],
  },
  {
    id: "s4",
    category: "sms",
    sender: "SARS-ZA",
    subject: "Tax refund of R14,320 pending",
    body: "SARS: Your tax refund of R14,320 is ready. To receive your refund, update your banking details at the link below. Refund expires in 48 hours.",
    correctAction: "ignore",
    explanation: "SARS communicates through your registered eFiling account, not via SMS with links. SARS already has your banking details from your tax return. Never click SMS links claiming to be from SARS.",
    redFlags: ["SMS with link", "SARS doesn't send refunds via SMS links", "48-hour expiry pressure", "Request to update banking details"],
  },
  {
    id: "s5",
    category: "advance-fee",
    sender: "dr.james.okonkwo@gmail.com",
    subject: "Strictly Confidential — Business Proposal",
    body: "I am a senior official at a Nigerian oil company. I have $12.5 million USD to transfer abroad. I need a trustworthy partner in SA. You will receive 30% (R75M). I need your banking details and a small processing fee of R15,000.",
    correctAction: "ignore",
    explanation: "This is the infamous '419' advance-fee fraud. There is no $12.5M. The R15,000 'processing fee' disappears, then they ask for more. Never send money to receive money — this is always a scam.",
    redFlags: ["Unsolicited large sum", "Requires a 'processing fee'", "Gmail sender for official business", "Too-good-to-be-true commission"],
  },
  {
    id: "s6",
    category: "phishing",
    sender: "noreply@absa-secure.com",
    subject: "Verify your Absa account — Action required",
    body: "Dear Absa customer, we are upgrading our security systems. Please verify your account by confirming your card number, PIN, and OTP via the secure form below. Failure to verify within 12 hours will result in account suspension.",
    correctAction: "ignore",
    explanation: "Absa will never ask for your PIN or OTP via email. No bank ever asks for your PIN — not via email, phone, or SMS. The domain 'absa-secure.com' is fake. Report this to Absa's fraud line: 0800 111 155.",
    redFlags: ["Requests PIN and OTP", "Fake domain", "Suspension threat", "12-hour deadline"],
  },
  {
    id: "s7",
    category: "social",
    sender: "WhatsApp: +27 82 555 0192",
    subject: "Hi, I'm a friend — quick favour?",
    body: "Hey, it's me — my phone got stolen and I'm using a new number. I'm stuck in Cape Town and need R3,500 urgently for a flight home. I'll pay you back tomorrow. Can you send to this Capitec: 1234567890?",
    correctAction: "verify",
    explanation: "This is a WhatsApp impersonation scam. Always call your friend on their old number or verify through a mutual contact before sending money. The 'new number' is the scammer's. Billions are lost this way annually in SA.",
    redFlags: ["New number claim", "Urgency", "Request to send money", "Can't verify identity"],
  },
  {
    id: "s8",
    category: "ceo-fraud",
    sender: "hr@company-payroll.co.za",
    subject: "Payroll banking detail update required",
    body: "Dear employee, due to our banking migration, please submit your updated banking details for the next payroll run by Friday. Fill in the form linked below to ensure your salary is not delayed.",
    correctAction: "verify",
    explanation: "Payroll detail change requests should always be verified directly with your HR department using a known internal contact — not by clicking links in emails. Fraudsters intercept payrolls this way.",
    redFlags: ["Requests banking details via email link", "Unofficial-looking domain", "Payroll threat (salary delay)", "Impersonates HR"],
  },
  {
    id: "s9",
    category: "investment",
    sender: "support@easyequities-dividends.co.za",
    subject: "You have unclaimed dividends of R8,240",
    body: "EasyEquities has detected unclaimed dividends in your account dating back 3 years totalling R8,240. To claim, please re-verify your identity and banking details via the link below.",
    correctAction: "ignore",
    explanation: "This impersonates EasyEquities. The real domain is easyequities.co.za. Log into your account directly to check dividends. Legitimate platforms never ask you to 'reverify' banking details through unsolicited emails.",
    redFlags: ["Impersonates real brand", "Fake domain", "Requests banking details", "Large unclaimed amount bait"],
  },
  {
    id: "s10",
    category: "sms",
    sender: "FNB",
    subject: "Your FNB OTP is 847291",
    body: "Your FNB OTP is 847291. A consultant from FNB Fraud Prevention will call you to verify this transaction. Please share the OTP with them to cancel the fraudulent transaction.",
    correctAction: "ignore",
    explanation: "FNB or any bank will NEVER ask you to share your OTP. The 'consultant' is the fraudster. OTPs are one-time passwords — sharing them authorises the very transaction you think you're cancelling. Hang up immediately.",
    redFlags: ["Asks you to share OTP", "Urgency (fraud claim)", "Inbound call asking for OTP", "Real bank branding used"],
  },
  {
    id: "s11",
    category: "advance-fee",
    sender: "lottery@uk-prize-draw.org",
    subject: "You've won £500,000 in the UK International Lottery",
    body: "Congratulations! Your email was selected in our international draw. You've won £500,000 (≈R11 million). To claim your prize, pay a R2,500 release fee and provide your passport copy.",
    correctAction: "ignore",
    explanation: "You can't win a lottery you didn't enter. The 'release fee' is the entire scam — once paid, they'll ask for more fees. Legitimate lotteries deduct fees from winnings, never ask for upfront payment.",
    redFlags: ["You didn't enter this lottery", "Upfront fee required", "Passport copy request (identity theft)", "International prize scam"],
  },
  {
    id: "s12",
    category: "social",
    sender: "love.blessing22@outlook.com",
    subject: "Hello beautiful soul — I want to know you",
    body: "Hi, I am a U.S. Army doctor working in Syria. I found your profile and feel a connection. I have $2M in gold bars that I need help transferring. In return I will marry you and we share everything.",
    correctAction: "ignore",
    explanation: "This is a romance scam combined with an advance-fee fraud. The 'gold bars' don't exist. After weeks of building trust, they'll ask for money (visa fees, shipping, etc). South Africans lose R100M+ annually to romance scams.",
    redFlags: ["Unsolicited contact", "Military abroad hook", "Gold/asset transfer story", "Marriage offer to stranger"],
  },
  {
    id: "s13",
    category: "phishing",
    sender: "delivery@dhlexpress-tracking.co.za",
    subject: "Your package requires R89 customs clearance",
    body: "DHL Express: Your international package (tracking ZA994821) is held at customs. A clearance fee of R89 is required within 24 hours. Pay via the link below to release your parcel.",
    correctAction: "ignore",
    explanation: "DHL will never email you to pay customs via a link. This is a parcel phishing scam — the R89 is bait to capture your card details. Check parcels only via dhl.com using your tracking number directly.",
    redFlags: ["Fake DHL domain", "Small fee designed to seem believable", "Pay via link", "Tracking number to seem legitimate"],
  },
  {
    id: "s14",
    category: "ceo-fraud",
    sender: "lawyer@smith-attorneys-trust.com",
    subject: "Estate of a deceased relative — urgent action required",
    body: "I represent the estate of Mr. Johan van der Berg who passed without heirs. He shares your surname. His estate of R4.2M requires a next-of-kin claimant. I need your ID and a R5,000 processing fee to begin probate.",
    correctAction: "ignore",
    explanation: "Legitimate estate attorneys never solicit claimants via cold email. The 'same surname' is a manipulation tactic. The processing fee goes straight to the scammer. Never pay to claim an inheritance.",
    redFlags: ["Cold email from unknown attorney", "Upfront fee to claim inheritance", "Too convenient surname match", "Urgency to act quickly"],
  },
  {
    id: "s15",
    category: "sms",
    sender: "Capitec Bank",
    subject: "SIM swap alert — verify now",
    body: "Capitec: A SIM swap has been requested on your account. If this was NOT you, call 0860 10 20 43 immediately and confirm your PIN to cancel.",
    correctAction: "verify",
    explanation: "This one requires verification — but not by calling the number in the SMS. A real SIM swap alert IS worth acting on, but call Capitec's official number (0860 10 20 43 is correct, but always verify the number from their website or your card) and NEVER confirm your PIN over the phone.",
    redFlags: ["Never share PIN even to cancel a SIM swap", "Verify number independently", "Could be real — call using number from your card"],
  },
  {
    id: "s16",
    category: "investment",
    sender: "admin@forex-millionaire-club.co.za",
    subject: "Join 500+ South Africans making R20k/week",
    body: "Our forex trading group has average weekly returns of R20,000 per member. Join for R3,500 and get access to our expert signals. Screenshot proof in our WhatsApp group. Money-back guarantee.",
    correctAction: "ignore",
    explanation: "Forex signal groups are almost always pyramid schemes. Screenshots are fabricated. 'Money-back guarantees' are worthless — the operators disappear. Legitimate forex trading requires FSCA registration — verify at fsca.co.za.",
    redFlags: ["WhatsApp-based 'proof'", "Guaranteed weekly income", "Upfront fee to 'join'", "No FSCA registration mentioned"],
  },
  {
    id: "s17",
    category: "phishing",
    sender: "noreply@sassa-grants.org",
    subject: "Your SASSA grant of R1,800 is ready to collect",
    body: "SASSA: Your social grant payment of R1,800 is available. Due to new regulations, you must re-register your details. Click the link to update your information and banking details.",
    correctAction: "ignore",
    explanation: "SASSA communicates through official channels and does not send emails with links to update banking details. This scam targets vulnerable grant recipients. Report it to SASSA at 0800 60 10 11.",
    redFlags: ["SASSA doesn't send emails with banking update links", "Fake domain (sassa-grants.org vs sassa.gov.za)", "Targets vulnerable people", "Re-registration pressure"],
  },
  {
    id: "s18",
    category: "social",
    sender: "hr-recruitment@job-sa-careers.co.za",
    subject: "Job offer — Data Capture Agent — R18,000/month work from home",
    body: "You have been selected for a data capture position. Salary R18,000/month, work from home. To secure your position, pay a R1,200 registration fee and submit your ID and bank statement.",
    correctAction: "ignore",
    explanation: "Legitimate employers NEVER charge a registration fee. Any job offer requiring an upfront payment is a scam. Additionally, requesting your ID and bank statement to 'apply' is identity theft. Report to the Department of Labour.",
    redFlags: ["Upfront registration fee", "Requests ID + bank statement", "Unsolicited job offer", "Too-high salary for unskilled work"],
  },
  {
    id: "s19",
    category: "advance-fee",
    sender: "accounts@vendor-pty-ltd.co.za",
    subject: "Invoice #INV-2847 — Payment overdue: R42,500",
    body: "Please find attached Invoice #INV-2847 for services rendered in October. This account is 30 days overdue. Please arrange payment to avoid legal action. New banking details are on the invoice.",
    correctAction: "verify",
    explanation: "Invoice fraud is a major threat to businesses. Verify banking detail changes directly with your supplier using a phone number you already have on record — never use contact details from the suspicious email. Call before you pay.",
    redFlags: ["Changed banking details on invoice", "Legal threat to pressure quick payment", "Slightly different supplier email domain", "No prior payment relationship established"],
  },
  {
    id: "s20",
    category: "sms",
    sender: "MTNSA",
    subject: "Congratulations! You've won a Samsung Galaxy S24",
    body: "MTN: You have been selected as our monthly data competition winner! Claim your Samsung Galaxy S24 by paying R250 courier fee. Reply YES or visit the link to claim before midnight.",
    correctAction: "ignore",
    explanation: "MTN and other networks do run competitions, but they never require you to pay to claim a prize. The R250 courier fee is the scam. Legitimate prizes have all costs covered by the company.",
    redFlags: ["Pay to claim a prize", "Midnight deadline", "SMS with link or reply", "'You've won' without entering"],
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function AntiScam() {
  const { t }          = useTranslation();
  const user           = useUserStore((s) => s.user);
  const phishingTotal  = useGameStore((s) => s.phishingTotal);
  const phishingCaught = useGameStore((s) => s.phishingCaught);
  const recordPhishing = useGameStore((s) => s.recordPhishing);

  const [activeScam, setActiveScam]       = useState<Scenario | null>(null);
  const [answered, setAnswered]           = useState<"correct" | "wrong" | null>(null);
  const [seenIds, setSeenIds]             = useState<Set<string>>(new Set());
  const [categoryFilter, setCategoryFilter] = useState<ScamCategory | "all">("all");

  const awareness = phishingTotal > 0 ? Math.round((phishingCaught / phishingTotal) * 100) : 0;

  const filteredPool = SCENARIOS.filter(
    (s) => categoryFilter === "all" || s.category === categoryFilter,
  );

  const launchScam = useCallback(() => {
    const unseen = filteredPool.filter((s) => !seenIds.has(s.id));
    const pool   = unseen.length > 0 ? unseen : filteredPool;
    const pick   = pool[Math.floor(Math.random() * pool.length)];
    setActiveScam(pick);
    setAnswered(null);
  }, [filteredPool, seenIds]);

  const handleAction = (action: "verify" | "ignore") => {
    if (!activeScam) return;
    const correct = action === activeScam.correctAction;
    recordPhishing(correct);
    setAnswered(correct ? "correct" : "wrong");
    setSeenIds((prev) => new Set(prev).add(activeScam.id));
  };

  const closeScam = () => { setActiveScam(null); setAnswered(null); };

  const downloadReport = () => {
    const report = {
      user: user?.name,
      awareness: `${awareness}%`,
      attempts: phishingTotal,
      caught: phishingCaught,
      date: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const a    = document.createElement("a");
    a.href     = URL.createObjectURL(blob);
    a.download = `compliance_report_${user?.name ?? "user"}.json`;
    a.click();
  };

  const awarenesspct = Math.min(100, awareness);
  const ring = awarenesspct >= 80 ? "text-xhosa-teal" : awarenesspct >= 50 ? "text-gold" : "text-xhosa-red";

  return (
    <div className="page-container pb-24">
      <h2 className="font-serif text-3xl font-bold text-white mb-2 flex items-center gap-3">
        <Shield className="w-6 h-6 text-gold" /> {t("antiScam.title")}
      </h2>
      <p className="text-muted-foreground text-sm mb-6 italic">
        "Iinkomo zakho zikhuselekile" — Protect your cattle (wealth).
      </p>

      {/* ── Stats row ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="glass-card p-4 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{t("antiScam.awareness")}</p>
          <p className={`text-2xl font-bold ${ring}`}>{awareness}%</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{t("antiScam.attempts")}</p>
          <p className="text-2xl font-bold text-white">{phishingTotal}</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{t("antiScam.avoided")}</p>
          <p className="text-2xl font-bold text-xhosa-teal">{phishingCaught}</p>
        </div>
      </div>

      {/* ── Awareness bar ──────────────────────────────────────────────────── */}
      {phishingTotal > 0 && (
        <div className="mb-6">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Scam awareness</span>
            <span>{awareness}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${awarenesspct >= 80 ? "bg-xhosa-teal" : awarenesspct >= 50 ? "bg-gold" : "bg-xhosa-red"}`}
              animate={{ width: `${awarenesspct}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
        </div>
      )}

      {/* ── Category filter ─────────────────────────────────────────────────── */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {(["all", ...Object.keys(CATEGORY_LABELS)] as ("all" | ScamCategory)[]).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              categoryFilter === cat
                ? "bg-gold/20 text-gold border border-gold/30"
                : "bg-white/5 text-muted-foreground border border-white/10 hover:bg-white/10"
            }`}
          >
            {cat === "all" ? "All Types" : CATEGORY_LABELS[cat].label}
          </button>
        ))}
      </div>

      {/* ── Launch button ───────────────────────────────────────────────────── */}
      <button
        type="button"
        className="btn-premium w-full mb-4 flex items-center justify-center gap-2"
        onClick={launchScam}
      >
        <AlertTriangle className="w-4 h-4" /> Simulate Scam Attempt
      </button>

      {/* ── Scenario card modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {activeScam && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
            onClick={closeScam}
          >
            <motion.div
              initial={{ y: 60, scale: 0.97 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              className="bg-dark-card border border-white/10 rounded-3xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Category badge */}
              <div className="flex items-center justify-between mb-4">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/5 border border-white/10 ${CATEGORY_LABELS[activeScam.category].color}`}>
                  {CATEGORY_LABELS[activeScam.category].label}
                </span>
                <button type="button" onClick={closeScam} className="text-muted-foreground hover:text-white text-lg">✕</button>
              </div>

              {/* Email card */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-xhosa-red/20 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-4 h-4 text-xhosa-red" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground truncate">From: {activeScam.sender}</p>
                    <p className="text-sm font-semibold text-white mt-0.5">{activeScam.subject}</p>
                  </div>
                </div>
                <p className="text-sm text-white/80 leading-relaxed border-t border-white/10 pt-3">{activeScam.body}</p>
              </div>

              {/* Action prompt */}
              {!answered ? (
                <>
                  <p className="text-center text-xs text-muted-foreground mb-3 uppercase tracking-wider">
                    What do you do?
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleAction("verify")}
                      className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-xhosa-blue/10 border border-xhosa-blue/30 text-xhosa-blue hover:bg-xhosa-blue/20 transition-all"
                    >
                      <Eye className="w-5 h-5" />
                      <span className="text-xs font-semibold">Verify / Report</span>
                      <span className="text-[9px] text-center text-xhosa-blue/70">Call the sender directly to confirm</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAction("ignore")}
                      className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-xhosa-red/10 border border-xhosa-red/30 text-xhosa-red hover:bg-xhosa-red/20 transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                      <span className="text-xs font-semibold">Ignore / Delete</span>
                      <span className="text-[9px] text-center text-xhosa-red/70">This is a scam — don't engage</span>
                    </button>
                  </div>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {/* Result banner */}
                  <div className={`flex items-center gap-3 p-4 rounded-2xl mb-4 ${
                    answered === "correct"
                      ? "bg-xhosa-teal/10 border border-xhosa-teal/30"
                      : "bg-xhosa-red/10 border border-xhosa-red/30"
                  }`}>
                    {answered === "correct"
                      ? <CheckCircle className="w-6 h-6 text-xhosa-teal shrink-0" />
                      : <XCircle className="w-6 h-6 text-xhosa-red shrink-0" />
                    }
                    <p className={`font-semibold text-sm ${answered === "correct" ? "text-xhosa-teal" : "text-xhosa-red"}`}>
                      {answered === "correct" ? "Well spotted! You avoided the scam." : "Careful! You fell for this one."}
                    </p>
                  </div>

                  {/* Explanation */}
                  <div className="bg-gold/5 border border-gold/20 rounded-2xl p-4 mb-4">
                    <p className="text-xs font-bold text-gold uppercase tracking-wider mb-2">Why?</p>
                    <p className="text-sm text-white/80 leading-relaxed">{activeScam.explanation}</p>
                  </div>

                  {/* Red flags */}
                  <div className="mb-5">
                    <p className="text-xs font-bold text-xhosa-red uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" /> Red Flags
                    </p>
                    <ul className="space-y-1.5">
                      {activeScam.redFlags.map((flag, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-white/70">
                          <span className="text-xhosa-red mt-0.5">•</span> {flag}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      className="btn-premium flex-1 flex items-center justify-center gap-2"
                      onClick={() => { closeScam(); launchScam(); }}
                    >
                      Next Scenario <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="btn-outline-premium px-4"
                      onClick={closeScam}
                    >
                      Done
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Scenario list preview ───────────────────────────────────────────── */}
      <div className="glass-card p-5 mb-4">
        <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
          <BadgeCheck className="w-4 h-4 text-gold" />
          Scenario Library ({filteredPool.length} scenarios)
        </h3>
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {filteredPool.map((s) => {
            const done = seenIds.has(s.id);
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => { setActiveScam(s); setAnswered(null); }}
                className="w-full text-left flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-gold/20 hover:bg-white/10 transition-all"
              >
                <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border bg-white/5 ${CATEGORY_LABELS[s.category].color} border-current/30 whitespace-nowrap`}>
                  {CATEGORY_LABELS[s.category].label}
                </span>
                <span className="text-xs text-white/70 flex-1 truncate">{s.subject}</span>
                {done && <CheckCircle className="w-3.5 h-3.5 text-xhosa-teal shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Download report ─────────────────────────────────────────────────── */}
      <button
        type="button"
        className="btn-outline-premium w-full flex items-center justify-center gap-2"
        onClick={downloadReport}
      >
        <Download className="w-4 h-4" /> {t("antiScam.download")}
      </button>
    </div>
  );
}
