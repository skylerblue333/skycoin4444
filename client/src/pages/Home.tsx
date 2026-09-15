/*
 * Product launchpad: evidence-led SKYCOIN4444 beta navigation. Link only to
 * working or explicitly controlled surfaces; never imply unavailable providers.
 */
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Bot,
  Boxes,
  Compass,
  CheckCircle2,
  GraduationCap,
  Gamepad2,
  Heart,
  Languages,
  LayoutDashboard,
  MessageSquare,
  Radio,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { Link } from "wouter";
import ThreeLightsEasterEgg from "@/components/ThreeLightsEasterEgg";
import KayleeQuietStar from "@/components/KayleeQuietStar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const experiences = [
  {
    title: "Social & Community",
    kicker: "Facebook-style participation",
    description:
      "Publish persisted posts, react, reply, and move into community spaces from one account-aware flow.",
    href: "/activity-feed",
    status: "Working beta",
    icon: Users,
  },
  {
    title: "SkyLive",
    kicker: "Small-room WebRTC broadcasting",
    description:
      "Start an authenticated small-room broadcast with real peer media, presence, and live chat.",
    href: "/live",
    status: "WebRTC beta",
    icon: Radio,
  },
  {
    title: "SkySchool",
    kicker: "Learning that is usable now",
    description:
      "Browse authored lessons, complete deterministic assessment work, and exercise the learning journey.",
    href: "/sky-school",
    status: "Working beta",
    icon: GraduationCap,
  },
  {
    title: "SkyGaming",
    kicker: "Deterministic arcade lab",
    description:
      "Play tested local game experiences without real-money wagering, token payouts, custody, or production multiplayer.",
    href: "/gaming",
    status: "Local test lab",
    icon: Gamepad2,
  },
  {
    title: "SkyMarket",
    kicker: "Modern commerce rehearsal",
    description:
      "Search a labeled fixture catalog, build a persistent local cart, and inspect deterministic checkout math.",
    href: "/beta-commerce",
    status: "Controlled sandbox",
    icon: ShoppingBag,
  },
  {
    title: "Language Exchange",
    kicker: "Tandem-style practice planning",
    description:
      "Save a language profile and generate a balanced practice plan without inventing unavailable partners.",
    href: "/language-partner-discovery",
    status: "Local test lab",
    icon: Languages,
  },
  {
    title: "SkyDating",
    kicker: "Safety-first onboarding",
    description:
      "Build and restore an adult-only dating profile draft with clear validation and storage boundaries.",
    href: "/dating-profile-setup",
    status: "Local test lab",
    icon: Heart,
  },
  {
    title: "Digital Assets",
    kicker: "Coinbase-style clarity",
    description:
      "Inspect labeled local and testnet evidence while custody, signing, transfers, and settlement remain gated.",
    href: "/beta-web3",
    status: "Controlled sandbox",
    icon: Boxes,
  },
  {
    title: "HopeAI Lab",
    kicker: "Safe local AI workspace",
    description:
      "Explore the verified AI sandbox while provider-backed actions remain explicitly separated from local behavior.",
    href: "/hope-a-i",
    status: "Controlled lab",
    icon: Bot,
  },
] as const;

const stats = [
  { value: "67", label: "launchable beta routes" },
  { value: "9", label: "headline journeys" },
  { value: "1", label: "unified workspace" },
  { value: "0", label: "missing routed source files" },
] as const;

const coreLoops = [
  {
    number: "01",
    title: "Connect",
    description: "Publish, reply, react, and build a real account-owned community identity.",
    href: "/activity-feed",
    accent: "from-sky-400/25 to-blue-500/10",
    icon: Users,
  },
  {
    number: "02",
    title: "Learn",
    description: "Complete lessons, keep your progress, and turn curiosity into a repeatable habit.",
    href: "/course-catalog",
    accent: "from-emerald-400/25 to-cyan-500/10",
    icon: GraduationCap,
  },
  {
    number: "03",
    title: "Play",
    description: "Build skill and streaks in deterministic games designed for short, replayable sessions.",
    href: "/gaming",
    accent: "from-violet-400/25 to-fuchsia-500/10",
    icon: Gamepad2,
  },
  {
    number: "04",
    title: "Create",
    description: "Open a small-room creator broadcast with real peer media, presence, and live chat.",
    href: "/live",
    accent: "from-amber-400/25 to-rose-500/10",
    icon: Radio,
  },
] as const;

const dailyMissions = [
  { id: "learn", label: "Complete one SkySchool lesson", detail: "Build a useful idea in under 10 minutes.", href: "/course-catalog", icon: GraduationCap },
  { id: "play", label: "Play one Arcade Lab round", detail: "Keep the session short and replayable.", href: "/gaming", icon: Gamepad2 },
  { id: "connect", label: "Leave one thoughtful community post", detail: "Add signal to the social loop.", href: "/activity-feed", icon: Users },
  { id: "create", label: "Visit a Live room or start one", detail: "See the real-time creator path.", href: "/live", icon: Radio },
] as const;

const localDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function Home() {
  const [completedMissions, setCompletedMissions] = useState<string[]>([]);
  const [showReset, setShowReset] = useState(false);
  const [missionDate, setMissionDate] = useState("");
  const [missionsHydrated, setMissionsHydrated] = useState(false);

  useEffect(() => {
    try {
      const today = localDateKey(new Date());
      const saved = localStorage.getItem("sky4444.daily-missions");
      const savedDate = localStorage.getItem("sky4444.daily-missions-date");
      setMissionDate(today);
      if (saved && savedDate === today) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const validMissionIds = new Set<string>(dailyMissions.map(mission => mission.id));
          setCompletedMissions(parsed.filter((item): item is string => typeof item === "string" && validMissionIds.has(item)));
        }
      }
    } catch {
      setCompletedMissions([]);
    } finally {
      setMissionsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!missionsHydrated || !missionDate) return;
    try {
      localStorage.setItem("sky4444.daily-missions", JSON.stringify(completedMissions));
      localStorage.setItem("sky4444.daily-missions-date", missionDate);
    } catch {
      // Private browsing and quota-restricted contexts should not break the launchpad.
    }
  }, [completedMissions, missionDate, missionsHydrated]);

  const completion = Math.round((completedMissions.length / dailyMissions.length) * 100);
  const dayLabel = useMemo(() => new Intl.DateTimeFormat("en-US", { weekday: "long", month: "short", day: "numeric" }).format(new Date()), []);
  const toggleMission = (id: string) => setCompletedMissions(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
  const resetMissions = () => { setCompletedMissions([]); setShowReset(false); };
  const nextMission = dailyMissions.find(mission => !completedMissions.includes(mission.id)) ?? dailyMissions[0];

  return (
    <main className="min-h-screen overflow-hidden bg-[#050510] text-white">
      <section className="relative border-b border-white/10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-10rem] top-[-8rem] h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute right-[-8rem] top-10 h-80 w-80 rounded-full bg-violet-600/20 blur-3xl" />
          <div className="absolute left-1/2 top-32 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-24">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="border-sky-300/30 bg-sky-300/[0.06] text-sky-100"
              >
                SKYCOIN4444 engineering beta
              </Badge>
              <Badge
                variant="outline"
                className="border-emerald-300/25 bg-emerald-300/[0.05] text-emerald-100"
              >
                Navigable tester surface
              </Badge>
            </div>

            <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              One ecosystem.
              <span className="block bg-gradient-to-r from-sky-300 via-blue-300 to-violet-300 bg-clip-text text-transparent">
                Real paths you can use.
              </span>
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-white/60 sm:text-lg">
              SKYCOIN4444 is a social learning arcade with creator rooms: connect
              with people, learn something useful, play a short session, and make
              something worth returning to. The wider ecosystem is available as
              clearly labeled labs—not inflated promises.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/onboarding">
                <Button
                  size="lg"
                  className="bg-white text-[#050510] hover:bg-white/90"
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Start the beta journey
                </Button>
              </Link>
              <Link href="/activity-feed">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/15 bg-white/[0.04] text-white hover:bg-white/10"
                >
                  See the core loop
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/advanced-search">
                <Button
                  size="lg"
                  variant="ghost"
                  className="text-white/65 hover:bg-white/[0.06] hover:text-white"
                >
                  Browse wider labs · 67 beta routes
                </Button>
              </Link>
            </div>

            <p className="mt-5 max-w-2xl text-xs leading-5 text-white/35">
              No invented users, traffic, balances, sellers, viewers, matches,
              payments, custody, production-chain writes, or provider activity.
            </p>
          </div>

          <Card className="border-white/10 bg-white/[0.055] text-white shadow-2xl shadow-blue-950/30">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-sky-400/20 to-violet-500/20 text-sky-200">
                  <Compass className="h-5 w-5" />
                </span>
                <Badge
                  variant="outline"
                  className="border-white/10 text-white/55"
                >
                  Best starting point
                </Badge>
              </div>
              <CardTitle className="mt-3 text-2xl text-white">
                Competitive Ecosystem Beta
              </CardTitle>
              <CardDescription className="text-white/55">
                A guided test loop across the strongest evidence-backed product
                journeys.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                "Create or use a beta account.",
                "Test one headline journey end to end.",
                "Refresh after saves to verify the stated persistence model.",
                "Mark the area tested in the workspace.",
                "Send feedback with the exact evidence gap.",
              ].map((step, index) => (
                <div
                  key={step}
                  className="flex gap-3 rounded-xl border border-white/[0.08] bg-black/20 p-3.5"
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white/[0.08] text-xs font-black text-sky-200">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-6 text-white/65">{step}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="relative mx-auto grid max-w-7xl grid-cols-2 border-t border-white/[0.07] px-4 sm:grid-cols-4">
          {stats.map(stat => (
            <div
              key={stat.label}
              className="border-white/[0.07] px-4 py-5 first:border-l-0 sm:border-l"
            >
              <strong className="block text-2xl font-black text-white">
                {stat.value}
              </strong>
              <span className="mt-1 block text-xs leading-5 text-white/40">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="relative border-b border-white/[0.07] bg-gradient-to-b from-white/[0.025] to-transparent">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:py-16">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-200/65">
              The core product
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Four actions that make the ecosystem worth returning to.
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/45">
              Start here. Each loop has a concrete result, an account-aware path,
              and a clear next step. The rest of SKYCOIN4444 stays available for
              exploration without competing for attention.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {coreLoops.map(({ number, title, description, href, accent, icon: Icon }) => (
              <Link key={title} href={href} className="group">
                <Card className="h-full border-white/10 bg-white/[0.035] text-white transition duration-200 group-hover:-translate-y-1 group-hover:border-white/20 group-hover:bg-white/[0.06]">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <span className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${accent} text-white`}>
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="text-xs font-black tracking-[0.18em] text-white/25">
                        {number}
                      </span>
                    </div>
                    <CardTitle className="mt-5 text-white">{title}</CardTitle>
                    <CardDescription className="leading-6 text-white/50">
                      {description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <span className="inline-flex items-center text-sm font-bold text-sky-200">
                      Open loop
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-b border-white/[0.07] bg-[#070719]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-200/70"><Zap className="h-4 w-4" /> Daily launchpad</div>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Make today count.</h2>
              <p className="mt-4 text-sm leading-7 text-white/50">A small four-step run turns the ecosystem from a menu into a habit. Check off what you complete; this progress stays on this device and makes no activity or audience claim.</p>
              <div className="mt-6 flex items-end gap-4"><div className="text-5xl font-black text-white">{completion}%</div><div className="pb-1 text-sm text-white/40">{dayLabel}<br />{completedMissions.length} of {dailyMissions.length} complete</div></div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-amber-300 to-sky-300 transition-all" style={{ width: `${completion}%` }} /></div>
              <div className="mt-5 flex flex-wrap gap-2"><Link href={nextMission.href}><Button className="bg-white text-[#050510] hover:bg-white/90">{completedMissions.length === dailyMissions.length ? "Replay today's run" : "Continue next mission"}<ArrowRight className="ml-2 h-4 w-4" /></Button></Link><Button variant="outline" onClick={() => setShowReset(current => !current)} className="border-white/15 bg-white/[0.03] text-white"><RotateCcw className="mr-2 h-4 w-4" />Reset run</Button>{showReset ? <Button variant="ghost" onClick={resetMissions} className="text-rose-200 hover:bg-rose-300/10 hover:text-rose-100">Confirm reset</Button> : null}</div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {dailyMissions.map(({ id, label, detail, href }, index) => {
                const complete = completedMissions.includes(id);
                return <div key={id} className={"rounded-2xl border p-4 transition " + (complete ? "border-emerald-300/25 bg-emerald-300/[0.06]" : "border-white/10 bg-white/[0.035]")}>
                  <div className="flex items-start gap-3"><button type="button" onClick={() => toggleMission(id)} aria-label={complete ? `Mark mission ${index + 1} incomplete` : `Mark mission ${index + 1} complete`} className={"grid h-9 w-9 shrink-0 place-items-center rounded-xl " + (complete ? "bg-emerald-300/15 text-emerald-200" : "bg-white/[0.07] text-white/50")}>{complete ? <CheckCircle2 className="h-5 w-5" /> : <span className="text-sm font-black">0{index + 1}</span>}</button><div><p className={"font-bold " + (complete ? "text-emerald-100" : "text-white")}>{label}</p><p className="mt-1 text-xs leading-5 text-white/40">{detail}</p></div></div>
                  <Link href={href} className="mt-4 inline-flex items-center text-xs font-bold text-sky-200 hover:text-white">Open experience <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
                </div>;
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-200/65">
              Headline ecosystem
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Explore the wider ecosystem.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-white/45">
            The core loop is the product. These additional labs are available for
            testing with explicit boundaries, so breadth never disguises what is
            genuinely usable today.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {experiences.map(({ title, kicker, description, href, status, icon: Icon }) => (
            <Link key={title} href={href} className="group">
              <Card className="h-full border-white/10 bg-white/[0.035] text-white transition duration-200 group-hover:-translate-y-1 group-hover:border-sky-300/30 group-hover:bg-white/[0.055]">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/[0.07] text-sky-200 transition group-hover:bg-sky-300/10">
                      <Icon className="h-5 w-5" />
                    </span>
                    <Badge
                      variant="outline"
                      className="border-white/10 text-[10px] text-white/50"
                    >
                      {status}
                    </Badge>
                  </div>
                  <div className="pt-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-200/55">
                      {kicker}
                    </p>
                    <CardTitle className="mt-1 text-white">{title}</CardTitle>
                  </div>
                  <CardDescription className="leading-6 text-white/50">
                    {description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <span className="inline-flex items-center text-sm font-bold text-sky-200">
                    Open experience
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-white/[0.07] bg-white/[0.018]">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 py-12 lg:grid-cols-3">
          <Card className="border-emerald-300/15 bg-emerald-300/[0.035] text-white">
            <CardHeader>
              <ShieldCheck className="h-5 w-5 text-emerald-200" />
              <CardTitle className="mt-2 text-white">
                Truthful by default
              </CardTitle>
              <CardDescription className="text-white/50">
                Promoted routes show persisted records, deterministic local
                behavior, or explicit controlled fixtures—not fabricated scale.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-violet-300/15 bg-violet-300/[0.035] text-white">
            <CardHeader>
              <Sparkles className="h-5 w-5 text-violet-200" />
              <CardTitle className="mt-2 text-white">
                One visual system
              </CardTitle>
              <CardDescription className="text-white/50">
                Shared navigation, cards, controls, spacing, and interaction
                patterns make the strongest beta areas feel related.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-sky-300/15 bg-sky-300/[0.035] text-white">
            <CardHeader>
              <MessageSquare className="h-5 w-5 text-sky-200" />
              <CardTitle className="mt-2 text-white">
                Feedback closes the loop
              </CardTitle>
              <CardDescription className="text-white/50">
                Bugs, privacy concerns, safety issues, and evidence gaps have a
                visible route back into the beta process.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/beta-feedback"
                className="inline-flex items-center text-sm font-bold text-sky-200"
              >
                Open feedback
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/10 via-white/[0.035] to-violet-500/10 p-7 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-200/65">
                Keep moving
              </p>
              <h2 className="mt-2 text-3xl font-black">
                The website now has a clear front door and a clear way back.
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-white/50">
                Use the workspace as mission control, jump directly into the
                nine headline journeys, and keep high-risk production actions
                gated until the evidence exists.
              </p>
            </div>
            <Link href="/beta-workspace">
              <Button
                size="lg"
                className="w-full bg-white text-[#050510] hover:bg-white/90 lg:w-auto"
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Enter workspace
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <ThreeLightsEasterEgg />
      <KayleeQuietStar />
    </main>
  );
}
