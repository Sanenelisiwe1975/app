import { motion } from "framer-motion";
import { Briefcase, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { useGameStore } from "@/shared/stores/gameStore";
import { useMarketStore } from "@/shared/stores/marketStore";
import { useNetWorth } from "@/shared/hooks/useNetWorth";
import { formatCurrency } from "@/shared/lib/formatters";

export default function Portfolio() {
  const cash   = useGameStore((s) => s.cash);
  const shares = useGameStore((s) => s.shares);
  const assets = useMarketStore((s) => s.assets);
  const netWorth = useNetWorth();

  const portfolioItems = Object.entries(shares).filter(([, amt]) => amt > 0);
  const invested = netWorth - cash;

  return (
    <div className="page-container pb-24">
      <h2 className="font-serif text-3xl font-bold text-white mb-2 flex items-center gap-3">
        <Briefcase className="w-6 h-6 text-gold" /> Your Holdings
      </h2>
      <p className="text-muted-foreground text-sm mb-6">Track every asset in your growing empire.</p>

      {/* ── Summary ─────────────────────────────────────────────────────── */}
      <div className="glass-card p-5 mb-6">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Cash</p>
            <p className="text-xl font-bold text-white">{formatCurrency(cash)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Invested</p>
            <p className="text-xl font-bold text-gold">{formatCurrency(invested)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Net Worth</p>
            <p className="text-xl font-bold gold-text">{formatCurrency(netWorth)}</p>
          </div>
        </div>
      </div>

      {/* ── Holdings ────────────────────────────────────────────────────── */}
      {portfolioItems.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No holdings yet. Visit the Market to start building your portfolio.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {portfolioItems.map(([symbol, amount]) => {
            const asset = assets.find((a) => a.symbol === symbol);
            if (!asset) return null;
            const value     = amount * asset.price;
            const prevPrice = asset.history[asset.history.length - 2] ?? asset.price;
            const change    = ((asset.price - prevPrice) / prevPrice) * 100;
            return (
              <motion.div
                key={symbol}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-white">{asset.name}</h3>
                    <p className="text-xs text-muted-foreground">{symbol}</p>
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${change >= 0 ? "text-xhosa-teal" : "text-xhosa-red"}`}>
                    {change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {change >= 0 ? "+" : ""}{change.toFixed(2)}%
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-[10px] text-muted-foreground">Shares</p>
                    <p className="font-medium text-white">{amount}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Price</p>
                    <p className="font-medium text-white">R{asset.price.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Value</p>
                    <p className="font-medium text-gold">{formatCurrency(value)}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
