/*
 * Product launchpad: evidence-led SKYCOIN4444 beta navigation. Link only to
 * working or explicitly controlled surfaces; never imply unavailable providers.
 */
import {
  ArrowRight,
  Bot,
  Boxes,
  Compass,
  GraduationCap,
  Gamepad2,
  Heart,
  Languages,
  LayoutDashboard,
  MessageSquare,
  Radio,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Users,
} from "lucide-react";
import { Link } from "wouter";
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
    title: "SkyLive Studio",
    kicker: "Twitch-style creator setup",
    description:
      "Preview local camera and microphone devices, prepare a stream brief, and test creator setup safely.",
    href: "/live-streaming",
    status: "Local test lab",
    icon: Radio,
  },
  {
    title: "SkySchool",
    kicker: "Learning that is usable now",
    description:
      "Browse authored lessons, complete deterministic assessment work, and exercise the learning journey.",
    href: "/course-catalog",
    status: "Working beta",
    icon: GraduationCap,
  },
  {
    title: "SkyGaming",
    kicker: "Deterministic arcade lab",
    description:
      "Play tested local game experiences without real-money wagering, token payouts, custody, or production multiplayer.",
    href: "/arcade",
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
    href: "/a-i-tools-hub",
    status: "Controlled lab",
    icon: Bot,
  },
] as const;

const stats = [
  { value: "23", label: "launchable beta routes" },
  { value: "9", label: "headline journeys" },
  { value: "1", label: "unified workspace" },
  { value: "0", label: "missing routed source files" },
] as const;

export default function Home() {
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
              Move through social, live creator tools, learning, gaming, commerce,
              language exchange, dating, digital-asset evidence, and HopeAI
              without getting lost in the wider historical screen inventory.
              Every promoted journey is labeled by what it actually proves.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/beta-workspace">
                <Button
                  size="lg"
                  className="bg-white text-[#050510] hover:bg-white/90"
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Open ecosystem workspace
                </Button>
              </Link>
              <Link href="/activity-feed">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/15 bg-white/[0.04] text-white hover:bg-white/10"
                >
                  Start with social
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/beta-catalog">
                <Button
                  size="lg"
                  variant="ghost"
                  className="text-white/65 hover:bg-white/[0.06] hover:text-white"
                >
                  Browse all 23 beta routes
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

      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-200/65">
              Headline ecosystem
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Pick an area and actually use it.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-white/45">
            The persistent navigation above stays available as you move between
            areas, so the beta behaves like one product instead of a pile of
            disconnected routes.
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
    </main>
  );
}
