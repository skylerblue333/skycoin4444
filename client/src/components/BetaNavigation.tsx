import {
  Activity,
  Bot,
  Boxes,
  GraduationCap,
  Gamepad2,
  Heart,
  Home,
  Languages,
  LayoutDashboard,
  LogIn,
  MessageSquare,
  Radio,
  UserRound,
  ShoppingBag,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";

const links = [
  { label: "Home", route: "/", icon: Home },
  { label: "Workspace", route: "/beta-workspace", icon: LayoutDashboard },
  { label: "Social", route: "/activity-feed", icon: Activity },
  { label: "Learn", route: "/course-catalog", icon: GraduationCap },
  { label: "Gaming", route: "/arcade", icon: Gamepad2 },
  { label: "Live", route: "/live-streaming", icon: Radio },
  { label: "Shop", route: "/beta-commerce", icon: ShoppingBag },
  { label: "Language", route: "/language-partner-discovery", icon: Languages },
  { label: "Dating", route: "/dating-profile-setup", icon: Heart },
  { label: "Web3", route: "/beta-web3", icon: Boxes },
  { label: "HopeAI", route: "/a-i-tools-hub", icon: Bot },
] as const;

function isActive(location: string, route: string) {
  return route === "/" ? location === "/" : location === route;
}

export default function BetaNavigation() {
  const [location] = useLocation();
  const { isAuthenticated, loading } = useAuth();

  return (
    <nav
      className="sticky top-0 z-50 border-b border-white/10 bg-[#050510]/90 text-white shadow-[0_12px_30px_-24px_rgba(0,0,0,0.9)] backdrop-blur-xl"
      aria-label="SKYCOIN4444 beta navigation"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-sky-400 via-blue-500 to-violet-600 text-xs font-black text-white shadow-lg shadow-blue-950/40">
            44
          </span>
          <span className="hidden sm:block">
            <strong className="block text-sm font-black tracking-tight">
              SKYCOIN4444
            </strong>
            <span className="block text-[10px] uppercase tracking-[0.18em] text-white/40">
              Engineering beta
            </span>
          </span>
        </Link>

        <div className="hidden min-w-0 flex-1 items-center justify-center gap-1 xl:flex">
          {links.slice(1).map(({ label, route, icon: Icon }) => {
            const active = isActive(location, route);
            return (
              <Link
                key={route}
                href={route}
                aria-current={active ? "page" : undefined}
                className={
                  "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold transition-colors " +
                  (active
                    ? "bg-white/12 text-white"
                    : "text-white/55 hover:bg-white/[0.07] hover:text-white")
                }
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Link>
            );
          })}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Link
            href={`/beta-feedback?route=${encodeURIComponent(location)}`}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-semibold text-white/70 transition hover:border-sky-300/30 hover:bg-white/10 hover:text-white"
          >
            <MessageSquare className="h-4 w-4" />
            <span className="hidden md:inline">Feedback</span>
          </Link>

          <Link
            href={isAuthenticated ? "/dashboard" : "/signin"}
            aria-label={
              loading
                ? "Checking beta account"
                : isAuthenticated
                  ? "Open account dashboard"
                  : "Open invitation sign in"
            }
            className={
              "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 " +
              (isAuthenticated
                ? "border border-emerald-300/20 bg-emerald-300/[0.08] text-emerald-100 hover:bg-emerald-300/[0.13]"
                : "bg-white text-[#050510] hover:bg-white/90")
            }
          >
            {isAuthenticated ? (
              <UserRound className="h-4 w-4" />
            ) : (
              <LogIn className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">
              {loading ? "Account" : isAuthenticated ? "Dashboard" : "Sign in"}
            </span>
          </Link>
        </div>
      </div>

      <div className="border-t border-white/[0.06] xl:hidden">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-3 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {links.map(({ label, route, icon: Icon }) => {
            const active = isActive(location, route);
            return (
              <Link
                key={route}
                href={route}
                aria-current={active ? "page" : undefined}
                className={
                  "inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors " +
                  (active
                    ? "bg-sky-400/15 text-sky-100"
                    : "text-white/50 hover:bg-white/[0.06] hover:text-white")
                }
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
