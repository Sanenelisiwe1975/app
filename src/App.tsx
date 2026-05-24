import { Suspense, lazy, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useUiStore, type Page } from "@/shared/stores/uiStore";
import { useUserStore } from "@/shared/stores/userStore";
import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";
import { OfflineBanner } from "@/shared/ui/OfflineBanner";
import { InstallPWA } from "@/shared/ui/InstallPWA";
import { useNetworkStatus } from "@/shared/hooks/useNetworkStatus";
import Sidebar from "@/widgets/sidebar/Sidebar";
import MobileNav from "@/widgets/mobile-nav/MobileNav";
import SplashScreen from "@/widgets/splash/SplashScreen";
import WelcomeVideo from "@/widgets/welcome-video/WelcomeVideo";
import "./App.css";

// ─── Code-split pages — each chunk loads only when navigated to ───────────────
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

// ─── Page → component + boundary label map ────────────────────────────────────
const PAGE_CONFIG: Partial<Record<Page, { Component: React.LazyExoticComponent<() => React.JSX.Element>; label: string }>> = {
  register:    { Component: Register,       label: "Register"       },
  mindset:     { Component: MindsetSelect,  label: "Mindset Select" },
  dashboard:   { Component: Dashboard,      label: "Dashboard"      },
  learn:       { Component: Learn,          label: "Learn"          },
  market:      { Component: Market,         label: "Market"         },
  portfolio:   { Component: Portfolio,      label: "Portfolio"      },
  stokvel:     { Component: Stokvel,        label: "Stokvel"        },
  timemachine: { Component: TimeMachine,    label: "Time Machine"   },
  antiscam:    { Component: AntiScam,       label: "B2B Shield"     },
  wealthybody: { Component: WealthyBody,    label: "Wealthy Body"   },
  emotion:     { Component: EmotionTracker, label: "Emotion Tracker"},
  prophet:     { Component: MarketProphet,  label: "Market Prophet" },
  certificate: { Component: Certificate,    label: "Certificate"    },
  switch:      { Component: SwitchMindset,  label: "Switch Mindset" },
};

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22 } },
  exit:    { opacity: 0, y: -12, transition: { duration: 0.18 } },
};

function PageSkeleton() {
  return (
    <div className="flex items-center justify-center h-full min-h-screen">
      <div className="w-8 h-8 rounded-full border-2 border-yellow-400 border-t-transparent animate-spin" />
    </div>
  );
}

// ─── App — thin shell; all business logic lives in stores + feature components ─
export default function App() {
  const page            = useUiStore((s) => s.page);
  const navigate        = useUiStore((s) => s.navigate);
  const user            = useUserStore((s) => s.user);
  const hasSeenWelcome  = useUserStore((s) => s.hasSeenWelcome);
  const markWelcomeSeen = useUserStore((s) => s.markWelcomeSeen);
  const { isOffline }   = useNetworkStatus();

  // Resume AudioContext on first user interaction (browser autoplay policy)
  useEffect(() => {
    const resume = () => {
      const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (Ctx) { const c = new Ctx(); if (c.state === "suspended") c.resume(); }
    };
    document.addEventListener("click", resume, { once: true });
    return () => document.removeEventListener("click", resume);
  }, []);

  const handleSplashComplete = useCallback(() => {
    navigate(user ? "dashboard" : "register");
  }, [user, navigate]);

  if (page === "splash") return <SplashScreen onComplete={handleSplashComplete} />;

  // Show welcome video once — right after the splash, before the register screen
  if (!hasSeenWelcome && page === "register") {
    return <WelcomeVideo onComplete={markWelcomeSeen} />;
  }

  const config = PAGE_CONFIG[page];

  // Skip-to-content anchor — hidden until focused, lets keyboard users bypass nav

  return (
    <div className="flex h-screen w-screen bg-dark overflow-hidden">
      <OfflineBanner />
      <InstallPWA />
      {/* Skip-to-content: invisible until focused via keyboard Tab */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[200] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-gold focus:text-dark focus:font-semibold"
      >
        Skip to content
      </a>
      {user && <Sidebar />}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div id="main-content" className={`flex-1 scroll-container overflow-y-auto${isOffline ? " pt-9" : ""}`}>
          {/* Each page gets its own ErrorBoundary — a crash in Market doesn't kill Dashboard */}
          <ErrorBoundary key={page} feature={config?.label}>
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
                  {config && <config.Component />}
                </motion.div>
              </AnimatePresence>
            </Suspense>
          </ErrorBoundary>
        </div>
        {user && <MobileNav />}
      </main>
    </div>
  );
}
