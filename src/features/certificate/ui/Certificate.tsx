import { useRef, useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Award, Download, CheckCircle, Shield,
  Wallet, Zap, ExternalLink, RefreshCw, AlertCircle,
  FlaskConical, Copy, CheckCheck,
} from "lucide-react";
import { ConnectionProvider, WalletProvider, useWallet } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";
import "@solana/wallet-adapter-react-ui/styles.css";
import { useGameStore } from "@/shared/stores/gameStore";
import { useUserStore } from "@/shared/stores/userStore";
import { useSolanaDevnet } from "@/shared/hooks/useSolanaDevnet";

// ── Certificate utilities ────────────────────────────────────────────────────

async function sha256(message: string): Promise<string> {
  const msgBuffer  = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

interface CertMeta {
  id: string;
  hash: string;
  issuedAt: number;
}

async function buildCertMeta(name: string, mindset: string, date: string): Promise<CertMeta> {
  const issuedAt = Date.now();
  const raw      = `${name}|${mindset}|${date}|${issuedAt}`;
  const hash     = await sha256(raw);
  const id       = `FINLIT-${hash.slice(0, 8).toUpperCase()}-${hash.slice(8, 16).toUpperCase()}`;
  return { id, hash, issuedAt };
}

// ── Xhosa-inspired decorative components ────────────────────────────────────

const BEAD_COLORS = ["#D4AF37","#E74C3C","#1ABC9C","#3498DB","#9B59B6","#E67E22","#F1C40F"];

function BeadworkBorder({ flip = false }: { flip?: boolean }) {
  return (
    <div className="flex overflow-hidden" style={{ height: 10, width: "100%" }}>
      {Array.from({ length: 80 }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 10,
            height: 10,
            flexShrink: 0,
            background: BEAD_COLORS[i % BEAD_COLORS.length],
            clipPath: flip
              ? "polygon(50% 100%, 100% 0%, 0% 0%)"
              : "polygon(50% 0%, 100% 100%, 0% 100%)",
          }}
        />
      ))}
    </div>
  );
}

function XhosaSeal() {
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" className="mx-auto">
      {/* Outer ring */}
      <circle cx="48" cy="48" r="46" fill="none" stroke="#D4AF37" strokeWidth="1.5"/>
      {/* Dashed inner ring */}
      <circle cx="48" cy="48" r="37" fill="none" stroke="#D4AF37" strokeWidth="0.75" strokeDasharray="3 2.5"/>
      {/* 8-pointed star (outer) */}
      <polygon
        points="48,8 53,37 82,48 53,59 48,88 43,59 14,48 43,37"
        fill="#D4AF37" fillOpacity="0.15"
      />
      {/* 8-pointed star (inner) */}
      <polygon
        points="48,20 52,39 71,48 52,57 48,76 44,57 25,48 44,39"
        fill="#D4AF37" fillOpacity="0.40"
      />
      {/* Centre diamond */}
      <polygon points="48,32 57,48 48,64 39,48" fill="#D4AF37"/>
      {/* Cardinal accent arrows */}
      <polygon points="48,10 51,18 45,18" fill="#D4AF37"/>
      <polygon points="86,48 78,45 78,51" fill="#D4AF37"/>
      <polygon points="48,86 51,78 45,78" fill="#D4AF37"/>
      <polygon points="10,48 18,45 18,51" fill="#D4AF37"/>
      {/* Diagonal dot accents */}
      <circle cx="72" cy="24" r="2" fill="#D4AF37" fillOpacity="0.5"/>
      <circle cx="24" cy="72" r="2" fill="#D4AF37" fillOpacity="0.5"/>
      <circle cx="72" cy="72" r="2" fill="#D4AF37" fillOpacity="0.5"/>
      <circle cx="24" cy="24" r="2" fill="#D4AF37" fillOpacity="0.5"/>
    </svg>
  );
}

function CornerDecor({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const deg = { tl: 0, tr: 90, br: 180, bl: 270 }[pos];
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        top:    pos.startsWith("t") ? 8   : undefined,
        bottom: pos.startsWith("b") ? 8   : undefined,
        left:   pos.endsWith("l")   ? 8   : undefined,
        right:  pos.endsWith("r")   ? 8   : undefined,
        width: 48, height: 48,
      }}
    >
      <svg width="48" height="48" viewBox="0 0 48 48">
        <g transform={`rotate(${deg}, 24, 24)`}>
          <line x1="0" y1="0" x2="48" y2="0" stroke="#D4AF37" strokeWidth="1.5"/>
          <line x1="0" y1="0" x2="0"  y2="48" stroke="#D4AF37" strokeWidth="1.5"/>
          <polygon points="0,0 22,0 0,22" fill="#D4AF37" fillOpacity="0.18"/>
          <rect x="3" y="3" width="8" height="8" fill="#D4AF37" fillOpacity="0.55"
            transform="rotate(45, 7, 7)"/>
          <circle cx="16" cy="3" r="1.5" fill="#D4AF37" fillOpacity="0.5"/>
          <circle cx="3"  cy="16" r="1.5" fill="#D4AF37" fillOpacity="0.5"/>
        </g>
      </svg>
    </div>
  );
}

// ── Status label helpers ─────────────────────────────────────────────────────

const STATUS_LABELS: Record<string, string> = {
  idle:                 "Ready",
  "requesting-airdrop": "Requesting test SOL…",
  building:             "Building transaction…",
  signing:              "Waiting for wallet signature…",
  confirming:           "Confirming on Devnet…",
  success:              "Anchored on Devnet!",
  error:                "Error",
};

// ── Devnet NFT tab ───────────────────────────────────────────────────────────

function DevnetTab({ meta }: { meta: CertMeta }) {
  const { publicKey } = useWallet();
  const { status, error, result, balance, fetchBalance, requestAirdrop, mintCertificate } =
    useSolanaDevnet(meta.id, meta.hash);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (publicKey) fetchBalance();
  }, [publicKey, fetchBalance]);

  const copyAddress = () => {
    if (!publicKey) return;
    navigator.clipboard.writeText(publicKey.toBase58());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const busy = status !== "idle" && status !== "success" && status !== "error";

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 bg-xhosa-blue/10 border border-xhosa-blue/30 rounded-2xl p-4">
        <FlaskConical className="w-5 h-5 text-xhosa-blue shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-xhosa-blue">Solana Devnet — Test Environment</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            This uses <strong className="text-white">Devnet SOL only</strong> (no real money). Your certificate
            hash is recorded on the Solana blockchain as a Memo transaction — permanent and publicly
            verifiable, but on the test network.
          </p>
        </div>
      </div>

      {/* Step 1 */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-6 h-6 rounded-full bg-gold/20 text-gold text-xs font-bold flex items-center justify-center">1</span>
          <p className="font-semibold text-white text-sm">Connect Wallet</p>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Supports Phantom and Solflare. Make sure your wallet is set to <strong className="text-white">Devnet</strong>.
        </p>
        <WalletMultiButton />
        {publicKey && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-3 flex items-center gap-2">
            <span className="font-mono text-[11px] text-muted-foreground truncate max-w-[220px]">
              {publicKey.toBase58()}
            </span>
            <button type="button" aria-label="Copy wallet address" onClick={copyAddress}
              className="text-gold hover:text-gold-light transition-colors shrink-0">
              {copied ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </motion.div>
        )}
      </div>

      {/* Step 2 */}
      {publicKey && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-6 rounded-full bg-gold/20 text-gold text-xs font-bold flex items-center justify-center">2</span>
            <p className="font-semibold text-white text-sm">Get Devnet SOL</p>
          </div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-muted-foreground">Balance</p>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-white">
                {balance !== null ? `${balance.toFixed(4)} SOL` : "—"}
              </span>
              <button type="button" aria-label="Refresh balance" onClick={fetchBalance}
                className="text-muted-foreground hover:text-white transition-colors">
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={status === "requesting-airdrop"}
              onClick={requestAirdrop}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-xhosa-blue/15 text-xhosa-blue border border-xhosa-blue/30 hover:bg-xhosa-blue/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Zap className="w-3.5 h-3.5" />
              {status === "requesting-airdrop" ? "Requesting…" : "Airdrop 1 SOL"}
            </button>
            <a
              href="https://faucet.solana.com"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-white/5 text-muted-foreground border border-white/10 hover:bg-white/10 hover:text-white transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Solana Faucet
            </a>
          </div>
        </motion.div>
      )}

      {/* Step 3 */}
      {publicKey && result?.certId !== meta.id && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-6 rounded-full bg-gold/20 text-gold text-xs font-bold flex items-center justify-center">3</span>
            <p className="font-semibold text-white text-sm">Anchor Certificate On-Chain</p>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Records your certificate hash (<span className="font-mono text-white">{meta.id}</span>) to the Solana Devnet
            blockchain using the Memo Program. Costs ~0.000005 SOL.
          </p>
          {status !== "idle" && (
            <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground">
              {busy && <RefreshCw className="w-3.5 h-3.5 animate-spin text-gold" />}
              {status === "error" && <AlertCircle className="w-3.5 h-3.5 text-xhosa-red" />}
              <span className={status === "error" ? "text-xhosa-red" : "text-gold"}>{STATUS_LABELS[status]}</span>
            </div>
          )}
          {error && (
            <div className="bg-xhosa-red/10 border border-xhosa-red/25 rounded-xl p-3 mb-4 text-xs text-xhosa-red">
              {error}
            </div>
          )}
          <button
            type="button"
            disabled={busy || (balance !== null && balance < 0.000005)}
            onClick={mintCertificate}
            className="btn-premium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {busy
              ? <><RefreshCw className="w-4 h-4 animate-spin" /> {STATUS_LABELS[status]}</>
              : <><Wallet className="w-4 h-4" /> Anchor to Devnet</>}
          </button>
        </motion.div>
      )}

      {/* Success */}
      <AnimatePresence>
        {result?.certId === meta.id && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 border border-gold/30"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-16 h-16 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center">
                <Award className="w-8 h-8 text-gold" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white">Certificate Anchored!</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Your certificate hash is now permanently recorded on the Solana Devnet blockchain.
              </p>
              <div className="w-full bg-white/5 rounded-xl p-3 text-left">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Transaction Signature</p>
                <p className="font-mono text-[11px] text-white break-all">{result.txSignature}</p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                <a href={result.explorerUrl} target="_blank" rel="noopener noreferrer"
                  className="btn-premium flex items-center gap-2 text-sm">
                  <ExternalLink className="w-4 h-4" /> View on Explorer
                </a>
                <button type="button" onClick={() => navigator.clipboard.writeText(result.txSignature)}
                  className="btn-outline-premium flex items-center gap-2 text-sm">
                  <Copy className="w-4 h-4" /> Copy Signature
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Anchored {new Date(result.mintedAt).toLocaleString("en-ZA")} · Devnet only
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Certificate content (tabs) ───────────────────────────────────────────────

type Tab = "digital" | "devnet";

function CertificateContent() {
  const { t }            = useTranslation();
  const user             = useUserStore((s) => s.user);
  const mindset          = useUserStore((s) => s.mindset);
  const completedModules = useGameStore((s) => s.completedModules);
  const badges           = useGameStore((s) => s.badges);
  const xp               = useGameStore((s) => s.xp);

  const currentModules = mindset?.modules ?? [];
  const allDone        = currentModules.length > 0 && currentModules.every((m) => completedModules.includes(m.id));

  const certRef                     = useRef<HTMLDivElement>(null);
  const [tab, setTab]               = useState<Tab>("digital");
  const [downloaded, setDownloaded] = useState(false);
  const [meta, setMeta]             = useState<CertMeta | null>(null);

  const holderName  = `${user?.name ?? ""} ${user?.surname ?? ""}`.trim();
  const mindsetName = mindset?.name ?? "";

  useEffect(() => {
    if (!allDone || !user || !mindset) return;
    const dateStr = new Date().toLocaleDateString();
    buildCertMeta(holderName, mindsetName, dateStr).then(setMeta);
  }, [allDone]);

  const handleDownload = async () => {
    if (!certRef.current) return;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas      = await html2canvas(certRef.current, { scale: 2, backgroundColor: "#fff8e7", useCORS: true });
      const link        = document.createElement("a");
      link.download     = `FINLIT_Certificate_${user?.name ?? "User"}_${meta?.id ?? ""}.png`;
      link.href         = canvas.toDataURL("image/png");
      link.click();
      setDownloaded(true);
    } catch (e) {
      console.error("Download failed", e);
    }
  };

  return (
    <div className="page-container pb-24">
      <h2 className="font-serif text-3xl font-bold text-white mb-2 flex items-center gap-3">
        <Award className="w-6 h-6 text-gold" /> {t("certificate.title")}
      </h2>
      <p className="text-muted-foreground text-sm mb-6">{t("certificate.subtitle")}</p>

      {allDone && meta ? (
        <>
          {/* Tab bar */}
          <div className="flex gap-1 bg-white/5 p-1 rounded-2xl mb-6 max-w-xs">
            {(["digital", "devnet"] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className="relative flex-1 py-2 rounded-xl text-xs font-semibold transition-colors"
              >
                {tab === t && (
                  <motion.div
                    layoutId="cert-tab-pill"
                    className="absolute inset-0 bg-gold/20 border border-gold/30 rounded-xl"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className={`relative z-10 ${tab === t ? "text-gold" : "text-muted-foreground"}`}>
                  {t === "digital" ? "Digital" : "Devnet NFT"}
                </span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {tab === "digital" ? (
              <motion.div key="digital" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>

                {/* ── Premium Xhosa-Inspired Certificate ──────────────────── */}
                <div
                  ref={certRef}
                  className="max-w-2xl mx-auto mb-6 overflow-hidden rounded-2xl shadow-2xl"
                  style={{ background: "#fff8e7", color: "#1a1a2e" }}
                >
                  {/* Top beadwork strip */}
                  <BeadworkBorder />

                  {/* Gold header band */}
                  <div
                    className="py-5 px-8 text-center"
                    style={{
                      background: "linear-gradient(135deg, #a67c00 0%, #D4AF37 38%, #F0D699 60%, #D4AF37 82%, #a67c00 100%)",
                    }}
                  >
                    <p className="text-[9px] font-bold uppercase tracking-[0.45em]" style={{ color: "rgba(26,26,46,0.65)" }}>
                      Xhosa Rise Global Holdings
                    </p>
                    <p className="text-xl font-black uppercase tracking-[0.18em] mt-0.5" style={{ color: "#1a1a2e" }}>
                      Certificate of Achievement
                    </p>
                    <p className="text-[9px] uppercase tracking-[0.45em] mt-0.5" style={{ color: "rgba(26,26,46,0.55)" }}>
                      Financial Literacy Excellence
                    </p>
                  </div>

                  {/* Body */}
                  <div className="relative px-8 py-9 md:px-12 md:py-10 text-center">
                    <CornerDecor pos="tl" />
                    <CornerDecor pos="tr" />
                    <CornerDecor pos="bl" />
                    <CornerDecor pos="br" />

                    {/* Ceremonial seal */}
                    <div className="mb-5">
                      <XhosaSeal />
                    </div>

                    {/* Title lines */}
                    <p className="text-[10px] uppercase tracking-[0.35em] mb-2" style={{ color: "rgba(26,26,46,0.5)" }}>
                      {t("certificate.certTitle")}
                    </p>
                    <h1
                      className="text-4xl font-black mb-1 leading-tight"
                      style={{ fontFamily: "'Playfair Display', serif", color: "#1a1a2e" }}
                    >
                      {t("certificate.certSubtitle")}
                    </h1>

                    {/* Gold rule */}
                    <div className="flex items-center justify-center gap-3 my-5">
                      <div className="h-px flex-1 max-w-[100px]"
                        style={{ background: "linear-gradient(to right, transparent, #D4AF37)" }} />
                      <div className="w-2.5 h-2.5 rotate-45" style={{ background: "#D4AF37" }} />
                      <div className="h-px flex-1 max-w-[100px]"
                        style={{ background: "linear-gradient(to left, transparent, #D4AF37)" }} />
                    </div>

                    {/* Holder */}
                    <p className="text-[11px] mb-1" style={{ color: "rgba(26,26,46,0.5)" }}>
                      {t("certificate.certifies")}
                    </p>
                    <h3
                      className="text-3xl font-bold mb-0.5"
                      style={{ fontFamily: "'Playfair Display', serif", color: "#1a1a2e" }}
                    >
                      {holderName}
                    </h3>
                    {user?.location && (
                      <p className="text-[11px] mb-5" style={{ color: "rgba(26,26,46,0.42)" }}>{user.location}</p>
                    )}

                    {/* Mindset */}
                    <p className="text-[11px] mb-1" style={{ color: "rgba(26,26,46,0.5)" }}>
                      for successfully completing
                    </p>
                    <p className="text-xl font-bold mb-1" style={{ color: "#a67c00" }}>{mindsetName}</p>
                    <p className="text-[10px] mb-3" style={{ color: "rgba(26,26,46,0.5)" }}>
                      {badges.length} badge{badges.length !== 1 ? "s" : ""} earned
                      &nbsp;·&nbsp; {xp.toLocaleString()} XP
                      &nbsp;·&nbsp; {completedModules.length} modules completed
                    </p>
                    {badges.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-1.5 mb-6 max-w-md mx-auto">
                        {badges.map((b) => (
                          <span
                            key={b}
                            className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-gold/15 border border-gold/30 text-[#a67c00]"
                          >
                            {b}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Beadwork dot row */}
                    <div className="flex gap-1.5 justify-center mb-6">
                      {BEAD_COLORS.map((c, i) => (
                        <div key={i} style={{
                          width: 10, height: 10, borderRadius: "50%",
                          background: c, opacity: 0.72,
                        }} />
                      ))}
                    </div>

                    {/* Verification panel */}
                    <div
                      className="rounded-xl p-4 mx-auto max-w-sm text-left"
                      style={{ background: "rgba(26,26,46,0.06)", border: "1px solid rgba(26,26,46,0.11)" }}
                    >
                      <div className="flex items-center gap-1.5 mb-2">
                        <Shield className="w-3 h-3" style={{ color: "rgba(26,26,46,0.45)" }} />
                        <span className="text-[9px] uppercase tracking-[0.3em]"
                          style={{ color: "rgba(26,26,46,0.45)" }}>
                          Cryptographically Verified
                        </span>
                      </div>
                      <p className="font-mono text-sm font-bold" style={{ color: "#1a1a2e" }}>{meta.id}</p>
                      <p className="font-mono text-[9px] mt-0.5" style={{ color: "rgba(26,26,46,0.35)" }}>
                        SHA-256: {meta.hash.slice(0, 32)}…
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="mt-7">
                      <div className="h-px mx-auto mb-3" style={{
                        maxWidth: 220,
                        background: "linear-gradient(to right, transparent, #D4AF37, transparent)",
                      }} />
                      <p className="text-[9px] uppercase tracking-[0.35em] mb-0.5"
                        style={{ color: "rgba(26,26,46,0.45)" }}>
                        {t("certificate.awardedBy")}
                      </p>
                      <p className="font-bold text-base" style={{ color: "#1a1a2e" }}>
                        Xhosa Rise Global Holdings
                      </p>
                      <p className="text-[9px] mt-1" style={{ color: "rgba(26,26,46,0.4)" }}>
                        Issued: {new Date(meta.issuedAt).toLocaleDateString("en-ZA", {
                          year: "numeric", month: "long", day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Bottom beadwork strip */}
                  <BeadworkBorder flip />
                </div>

                <div className="flex justify-center">
                  <button
                    type="button"
                    className="btn-premium flex items-center justify-center gap-2"
                    onClick={handleDownload}
                  >
                    <Download className="w-4 h-4" />
                    {downloaded ? t("certificate.downloaded") : t("certificate.download")}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="devnet" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                <DevnetTab meta={meta} />
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <div className="glass-card p-8 text-center">
          <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground mb-4">
            Complete all {currentModules.length} modules to unlock your verified FINLIT certificate.
          </p>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden max-w-xs mx-auto">
            <motion.div
              className="h-full bg-gold rounded-full"
              animate={{ width: `${currentModules.length > 0 ? (completedModules.length / currentModules.length) * 100 : 0}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {completedModules.length}/{currentModules.length} completed
          </p>
        </div>
      )}
    </div>
  );
}

// ── Outer wrapper — scopes Solana providers to this lazy-loaded chunk ────────

const DEVNET_ENDPOINT = "https://api.devnet.solana.com";

export default function Certificate() {
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  );

  return (
    <ConnectionProvider endpoint={DEVNET_ENDPOINT}>
      <WalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>
          <CertificateContent />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
