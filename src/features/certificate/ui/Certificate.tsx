import { useRef, useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { QRCodeSVG } from "qrcode.react";
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
  expiresAt: number;
}

async function buildCertMeta(name: string, mindset: string, date: string): Promise<CertMeta> {
  const issuedAt  = Date.now();
  const expiresAt = issuedAt + 60 * 60 * 1000;
  const raw       = `${name}|${mindset}|${date}|${issuedAt}`;
  const hash      = await sha256(raw);
  const id        = `FINLIT-${hash.slice(0, 8).toUpperCase()}-${hash.slice(8, 16).toUpperCase()}`;
  return { id, hash, issuedAt, expiresAt };
}

function buildQrPayload(meta: CertMeta, name: string, mindset: string) {
  return JSON.stringify({
    certId:    meta.id,
    holder:    name,
    mindset,
    hash:      meta.hash,
    issuedAt:  new Date(meta.issuedAt).toISOString(),
    expiresAt: new Date(meta.expiresAt).toISOString(),
    issuer:    "Xhosa Rise Global Holdings",
  });
}

// ── Status label helpers ─────────────────────────────────────────────────────

const STATUS_LABELS: Record<string, string> = {
  idle:               "Ready",
  "requesting-airdrop": "Requesting test SOL…",
  building:           "Building transaction…",
  signing:            "Waiting for wallet signature…",
  confirming:         "Confirming on Devnet…",
  success:            "Anchored on Devnet!",
  error:              "Error",
};

// ── Devnet NFT tab ───────────────────────────────────────────────────────────

function DevnetTab({ meta, holderName, mindsetName }: { meta: CertMeta; holderName: string; mindsetName: string }) {
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
      {/* Test environment banner */}
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

      {/* Step 1 — Connect wallet */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-6 h-6 rounded-full bg-gold/20 text-gold text-xs font-bold flex items-center justify-center">1</span>
          <p className="font-semibold text-white text-sm">Connect Wallet</p>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Supports Phantom and Solflare. Make sure your wallet is set to <strong className="text-white">Devnet</strong>.
        </p>
        {/* WalletMultiButton injects its own styles via the imported CSS */}
        <WalletMultiButton />

        {publicKey && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 flex items-center gap-2"
          >
            <span className="font-mono text-[11px] text-muted-foreground truncate max-w-[220px]">
              {publicKey.toBase58()}
            </span>
            <button type="button" aria-label="Copy wallet address" onClick={copyAddress} className="text-gold hover:text-gold-light transition-colors shrink-0">
              {copied ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </motion.div>
        )}
      </div>

      {/* Step 2 — Get Devnet SOL */}
      {publicKey && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-5"
        >
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
              <button type="button" aria-label="Refresh balance" onClick={fetchBalance} className="text-muted-foreground hover:text-white transition-colors">
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
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-white/5 text-muted-foreground border border-white/10 hover:bg-white/10 hover:text-white transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Solana Faucet
            </a>
          </div>
        </motion.div>
      )}

      {/* Step 3 — Mint */}
      {publicKey && result?.certId !== meta.id && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-6 rounded-full bg-gold/20 text-gold text-xs font-bold flex items-center justify-center">3</span>
            <p className="font-semibold text-white text-sm">Anchor Certificate On-Chain</p>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Records your certificate hash (<span className="font-mono text-white">{meta.id}</span>) to the Solana Devnet
            blockchain using the Memo Program. Costs ~0.000005 SOL.
          </p>

          {/* Status indicator */}
          {status !== "idle" && (
            <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground">
              {busy && <RefreshCw className="w-3.5 h-3.5 animate-spin text-gold" />}
              {status === "error" && <AlertCircle className="w-3.5 h-3.5 text-xhosa-red" />}
              <span className={status === "error" ? "text-xhosa-red" : "text-gold"}>
                {STATUS_LABELS[status]}
              </span>
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
            {busy ? (
              <><RefreshCw className="w-4 h-4 animate-spin" /> {STATUS_LABELS[status]}</>
            ) : (
              <><Wallet className="w-4 h-4" /> Anchor to Devnet</>
            )}
          </button>
        </motion.div>
      )}

      {/* Success screen */}
      <AnimatePresence>
        {result?.certId === meta.id && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
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
                <a
                  href={result.explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-premium flex items-center gap-2 text-sm"
                >
                  <ExternalLink className="w-4 h-4" /> View on Explorer
                </a>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(result.txSignature)}
                  className="btn-outline-premium flex items-center gap-2 text-sm"
                >
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
  const [qrExpired, setQrExpired]   = useState(false);

  const holderName   = `${user?.name ?? ""} ${user?.surname ?? ""}`.trim();
  const mindsetName  = mindset?.name ?? "";

  useEffect(() => {
    if (!allDone || !user || !mindset) return;
    const dateStr = new Date().toLocaleDateString();
    buildCertMeta(holderName, mindsetName, dateStr).then(setMeta);
  }, [allDone]);

  useEffect(() => {
    if (!meta) return;
    const remaining = meta.expiresAt - Date.now();
    if (remaining <= 0) { setQrExpired(true); return; }
    const timer = setTimeout(() => setQrExpired(true), remaining);
    return () => clearTimeout(timer);
  }, [meta]);

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

  const refreshQr = async () => {
    if (!user || !mindset) return;
    const dateStr = new Date().toLocaleDateString();
    const fresh   = await buildCertMeta(holderName, mindsetName, dateStr);
    setMeta(fresh);
    setQrExpired(false);
  };

  return (
    <div className="page-container pb-24">
      <h2 className="font-serif text-3xl font-bold text-white mb-2 flex items-center gap-3">
        <Award className="w-6 h-6 text-gold" /> {t("certificate.title")}
      </h2>
      <p className="text-muted-foreground text-sm mb-6">{t("certificate.subtitle")}</p>

      {allDone && meta ? (
        <>
          {/* ── Tab bar ──────────────────────────────────────────────── */}
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
              <motion.div
                key="digital"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* ── Premium Certificate ─────────────────────────────── */}
                <div
                  ref={certRef}
                  className="cert-root bg-[#fff8e7] text-[#1a1a2e] rounded-3xl text-center border-8 border-double border-gold max-w-2xl mx-auto mb-6 overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-gold-dark via-gold to-gold-light py-4 px-8">
                    <p className="text-dark text-[10px] font-bold uppercase tracking-[0.4em]">Certificate of Achievement</p>
                  </div>

                  <div className="p-8 md:p-10">
                    <div className="w-20 h-20 bg-gradient-to-br from-gold-light to-gold rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg">
                      <Award className="w-10 h-10 text-dark" />
                    </div>

                    <h1 className="cert-text-dark text-4xl font-black mb-1">{t("certificate.certTitle")}</h1>
                    <h2 className="cert-text-dark text-lg font-semibold mb-5">{t("certificate.certSubtitle")}</h2>

                    <p className="text-sm mb-1 text-[#1a1a2e]/70">{t("certificate.certifies")}</p>
                    <h3 className="cert-text-dark text-3xl font-bold mb-1">{holderName}</h3>
                    <p className="text-[#1a1a2e]/60 text-xs mb-5">{user?.location}</p>

                    <p className="text-sm mb-1 text-[#1a1a2e]/70">for successfully completing</p>
                    <p className="cert-text-dark font-bold text-xl mb-1">{mindsetName}</p>
                    <p className="text-sm text-[#1a1a2e]/70 mb-4">
                      {badges.length} badge{badges.length !== 1 ? "s" : ""} earned · {xp.toLocaleString()} XP · {completedModules.length} modules
                    </p>

                    <div className="beadwork-bar w-48 mx-auto my-4" />

                    <div className="bg-[#1a1a2e]/5 rounded-xl p-3 mb-5 inline-block">
                      <div className="flex items-center gap-2 justify-center mb-1">
                        <Shield className="w-3 h-3 text-[#1a1a2e]/50" />
                        <span className="text-[10px] text-[#1a1a2e]/50 uppercase tracking-wider">Verified Certificate ID</span>
                      </div>
                      <p className="font-mono text-sm font-bold cert-text-dark">{meta.id}</p>
                      <p className="font-mono text-[9px] text-[#1a1a2e]/40 mt-0.5">SHA-256: {meta.hash.slice(0, 32)}…</p>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      {qrExpired ? (
                        <div className="w-28 h-28 border-2 border-dashed border-[#1a1a2e]/20 rounded-lg flex flex-col items-center justify-center">
                          <p className="text-[10px] text-[#1a1a2e]/40 text-center">QR expired</p>
                        </div>
                      ) : (
                        <QRCodeSVG
                          value={buildQrPayload(meta, holderName, mindsetName)}
                          size={112}
                          bgColor="#fff8e7"
                          fgColor="#1a1a2e"
                          level="M"
                          includeMargin
                        />
                      )}
                      <p className="text-[9px] text-[#1a1a2e]/40 text-center">
                        Scan to verify · expires {new Date(meta.expiresAt).toLocaleTimeString()}
                      </p>
                    </div>

                    <div className="mt-5">
                      <p className="text-[10px] uppercase tracking-widest text-[#1a1a2e]/50 mb-0.5">{t("certificate.awardedBy")}</p>
                      <p className="cert-text-dark font-bold text-base">Xhosa Rise Global Holdings</p>
                      <p className="text-[10px] text-[#1a1a2e]/40">
                        Issued: {new Date(meta.issuedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    type="button"
                    className="btn-premium flex items-center justify-center gap-2"
                    onClick={handleDownload}
                  >
                    <Download className="w-4 h-4" />
                    {downloaded ? t("certificate.downloaded") : t("certificate.download")}
                  </button>
                  {qrExpired && (
                    <button
                      type="button"
                      className="btn-outline-premium flex items-center justify-center gap-2"
                      onClick={refreshQr}
                    >
                      Refresh QR Code
                    </button>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="devnet"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <DevnetTab meta={meta} holderName={holderName} mindsetName={mindsetName} />
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
