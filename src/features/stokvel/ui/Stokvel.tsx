import { motion } from "framer-motion";
import { Users, PiggyBank, Vote, ArrowRight } from "lucide-react";
import { useGameStore } from "@/shared/stores/gameStore";
import { useAudio } from "@/shared/hooks/useAudio";

export default function Stokvel() {
  const cash              = useGameStore((s) => s.cash);
  const community         = useGameStore((s) => s.community);
  const contributeStokvel = useGameStore((s) => s.contributeStokvel);
  const voteStokvel       = useGameStore((s) => s.voteStokvel);
  const { playDrum }      = useAudio();

  const potPct = Math.min(100, (community.pot / 2000) * 100);

  return (
    <div className="page-container pb-24">
      <h2 className="font-serif text-3xl font-bold text-white mb-2 flex items-center gap-3">
        <Users className="w-6 h-6 text-gold" /> Community Stokvel
      </h2>
      <p className="text-muted-foreground text-sm mb-6 italic">
        "Umntu ngumntu ngabantu" — A person is a person through others.
      </p>

      <div className="glass-card p-6 mb-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Members</p>
            <p className="text-2xl font-bold text-white">{community.members}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Pot</p>
            <p className="text-2xl font-bold gold-text">R{community.pot.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Next Payout</p>
            <p className="text-2xl font-bold text-white">Member {community.nextPayout + 1}</p>
          </div>
        </div>

        <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-6">
          <motion.div
            className="h-full bg-gradient-to-r from-gold-light to-gold rounded-full"
            animate={{ width: `${potPct}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            className="btn-premium flex-1 flex items-center justify-center gap-2"
            onClick={() => { contributeStokvel(); playDrum(); }}
            disabled={cash < 100}
          >
            <PiggyBank className="w-4 h-4" /> Contribute R100
          </button>
          <button
            type="button"
            className="btn-outline-premium flex-1 flex items-center justify-center gap-2"
            onClick={() => { voteStokvel(); playDrum(); }}
            disabled={community.pot <= 0}
          >
            <Vote className="w-4 h-4" /> Vote Payout
          </button>
        </div>
      </div>

      <div className="glass-card p-5 border-l-4 border-l-xhosa-teal">
        <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
          <ArrowRight className="w-4 h-4 text-xhosa-teal" /> How It Works
        </h3>
        <ul className="text-sm text-white/70 space-y-2">
          <li>• Each member contributes R100 to the communal pot</li>
          <li>• When the pot reaches R2,000, it automatically rotates to the next member</li>
          <li>• The Stokvel tradition builds discipline, trust, and collective wealth</li>
          <li>• Modern stokvels in South Africa manage over R50 billion annually</li>
        </ul>
      </div>
    </div>
  );
}
