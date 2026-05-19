import { Suspense, lazy, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Stores
import { useUiStore, type Page } from "@/shared/stores/uiStore";
import { useUserStore } from "@/shared/stores/userStore";
import { useGameStore } from "@/shared/stores/gameStore";
import { useMarketStore } from "@/shared/stores/marketStore";

import { useAudio } from "@/shared/hooks/useAudio";

// Widgets
import Sidebar from "@/widgets/sidebar/Sidebar";
import MobileNav from "@/widgets/mobile-nav/MobileNav";
import SplashScreen from "@/widgets/splash/SplashScreen";

import "./App.css";

// ─── Code-split page imports ──────────────────────────────────────────────────
// Each page is its own JS chunk — only loads when the user navigates to it.
const Register       = lazy(() => import("@/features/auth/ui/Register"));
const MindsetSelect  = lazy(() => import("@/features/auth/ui/MindsetSelect"));
const Dashboard      = lazy(() => import("@/features/dashboard/ui/Dashboard"));
const Learn          = lazy(() => import("@/features/learn/ui/Learn"));
const Market         = lazy(() => import("@/features/market/ui/Market"));
const Portfolio      = lazy(() => import("@/features/portfolio/ui/Portfolio"));
const Stokvel        = lazy(() => import("@/features/stokvel/ui/Stokvel"));
const TimeMachine    = lazy(() => import("@/features/time-machine/ui/TimeMachine"));
const AntiScam       = lazy(() => import("@/features/anti-scam/ui/AntiScam"));
const WealthyBody    = lazy(() => import("@/features/wealthy-body/ui/WealthyBody"));
const EmotionTracker = lazy(() => import("@/features/emotion-tracker/ui/EmotionTracker"));
const MarketProphet  = lazy(() => import("@/features/market-prophet/ui/MarketProphet"));
const Certificate    = lazy(() => import("@/features/certificate/ui/Certificate"));
const SwitchMindset  = lazy(() => import("@/features/auth/ui/SwitchMindset"));

// ─── Animation config ─────────────────────────────────────────────────────────

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22 } },
  exit:    { opacity: 0, y: -12, transition: { duration: 0.18 } },
};

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function PageSkeleton() {
  return (
    <div className="flex items-center justify-center h-full min-h-screen">
      <div className="w-8 h-8 rounded-full border-2 border-yellow-400 border-t-transparent animate-spin" />
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  // ── Store slices ────────────────────────────────────────────────────────────
  const page     = useUiStore((s) => s.page);
  const navigate = useUiStore((s) => s.navigate);

  const user         = useUserStore((s) => s.user);
  const audienceKey  = useUserStore((s) => s.audienceKey);
  const mindset      = useUserStore((s) => s.mindset);
  const setUser      = useUserStore((s) => s.setUser);
  const setAudience  = useUserStore((s) => s.setAudience);
  const setMindset   = useUserStore((s) => s.setMindset);
  const clearUser    = useUserStore((s) => s.clear);

  const cash              = useGameStore((s) => s.cash);
  const shares            = useGameStore((s) => s.shares);
  const xp                = useGameStore((s) => s.xp);
  const badges            = useGameStore((s) => s.badges);
  const completedModules  = useGameStore((s) => s.completedModules);
  const level             = useGameStore((s) => s.level);
  const health            = useGameStore((s) => s.health);
  const community         = useGameStore((s) => s.community);
  const phishingTotal     = useGameStore((s) => s.phishingTotal);
  const phishingCaught    = useGameStore((s) => s.phishingCaught);
  const customScams       = useGameStore((s) => s.customScams);
  const prophetBalance    = useGameStore((s) => s.prophetBalance);
  const predictions       = useGameStore((s) => s.predictions);
  const totalTrades       = useGameStore((s) => s.totalTrades);
  const profitableTrades  = useGameStore((s) => s.profitableTrades);
  const impulseSpendsBlocked = useGameStore((s) => s.impulseSpendsBlocked);
  const initMindset       = useGameStore((s) => s.initMindset);
  const gameReset         = useGameStore((s) => s.reset);
  const completeModule    = useGameStore((s) => s.completeModule);
  const buyShares         = useGameStore((s) => s.buyShares);
  const sellShares        = useGameStore((s) => s.sellShares);
  const contributeStokvel = useGameStore((s) => s.contributeStokvel);
  const voteStokvel       = useGameStore((s) => s.voteStokvel);
  const recordPhishing    = useGameStore((s) => s.recordPhishing);
  const addCustomScam     = useGameStore((s) => s.addCustomScam);
  const syncHealth        = useGameStore((s) => s.syncHealth);
  const placeBet          = useGameStore((s) => s.placeBet);
  const settlePredictions = useGameStore((s) => s.settlePredictions);
  const blockImpulse      = useGameStore((s) => s.blockImpulse);
  const simulateImpulse   = useGameStore((s) => s.simulateImpulse);

  const marketAssets    = useMarketStore((s) => s.assets);
  const activeSymbol    = useMarketStore((s) => s.activeSymbol);
  const setActiveSymbol = useMarketStore((s) => s.setActiveSymbol);
  const resetAssets     = useMarketStore((s) => s.resetAssets);

  const { playDrum, playSuccess, playHymn } = useAudio();

  // ── Derived values ───────────────────────────────────────────────────────────

  const netWorth = cash + Object.entries(shares).reduce((sum, [sym, qty]) => {
    const asset = marketAssets.find((a) => a.symbol === sym);
    return sum + (asset ? qty * asset.price : 0);
  }, 0);

  const healthMult =
    1 +
    (Math.min(10_000, health.steps) / 10_000) * 0.2 +
    (Math.min(8, health.sleep) / 8) * 0.1;

  // ── Resume AudioContext on first user interaction ─────────────────────────

  useEffect(() => {
    const resumeAudio = () => {
      const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (Ctx) {
        const ctx = new Ctx();
        if (ctx.state === "suspended") ctx.resume();
      }
    };
    document.addEventListener("click", resumeAudio, { once: true });
    return () => document.removeEventListener("click", resumeAudio);
  }, []);

  // ── Build a state-compatible object for legacy components ─────────────────
  // Existing page components still expect a `state` prop shaped like the old
  // useGameState. We compose it here from the new stores so we don't have to
  // rewrite every component at once. Each component will be migrated
  // individually in later phases.
  const state = {
    user,
    selectedAudience: audienceKey,
    selectedMindsetObj: mindset,
    cash,
    shares,
    xp,
    badges,
    completedModules,
    currentLevel: level,
    healthSteps: health.steps,
    healthSleep: health.sleep,
    heartRate: health.heartRate,
    community,
    phishingTotal,
    phishingCaught,
    customScams,
    prophetBalance,
    predictions,
    marketAssetsState: marketAssets,
    currentAssetSymbol: activeSymbol,
    currentModules: mindset?.modules ?? [],
    totalTrades,
    profitableTrades,
    impulseSpendsBlocked,
  };

  // ── Event handlers ────────────────────────────────────────────────────────

  const handleSplashComplete = useCallback(() => {
    navigate(user ? "dashboard" : "register");
    if (user) playHymn();
  }, [user, navigate, playHymn]);

  const handleRegister = useCallback(
    (data: { name: string; surname: string; age: string; location: string; audience: string }) => {
      setUser({
        name: data.name,
        surname: data.surname,
        age: data.age,
        location: data.location,
        audience: data.audience as any,
        mindset: "",
      });
      setAudience(data.audience as any);
      navigate("mindset");
      playDrum();
    },
    [setUser, setAudience, navigate, playDrum]
  );

  const handleSelectMindset = useCallback(
    (selectedMindset: any) => {
      setMindset(selectedMindset);
      setUser({ ...user!, mindset: selectedMindset.id });
      initMindset(selectedMindset.startCash);
      resetAssets();
      navigate("dashboard");
      playHymn();
    },
    [setMindset, setUser, user, initMindset, resetAssets, navigate, playHymn]
  );

  const handleHardReset = useCallback(() => {
    clearUser();
    gameReset();
    resetAssets();
    navigate("register");
  }, [clearUser, gameReset, resetAssets, navigate]);

  // ── Page renderer ─────────────────────────────────────────────────────────

  function renderPage() {
    switch (page) {
      case "splash":
        return (
          <SplashScreen onComplete={handleSplashComplete} />
        );

      case "register":
        return (
          <Register
            onRegister={handleRegister}
            onNavigate={() => { if (user) navigate("dashboard"); }}
          />
        );

      case "mindset":
        return audienceKey ? (
          <MindsetSelect
            audienceKey={audienceKey}
            onSelect={handleSelectMindset}
            onBack={() => navigate("register")}
          />
        ) : null;

      case "dashboard":
        return <Dashboard />;

      case "learn":
        return (
          <Learn
            state={state}
            onCompleteModule={completeModule}
            onPlaySuccess={playSuccess}
          />
        );

      case "market":
        return (
          <Market
            state={state}
            netWorth={netWorth}
            onBuy={(symbol, amount, price) => buyShares(symbol, amount, price)}
            onSell={(symbol, amount, price) => sellShares(symbol, amount, price)}
            onSetLevel={(_level) => {}}
            onSetAsset={setActiveSymbol}
            onPlayDrum={playDrum}
          />
        );

      case "portfolio":
        return <Portfolio state={state} netWorth={netWorth} />;

      case "stokvel":
        return (
          <Stokvel
            state={state}
            onContribute={contributeStokvel}
            onVote={voteStokvel}
            onPlayDrum={playDrum}
          />
        );

      case "timemachine":
        return <TimeMachine netWorth={netWorth} onPlaySuccess={playSuccess} />;

      case "antiscam":
        return (
          <AntiScam
            state={state}
            onRecord={recordPhishing}
            onAddCustom={addCustomScam}
          />
        );

      case "wealthybody":
        return (
          <WealthyBody
            state={state}
            healthMult={healthMult}
            onSync={syncHealth}
          />
        );

      case "emotion":
        return (
          <EmotionTracker
            state={state}
            onSimulateImpulse={simulateImpulse}
            onBlockImpulse={blockImpulse}
          />
        );

      case "prophet":
        return (
          <MarketProphet
            state={state}
            onPlaceBet={placeBet}
            onSettle={settlePredictions}
          />
        );

      case "certificate":
        return <Certificate state={state} />;

      case "switch":
        return (
          <SwitchMindset
            onNewMindset={() => {
              clearUser();
              navigate("register");
            }}
            onHardReset={handleHardReset}
            onBack={() => navigate("dashboard")}
          />
        );

      default:
        return null;
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (page === "splash") {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <div className="flex h-screen w-screen bg-dark overflow-hidden">
      {user && (
        <Sidebar
          activePage={page}
          onNavigate={(p: string) => navigate(p as Page)}
          mindsetName={mindset?.name}
          userName={user?.name}
        />
      )}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="flex-1 scroll-container overflow-y-auto">
          <Suspense fallback={<PageSkeleton />}>
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="min-h-full"
              >
                {renderPage()}
              </motion.div>
            </AnimatePresence>
          </Suspense>
        </div>
        {user && (
          <MobileNav
            activePage={page}
            onNavigate={(p: string) => navigate(p as Page)}
          />
        )}
      </main>
    </div>
  );
}
