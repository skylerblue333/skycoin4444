import { Link } from "wouter";
import {
  ArrowRight,
  BarChart3,
  Brain,
  Gamepad2,
  GraduationCap,
  Heart,
  Radio,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExperienceShell, SurfaceCard } from "@/components/ecosystem/ExperienceShell";

const MODULES = [
  { title: "Wallet", detail: "Account and asset interfaces", href: "/wallet", icon: Wallet, className: "from-sky-500 to-blue-700" },
  { title: "HopeAI", detail: "Assistant and agent experiences", href: "/a-i-assistant", icon: Brain, className: "from-violet-500 to-indigo-700" },
  { title: "Games", detail: "GameFi hubs, quests and competition", href: "/gaming", icon: Gamepad2, className: "from-fuchsia-500 to-violet-700" },
  { title: "SkyLive", detail: "Creator and streaming interface", href: "/live", icon: Radio, className: "from-indigo-500 to-blue-700" },
  { title: "Dating", detail: "Connection discovery preview", href: "/dating-home", icon: Heart, className: "from-pink-500 to-rose-700" },
  { title: "Marketplace", detail: "Commerce integration surface", href: "/marketplace", icon: ShoppingBag, className: "from-orange-500 to-amber-700" },
  { title: "Education", detail: "Learning and course experiences", href: "/education", icon: GraduationCap, className: "from-emerald-500 to-teal-700" },
  { title: "Analytics", detail: "Metrics and reporting interfaces", href: "/analytics", icon: BarChart3, className: "from-cyan-500 to-sky-700" },
] as const;

const PRINCIPLES = [
  "Shared responsive navigation and visual hierarchy",
  "Explicit engineering-beta and preview states",
  "No invented payments, users, balances or production activity",
  "Accessible focus, motion and mobile interaction defaults",
] as const;

export default function Home() {
  return (
    <ExperienceShell
      title="SKYCOIN4444"
      subtitle="One interface system for the SKYCOIN4444 engineering-beta ecosystem."
      icon={Sparkles}
      accent="violet"
      badge="Engineering beta"
      actions={
        <Link href="/dashboard">
          <Button className="rounded-xl bg-violet-600 shadow-md shadow-violet-200 hover:bg-violet-700">
            Open dashboard <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      }
    >
      <div className="space-y-6">
        <SurfaceCard className="relative overflow-hidden bg-slate-950 p-6 text-white md:p-9 lg:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_15%,rgba(99,102,241,.38),transparent_32%),radial-gradient(circle_at_82%_20%,rgba(14,165,233,.25),transparent_28%),radial-gradient(circle_at_60%_100%,rgba(236,72,153,.14),transparent_30%)]" />
          <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,.75fr)] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-violet-200">
                <Sparkles className="h-3.5 w-3.5" /> Unified ecosystem
              </span>
              <h2 className="mt-5 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                Build, explore and validate the ecosystem from one premium interface.
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                SKYCOIN4444 brings its major product surfaces into a consistent design language while keeping unfinished integrations clearly identified. The interface can evolve quickly without presenting preview fixtures as production activity.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/dashboard">
                  <Button className="rounded-xl bg-white px-5 text-slate-950 hover:bg-slate-100">
                    Explore platform <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/master-architecture">
                  <Button variant="outline" className="rounded-xl border-white/15 bg-white/5 px-5 text-white hover:bg-white/10 hover:text-white">
                    Architecture
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {PRINCIPLES.map((item, index) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
                  <div className="flex items-start gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-emerald-400/10 text-emerald-300">
                      <ShieldCheck className="h-4 w-4" />
                    </span>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Principle {index + 1}</div>
                      <p className="mt-1 text-sm font-semibold leading-5 text-slate-200">{item}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SurfaceCard>

        <section>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600">Core experiences</p>
              <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">Explore the ecosystem</h2>
              <p className="mt-1 text-sm text-slate-500">Major modules share the same responsive shell and interaction language.</p>
            </div>
            <Link href="/dashboard" className="text-sm font-semibold text-violet-700 hover:text-violet-900">View dashboard →</Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {MODULES.map(({ title, detail, href, icon: Icon, className }) => (
              <Link key={title} href={href} className="group block">
                <SurfaceCard className="h-full overflow-hidden transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-lg">
                  <div className={`relative h-28 bg-gradient-to-br ${className} p-4 text-white`}>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgba(255,255,255,.30),transparent_35%)]" />
                    <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-white/15 backdrop-blur"><Icon className="h-5 w-5" /></span>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-bold text-slate-900">{title}</h3>
                      <ArrowRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-violet-600" />
                    </div>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p>
                  </div>
                </SurfaceCard>
              </Link>
            ))}
          </div>
        </section>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <SurfaceCard className="p-5 md:p-6">
            <div className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-violet-600" /><h2 className="font-bold">Full-app UI system</h2></div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Global typography, focus treatment, responsive surfaces, form behavior, tables, scrollbars, motion preferences and light/dark visual polish now come from one client-wide layer. Individual modules can keep their own personality without drifting away from the ecosystem experience.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {["Responsive", "Accessible defaults", "Shared surfaces"].map((label) => <div key={label} className="rounded-xl bg-slate-50 px-3 py-3 text-center text-xs font-semibold text-slate-600">{label}</div>)}
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-5 md:p-6">
            <div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-emerald-600" /><h2 className="font-bold">Product truthfulness</h2></div>
            <p className="mt-3 text-sm leading-6 text-slate-600">UI polish does not imply a backend capability exists. Features remain labeled as previews, pending integrations, or engineering-beta surfaces until their services are actually connected and verified.</p>
            <Link href="/build-roadmap"><Button variant="outline" className="mt-5 w-full rounded-xl border-slate-200">Open build roadmap</Button></Link>
          </SurfaceCard>
        </div>
      </div>
    </ExperienceShell>
  );
}
