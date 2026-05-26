import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Briefcase, TrendingUp, TrendingDown, Wallet,
  History, ShoppingCart, DollarSign, PieChart, ArrowUpRight,
} from "lucide-react";
import { useGameStore } from "@/shared/stores/gameStore";
import { useMarketStore } from "@/shared/stores/marketStore";
import { useNetWorth } from "@/shared/hooks/useNetWorth";
import { useTradeHistory } from "@/shared/hooks/useTradeHistory";
import { useCurrencyFormatter } from "@/shared/hooks/useCurrencyFormatter";
import { EasyEquitiesButton } from "@/shared/ui/EasyEquitiesPrompt";
import EasyEquitiesBridge from "./EasyEquitiesBridge";

// ── Colour palette for allocation bars ────────────────────────────────────────
const ALLOCATION_COLORS = [
  "bg-gold",
  "bg-xhosa-teal",
  "bg-xhosa-blue",
  "bg-xhosa-red",
  "bg-xhosa-purple",
  "bg-xhosa-yellow",
  "bg-xhosa-coral",
];

export default function Portfolio() {
  const { t }          = useTranslation();
  const formatCurrency = useCurrencyFormatter();
  const [bridge, setBridge] = useState(false);
  const cash          = useGameStore((s) => s.cash);
  const shares   = useGameStore((s) => s.shares);
  const totalTrades      = useGameStore((s) => s.totalTrades);
  const profitableTrades = useGameStore((s) => s.profitableTrades);
  const assets   = useMarketStore((s) => s.assets);
  const netWorth = useNetWorth();

  const { data: trades = [], isLoading: tradesLoading } = useTradeHistory();

  const portfolioItems = Object.entries(shares)
    .filter(([, amt]) => amt > 0)
    .map(([symbol, amount]) => {
      const asset    = assets.find((a) => a.symbol === symbol);
      const value    = asset ? amount * asset.price : 0;
      const prevPrice = asset?.history[asset.history.length - 2] ?? asset?.price ?? 0;
      const change    = asset && prevPrice > 0
        ? ((asset.price - prevPrice) / prevPrice) * 100
        : 0;
      return { symbol, amount, asset, value, change };
    })
    .sort((a, b) => b.value - a.value);

  const invested      = netWorth - cash;
  const winRate       = totalTrades > 0 ? Math.round((profitableTrades / totalTrades) * 100) : 0;
  const totalPortfolio = portfolioItems.reduce((s, i) => s + i.value, 0);

  // Allocation including cash
  const allocationRows = [
    { label: "Cash", value: cash, color: "bg-white/40" },
    ...portfolioItems.map(({ symbol, value }, i) => ({
      label: symbol,
      value,
      color: ALLOCATION_COLORS[i % ALLOCATION_COLORS.length],
    })),
  ].filter((r) => r.value > 0);
  const allocationTotal = allocationRows.reduce((s, r) => s + r.value, 0);

  return (
    <div className="page-container pb-24">
      <h2 className="font-serif text-3xl font-bold text-white mb-2 flex items-center gap-3">
        <Briefcase className="w-6 h-6 text-gold" /> {t("portfolio.title")}
      </h2>
      <p className="text-muted-foreground text-sm mb-6">{t("portfolio.subtitle")}</p>

      {/* ── Summary cards ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: t("portfolio.cash"),     value: formatCurrency(cash),     color: "text-white"      },
          { label: t("portfolio.invested"), value: formatCurrency(invested),  color: "text-gold"       },
          { label: t("portfolio.netWorth"), value: formatCurrency(netWorth),  color: "gold-text"       },
          { label: "Win Rate",              value: `${winRate}%`,             color: "text-xhosa-teal" },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass-card p-4">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
            <p className={`text-lg font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* ── Allocation strip ────────────────────────────────────────────────── */}
      {allocationTotal > 0 && (
        <div className="glass-card p-5 mb-6">
          <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-gold" /> {t("portfolio.allocationTitle")}
          </h3>
          {/* Stacked bar */}
          <div className="flex h-3 rounded-full overflow-hidden mb-3 gap-px">
            {allocationRows.map(({ label, value, color }) => (
              <motion.div
                key={label}
                className={`h-full ${color}`}
                initial={{ width: 0 }}
                animate={{ width: `${(value / allocationTotal) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            ))}
          </div>
          {/* Legend */}
          <div className="flex flex-wrap gap-x-2 sm:gap-x-4 gap-y-1.5">
            {allocationRows.map(({ label, value, color }) => {
              const pct = ((value / allocationTotal) * 100).toFixed(1);
              return (
                <div key={label} className="flex items-center gap-1">
                  <span className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-sm shrink-0 ${color}`} />
                  <span className="text-[10px] sm:text-xs text-muted-foreground">{label}</span>
                  <span className="text-[10px] sm:text-xs font-semibold text-white">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Holdings ────────────────────────────────────────────────────────── */}
      {portfolioItems.length === 0 ? (
        <div className="glass-card p-8 text-center mb-6">
          <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground mb-4">{t("portfolio.noHoldings")}</p>
          <EasyEquitiesButton compact />
        </div>
      ) : (
        <div className="space-y-3 mb-6">
          {portfolioItems.map(({ symbol, amount, asset, value, change }, i) => {
            if (!asset) return null;
            const allocPct = totalPortfolio > 0 ? (value / totalPortfolio) * 100 : 0;
            const barColor = ALLOCATION_COLORS[i % ALLOCATION_COLORS.length];
            return (
              <motion.div
                key={symbol}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black text-dark ${barColor}`}>
                      {symbol.slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm">{asset.name}</h3>
                      <p className="text-[10px] text-muted-foreground">{symbol}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-semibold ${change >= 0 ? "text-xhosa-teal" : "text-xhosa-red"}`}>
                    {change >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    {change >= 0 ? "+" : ""}{change.toFixed(2)}%
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 text-sm mb-3">
                  <div>
                    <p className="text-[10px] text-muted-foreground">{t("portfolio.shares")}</p>
                    <p className="font-medium text-white">{amount}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">{t("portfolio.price")}</p>
                    <p className="font-medium text-white">{formatCurrency(asset.price)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">{t("portfolio.value")}</p>
                    <p className="font-medium text-gold">{formatCurrency(value)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">{t("portfolio.allocation")}</p>
                    <p className="font-medium text-white">{allocPct.toFixed(1)}%</p>
                  </div>
                </div>

                {/* Allocation bar */}
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${barColor}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${allocPct}%` }}
                    transition={{ duration: 0.7, delay: i * 0.05 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ── Trade history ────────────────────────────────────────────────────── */}
      <div className="glass-card p-5 mb-6">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <History className="w-4 h-4 text-gold" /> {t("portfolio.tradeHistory")}
        </h3>
        {tradesLoading ? (
          <p className="text-sm text-muted-foreground">{t("common.loading")}</p>
        ) : trades.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("portfolio.noTrades")}</p>
        ) : (
          <>
            {/* Totals row */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <p className="text-[10px] text-muted-foreground mb-1">Total Trades</p>
                <p className="text-lg font-bold text-white">{totalTrades}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <p className="text-[10px] text-muted-foreground mb-1">Profitable</p>
                <p className="text-lg font-bold text-xhosa-teal">{profitableTrades}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <p className="text-[10px] text-muted-foreground mb-1">Win Rate</p>
                <p className={`text-lg font-bold ${winRate >= 50 ? "text-xhosa-teal" : "text-xhosa-red"}`}>{winRate}%</p>
              </div>
            </div>

            <div className="space-y-1 max-h-64 overflow-y-auto">
              {[...trades].reverse().map((trade) => (
                <div
                  key={trade.id}
                  className="flex items-center justify-between text-sm py-2.5 border-b border-white/5 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    {trade.type === "buy"
                      ? <ShoppingCart className="w-3.5 h-3.5 text-xhosa-teal" />
                      : <DollarSign   className="w-3.5 h-3.5 text-xhosa-red"  />}
                    <span className={`font-semibold text-xs ${trade.type === "buy" ? "text-xhosa-teal" : "text-xhosa-red"}`}>
                      {trade.type.toUpperCase()}
                    </span>
                    <span className="text-white font-medium">{trade.symbol}</span>
                    <span className="text-muted-foreground text-xs">× {trade.amount}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-xs font-medium">{formatCurrency(trade.price)}</p>
                    <p className="text-[9px] text-muted-foreground">
                      {new Date(trade.timestamp).toLocaleString([], {
                        month: "short", day: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Real World Bridge CTA ────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="relative rounded-3xl overflow-hidden border border-gold/30 mb-6"
        style={{
          background: "linear-gradient(135deg, rgba(18,16,14,0.96) 0%, rgba(30,24,10,0.98) 100%)",
        }}
      >
        {/* Shimmer top */}
        <div className="h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
        {/* Beadwork strip */}
        <div className="flex h-1">
          {[0,1,2,3,4,5,6,7].map((i) => (
            <div key={i} className={`flex-1 bead-${i}`} />
          ))}
        </div>

        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold/25 to-gold/5 border border-gold/25 flex items-center justify-center shrink-0">
              <span className="text-2xl">🌉</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold text-gold uppercase tracking-widest mb-0.5">Real World Bridge</p>
              <h3 className="font-serif text-lg font-bold text-white mb-1">Transfer to EasyEquities</h3>
              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                You've simulated wealth. Now bridge it. Invest your simulated gains in real JSE shares — from as little as R50. Earn XP and the <span className="text-gold font-semibold">Real Investor</span> badge.
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setBridge(true)}
                  className="btn-premium flex items-center gap-2 text-sm"
                >
                  Transfer Now <ArrowUpRight className="w-4 h-4" />
                </button>
                <EasyEquitiesButton compact />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── EasyEquities Bridge Modal ─────────────────────────────────────────── */}
      <AnimatePresence>
        {bridge && <EasyEquitiesBridge onClose={() => setBridge(false)} />}
      </AnimatePresence>
    </div>
  );
}
