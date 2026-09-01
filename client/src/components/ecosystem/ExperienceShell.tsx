import type { LucideIcon } from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  BarChart3,
  Gamepad2,
  GraduationCap,
  Heart,
  Home,
  Radio,
  Search,
  ShoppingBag,
  Sparkles,
  Wallet,
} from "lucide-react";
import { Input } from "@/components/ui/input";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/wallet", label: "Wallet", icon: Wallet },
  { href: "/gaming", label: "Games", icon: Gamepad2 },
  { href: "/live", label: "Live", icon: Radio },
  { href: "/dating-home", label: "Dating", icon: Heart },
  { href: "/marketplace", label: "Marketplace", icon: ShoppingBag },
  { href: "/a-i-assistant", label: "HopeAI", icon: Sparkles },
  { href: "/education", label: "Education", icon: GraduationCap },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
] as const;

export type ExperienceAccent = "violet" | "pink" | "indigo" | "orange";

const ACCENTS: Record<ExperienceAccent, { pill: string; icon: string; glow: string }> = {
  violet: {
    pill: "bg-violet-600 text-white shadow-violet-500/20",
    icon: "bg-violet-100 text-violet-700",
    glow: "from-violet-500/10 via-transparent to-transparent",
  },
  pink: {
    pill: "bg-pink-600 text-white shadow-pink-500/20",
    icon: "bg-pink-100 text-pink-700",
    glow: "from-pink-500/10 via-transparent to-transparent",
  },
  indigo: {
    pill: "bg-indigo-600 text-white shadow-indigo-500/20",
    icon: "bg-indigo-100 text-indigo-700",
    glow: "from-indigo-500/10 via-transparent to-transparent",
  },
  orange: {
    pill: "bg-orange-600 text-white shadow-orange-500/20",
    icon: "bg-orange-100 text-orange-700",
    glow: "from-orange-500/10 via-transparent to-transparent",
  },
};

interface ExperienceShellProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  accent: ExperienceAccent;
  badge?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export function ExperienceShell({
  title,
  subtitle,
  icon: Icon,
  accent,
  badge,
  actions,
  children,
}: ExperienceShellProps) {
  const [location] = useLocation();
  const palette = ACCENTS[accent];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-slate-800 bg-slate-950 px-3 py-5 text-slate-300 lg:block">
          <Link href="/" className="mb-7 flex items-center gap-3 px-3 text-white">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-sm font-black shadow-lg shadow-blue-950/40">S</span>
            <div>
              <div className="text-sm font-black tracking-wide">SKYCOIN4444</div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Ecosystem</div>
            </div>
          </Link>

          <nav className="space-y-1" aria-label="Ecosystem navigation">
            {NAV_ITEMS.map((item) => {
              const ItemIcon = item.icon;
              const active = location === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    active ? `${palette.pill} shadow-lg` : "hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <ItemIcon className="h-4 w-4" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <div className="text-xs font-semibold text-white">Engineering beta</div>
            <p className="mt-1 text-[11px] leading-5 text-slate-500">
              Service availability is shown explicitly. Preview data is never presented as live production activity.
            </p>
          </div>
        </aside>

        <main className="relative min-w-0 flex-1 overflow-hidden">
          <div className={`pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-b ${palette.glow}`} />
          <header className="relative z-10 border-b border-slate-200/80 bg-white/90 px-4 py-4 backdrop-blur md:px-7">
            <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${palette.icon}`}>
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h1 className="truncate text-xl font-bold tracking-tight md:text-2xl">{title}</h1>
                    {badge ? <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">{badge}</span> : null}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-slate-500 md:text-sm">{subtitle}</p>
                </div>
              </div>
              <div className="hidden items-center gap-3 md:flex">
                <div className="relative w-56 xl:w-72">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                  <Input aria-label="Search this experience" placeholder="Search..." className="h-9 rounded-xl border-slate-200 bg-slate-50 pl-9" />
                </div>
                {actions}
              </div>
            </div>
          </header>
          <div className="relative z-10 mx-auto max-w-[1500px] p-4 md:p-7">{children}</div>
        </main>
      </div>
    </div>
  );
}

export function SurfaceCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/40 ${className}`}>{children}</section>;
}
