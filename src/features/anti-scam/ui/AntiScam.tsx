import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, AlertTriangle, CheckCircle, XCircle, Download, Plus } from "lucide-react";
import { useGameStore } from "@/shared/stores/gameStore";
import { useUserStore } from "@/shared/stores/userStore";

const DEFAULT_SCAMS = [
  { text: "CEO needs R50k transfer urgently for a deal closing in 1 hour.", sender: "ceo@company-za.com", correctAction: "verify" },
  { text: "Your account is locked. Click here to reset password immediately.", sender: "security@paypa1.co.za", correctAction: "ignore" },
  { text: "Invoice #8842 is overdue. Pay now to avoid legal action.", sender: "accounts@vendor-pty.co.za", correctAction: "verify" },
  { text: "You've won R250,000 in the Lotto! Click to claim.", sender: "winner@lotto-sa.net", correctAction: "ignore" },
  { text: "Urgent: Update your banking details for SARS refund.", sender: "refunds@sars-za.org", correctAction: "verify" },
];

export default function AntiScam() {
  const user           = useUserStore((s) => s.user);
  const phishingTotal  = useGameStore((s) => s.phishingTotal);
  const phishingCaught = useGameStore((s) => s.phishingCaught);
  const customScams    = useGameStore((s) => s.customScams);
  const recordPhishing = useGameStore((s) => s.recordPhishing);
  const addCustomScam  = useGameStore((s) => s.addCustomScam);

  const [scamText, setScamText]     = useState("");
  const [scamSender, setScamSender] = useState("");
  const [lastResult, setLastResult] = useState<{ text: string; correct: boolean } | null>(null);

  const allScams  = [...DEFAULT_SCAMS, ...customScams];
  const awareness = phishingTotal > 0 ? Math.round((phishingCaught / phishingTotal) * 100) : 0;

  const triggerScam = () => {
    const scam   = allScams[Math.floor(Math.random() * allScams.length)];
    const action = window.confirm(
      `⚠️ SIMULATED PHISHING\n\nFrom: ${scam.sender}\n\n"${scam.text}"\n\nOK = Verify / Report\nCancel = Ignore / Delete`
    );
    const correct =
      (scam.correctAction === "verify" && action === true) ||
      (scam.correctAction === "ignore" && action === false);
    recordPhishing(correct);
    setLastResult({ text: scam.text.substring(0, 60), correct });
  };

  const addCustom = () => {
    if (!scamText || !scamSender) return;
    addCustomScam({ text: scamText, sender: scamSender, correctAction: "verify" });
    setScamText("");
    setScamSender("");
  };

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

  return (
    <div className="page-container pb-24">
      <h2 className="font-serif text-3xl font-bold text-white mb-2 flex items-center gap-3">
        <Shield className="w-6 h-6 text-gold" /> B2B Enterprise Shield
      </h2>
      <p className="text-muted-foreground text-sm mb-6">
        "Iinkomo zakho zikhuselekile" — Protect your cattle (wealth).
      </p>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="glass-card p-4 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Awareness</p>
          <p className="text-2xl font-bold text-xhosa-teal">{awareness}%</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Attempts</p>
          <p className="text-2xl font-bold text-white">{phishingTotal}</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Avoided</p>
          <p className="text-2xl font-bold text-xhosa-teal">{phishingCaught}</p>
        </div>
      </div>

      <button type="button" className="btn-premium w-full mb-4 flex items-center justify-center gap-2" onClick={triggerScam}>
        <AlertTriangle className="w-4 h-4" /> Simulated Phishing Email
      </button>

      {lastResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`glass-card p-4 mb-4 border-l-4 ${lastResult.correct ? "border-l-xhosa-teal" : "border-l-xhosa-red"}`}
        >
          <div className="flex items-center gap-2">
            {lastResult.correct
              ? <CheckCircle className="w-5 h-5 text-xhosa-teal" />
              : <XCircle className="w-5 h-5 text-xhosa-red" />}
            <p className="text-sm text-white">
              {lastResult.text}... — {lastResult.correct ? "Avoided" : "Fell for it"}
            </p>
          </div>
        </motion.div>
      )}

      <div className="glass-card p-5 mb-4">
        <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
          <Plus className="w-4 h-4 text-gold" /> Create Custom Training Scenario
        </h3>
        <textarea
          className="input-premium mb-3"
          rows={2}
          placeholder="Enter scam message text..."
          value={scamText}
          onChange={(e) => setScamText(e.target.value)}
        />
        <input
          className="input-premium mb-3"
          placeholder="Sender email address"
          value={scamSender}
          onChange={(e) => setScamSender(e.target.value)}
        />
        <button
          type="button"
          className="btn-outline-premium w-full"
          onClick={addCustom}
          disabled={!scamText || !scamSender}
        >
          Add to Training Pool
        </button>
      </div>

      <button type="button" className="btn-outline-premium w-full flex items-center justify-center gap-2" onClick={downloadReport}>
        <Download className="w-4 h-4" /> Download Compliance Report
      </button>
    </div>
  );
}
