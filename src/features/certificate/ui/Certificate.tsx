import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { QRCodeSVG } from "qrcode.react";
import { Award, Download, CheckCircle, Shield } from "lucide-react";
import { useGameStore } from "@/shared/stores/gameStore";
import { useUserStore } from "@/shared/stores/userStore";

// ── Certificate utilities ───────────────────────────────────────────────────

/** SHA-256 via Web Crypto API — no library needed */
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
  expiresAt: number; // QR expires 1 hour after issue
}

async function buildCertMeta(name: string, mindset: string, date: string): Promise<CertMeta> {
  const issuedAt  = Date.now();
  const expiresAt = issuedAt + 60 * 60 * 1000; // +1 hour
  const raw       = `${name}|${mindset}|${date}|${issuedAt}`;
  const hash      = await sha256(raw);
  const id        = `FINLIT-${hash.slice(0, 8).toUpperCase()}-${hash.slice(8, 16).toUpperCase()}`;
  return { id, hash, issuedAt, expiresAt };
}

/** QR code payload — a verifiable JSON string encoded in the QR */
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

// ── Component ───────────────────────────────────────────────────────────────

export default function Certificate() {
  const { t }            = useTranslation();
  const user             = useUserStore((s) => s.user);
  const mindset          = useUserStore((s) => s.mindset);
  const completedModules = useGameStore((s) => s.completedModules);
  const badges           = useGameStore((s) => s.badges);
  const xp               = useGameStore((s) => s.xp);

  const currentModules = mindset?.modules ?? [];
  const allDone        = currentModules.length > 0 && currentModules.every((m) => completedModules.includes(m.id));

  const certRef                     = useRef<HTMLDivElement>(null);
  const [downloaded, setDownloaded] = useState(false);
  const [meta, setMeta]             = useState<CertMeta | null>(null);
  const [qrExpired, setQrExpired]   = useState(false);

  // Generate cert metadata once when the page loads and all modules are done
  useEffect(() => {
    if (!allDone || !user || !mindset) return;
    const dateStr = new Date().toLocaleDateString();
    buildCertMeta(`${user.name} ${user.surname}`, mindset.name, dateStr).then(setMeta);
  }, [allDone]);

  // Expire the QR after 1 hour
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
    const fresh   = await buildCertMeta(`${user.name} ${user.surname}`, mindset.name, dateStr);
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
          {/* ── Premium Certificate ──────────────────────────────────── */}
          <div
            ref={certRef}
            className="cert-root bg-[#fff8e7] text-[#1a1a2e] rounded-3xl text-center border-8 border-double border-gold max-w-2xl mx-auto mb-6 overflow-hidden"
          >
            {/* Gold header band */}
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
              <h3 className="cert-text-dark text-3xl font-bold mb-1">{user?.name} {user?.surname}</h3>
              <p className="text-[#1a1a2e]/60 text-xs mb-5">{user?.location}</p>

              <p className="text-sm mb-1 text-[#1a1a2e]/70">for successfully completing</p>
              <p className="cert-text-dark font-bold text-xl mb-1">{mindset?.name}</p>
              <p className="text-sm text-[#1a1a2e]/70 mb-4">
                {badges.length} badge{badges.length !== 1 ? "s" : ""} earned · {xp.toLocaleString()} XP · {completedModules.length} modules
              </p>

              <div className="beadwork-bar w-48 mx-auto my-4" />

              {/* Blockchain-style unique ID */}
              <div className="bg-[#1a1a2e]/5 rounded-xl p-3 mb-5 inline-block">
                <div className="flex items-center gap-2 justify-center mb-1">
                  <Shield className="w-3 h-3 text-[#1a1a2e]/50" />
                  <span className="text-[10px] text-[#1a1a2e]/50 uppercase tracking-wider">Verified Certificate ID</span>
                </div>
                <p className="font-mono text-sm font-bold cert-text-dark">{meta.id}</p>
                <p className="font-mono text-[9px] text-[#1a1a2e]/40 mt-0.5">SHA-256: {meta.hash.slice(0, 32)}…</p>
              </div>

              {/* QR code section */}
              <div className="flex flex-col items-center gap-2">
                {qrExpired ? (
                  <div className="w-28 h-28 border-2 border-dashed border-[#1a1a2e]/20 rounded-lg flex flex-col items-center justify-center">
                    <p className="text-[10px] text-[#1a1a2e]/40 text-center">QR expired</p>
                  </div>
                ) : (
                  <QRCodeSVG
                    value={buildQrPayload(meta, `${user?.name} ${user?.surname}`, mindset?.name ?? "")}
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

          {/* Action buttons */}
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
