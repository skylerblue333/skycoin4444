/*
 * Flagship launchpad for the SKYCOIN4444 engineering beta.
 * The visual system is intentionally ambitious while capability claims remain evidence-led.
 */
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Bot,
  Boxes,
  CheckCircle2,
  Compass,
  Gamepad2,
  GraduationCap,
  Heart,
  Languages,
  LayoutDashboard,
  MessageCircleMore,
  Radio,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { Link } from "wouter";
import routeCatalog from "@/data/routeCatalog.json";
import ThreeLightsEasterEgg from "@/components/ThreeLightsEasterEgg";
import KayleeQuietStar from "@/components/KayleeQuietStar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const flagshipAreas = [
  {
    title: "Social",
    subtitle: "Posts, replies, reactions",
    href: "/activity-feed",
    icon: Users,
    status: "Account-aware beta",
  },
  {
    title: "Chat",
    subtitle: "Unified messaging surface",
    href: "/unified-messaging",
    icon: MessageCircleMore,
    status: "Beta surface",
  },
  {
    title: "Gaming",
    subtitle: "Six flagship demo-credit games",
    href: "/gaming",
    icon: Gamepad2,
    status: "Playable beta",
  },
  {
    title: "SkySchool",
    subtitle: "Lessons and assessment flows",
    href: "/sky-school",
    icon: GraduationCap,
    status: "Working beta",
  },
  {
    title: "SkyLive",
    subtitle: "Small-room WebRTC creator flow",
    href: "/live",
    icon: Radio,
    status: "Bounded beta",
  },
  {
    title: "HopeAI",
    subtitle: "Controlled assistant workspace",
    href: "/hope-a-i",
    icon: Bot,
    status: "Controlled lab",
  },
  {
    title: "Market",
    subtitle: "Commerce rehearsal",
    href: "/beta-commerce",
    icon: ShoppingBag,
    status: "Sandbox",
  },
  {
    title: "Web3",
    subtitle: "Wallet and chain evidence",
    href: "/beta-web3",
    icon: Boxes,
    status: "Controlled sandbox",
  },
  {
    title: "Dating",
    subtitle: "Adult-only profile workflow",
    href: "/dating-profile-setup",
    icon: Heart,
    status: "Safety-first beta",
  },
  {
    title: "Language Exchange",
    subtitle: "Practice profile and discovery planning",
    href: "/language-partner-discovery",
    icon: Languages,
    status: "Local beta",
  },
] as const;

const systemPillars = [
  {
    title: "One connected shell",
    description: "Global navigation keeps major product areas one tap away instead of scattering testers across disconnected demos.",
    icon: LayoutDashboard,
  },
  {
    title: "Evidence over fake metrics",
    description: "No invented balances, viewers, matches, payouts, traffic, users, or external-provider activity.",
    icon: ShieldCheck,
  },
  {
    title: "Desktop + mobile first",
    description: "Dense control-room layouts collapse into touch-friendly cards and a persistent mobile dock.",
    icon: Sparkles,
  },
] as const;

const missions = [
  { id: "social", label: "Post or reply once", href: "/activity-feed", icon: Users },
  { id: "learn", label: "Complete one lesson", href: "/course-catalog", icon: GraduationCap },
  { id: "play", label: "Play one flagship game", href: "/gaming", icon: Gamepad2 },
  { id: "explore", label: "Open one new product area", href: "/platform-map", icon: Compass },
] as const;

function localDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function Home() {
  const [completed, setCompleted] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [showReset, setShowReset] = useState(false);

  useEffect(() => {
    try {
      const today = localDateKey(new Date());
      const storedDate = localStorage.getItem("sky4444.daily-missions-date");
      const stored = localStorage.getItem("sky4444.daily-missions");
      if (stored && storedDate === today) {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const allowed = new Set<string>(missions.map(mission => mission.id));
          setCompleted(parsed.filter((value): value is string => typeof value === "string" && allowed.has(value)));
        }
      }
    } catch {
      setCompleted([]);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem("sky4444.daily-missions", JSON.stringify(completed));
      localStorage.setItem("sky4444.daily-missions-date", localDateKey(new Date()));
    } catch {
      // Local storage is an optional convenience only.
    }
  }, [completed, hydrated]);

  const completion = Math.round((completed.length / missions.length) * 100);
  const dayLabel = useMemo(
    () => new Intl.DateTimeFormat("en-US", { weekday: "long", month: "short", day: "numeric" }).format(new Date()),
    []
  );
  const nextMission = missions.find(mission => !completed.includes(mission.id)) ?? missions[0];

  const toggleMission = (id: string) => {
    setCompleted(current =>
      current.includes(id) ? current.filter(value => value !== id) : [...current, id]
    );
  };

  return (
    <main className="sky-app-surface min-h-screen overflow-hidden text-white">
      <div className="sky-grid-bg pointer-events-none absolute inset-0 -z-10 opacity-70" />

      <section className="relative border-b border-amber-200/10">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(circle_at_50%_0%,rgba(190,54,39,0.24),transparent_62%)]" />

        <div className="mx-auto max-w-7xl px-4 pb-14 pt-10 sm:px-6 lg:px-8 lg:pb-20 lg:pt-16">
          <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="border border-amber-200/20 bg-amber-200/[0.08] text-amber-100">
                  SKYCOIN4444 / UNIFIED BETA
                </Badge>
                <Badge variant="outline" className="border-emerald-300/18 bg-emerald-300/[0.05] text-emerald-100">
                  Hosted engineering beta
                </Badge>
              </div>

              <p className="sky-eyebrow mt-6">One ecosystem · one command center</p>
              <h1 className="mt-3 max-w-4xl text-5xl font-black leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
                Make the beta feel like
                <span className="sky-gold-text block">one serious product.</span>
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-white/58 sm:text-lg">
                Social, chat, live, learning, gaming, commerce, Web3, dating, language exchange,
                and HopeAI now share a denser premium shell inspired by the red-and-gold control-room
                direction—without copying unsupported claims from the reference artwork.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/dashboard">
                  <Button size="lg" className="sky-action-glow">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Open command center
                  </Button>
                </Link>
                <Link href="/gaming">
                  <Button size="lg" variant="outline" className="text-white">
                    <Gamepad2 className="mr-2 h-4 w-4" />
                    Play flagship games
                  </Button>
                </Link>
                <Link href="/platform-map">
                  <Button size="lg" variant="ghost" className="text-white/68">
                    Explore {routeCatalog.routes.length.toLocaleString()} routes
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <div className="mt-8 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  [routeCatalog.routes.length.toLocaleString(), "indexed routes"],
                  ["10", "headline areas"],
                  ["6", "flagship games"],
                  ["1", "unified shell"],
                ].map(([value, label]) => (
                  <div key={label} className="sky-kpi rounded-2xl px-4 py-4">
                    <strong className="block text-2xl font-black text-amber-100">{value}</strong>
                    <span className="mt-1 block text-[11px] font-semibold uppercase tracking-[0.12em] text-white/35">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="sky-panel sky-red-glow relative overflow-hidden rounded-[2rem] p-4 sm:p-5">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-500/70 via-amber-300 to-red-500/70" />
              <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] pb-4">
                <div>
                  <p className="sky-eyebrow">Live app direction</p>
                  <h2 className="mt-1 text-xl font-black">SKY44 Command Center</h2>
                </div>
                <div className="grid h-12 w-12 place-items-center rounded-2xl border border-amber-200/20 bg-gradient-to-br from-amber-300 via-yellow-400 to-red-500 text-sm font-black text-[#1b0d04]">
                  44
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-[0.82fr_1.18fr]">
                <div className="space-y-2">
                  {flagshipAreas.slice(0, 5).map(({ title, subtitle, href, icon: Icon }) => (
                    <Link
                      key={title}
                      href={href}
                      className="group flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-black/20 p-3 transition hover:-translate-y-0.5 hover:border-amber-200/20 hover:bg-amber-200/[0.045]"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-amber-200/12 bg-amber-200/[0.055] text-amber-100">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <strong className="block truncate text-sm">{title}</strong>
                        <span className="block truncate text-[10px] text-white/35">{subtitle}</span>
                      </span>
                    </Link>
                  ))}
                </div>

                <div className="rounded-[1.8rem] border border-amber-200/16 bg-[#090707] p-3 shadow-2xl shadow-black/45">
                  <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-white/10" />
                  <div className="rounded-2xl border border-white/[0.07] bg-gradient-to-br from-red-500/[0.10] via-white/[0.025] to-amber-300/[0.06] p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-100/55">Today</p>
                    <div className="mt-2 flex items-end justify-between gap-3">
                      <div>
                        <strong className="text-3xl font-black">{completion}%</strong>
                        <p className="mt-1 text-xs text-white/36">daily beta loop complete</p>
                      </div>
                      <div className="rounded-full border border-amber-200/20 bg-amber-200/[0.06] px-3 py-1 text-[10px] font-black text-amber-100">
                        {completed.length}/{missions.length}
                      </div>
                    </div>
                    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                      <div className="h-full rounded-full bg-gradient-to-r from-red-500 via-amber-300 to-yellow-300" style={{ width: `${completion}%` }} />
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {flagshipAreas.slice(5).map(({ title, href, icon: Icon }) => (
                      <Link key={title} href={href} className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3 text-center transition hover:border-amber-200/18 hover:bg-amber-200/[0.04]">
                        <Icon className="mx-auto h-4 w-4 text-amber-100/80" />
                        <span className="mt-2 block text-[11px] font-bold">{title}</span>
                      </Link>
                    ))}
                  </div>

                  <Link href={nextMission.href} className="mt-3 flex items-center justify-between rounded-2xl border border-red-400/18 bg-red-500/[0.07] p-3 text-sm font-bold text-red-50">
                    Continue next mission
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <p className="mt-4 text-center text-[10px] leading-5 text-white/24">
                No fake account balance, APY, income-share, official-government affiliation, custody,
                or production-scale activity is presented here.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/[0.06] bg-black/10">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-3">
            {systemPillars.map(({ title, description, icon: Icon }) => (
              <article key={title} className="sky-panel rounded-3xl p-5">
                <span className="grid h-11 w-11 place-items-center rounded-2xl border border-amber-200/12 bg-amber-200/[0.055] text-amber-100">
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="mt-4 text-lg font-black">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-white/42">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="sky-eyebrow">Ecosystem launch grid</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Ten places worth tapping first.</h2>
          </div>
          <Link href="/platform-map" className="inline-flex items-center gap-2 text-sm font-bold text-amber-100/75 hover:text-amber-50">
            Full product map <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {flagshipAreas.map(({ title, subtitle, href, icon: Icon, status }, index) => (
            <Link
              key={title}
              href={href}
              className="sky-panel-soft group rounded-3xl p-5 transition duration-200 hover:-translate-y-1 hover:border-amber-200/18 hover:bg-amber-200/[0.035]"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-2xl border border-amber-200/12 bg-gradient-to-br from-amber-200/[0.09] to-red-500/[0.07] text-amber-100">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-xs font-black tracking-[0.2em] text-white/16">0{index + 1}</span>
              </div>
              <h3 className="mt-5 text-xl font-black">{title}</h3>
              <p className="mt-1 text-sm text-white/40">{subtitle}</p>
              <div className="mt-5 flex items-center justify-between gap-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.13em] text-amber-100/50">{status}</span>
                <ArrowRight className="h-4 w-4 text-white/25 transition-transform group-hover:translate-x-1 group-hover:text-amber-100" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-white/[0.06] bg-gradient-to-b from-red-500/[0.035] to-transparent">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <div className="inline-flex items-center gap-2 text-amber-100/75">
              <Zap className="h-4 w-4" />
              <span className="sky-eyebrow">Daily launchpad</span>
            </div>
            <h2 className="mt-3 text-3xl font-black tracking-tight">A four-step loop, not a wall of features.</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/43">
              Use this as a simple tester routine. Completion is stored on this device only; it is not a user-activity or engagement metric.
            </p>

            <div className="mt-6 flex items-end gap-4">
              <strong className="sky-gold-text text-6xl font-black">{completion}%</strong>
              <div className="pb-1 text-xs leading-5 text-white/35">
                {dayLabel}<br />
                {completed.length} of {missions.length} complete
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Link href={nextMission.href}>
                <Button>
                  Continue run <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" className="text-white" onClick={() => setShowReset(value => !value)}>
                <RotateCcw className="mr-1 h-4 w-4" /> Reset
              </Button>
              {showReset ? (
                <Button
                  variant="ghost"
                  className="text-red-100"
                  onClick={() => {
                    setCompleted([]);
                    setShowReset(false);
                  }}
                >
                  Confirm reset
                </Button>
              ) : null}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {missions.map(({ id, label, href, icon: Icon }, index) => {
              const done = completed.includes(id);
              return (
                <article
                  key={id}
                  className={
                    "rounded-3xl border p-4 transition " +
                    (done
                      ? "border-amber-200/18 bg-amber-200/[0.055]"
                      : "border-white/[0.07] bg-white/[0.022]")
                  }
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      aria-label={done ? `Mark ${label} incomplete` : `Mark ${label} complete`}
                      onClick={() => toggleMission(id)}
                      className={
                        "grid h-11 w-11 shrink-0 place-items-center rounded-2xl border transition " +
                        (done
                          ? "border-amber-200/20 bg-amber-200/[0.10] text-amber-100"
                          : "border-white/[0.08] bg-black/20 text-white/38 hover:border-amber-200/18")
                      }
                    >
                      {done ? <CheckCircle2 className="h-5 w-5" /> : <span className="text-xs font-black">0{index + 1}</span>}
                    </button>
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-black">{label}</h3>
                      <Link href={href} className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-amber-100/55 hover:text-amber-50">
                        Open area <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="sky-panel rounded-[2rem] p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <p className="sky-eyebrow">Truth boundary</p>
              <h2 className="mt-2 text-3xl font-black">Premium presentation, careful claims.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/43">
                This redesign can look ambitious without pretending the engineering beta has live payment settlement,
                custody, production blockchain execution, identity verification, audited compliance, global-scale streaming,
                or guaranteed external AI connectivity.
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {[
                ["Design", "red + gold control-room system"],
                ["Navigation", "one shell across product areas"],
                ["Mobile", "touch-first dock + dense cards"],
                ["Claims", "evidence-led beta language"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/[0.07] bg-black/20 p-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.16em] text-white/25">{label}</span>
                  <p className="mt-2 text-sm font-bold text-amber-50/85">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="pb-8">
        <ThreeLightsEasterEgg />
        <KayleeQuietStar />
      </div>
    </main>
  );
}
