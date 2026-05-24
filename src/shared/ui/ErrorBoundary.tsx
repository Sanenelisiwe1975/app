import { Component, type ErrorInfo, type ReactNode } from "react";
import { RefreshCw, AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
  /** Optional label shown in the fallback (e.g. "Market", "Dashboard") */
  feature?: string;
  /** If true, shows a minimal inline fallback instead of the full-page one */
  inline?: boolean;
}

interface State {
  error: Error | null;
}

/**
 * Catches render errors in child components so one broken feature
 * doesn't take down the entire app. Mount as close to the crash site
 * as possible (per-feature, not just at the root).
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // In production replace with your error tracking service (Sentry, etc.)
    console.error(`[ErrorBoundary${this.props.feature ? `:${this.props.feature}` : ""}]`, error, info.componentStack);
  }

  private handleRetry = () => this.setState({ error: null });

  render() {
    if (!this.state.error) return this.props.children;

    if (this.props.inline) {
      return (
        <div className="glass-card p-4 flex items-center gap-3 text-sm text-muted-foreground">
          <AlertTriangle className="w-4 h-4 text-xhosa-red shrink-0" />
          <span>Something went wrong in {this.props.feature ?? "this section"}.</span>
          <button
            type="button"
            onClick={this.handleRetry}
            className="ml-auto text-gold hover:underline text-xs"
          >
            Retry
          </button>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-xhosa-red/20 flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8 text-xhosa-red" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-white mb-2">
          {this.props.feature ? `${this.props.feature} ran into a problem` : "Something went wrong"}
        </h2>
        <p className="text-muted-foreground text-sm mb-6 max-w-sm">
          {this.state.error.message || "An unexpected error occurred. Your progress is saved."}
        </p>
        <button
          type="button"
          onClick={this.handleRetry}
          className="btn-premium flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
      </div>
    );
  }
}
