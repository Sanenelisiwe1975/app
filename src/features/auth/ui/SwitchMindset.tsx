import { RefreshCw, AlertTriangle, Trash2, ArrowLeft } from "lucide-react";

export default function SwitchMindset({
  onNewMindset,
  onHardReset,
  onBack,
}: {
  onNewMindset: () => void;
  onHardReset: () => void;
  onBack: () => void;
}) {
  return (
    <div className="page-container pb-24">
      <h2 className="font-serif text-3xl font-bold text-white mb-2 flex items-center gap-3">
        <RefreshCw className="w-6 h-6 text-gold" /> Switch Mindset
      </h2>
      <p className="text-muted-foreground text-sm mb-6">
        Evolve your financial identity. Start a new path while preserving your legacy.
      </p>

      <div className="glass-card p-6 mb-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
            <RefreshCw className="w-6 h-6 text-gold" />
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">Start New Mindset</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your XP and badges remain as permanent legacy. Cash and module progress reset for your new path. 
              Perfect for exploring a different career or business trajectory.
            </p>
            <button className="btn-premium flex items-center gap-2" onClick={onNewMindset}>
              <RefreshCw className="w-4 h-4" /> Begin New Journey
            </button>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 mb-4 border-xhosa-red/30">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-xhosa-red/10 flex items-center justify-center shrink-0">
            <Trash2 className="w-6 h-6 text-xhosa-red" />
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">Hard Reset</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Complete wipe. All progress, XP, badges, and history deleted forever. 
              Only use this if you want a completely fresh start.
            </p>
            <button
              className="px-4 py-2 rounded-full text-sm font-medium bg-xhosa-red/10 text-xhosa-red border border-xhosa-red/30 hover:bg-xhosa-red/20 transition-all flex items-center gap-2"
              onClick={() => {
                if (confirm("HARD RESET: All progress will be permanently deleted. Are you sure?")) {
                  onHardReset();
                }
              }}
            >
              <AlertTriangle className="w-4 h-4" /> Destroy All Progress
            </button>
          </div>
        </div>
      </div>

      <button className="btn-outline-premium flex items-center gap-2" onClick={onBack}>
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>
    </div>
  );
}
