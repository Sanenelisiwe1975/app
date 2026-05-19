import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ShoppingCart,
  DollarSign,
  BarChart3,
  Lock,
  Unlock,
} from "lucide-react";
import { Chart, registerables } from "chart.js";
import type { GameState } from "@/hooks/useGameState";

Chart.register(...registerables);

const levels = [
  { id: "beginner", name: "Seedling", icon: "🌱", unlockNetWorth: 0, volatilityLabel: "Low", startCash: 5000 },
  { id: "intermediate", name: "Growth", icon: "⚡", unlockNetWorth: 10000, volatilityLabel: "Medium", startCash: 50000 },
  { id: "advanced", name: "Harvest", icon: "🔥", unlockNetWorth: 100000, volatilityLabel: "High", startCash: 200000 },
];

export default function Market({
  state,
  netWorth,
  onBuy,
  onSell,
  onSetLevel,
  onSetAsset,
  onPlayDrum,
}: {
  state: GameState;
  netWorth: number;
  onBuy: (symbol: string, amount: number, price: number) => void;
  onSell: (symbol: string, amount: number, price: number) => void;
  onSetLevel: (level: string) => void;
  onSetAsset: (symbol: string) => void;
  onPlayDrum: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const [currentAsset, setCurrentAsset] = useState(state.currentAssetSymbol || "JSE");

  const asset = state.marketAssetsState.find((a) => a.symbol === currentAsset);
  const sharesOwned = state.shares[currentAsset] || 0;

  useEffect(() => {
    if (!canvasRef.current || !asset) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, "rgba(212, 175, 55, 0.3)");
    gradient.addColorStop(1, "rgba(212, 175, 55, 0.0)");

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
            data: asset.history.map((_, i) => {
              const slice = asset.history.slice(Math.max(0, i - 4), i + 1);
              return slice.reduce((a, b) => a + b, 0) / slice.length;
            }),
            borderColor: "#1ABC9C",
            borderWidth: 1.5,
            pointRadius: 0,
            fill: false,
            tension: 0.4,
          },
          {
            label: "Long MA",
            data: asset.history.map((_, i) => {
              const slice = asset.history.slice(Math.max(0, i - 9), i + 1);
              return slice.reduce((a, b) => a + b, 0) / slice.length;
            }),
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
          legend: {
            labels: { color: "rgba(255,255,255,0.6)", font: { size: 11 } },
          },
          tooltip: {
            backgroundColor: "rgba(18, 18, 26, 0.95)",
            titleColor: "#D4AF37",
            bodyColor: "#fff",
            borderColor: "rgba(212,175,55,0.2)",
            borderWidth: 1,
          },
        },
        scales: {
          x: {
            display: false,
            grid: { display: false },
          },
          y: {
            grid: { color: "rgba(255,255,255,0.05)" },
            ticks: {
              color: "rgba(255,255,255,0.4)",
              font: { size: 10 },
              callback: function (value) {
                const num = Number(value);
                if (num >= 1000) return "R" + (num / 1000).toFixed(1) + "K";
                return "R" + num.toFixed(0);
              },
            },
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [asset?.history.length, currentAsset]);

  const shortMA = asset
    ? asset.history.slice(-5).reduce((a, b) => a + b, 0) / Math.min(5, asset.history.length || 1)
    : 0;
  const longMA = asset
    ? asset.history.slice(-10).reduce((a, b) => a + b, 0) / Math.min(10, asset.history.length || 1)
    : 0;

  let signal: "buy" | "sell" | "hold" = "hold";
  if (shortMA > longMA * 1.01) signal = "buy";
  else if (shortMA < longMA * 0.99) signal = "sell";

  const handleBuy = () => {
    if (!asset) return;
    if (state.cash >= asset.price) {
      onBuy(currentAsset, 1, asset.price);
      onPlayDrum();
    }
  };

  const handleSell = () => {
    if (!asset || sharesOwned <= 0) return;
    onSell(currentAsset, 1, asset.price);
    onPlayDrum();
  };

  return (
    <div className="page-container pb-24">
      <h2 className="font-serif text-3xl font-bold text-white mb-2 flex items-center gap-3">
        <BarChart3 className="w-6 h-6 text-gold" /> Market Simulator
      </h2>
      <p className="text-muted-foreground text-sm mb-6">
        Live market simulation with moving average signals. Higher levels unlock with net worth.
      </p>

      {/* Level Selector */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
        {levels.map((level) => {
          const isUnlocked = netWorth >= level.unlockNetWorth;
          const isActive = state.currentLevel === level.id;
          return (
            <motion.button
              key={level.id}
              onClick={() => isUnlocked && onSetLevel(level.id)}
              disabled={!isUnlocked}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                isActive
                  ? "bg-gold/15 text-gold border border-gold/30"
                  : isUnlocked
                  ? "bg-white/5 text-white border border-white/10 hover:bg-white/10"
                  : "bg-white/5 text-muted-foreground border border-white/5 cursor-not-allowed opacity-50"
              }`}
              whileHover={isUnlocked ? { y: -2 } : {}}
            >
              <span>{level.icon}</span>
              <span>{level.name}</span>
              {isUnlocked ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
            </motion.button>
          );
        })}
      </div>

      {/* Asset Selector */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {state.marketAssetsState.map((a) => (
          <button
            key={a.symbol}
            onClick={() => {
              setCurrentAsset(a.symbol);
              onSetAsset(a.symbol);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentAsset === a.symbol
                ? "bg-gold/20 text-gold border border-gold/30"
                : "bg-white/5 text-muted-foreground border border-white/10 hover:bg-white/10"
            }`}
          >
            {a.symbol}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="glass-card p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold text-white">{asset?.name}</h3>
            <p className="text-xs text-muted-foreground">{asset?.symbol}</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-white">
              R{asset?.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-[10px] text-muted-foreground">Live simulation</p>
          </div>
        </div>
        <div className="h-64 w-full">
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>
      </div>

      {/* Signal & Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="glass-card p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Signal</p>
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm ${
              signal === "buy"
                ? "bg-xhosa-teal/20 text-xhosa-teal border border-xhosa-teal/30"
                : signal === "sell"
                ? "bg-xhosa-red/20 text-xhosa-red border border-xhosa-red/30"
                : "bg-xhosa-yellow/20 text-xhosa-yellow border border-xhosa-yellow/30"
            }`}
          >
            {signal === "buy" ? <TrendingUp className="w-4 h-4" /> : signal === "sell" ? <TrendingDown className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
            {signal === "buy" ? "BUY SIGNAL" : signal === "sell" ? "SELL SIGNAL" : "HOLD"}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Short MA: R{shortMA?.toFixed(2)} | Long MA: R{longMA?.toFixed(2)}
          </p>
        </div>

        <div className="glass-card p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Your Position</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Shares</p>
              <p className="text-lg font-bold text-white">{sharesOwned}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Value</p>
              <p className="text-lg font-bold text-white">
                R{((sharesOwned || 0) * (asset?.price || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Cash</p>
              <p className="text-lg font-bold text-white">R{state.cash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Available</p>
              <p className="text-lg font-bold text-xhosa-teal">
                {asset && state.cash >= asset.price ? "Yes" : "No"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          className="btn-premium flex-1 flex items-center justify-center gap-2"
          onClick={handleBuy}
          disabled={!asset || state.cash < (asset?.price || Infinity)}
        >
          <ShoppingCart className="w-4 h-4" /> Buy 1 Share
        </button>
        <button
          className="btn-outline-premium flex-1 flex items-center justify-center gap-2"
          onClick={handleSell}
          disabled={sharesOwned <= 0}
        >
          <DollarSign className="w-4 h-4" /> Sell 1 Share
        </button>
      </div>

      <div className="mt-4 glass-card p-4 border-l-4 border-l-gold">
        <p className="text-sm text-white/70">
          Tip: You can start investing from as little as R1 on EasyEquities. Every small step builds your empire. 
          The moving average crossover strategy shown here is used by professional traders globally.
        </p>
      </div>
    </div>
  );
}
