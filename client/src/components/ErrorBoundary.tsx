import { Component, ReactNode } from "react";
import { AlertTriangle, BookOpen, Gamepad2, Home, RotateCcw } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

interface Props { children: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

const recoveryLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/gaming", label: "Gaming", icon: Gamepad2 },
  { href: "/course-catalog", label: "Learn", icon: BookOpen },
] as const;

export function ScreenLoadingFallback() {
  return <main className="flex min-h-screen items-center justify-center bg-[#050510] p-6 text-white"><section className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center"><div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-sky-300" /><p className="mt-5 text-lg font-bold">Restoring screen…</p><p className="mt-2 text-sm leading-6 text-white/45">The app is loading this area. If it takes too long, continue from a stable core area.</p><div className="mt-5 flex flex-wrap justify-center gap-2">{recoveryLinks.map(({ href, label }) => <Link key={href} href={href} className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white/70 hover:bg-white/10 hover:text-white">{label}</Link>)}</div></section></main>;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  reset = () => this.setState({ hasError: false, error: null });

  render() {
    if (!this.state.hasError) return this.props.children;
    const message = this.state.error?.message || "The screen could not be rendered.";
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050510] p-6 text-white">
        <section className="w-full max-w-2xl rounded-3xl border border-rose-300/20 bg-white/[0.04] p-8 shadow-2xl shadow-black/30">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-rose-300/10 text-rose-200"><AlertTriangle className="h-6 w-6" /></span>
            <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-200/70">Screen recovery</p><h1 className="mt-2 text-2xl font-black">This area needs a refresh</h1><p className="mt-2 leading-6 text-white/55">The rest of SKYCOIN4444 is still available. Retry this screen or jump to another working area below.</p></div>
          </div>
          <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4"><p className="text-xs font-bold uppercase tracking-wide text-white/35">Diagnostic message</p><p className="mt-2 break-words text-sm text-white/60">{message}</p></div>
          <div className="mt-6 flex flex-wrap gap-2"><button type="button" onClick={this.reset} className={cn("inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold", "bg-white text-[#050510] hover:bg-white/90")}><RotateCcw className="h-4 w-4" />Try again</button><button type="button" onClick={() => window.location.reload()} className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10"><RotateCcw className="h-4 w-4" />Reload app</button>{recoveryLinks.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-white/75 hover:bg-white/10 hover:text-white"><Icon className="h-4 w-4" />{label}</Link>)}</div>
          <p className="mt-6 text-xs leading-5 text-white/30">No progress, wallet data, or account records are deleted by this recovery screen.</p>
        </section>
      </main>
    );
  }
}

export { ErrorBoundary };
export default ErrorBoundary;
