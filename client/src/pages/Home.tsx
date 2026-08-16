import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  GraduationCap,
  LayoutDashboard,
  LockKeyhole,
  MessageCircle,
  Orbit,
  ShieldCheck,
  Sparkles,
  WalletCards,
  Waves,
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const pillars = [
  {
    title: "Your daily command center",
    description: "See your next useful action, account state, and shortcuts in one focused dashboard.",
    href: "/dashboard",
    icon: LayoutDashboard,
    tone: "from-fuchsia-500/20 to-violet-500/10 border-fuchsia-400/30",
    status: "Ready to explore",
  },
  {
    title: "Learn and build momentum",
    description: "Move through SkySchool surfaces and keep progress visible without invented certificates or outcomes.",
    href: "/school",
    icon: GraduationCap,
    tone: "from-cyan-500/20 to-sky-500/10 border-cyan-400/30",
    status: "Learning surfaces",
  },
  {
    title: "Meet HopeAI",
    description: "Explore the assistant experience with clear boundaries when a model or provider is unavailable.",
    href: "/hope-a-i",
    icon: BrainCircuit,
    tone: "from-violet-500/20 to-indigo-500/10 border-violet-400/30",
    status: "Provider-dependent",
  },
  {
    title: "Keep your wallet safe",
    description: "Review wallet entry points without pretending custody, balances, or transactions exist until verified.",
    href: "/wallet",
    icon: WalletCards,
    tone: "from-emerald-500/20 to-teal-500/10 border-emerald-400/30",
    status: "Safety-first boundary",
  },
];

const quickLinks = [
  { label: "Profile", href: "/profile", icon: ShieldCheck },
  { label: "Community", href: "/community", icon: MessageCircle },
  { label: "Crypto Hub", href: "/crypto-hub", icon: Waves },
  { label: "Settings", href: "/settings", icon: LockKeyhole },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#07070c] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(217,70,239,0.18),transparent_32%),radial-gradient(circle_at_85%_15%,rgba(34,211,238,0.14),transparent_30%)]" />
      <section className="relative mx-auto max-w-7xl px-6 pb-16 pt-10 lg:px-10 lg:pt-16">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-fuchsia-400 to-cyan-300 text-slate-950 shadow-[0_0_35px_rgba(217,70,239,0.35)]">
              <Orbit className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.28em] text-white">SKYCOIN4444</p>
              <p className="text-xs text-slate-500">A focused digital ecosystem</p>
            </div>
          </div>
          <Link href="/dashboard">
            <Button variant="outline" className="border-white/15 bg-white/5 text-white hover:bg-white/10">
              Open workspace <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-10 pb-12 pt-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-xs font-medium text-emerald-200">
              <CheckCircle2 className="h-3.5 w-3.5" /> Truthful product status is built in
            </div>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[0.98] tracking-[-0.04em] text-white md:text-7xl">
              One place to
              <span className="block bg-gradient-to-r from-fuchsia-300 via-violet-300 to-cyan-200 bg-clip-text text-transparent">learn, create, connect.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">
              SKYCOIN4444 is being shaped into a dependable daily workspace for people who want useful tools, clear progress, and honest boundaries—not a wall of pretend metrics.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/dashboard">
                <Button className="h-12 rounded-xl bg-white px-6 text-slate-950 hover:bg-slate-200">
                  Start with your dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/feature-tour">
                <Button variant="outline" className="h-12 rounded-xl border-white/15 bg-white/5 px-6 text-white hover:bg-white/10">
                  Explore the ecosystem
                </Button>
              </Link>
            </div>
          </div>

          <Card className="relative overflow-hidden rounded-3xl border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-fuchsia-950/20 backdrop-blur-xl">
            <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Launch posture</p>
                  <h2 className="mt-2 text-xl font-semibold">Build forward, verify everything</h2>
                </div>
                <Sparkles className="h-6 w-6 text-fuchsia-300" />
              </div>
              <div className="mt-7 space-y-4">
                {[
                  ["Core navigation", "Connected"],
                  ["Truthful unavailable states", "Enabled"],
                  ["Financial data", "Provider-dependent"],
                  ["Production infrastructure", "Evidence required"],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between border-b border-white/10 pb-3 last:border-0 last:pb-0">
                    <span className="text-sm text-slate-400">{label}</span>
                    <span className="text-sm font-medium text-slate-200">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <Link key={pillar.title} href={pillar.href}>
                <Card className={`group h-full rounded-3xl bg-gradient-to-br p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.09] ${pillar.tone}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-black/20 text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-white/40 transition-transform group-hover:translate-x-1 group-hover:text-white" />
                  </div>
                  <h2 className="mt-8 text-xl font-semibold">{pillar.title}</h2>
                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-300">{pillar.description}</p>
                  <p className="mt-6 text-xs font-medium uppercase tracking-[0.18em] text-white/50">{pillar.status}</p>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.035] p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Quick access</p>
              <p className="mt-1 text-sm text-slate-300">Jump into the parts you want to use every day.</p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {quickLinks.map(({ label, href, icon: Icon }) => (
                <Link key={href} href={href}>
                  <Button variant="ghost" className="w-full justify-start gap-2 text-slate-300 hover:bg-white/10 hover:text-white">
                    <Icon className="h-4 w-4" /> {label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
