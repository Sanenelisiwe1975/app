import { motion } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  TrendingUp,
  Users,
  RefreshCw,
} from "lucide-react";

const mobileNavItems = [
  { id: "dashboard", icon: LayoutDashboard },
  { id: "learn", icon: BookOpen },
  { id: "market", icon: TrendingUp },
  { id: "stokvel", icon: Users },
  { id: "switch", icon: RefreshCw },
];

export default function MobileNav({
  activePage,
  onNavigate,
}: {
  activePage: string;
  onNavigate: (page: string) => void;
}) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-dark-card/95 backdrop-blur-xl border-t border-gold/20 px-2 pb-safe pt-2">
      <div className="flex justify-around items-center">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all ${
                isActive ? "text-gold" : "text-muted-foreground"
              }`}
              whileTap={{ scale: 0.9 }}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[9px] font-medium uppercase tracking-wider">
                {item.id}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
