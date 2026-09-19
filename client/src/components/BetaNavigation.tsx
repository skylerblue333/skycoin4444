import { useEffect, useRef, useState } from "react";
import {
  Bot,
  ChevronRight,
  Compass,
  Gamepad2,
  Grid2X2,
  Home,
  LogIn,
  Menu,
  MessageCircleMore,
  MessageSquare,
  Mic,
  MicOff,
  Radio,
  Search,
  Sparkles,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import V3CommandPalette from "@/components/V3CommandPalette";
import routeCatalog from "@/data/routeCatalog.json";
import {
  betaExperienceAreas,
  betaExperienceStatusCopy,
  resolveBetaRouteContext,
  type BetaExperienceArea,
} from "@/data/betaExperienceAreas";

const primaryLinks = [
  { label: "Home", route: "/", icon: Home },
  { label: "Explore", route: "/platform-map", icon: Compass },
  { label: "Social", route: "/activity-feed", icon: Users },
  { label: "Chat", route: "/unified-messaging", icon: MessageCircleMore },
  { label: "Gaming", route: "/gaming", icon: Gamepad2 },
  { label: "HopeAI", route: "/hope-a-i", icon: Bot },
  { label: "Live", route: "/live", icon: Radio },
] as const;

const legacyNavigationAliases = [
  { label: "V5", route: "/beta-workspace" },
  { label: "Market", route: "/beta-commerce" },
  { label: "School", route: "/sky-school" },
  { label: "Web3", route: "/beta-web3" },
  { label: "Dating", route: "/dating-home" },
  { label: "Global", route: "/translation-enabled-community" },
  { label: "Creator", route: "/creator-dashboard" },
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
    href: "/charity",
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

function routeIsActive(location: string, route: string) {
  return route === "/" ? location === "/" : location === route;
}

function areaIsActive(location: string, area: BetaExperienceArea) {
  return (
    location === area.route ||
    area.highlights.some(highlight => highlight.route === location)
  );
}

function statusDot(area: BetaExperienceArea) {
  if (area.status === "core_beta") return "bg-emerald-300";
  if (area.status === "controlled_beta") return "bg-amber-300";
  return "bg-slate-400";
}

export default function BetaNavigation() {
  const [location, setLocation] = useLocation();
  const { isAuthenticated, loading } = useAuth();
  const [commandOpen, setCommandOpen] = useState(false);
  const [areaOpen, setAreaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [fourFoursOpen, setFourFoursOpen] = useState(false);
  const [voiceListening, setVoiceListening] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState("");
  const voiceRecognition = useRef<any>(null);
  const [, setMarkTaps] = useState(0);
  const keyRun = useRef(0);

  useEffect(() => {
    setAreaOpen(false);
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const editing =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen(true);
        return;
      }

      if (event.key === "Escape") {
        setAreaOpen(false);
        setMobileOpen(false);
        setFourFoursOpen(false);
        return;
      }

      if (editing) return;
      keyRun.current = event.key === "4" ? keyRun.current + 1 : 0;
      if (keyRun.current >= 4) {
        keyRun.current = 0;
        setFourFoursOpen(true);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => () => voiceRecognition.current?.stop(), []);

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

  function startVoiceNavigation() {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceMessage("Voice navigation is not supported in this browser.");
      return;
    }

    if (voiceListening) {
      voiceRecognition.current?.stop();
      setVoiceListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => {
      setVoiceListening(true);
      setVoiceMessage(
        "Listening… say Home, V5, Explore, Social, Live, Gaming, Market, School, HopeAI, Web3, Dating, Global, or Creator."
      );
    };
    recognition.onresult = (event: any) => {
      const spoken = String(event.results?.[0]?.[0]?.transcript ?? "")
        .toLowerCase()
        .trim();

      const mainMatch = primaryLinks.find(item =>
        spoken.includes(item.label.toLowerCase())
      );
      const legacyMatch = legacyNavigationAliases.find(item =>
        spoken.includes(item.label.toLowerCase())
      );
      const areaMatch = betaExperienceAreas.find(area => {
        const candidates = [area.name, area.eyebrow, ...area.searchTerms]
          .join(" ")
          .toLowerCase();
        return (
          spoken.includes(area.name.toLowerCase()) ||
          area.searchTerms.some(term => spoken.includes(term.toLowerCase())) ||
          candidates.includes(spoken)
        );
      });
      const destination = mainMatch?.route ?? legacyMatch?.route ?? areaMatch?.route;
      const label = mainMatch?.label ?? legacyMatch?.label ?? areaMatch?.name;

      if (destination && label) {
        setVoiceMessage(`Opening ${label}.`);
        setLocation(destination);
      } else {
        setVoiceMessage(`I heard “${spoken}”. Try Social, Chat, Gaming, HopeAI, Wallet, Market, School, Live, Dating, or Explore.`);
      }
    };
    recognition.onerror = () => {
      setVoiceListening(false);
      setVoiceMessage("Voice input was unavailable. Use Explore or Search instead.");
    };
    recognition.onend = () => setVoiceListening(false);
    voiceRecognition.current = recognition;
    recognition.start();
  }

  const currentRoute = routeCatalog.routes.find(route => route.path === location);
  const routeContext = resolveBetaRouteContext(location, currentRoute?.label ?? "");
  const activeArea = routeContext.area;
  const currentRouteLabel =
    currentRoute?.label ??
    (location === "/" ? "Home" : location.split("/").filter(Boolean).join(" / ") || "Home");

  return (
    <nav
      className="sticky top-0 z-50 border-b border-white/10 bg-[#050510]/92 text-white shadow-[0_16px_40px_-28px_rgba(0,0,0,1)] backdrop-blur-xl"
      aria-label="SKYCOIN4444 beta navigation"
    >
      <V3CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
      <span className="sr-only" role="status" aria-live="polite">
        {voiceMessage}
      </span>

      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="SKYCOIN4444 home"
          onClick={recordMarkTap}
          className="flex shrink-0 items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
        >
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-sky-400 via-blue-500 to-violet-600 text-xs font-black text-white shadow-lg shadow-blue-950/40">
            44
          </span>
          <span className="hidden sm:block">
            <strong className="block text-sm font-black tracking-tight">SKYCOIN4444</strong>
            <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-white/35">
              V5 engineering beta
            </span>
          </span>
        </Link>

        <div className="hidden min-w-0 flex-1 items-center justify-center gap-1 xl:flex">
          {primaryLinks.slice(1).map(({ label, route, icon: Icon }) => {
            const active = routeIsActive(location, route);
            return (
              <Link
                key={route}
                href={route}
                aria-current={active ? "page" : undefined}
                className={
                  "inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition " +
                  (active
                    ? "bg-white/10 text-white shadow-inner"
                    : "text-white/48 hover:bg-white/[0.055] hover:text-white/85")
                }
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Link>
            );
          })}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setAreaOpen(open => !open);
              setMobileOpen(false);
            }}
            aria-expanded={areaOpen}
            aria-controls="beta-area-launcher"
            className={
              "hidden items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition md:inline-flex " +
              (areaOpen
                ? "border-sky-300/30 bg-sky-300/10 text-sky-100"
                : "border-white/10 bg-white/[0.035] text-white/65 hover:border-sky-300/20 hover:text-white")
            }
          >
            <Grid2X2 className="h-4 w-4" />
            Areas
          </button>

          <button
            type="button"
            onClick={() => setCommandOpen(true)}
            aria-label="Search all SKYCOIN4444 routes"
            title="Search all routes (Ctrl/⌘ K)"
            className="inline-flex items-center gap-2 rounded-xl border border-sky-300/20 bg-sky-300/[0.07] px-3 py-2 text-xs font-bold text-sky-100 transition hover:border-sky-300/35 hover:bg-sky-300/[0.11]"
          >
            <Search className="h-4 w-4" />
            <span className="hidden md:inline">Search</span>
            <span className="hidden rounded-md border border-white/10 bg-black/20 px-1.5 py-0.5 text-[9px] text-white/35 lg:inline">
              ⌘K
            </span>
          </button>

          <button
            type="button"
            onClick={startVoiceNavigation}
            aria-label={voiceListening ? "Stop voice navigation" : "Start voice navigation"}
            title={voiceMessage || "Voice navigation"}
            className={
              "hidden items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition lg:inline-flex " +
              (voiceListening
                ? "border-rose-300/35 bg-rose-300/10 text-rose-100"
                : "border-white/10 bg-white/[0.035] text-white/55 hover:border-sky-300/20 hover:text-white")
            }
          >
            {voiceListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            {voiceListening ? "Stop" : "Voice"}
          </button>

          <Link
            href={`/beta-feedback?route=${encodeURIComponent(location)}`}
            aria-label="Send beta feedback"
            className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2 text-xs font-bold text-white/55 transition hover:border-sky-300/20 hover:text-white lg:inline-flex"
          >
            <MessageSquare className="h-4 w-4" />
            Feedback
          </Link>

          <Link
            href={isAuthenticated ? "/dashboard" : "/signin"}
            aria-label={
              loading
                ? "Checking beta account"
                : isAuthenticated
                  ? "Open account dashboard"
                  : "Open account sign in"
            }
            className={
              "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 " +
              (isAuthenticated
                ? "border border-emerald-300/20 bg-emerald-300/[0.08] text-emerald-100 hover:bg-emerald-300/[0.13]"
                : "bg-white text-[#050510] hover:bg-white/90")
            }
          >
            {isAuthenticated ? <UserRound className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
            <span className="hidden sm:inline">
              {loading ? "Account" : isAuthenticated ? "Dashboard" : "Sign in"}
            </span>
          </Link>

          <button
            type="button"
            onClick={() => {
              setMobileOpen(open => !open);
              setAreaOpen(false);
            }}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.035] text-white/65 md:hidden"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {location !== "/" ? (
        <div className="border-t border-white/[0.055] bg-white/[0.018]">
          <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-2 text-[11px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-6 lg:px-8">
            <Link
              href={routeContext.parentRoute}
              className="shrink-0 rounded-lg px-2.5 py-1.5 font-black text-sky-100/75 transition hover:bg-white/[0.05] hover:text-sky-100"
            >
              {routeContext.parentLabel}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-white/20" />
            <span className="max-w-[220px] shrink-0 truncate font-bold text-white/55">
              {currentRouteLabel}
            </span>
            <span className="h-1 w-1 shrink-0 rounded-full bg-white/20" />
            {activeArea ? (
              activeArea.highlights.map(link => (
                <Link
                  key={link.route}
                  href={link.route}
                  className={
                    "shrink-0 rounded-lg px-2.5 py-1.5 font-semibold transition " +
                    (location === link.route
                      ? "bg-white/10 text-white"
                      : "text-white/35 hover:bg-white/[0.05] hover:text-white/70")
                  }
                >
                  {link.label}
                </Link>
              ))
            ) : (
              <>
                <span className="shrink-0 text-white/28">
                  This screen is in the legacy route library.
                </span>
                <Link
                  href="/platform-map"
                  className="shrink-0 rounded-lg bg-sky-300/[0.08] px-2.5 py-1.5 font-bold text-sky-100/75 hover:bg-sky-300/[0.12]"
                >
                  Find its product area
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}

      {areaOpen ? (
        <div id="beta-area-launcher" className="absolute left-0 right-0 top-full hidden border-b border-white/10 bg-[#070712]/98 shadow-2xl shadow-black/50 backdrop-blur-xl md:block">
          <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-sky-200/50">Ecosystem areas</p>
                <h2 className="mt-1 text-lg font-black tracking-tight">Go somewhere useful</h2>
              </div>
              <Link href="/platform-map" className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-200/75 hover:text-sky-100">
                Full Explore <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-5 grid gap-2 md:grid-cols-3 lg:grid-cols-4">
              {betaExperienceAreas.map(area => {
                const active = areaIsActive(location, area);
                return (
                  <Link
                    key={area.id}
                    href={area.route}
                    className={
                      "group flex items-center gap-3 rounded-2xl border p-3 transition " +
                      (active
                        ? "border-sky-300/25 bg-sky-300/[0.08]"
                        : "border-white/[0.07] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.045]")
                    }
                  >
                    <span className={`h-2 w-2 shrink-0 rounded-full ${statusDot(area)}`} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold text-white/85">{area.name}</span>
                      <span className="mt-0.5 block truncate text-[10px] text-white/32">{area.eyebrow}</span>
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-white/15 transition group-hover:translate-x-0.5 group-hover:text-white/40" />
                  </Link>
                );
              })}
            </div>

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/[0.06] pt-4 text-[10px] text-white/35">
              {(["core_beta", "controlled_beta", "preview"] as const).map(status => (
                <span key={status} className="inline-flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${status === "core_beta" ? "bg-emerald-300" : status === "controlled_beta" ? "bg-amber-300" : "bg-slate-400"}`} />
                  {betaExperienceStatusCopy[status].label}
                </span>
              ))}
              <span className="text-white/25">Status describes the beta surface, not production certification.</span>
            </div>
          </div>
        </div>
      ) : null}

      {mobileOpen ? (
        <div className="border-t border-white/[0.06] bg-[#070712] md:hidden">
          <div className="grid grid-cols-2 gap-2 p-3">
            {primaryLinks.map(({ label, route, icon: Icon }) => (
              <Link
                key={route}
                href={route}
                className={
                  "flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-bold " +
                  (routeIsActive(location, route) ? "bg-sky-300/10 text-sky-100" : "bg-white/[0.03] text-white/55")
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
            <Link href="/platform-map" className="flex items-center gap-2 rounded-xl bg-white/[0.03] px-3 py-3 text-sm font-bold text-white/55">
              <Grid2X2 className="h-4 w-4" />
              All areas
            </Link>
            <button type="button" onClick={startVoiceNavigation} className="flex items-center gap-2 rounded-xl bg-white/[0.03] px-3 py-3 text-left text-sm font-bold text-white/55">
              {voiceListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              Voice
            </button>
            <Link href={`/beta-feedback?route=${encodeURIComponent(location)}`} className="col-span-2 flex items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-3 text-sm font-bold text-white/60">
              <MessageSquare className="h-4 w-4" />
              Send beta feedback
            </Link>
          </div>
        </div>
      ) : null}

      {fourFoursOpen ? (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-[#020208]/92 p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="four-fours-title">
          <div className="max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-sky-300/20 bg-[#080817] p-5 shadow-2xl shadow-blue-950/50 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-violet-300/15 bg-violet-300/[0.06] px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-violet-100/60">
                  <Sparkles className="h-3.5 w-3.5" />
                  44 · 44
                </div>
                <h2 id="four-fours-title" className="mt-4 text-2xl font-black tracking-tight text-white sm:text-3xl">You found the Four Fours.</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">Four small notes hidden behind the mark. No score, no reward, no tracking—just something worth leaving in the ecosystem.</p>
              </div>
              <button type="button" aria-label="Close Four Fours Easter egg" onClick={() => setFourFoursOpen(false)} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-white/55 hover:bg-white/[0.08] hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {fourFoursTrail.map(item => (
                <article key={item.number} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
                  <span className="text-[10px] font-black uppercase tracking-[0.22em] text-sky-200/45">{item.number}</span>
                  <h3 className="mt-2 text-base font-black text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/45">{item.message}</p>
                  <Link href={item.href} onClick={() => setFourFoursOpen(false)} className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-sky-200/75 hover:text-sky-100">
                    {item.action} <ChevronRight className="h-4 w-4" />
                  </Link>
                </article>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-white/[0.06] bg-black/20 p-4">
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
