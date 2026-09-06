import { useEffect, useRef, useState } from "react";
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
  Sparkles,
  UserRound,
  ShoppingBag,
  X,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";

const links = [
  { label: "Home", route: "/", icon: Home },
  { label: "Workspace", route: "/beta-workspace", icon: LayoutDashboard },
  { label: "Social", route: "/activity-feed", icon: Activity },
  { label: "Learn", route: "/sky-school", icon: GraduationCap },
  { label: "Gaming", route: "/gaming", icon: Gamepad2 },
  { label: "Live", route: "/live-streaming", icon: Radio },
  { label: "Shop", route: "/beta-commerce", icon: ShoppingBag },
  { label: "Language", route: "/language-partner-discovery", icon: Languages },
  { label: "Dating", route: "/dating-profile-setup", icon: Heart },
  { label: "Web3", route: "/beta-web3", icon: Boxes },
  { label: "HopeAI", route: "/hope-a-i", icon: Bot },
] as const;

const fourFoursTrail = [
  {
    number: "01",
    title: "Build what you can prove",
    message:
      "Big ideas matter. Evidence matters too. Make something real, test it, improve it, and let the work speak.",
    href: "/beta-workspace",
    action: "Open the workshop",
  },
  {
    number: "02",
    title: "Keep learning",
    message:
      "Curiosity compounds. Ask better questions, learn from people unlike you, and never be embarrassed to begin again.",
    href: "/sky-school",
    action: "Follow the lesson",
  },
  {
    number: "03",
    title: "Help somebody",
    message:
      "Technology is most interesting when it makes another person's day, work, or future a little better.",
    href: "/hope-a-i",
    action: "Follow hope",
  },
  {
    number: "04",
    title: "Remember to play",
    message:
      "Not everything valuable has to become a metric. Keep some room for jokes, games, music, wonder, and ridiculous ideas.",
    href: "/gaming",
    action: "Follow the spark",
  },
] as const;

function isActive(location: string, route: string) {
  return route === "/" ? location === "/" : location === route;
}

export default function BetaNavigation() {
  const [location] = useLocation();
  const { isAuthenticated, loading } = useAuth();
  const [fourFoursOpen, setFourFoursOpen] = useState(false);
  const [, setMarkTaps] = useState(0);
  const keyRun = useRef(0);

  function recordMarkTap() {
    setMarkTaps(current => {
      const next = current + 1;
      if (next >= 4) {
        setFourFoursOpen(true);
        return 0;
      }
      return next;
    });
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable
      ) {
        return;
      }

      if (event.key === "Escape" && fourFoursOpen) {
        setFourFoursOpen(false);
        return;
      }

      keyRun.current = event.key === "4" ? keyRun.current + 1 : 0;
      if (keyRun.current >= 4) {
        keyRun.current = 0;
        setFourFoursOpen(true);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fourFoursOpen]);

  return (
    <nav
      className="sticky top-0 z-50 border-b border-white/10 bg-[#050510]/90 text-white shadow-[0_12px_30px_-24px_rgba(0,0,0,0.9)] backdrop-blur-xl"
      aria-label="SKYCOIN4444 beta navigation"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <Link
          href="/"
          aria-label="SKYCOIN4444 home"
          onClick={recordMarkTap}
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

      {fourFoursOpen ? (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-[#020208]/90 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="four-fours-title"
        >
          <div className="max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-sky-300/20 bg-[#080817] p-5 shadow-2xl shadow-blue-950/50 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-violet-300/15 bg-violet-300/[0.06] px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-violet-100/60">
                  <Sparkles className="h-3.5 w-3.5" />
                  44 · 44
                </div>
                <h2
                  id="four-fours-title"
                  className="mt-4 text-2xl font-black tracking-tight text-white sm:text-3xl"
                >
                  You found the Four Fours.
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">
                  Four notes hidden behind the mark. They are not achievements,
                  rewards, credentials, or tracked progress—just a small trail
                  through the ecosystem.
                </p>
              </div>
              <button
                type="button"
                aria-label="Close Four Fours Easter egg"
                onClick={() => setFourFoursOpen(false)}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-white/55 transition hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/60"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {fourFoursTrail.map(item => (
                <div
                  key={item.number}
                  className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5"
                >
                  <span className="text-[10px] font-black tracking-[0.24em] text-sky-200/45">
                    {item.number} / 04
                  </span>
                  <h3 className="mt-2 text-base font-black text-white/85">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs leading-6 text-white/40">
                    {item.message}
                  </p>
                  <Link
                    href={item.href}
                    onClick={() => setFourFoursOpen(false)}
                    className="mt-4 inline-flex text-xs font-bold text-sky-200 transition hover:text-white"
                  >
                    {item.action}
                  </Link>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-white/[0.07] bg-black/20 p-4 text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-white/25">
                The old engineering rule
              </p>
              <p className="mt-2 text-sm font-semibold text-white/55">
                No fake progress. Build it. Test it. Integrate it. Prove it.
              </p>
            </div>

            <p className="mt-4 text-center text-[10px] leading-5 text-white/20">
              Unlocks in memory only. No analytics event, cookie, account field,
              local storage, or server record is created.
            </p>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
