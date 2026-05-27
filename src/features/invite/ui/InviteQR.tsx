import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { QRCodeCanvas } from "qrcode.react";
import {
  Share2, Plus, Copy, Download, Trash2, X, Clock, Users, CheckCircle, Zap,
} from "lucide-react";
import { useGameStore } from "@/shared/stores/gameStore";
import { useUserStore } from "@/shared/stores/userStore";
import {
  generateInviteCode,
  buildInviteUrl,
  formatCountdown,
} from "@/shared/hooks/useInviteSystem";
import type { Invite } from "@/shared/stores/gameStore";

const EXPIRY_OPTIONS = [
  { label: "24 Hours",  ms: 24 * 60 * 60 * 1000 },
  { label: "48 Hours",  ms: 48 * 60 * 60 * 1000 },
  { label: "7 Days",    ms: 7  * 24 * 60 * 60 * 1000 },
] as const;

const MAX_USES_OPTIONS = [1, 5, 10, 50] as const;

function downloadQR(code: string) {
  const wrapper = document.getElementById(`qr-wrap-${code}`);
  const srcCanvas = wrapper?.querySelector("canvas");
  if (!srcCanvas) return;

  const qrSize = srcCanvas.width;
  const pad    = 20;
  const footerH = 52;
  const w = qrSize + pad * 2;
  const h = qrSize + pad * 2 + footerH;

  const offscreen = document.createElement("canvas");
  offscreen.width  = w;
  offscreen.height = h;
  const ctx = offscreen.getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);

  ctx.drawImage(srcCanvas, pad, pad, qrSize, qrSize);

  ctx.fillStyle = "#12121a";
  ctx.fillRect(0, qrSize + pad * 2, w, footerH);

  ctx.fillStyle = "#D4AF37";
  ctx.font = "bold 13px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("FINLIT — Xhosa Rise Global", w / 2, qrSize + pad * 2 + 20);

  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.font = "10px monospace";
  ctx.fillText(code, w / 2, qrSize + pad * 2 + 38);

  const link = document.createElement("a");
  link.download = `FINLIT-invite-${code}.png`;
  link.href = offscreen.toDataURL("image/png");
  link.click();
}

// ── Create modal ──────────────────────────────────────────────────────────────

interface CreateModalProps {
  fromName: string;
  onClose: () => void;
  onCreate: (invite: Invite) => void;
}

function CreateModal({ fromName, onClose, onCreate }: CreateModalProps) {
  const { t } = useTranslation();
  const [message,  setMessage]  = useState("");
  const [expiryMs, setExpiryMs] = useState(EXPIRY_OPTIONS[1].ms);
  const [maxUses,  setMaxUses]  = useState<number>(10);

  const handleCreate = () => {
    const code: Invite = {
      code:      generateInviteCode(),
      createdAt: Date.now(),
      expiresAt: Date.now() + expiryMs,
      maxUses,
      message:   message.trim() || t("invite.messagePlaceholder"),
      fromName,
    };
    onCreate(code);
    onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative w-full max-w-md glass-card p-6 rounded-2xl"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-white text-lg flex items-center gap-2">
            <Plus className="w-5 h-5 text-gold" /> {t("invite.create")}
          </h3>
          <button type="button" onClick={onClose} aria-label="Close" className="text-muted-foreground hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Personal message */}
        <label className="block text-xs text-muted-foreground mb-1.5 uppercase tracking-wider">
          {t("invite.message")}
        </label>
        <input
          type="text"
          maxLength={80}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t("invite.messagePlaceholder")}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-gold/40 mb-5"
        />

        {/* Expiry */}
        <label className="block text-xs text-muted-foreground mb-1.5 uppercase tracking-wider">
          {t("invite.expiry")}
        </label>
        <div className="flex gap-2 mb-5">
          {EXPIRY_OPTIONS.map((o) => (
            <button
              key={o.ms}
              type="button"
              onClick={() => setExpiryMs(o.ms)}
              className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all border ${
                expiryMs === o.ms
                  ? "bg-gold/15 text-gold border-gold/30"
                  : "bg-white/5 text-muted-foreground border-white/10 hover:bg-white/10"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>

        {/* Max uses */}
        <label className="block text-xs text-muted-foreground mb-1.5 uppercase tracking-wider">
          {t("invite.maxUses")}
        </label>
        <div className="flex gap-2 mb-6">
          {MAX_USES_OPTIONS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setMaxUses(n)}
              className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all border ${
                maxUses === n
                  ? "bg-gold/15 text-gold border-gold/30"
                  : "bg-white/5 text-muted-foreground border-white/10 hover:bg-white/10"
              }`}
            >
              {n === 50 ? t("invite.unlimited") : n}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="btn-premium w-full flex items-center justify-center gap-2"
          onClick={handleCreate}
        >
          <Share2 className="w-4 h-4" /> {t("invite.generate")}
        </button>
      </motion.div>
    </motion.div>
  );
}

// ── Invite card ───────────────────────────────────────────────────────────────

function InviteCard({ invite, onDelete }: { invite: Invite; onDelete: () => void }) {
  const { t } = useTranslation();
  const [now, setNow] = useState(Date.now());
  const [copied, setCopied] = useState(false);
  const url = buildInviteUrl(invite);
  const isExpired = invite.expiresAt <= now;

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — silently ignore
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`glass-card p-5 ${isExpired ? "opacity-50" : ""}`}
    >
      <div className="flex gap-4">
        {/* QR Code */}
        <div id={`qr-wrap-${invite.code}`} className="shrink-0 p-2 bg-white rounded-xl">
          <QRCodeCanvas
            value={url}
            size={96}
            bgColor="#ffffff"
            fgColor="#12121a"
            level="M"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-mono text-gold font-semibold tracking-wider mb-1 truncate">
            {invite.code}
          </p>
          {invite.message && (
            <p className="text-xs text-white/70 italic mb-2 truncate">"{invite.message}"</p>
          )}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-muted-foreground mb-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {isExpired ? (
                <span className="text-xhosa-red">{t("invite.expired")}</span>
              ) : (
                formatCountdown(invite.expiresAt, now)
              )}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {t("invite.maxUses")}: {invite.maxUses === 50 ? t("invite.unlimited") : invite.maxUses}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-xs text-white transition-all"
            >
              {copied ? <CheckCircle className="w-3 h-3 text-xhosa-teal" /> : <Copy className="w-3 h-3" />}
              {copied ? t("invite.copied") : t("invite.copy")}
            </button>
            <button
              type="button"
              onClick={() => downloadQR(invite.code)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-xs text-white transition-all"
            >
              <Download className="w-3 h-3" /> {t("invite.download")}
            </button>
            <button
              type="button"
              onClick={onDelete}
              aria-label={t("invite.delete")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-xhosa-red/10 border border-xhosa-red/20 hover:bg-xhosa-red/20 text-xs text-xhosa-red transition-all ml-auto"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function InviteQR() {
  const { t } = useTranslation();
  const user          = useUserStore((s) => s.user);
  const invites       = useGameStore((s) => s.invites);
  const createInvite  = useGameStore((s) => s.createInvite);
  const deleteInvite  = useGameStore((s) => s.deleteInvite);
  const pruneExpired  = useGameStore((s) => s.pruneExpiredInvites);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    pruneExpired();
  }, [pruneExpired]);

  const fromName = user?.name ?? "A FINLIT member";

  return (
    <div className="page-container pb-24">
      <h2 className="font-serif text-3xl font-bold text-white mb-2 flex items-center gap-3">
        <Share2 className="w-6 h-6 text-gold" /> {t("invite.title")}
      </h2>
      <p className="text-muted-foreground text-sm mb-6">{t("invite.subtitle")}</p>

      {/* ── Earn banner ─────────────────────────────────────────────────── */}
      <div className="glass-card p-4 mb-6 flex items-center gap-4 border-l-4 border-l-gold">
        <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center shrink-0">
          <Zap className="w-5 h-5 text-gold" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Earn R500 + 50 XP per referral</p>
          <p className="text-xs text-muted-foreground">Every friend who joins via your link gives you a bonus automatically.</p>
        </div>
      </div>

      {/* ── Create button ───────────────────────────────────────────────── */}
      <button
        type="button"
        className="btn-premium w-full flex items-center justify-center gap-2 mb-6"
        onClick={() => setShowModal(true)}
      >
        <Plus className="w-4 h-4" /> {t("invite.create")}
      </button>

      {/* ── Active invites ──────────────────────────────────────────────── */}
      <h3 className="text-xs text-muted-foreground uppercase tracking-widest mb-3">{t("invite.active")}</h3>

      {invites.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <Share2 className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">{t("invite.noInvites")}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {invites.map((invite) => (
              <InviteCard
                key={invite.code}
                invite={invite}
                onDelete={() => deleteInvite(invite.code)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* ── Tip ─────────────────────────────────────────────────────────── */}
      <div className="glass-card p-4 border-l-4 border-l-xhosa-teal mt-6">
        <p className="text-sm text-white/70">{t("invite.tip")}</p>
      </div>

      {/* ── Create modal ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showModal && (
          <CreateModal
            fromName={fromName}
            onClose={() => setShowModal(false)}
            onCreate={createInvite}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
