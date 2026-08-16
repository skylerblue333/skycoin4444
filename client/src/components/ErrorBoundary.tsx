import { AlertTriangle, RotateCcw } from "lucide-react";
import { Component, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    const isDevelopment = import.meta.env.MODE === "development";

    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-8">
        <section
          className="flex w-full max-w-xl flex-col items-center rounded-xl border border-border bg-card p-8 text-center shadow-sm"
          role="alert"
          aria-live="assertive"
        >
          <AlertTriangle
            size={48}
            className="mb-6 text-destructive"
            aria-hidden="true"
          />
          <h1 className="text-xl font-semibold">
            SKYCOIN4444 could not load this page
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            An unexpected application error occurred. No account, wallet, or
            transaction data was changed. Reload the page and try again.
          </p>
          {isDevelopment && this.state.error ? (
            <details className="mt-6 w-full text-left">
              <summary className="cursor-pointer text-sm font-medium">
                Development diagnostics
              </summary>
              <pre className="mt-3 max-h-48 overflow-auto rounded-md bg-muted p-4 text-xs text-muted-foreground whitespace-pre-wrap">
                {this.state.error.stack ?? this.state.error.message}
              </pre>
            </details>
          ) : null}
          <button
            type="button"
            onClick={() => window.location.reload()}
            className={cn(
              "mt-6 flex items-center gap-2 rounded-lg px-4 py-2",
              "bg-primary text-primary-foreground",
              "hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
          >
            <RotateCcw size={16} aria-hidden="true" />
            Reload page
          </button>
        </section>
      </main>
    );
  }
}

export default ErrorBoundary;
