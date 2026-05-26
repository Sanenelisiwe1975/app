import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  TrendingUp, TrendingDown, Minus,
  ShoppingCart, DollarSign, BarChart3, Lock, Unlock,
} from "lucide-react";
import { Chart, registerables } from "chart.js";
import { useGameStore } from "@/shared/stores/gameStore";
import { useMarketStore } from "@/shared/stores/marketStore";
import { useNetWorth } from "@/shared/hooks/useNetWorth";
import { useAudio } from "@/shared/hooks/useAudio";
import { useCurrencyFormatter } from "@/shared/hooks/useCurrencyFormatter";
import { useUserStore } from "@/shared/stores/userStore";
import { CURRENCY_SYMBOLS } from "@/shared/lib/formatters";
import { EasyEquitiesPrompt } from "@/shared/ui/EasyEquitiesPrompt";

Chart.register(...registerables);

const LEVELS = [
  { id: "beginner",     name: "Seedling", icon: "🌱", unlockNetWorth: 0,       volatilityLabel: "Low" },
  { id: "intermediate", name: "Growth",   icon: "⚡", unlockNetWorth: 10_000,  volatilityLabel: "Medium" },
  { id: "advanced",     name: "Harvest",  icon: "🔥", unlockNetWorth: 100_000, volatilityLabel: "High" },
] as const;

export default function Market() {
  const { t }          = useTranslation();
  const formatCurrency = useCurrencyFormatter();
  const currency       = useUserStore((s) => s.currency);
  const cash      = useGameStore((s) => s.cash);
  const shares    = useGameStore((s) => s.shares);
  const level     = useGameStore((s) => s.level);
  const buyShares  = useGameStore((s) => s.buyShares);
  const sellShares = useGameStore((s) => s.sellShares);

  const assets          = useMarketStore((s) => s.assets);
  const activeSymbol    = useMarketStore((s) => s.activeSymbol);
  const setActiveSymbol = useMarketStore((s) => s.setActiveSymbol);

  const netWorth    = useNetWorth();
  const { playDrum } = useAudio();

  const [localSymbol, setLocalSymbol] = useState(activeSymbol);
  const [tradeCount, setTradeCount]   = useState(0);
  const [showEEPrompt, setShowEEPrompt] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef  = useRef<Chart | null>(null);

  const asset      = assets.find((a) => a.symbol === localSymbol) ?? assets[0];
  const sharesOwned = shares[localSymbol] ?? 0;

  const shortMA = asset
    ? asset.history.slice(-5).reduce((a, b) => a + b, 0) / Math.min(5, asset.history.length || 1)
    : 0;
  const longMA = asset
    ? asset.history.slice(-10).reduce((a, b) => a + b, 0) / Math.min(10, asset.history.length || 1)
    : 0;

  let signal: "buy" | "sell" | "hold" = "hold";
  if (shortMA > longMA * 1.01) signal = "buy";
  else if (shortMA < longMA * 0.99) signal = "sell";

  // Rebuild chart whenever history length changes or active asset changes
  useEffect(() => {
    if (!canvasRef.current || !asset) return;
    if (chartRef.current) chartRef.current.destroy();

    const ctx      = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, "rgba(212, 175, 55, 0.3)");
    gradient.addColorStop(1, "rgba(212, 175, 55, 0.0)");

    const makeMA = (window: number) =>
      asset.history.map((_, i) => {
        const slice = asset.history.slice(Math.max(0, i - (window - 1)), i + 1);
        return slice.reduce((a, b) => a + b, 0) / slice.length;
      });

    chartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: asset.history.map((_, i) => i.toString()),
        datasets: [
          {
            label: asset.name,
            data: asset.history,
            borderColor: "#D4AF37",
            backgroundColor: gradient,
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 4,
            fill: true,
            tension: 0.4,
          },
          {
            label: "Short MA",
            data: makeMA(5),
            borderColor: "#1ABC9C",
            borderWidth: 1.5,
            pointRadius: 0,
            fill: false,
            tension: 0.4,
          },
          {
            label: "Long MA",
            data: makeMA(10),
            borderColor: "#E74C3C",
            borderWidth: 1.5,
            pointRadius: 0,
            fill: false,
            tension: 0.4,
            borderDash: [5, 5],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 0 },
        interaction: { intersect: false, mode: "index" },
        plugins: {
          legend: { labels: { color: "rgba(255,255,255,0.6)", font: { size: 11 } } },
          tooltip: {
            backgroundColor: "rgba(18,18,26,0.95)",
            titleColor: "#D4AF37",
            bodyColor: "#fff",
            borderColor: "rgba(212,175,55,0.2)",
            borderWidth: 1,
          },
        },
        scales: {
          x: { display: false, grid: { display: false } },
          y: {
            grid: { color: "rgba(255,255,255,0.05)" },
            ticks: {
              color: "rgba(255,255,255,0.4)",
              font: { size: 10 },
              callback: (value) => {
                const n = Number(value);
                const sym = CURRENCY_SYMBOLS[currency] ?? "R";
                return n >= 1000 ? `${sym}${(n / 1000).toFixed(1)}K` : `${sym}${n.toFixed(0)}`;
              },
            },
          },
        },
      },
    });

    return () => { chartRef.current?.destroy(); chartRef.current = null; };
  }, [asset?.history.length, localSymbol, currency]);

  const selectAsset = (symbol: string) => {
    setLocalSymbol(symbol);
    setActiveSymbol(symbol);
  };

  const handleBuy = () => {
    if (!asset || cash < asset.price) return;
    buyShares(localSymbol, 1, asset.price);
    playDrum();
    const next = tradeCount + 1;
    setTradeCount(next);
    if (next % 3 === 0) setShowEEPrompt(true);
  };

  const handleSell = () => {
    if (!asset || sharesOwned <= 0) return;
    sellShares(localSymbol, 1, asset.price);
    playDrum();
    const next = tradeCount + 1;
    setTradeCount(next);
    if (next % 3 === 0) setShowEEPrompt(true);
  };

  return (
    <div className="page-container pb-24">
      <h2 className="font-serif text-3xl font-bold text-white mb-2 flex items-center gap-3">
        <BarChart3 className="w-6 h-6 text-gold" /> {t("market.title")}
      </h2>
      <p className="text-muted-foreground text-sm mb-6">{t("market.subtitle")}</p>

      {/* ── Level Selector ────────────────────────────────────────────────── */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
        {LEVELS.map((lvl) => {
          const isUnlocked = netWorth >= lvl.unlockNetWorth;
          const isActive   = level === lvl.id;
          return (
            <motion.button
              key={lvl.id}
              type="button"
              disabled={!isUnlocked}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                isActive   ? "bg-gold/15 text-gold border border-gold/30"
                : isUnlocked ? "bg-white/5 text-white border border-white/10 hover:bg-white/10"
                : "bg-white/5 text-muted-foreground border border-white/5 cursor-not-allowed opacity-50"
              }`}
              whileHover={isUnlocked ? { y: -2 } : {}}
            >
              <span>{lvl.icon}</span>
              <span>{lvl.name}</span>
              {isUnlocked ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
            </motion.button>
          );
        })}
      </div>

      {/* ── Asset Selector ────────────────────────────────────────────────── */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {assets.map((a) => (
          <button
            key={a.symbol}
            type="button"
            onClick={() => selectAsset(a.symbol)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              localSymbol === a.symbol
                ? "bg-gold/20 text-gold border border-gold/30"
                : "bg-white/5 text-muted-foreground border border-white/10 hover:bg-white/10"
            }`}
          >
            {a.symbol}
          </button>
        ))}
      </div>

      {/* ── Chart ─────────────────────────────────────────────────────────── */}
      <div className="glass-card p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold text-white">{asset?.name}</h3>
            <p className="text-xs text-muted-foreground">{asset?.symbol}</p>
          </div>
          <div className="text-right">
            {/* aria-live: screen readers announce price changes automatically */}
            <p
              className="text-xl font-bold text-white"
              aria-live="polite"
              aria-atomic="true"
              aria-label={`${asset?.name} price: ${formatCurrency(asset?.price ?? 0)}`}
            >
              {formatCurrency(asset?.price ?? 0)}
            </p>
            <p className="text-[10px] text-muted-foreground">{t("market.liveSimulation")}</p>
          </div>
        </div>
        <div className="h-64 w-full">
          <canvas ref={canvasRef} className="w-full h-full" aria-label={`Price chart for ${asset?.name}`} />
        </div>
      </div>

      {/* ── Signal & Position ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="glass-card p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{t("market.signal")}</p>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm ${
            signal === "buy"  ? "bg-xhosa-teal/20 text-xhosa-teal border border-xhosa-teal/30"
            : signal === "sell" ? "bg-xhosa-red/20 text-xhosa-red border border-xhosa-red/30"
            : "bg-xhosa-yellow/20 text-xhosa-yellow border border-xhosa-yellow/30"
          }`}>
            {signal === "buy" ? <TrendingUp className="w-4 h-4" />
              : signal === "sell" ? <TrendingDown className="w-4 h-4" />
              : <Minus className="w-4 h-4" />}
            {signal === "buy" ? t("market.buySignal") : signal === "sell" ? t("market.sellSignal") : t("market.hold")}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Short MA: {formatCurrency(shortMA)} | Long MA: {formatCurrency(longMA)}
          </p>
        </div>

        <div className="glass-card p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{t("market.position")}</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-muted-foreground">{t("market.shares")}</p>
              <p className="text-lg font-bold text-white">{sharesOwned}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t("market.value")}</p>
              <p className="text-lg font-bold text-white">{formatCurrency(sharesOwned * (asset?.price ?? 0))}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t("dashboard.cash")}</p>
              <p className="text-lg font-bold text-white">{formatCurrency(cash)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t("market.canBuy")}</p>
              <p className={`text-lg font-bold ${asset && cash >= asset.price ? "text-xhosa-teal" : "text-xhosa-red"}`}>
                {asset && cash >= asset.price ? "Yes" : "No"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Actions ───────────────────────────────────────────────────────── */}
      <div className="flex gap-3">
        <button
          type="button"
          className="btn-premium flex-1 flex items-center justify-center gap-2"
          onClick={handleBuy}
          disabled={!asset || cash < (asset?.price ?? Infinity)}
        >
          <ShoppingCart className="w-4 h-4" /> {t("market.buyOne")}
        </button>
        <button
          type="button"
          className="btn-outline-premium flex-1 flex items-center justify-center gap-2"
          onClick={handleSell}
          disabled={sharesOwned <= 0}
        >
          <DollarSign className="w-4 h-4" /> {t("market.sellOne")}
        </button>
      </div>

      <div className="mt-4 glass-card p-4 border-l-4 border-l-gold">
        <p className="text-sm text-white/70">{t("market.tip")}</p>
      </div>

      {showEEPrompt && (
        <EasyEquitiesPrompt
          trigger="trade"
          netWorth={netWorth}
          inline
          onDismiss={() => setShowEEPrompt(false)}
        />
      )}
    </div>
  );
}
