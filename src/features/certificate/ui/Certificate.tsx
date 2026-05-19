import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Award, Download, CheckCircle } from "lucide-react";
import type { GameState } from "@/hooks/useGameState";

export default function Certificate({ state }: { state: GameState }) {
  const certRef = useRef<HTMLDivElement>(null);
  const [downloaded, setDownloaded] = useState(false);

  const allDone =
    state.currentModules.length > 0 &&
    state.currentModules.every((m) => state.completedModules.includes(m.id));

  const handleDownload = async () => {
    if (!certRef.current) return;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(certRef.current, { scale: 2, backgroundColor: "#fff8e7" });
      const link = document.createElement("a");
      link.download = `FINLIT_Certificate_${state.user?.name || "User"}.png`;
      link.href = canvas.toDataURL();
      link.click();
      setDownloaded(true);
    } catch (e) {
      console.error("Download failed", e);
    }
  };

  return (
    <div className="page-container pb-24">
      <h2 className="font-serif text-3xl font-bold text-white mb-2 flex items-center gap-3">
        <Award className="w-6 h-6 text-gold" /> Certificate of Completion
      </h2>
      <p className="text-muted-foreground text-sm mb-6">
        Complete all modules to unlock your premium FINLIT certificate.
      </p>

      {allDone ? (
        <>
          <div
            ref={certRef}
            className="bg-[#fff8e7] text-[#1a1a2e] p-8 md:p-12 rounded-3xl text-center border-8 border-double border-gold max-w-2xl mx-auto mb-6"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            <div className="w-20 h-20 bg-gradient-to-br from-gold-light to-gold rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Award className="w-10 h-10 text-dark" />
            </div>
            <h1 className="text-4xl font-black mb-2" style={{ color: "#1a1a2e" }}>FINLIT</h1>
            <h2 className="text-xl font-semibold mb-4" style={{ color: "#1a1a2e" }}>
              Certificate of Financial Literacy
            </h2>
            <p className="text-sm mb-2">This certifies that</p>
            <h3 className="text-2xl font-bold mb-4" style={{ color: "#1a1a2e" }}>
              {state.user?.name} {state.user?.surname}
            </h3>
            <p className="text-sm mb-4">
              has successfully completed the <strong>{state.selectedMindsetObj?.name}</strong> curriculum
              <br />
              and earned {state.badges.length} badges
            </p>
            <div className="beadwork-bar w-48 mx-auto my-6" />
            <p className="text-xs uppercase tracking-widest mb-1">Awarded by</p>
            <p className="font-bold text-lg mb-2" style={{ color: "#1a1a2e" }}>Xhosa Rise Global Holdings</p>
            <p className="text-xs">Date: {new Date().toLocaleDateString()}</p>
          </div>

          <button
            className="btn-premium mx-auto flex items-center justify-center gap-2"
            onClick={handleDownload}
          >
            <Download className="w-4 h-4" />
            {downloaded ? "Downloaded!" : "Download as PNG"}
          </button>
        </>
      ) : (
        <div className="glass-card p-8 text-center">
          <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">
            Complete all {state.currentModules.length} modules to unlock your premium certificate.
          </p>
          <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden max-w-xs mx-auto">
            <motion.div
              className="h-full bg-gold rounded-full"
              animate={{
                width: `${state.currentModules.length > 0 ? (state.completedModules.length / state.currentModules.length) * 100 : 0}%`,
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {state.completedModules.length}/{state.currentModules.length} completed
          </p>
        </div>
      )}
    </div>
  );
}
