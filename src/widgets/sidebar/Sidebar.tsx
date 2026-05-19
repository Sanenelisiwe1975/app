import { motion } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  TrendingUp,
  Briefcase,
  Users,
  Clock,
  Shield,
  Heart,
  Brain,
  Award,
  RefreshCw,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "learn", label: "Learn", icon: BookOpen },
  { id: "market", label: "Market", icon: TrendingUp },
  { id: "portfolio", label: "Portfolio", icon: Briefcase },
  { id: "stokvel", label: "Stokvel", icon: Users },
  { id: "timemachine", label: "Time Machine", icon: Clock },
  { id: "antiscam", label: "B2B Shield", icon: Shield },
  { id: "wealthybody", label: "Wealthy Body", icon: Heart },
  { id: "emotion", label: "Emotion", icon: Brain },
  { id: "prophet", label: "Prophet", icon: TrendingUp },
  { id: "certificate", label: "Certificate", icon: Award },
  { id: "switch", label: "Switch", icon: RefreshCw },
];

export default function Sidebar({
  activePage,
  onNavigate,
  mindsetName,
  userName,
}: {
  activePage: string;
  onNavigate: (page: string) => void;
  mindsetName?: string;
  userName?: string;
}) {
  return (
    <aside className="hidden md:flex flex-col w-72 h-full bg-dark-card/90 border-r border-gold/10 backdrop-blur-xl">
      <div className="p-6 border-b border-gold/10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gold-light to-gold flex items-center justify-center text-dark font-bold text-lg shadow-glow">
            XR
          </div>
          <div>
            <h2 className="font-serif text-lg font-semibold text-white leading-tight">FINLIT</h2>
            <p className="text-[10px] tracking-[0.2em] text-gold uppercase">Xhosa Rise Global</p>
          </div>
        </div>
        {userName && (
          <div className="mt-4 pt-4 border-t border-gold/10">
            <p className="text-xs text-muted-foreground">Welcome back</p>
            <p className="text-sm font-medium text-white">{userName}</p>
            {mindsetName && (
              <p className="text-xs text-gold mt-0.5">{mindsetName}</p>
            )}
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-gold/10 text-gold border border-gold/20"
                  : "text-muted-foreground hover:bg-white/5 hover:text-white"
              }`}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="w-4 h-4" />
              <span className="flex-1 text-left">{item.label}</span>
              {isActive && <ChevronRight className="w-3 h-3" />}
            </motion.button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gold/10">
        <div className="beadwork-bar w-full mb-3" />
        <p className="text-[10px] text-muted-foreground text-center tracking-wider uppercase">
          From South African Roots to Global Markets
        </p>
      </div>
    </aside>
  );
}
