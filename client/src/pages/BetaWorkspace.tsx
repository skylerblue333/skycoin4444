/*
 * Product philosophy: evidence-led Field Atlas workspace. This page is a
 * practical launchpad for working beta journeys, not a marketing dashboard.
 * Every card links to a real route or states why a capability is gated.
 */
import { Activity, ArrowRight, BookOpen, Boxes, CheckCircle2, FileText, FileWarning, Gauge, MessageSquare, Radio, ScanSearch, ShieldCheck, Sparkles, UserRound, Users } from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const JOURNEYS = [
  { title: "SkySchool", route: "/course-catalog", detail: "Take authored lessons, answer deterministic assessments, and persist completion progress.", status: "Working", icon: BookOpen, tone: "text-emerald-300" },
  { title: "Community Hub", route: "/community-hub", detail: "Create a community, join it, publish a thread, and verify persistence after refresh.", status: "Working", icon: Users, tone: "text-sky-300" },
  { title: "Activity Feed", route: "/activity-feed", detail: "Publish a post, react, reply, and inspect the real authenticated feed workflow.", status: "Working", icon: Radio, tone: "text-violet-300" },
  { title: "Profile & privacy", route: "/profile", detail: "Review identity and privacy settings without exposing unsupported wallet or financial claims.", status: "Working", icon: UserRound, tone: "text-amber-300" },
  { title: "Beta feedback", route: "/beta-feedback", detail: "Submit a bug, content issue, privacy concern, or evidence gap for engineering review.", status: "Working", icon: MessageSquare, tone: "text-rose-300" },
  { title: "Local AI sandbox", route: "/a-i-tools-hub", detail: "Draft an outline, extract actions, and scan sensitive wording without provider calls.", status: "Local only", icon: Sparkles, tone: "text-fuchsia-300" },
  { title: "Web3 evidence room", route: "/beta-web3", detail: "Inspect labeled local/testnet NFT and token metadata fixtures with no chain writes.", status: "Controlled", icon: Boxes, tone: "text-cyan-300" },
  { title: "Creator evidence studio", route: "/creator-analytics", detail: "Capture local content briefs and move them through a human-review queue without fake metrics or monetization claims.", status: "Local only", icon: FileText, tone: "text-orange-300" },
  { title: "Operational readiness", route: "/operational-readiness", detail: "Check approved health and database-readiness endpoints before interpreting any beta behavior as evidence.", status: "Evidence view", icon: Activity, tone: "text-lime-300" },
] as const;

const GATED = ["Payments and settlement", "Wallet custody and signing", "Production chain execution", "Provider-backed AI actions"];

export default function BetaWorkspace() {
  return (
    <main className="min-h-screen bg-[#050510] text-white">
      <header className="border-b border-white/10 bg-[#050510]/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5">
          <div className="flex items-center gap-3"><Link href="/" className="text-sm text-white/45 hover:text-white">← Home</Link><div className="h-4 w-px bg-white/15" /><div><div className="flex items-center gap-2"><h1 className="font-black tracking-tight">Skycoin4444 Beta Workspace</h1><Badge variant="outline" className="border-amber-400/50 text-amber-200">Engineering beta</Badge></div><p className="mt-1 text-xs text-white/40">One launchpad for the product journeys that have evidence today</p></div></div>
          <Link href="/beta-catalog" className="hidden text-sm text-amber-200 hover:text-amber-100 sm:block">Open full catalog →</Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-10">
        <section className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <div><p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-200/70">Product surface</p><h2 className="mt-3 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl">Test the ecosystem as a set of connected journeys.</h2><p className="mt-5 max-w-3xl text-base leading-7 text-white/55">This workspace replaces route hunting with a clear beta loop: learn, participate, publish, review identity, submit evidence, experiment locally, and inspect controlled Web3 data.</p></div>
          <Card className="border-amber-400/25 bg-amber-400/[0.06] text-white"><CardHeader><Gauge className="h-5 w-5 text-amber-200" /><CardTitle className="mt-2 text-amber-100">Release posture</CardTitle><CardDescription className="text-white/55">17 launchable beta routes are tracked in the inventory; this workspace groups the highest-value journeys.</CardDescription></CardHeader><CardContent><div className="flex items-center gap-2 text-sm text-emerald-200"><CheckCircle2 className="h-4 w-4" />Truthful availability labels</div><div className="mt-2 flex items-center gap-2 text-sm text-white/55"><ShieldCheck className="h-4 w-4" />High-risk actions remain gated</div></CardContent></Card>
        </section>

        <section><div className="mb-4 flex items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">Working journeys</p><h3 className="mt-2 text-2xl font-bold">Choose a path and test it end to end</h3></div><span className="text-xs text-white/35">9 grouped surfaces</span></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{JOURNEYS.map(({ title, route, detail, status, icon: Icon, tone }) => <Link key={route} href={route} className="group"><Card className="h-full border-white/10 bg-white/[0.03] transition-colors group-hover:border-amber-300/50 group-hover:bg-white/[0.05]"><CardHeader><div className="flex items-start justify-between gap-3"><span className={`grid h-10 w-10 place-items-center rounded-lg bg-white/[0.06] ${tone}`}><Icon className="h-5 w-5" /></span><Badge variant={status === "Controlled" ? "outline" : "default"} className={status === "Controlled" ? "border-cyan-300/40 text-cyan-200" : ""}>{status}</Badge></div><CardTitle className="mt-2 text-white">{title}</CardTitle><CardDescription className="leading-6 text-white/50">{detail}</CardDescription></CardHeader><CardContent><span className="inline-flex items-center text-sm font-semibold text-amber-200">Open journey <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" /></span></CardContent></Card></Link>)}</div></section>

        <section className="grid gap-5 lg:grid-cols-[1fr_1fr]"><Card className="border-white/10 bg-white/[0.03]"><CardHeader><FileWarning className="h-5 w-5 text-amber-200" /><CardTitle className="mt-2">What is intentionally unavailable</CardTitle><CardDescription className="text-white/50">A screen or package does not count as evidence for these capabilities.</CardDescription></CardHeader><CardContent className="grid gap-2 sm:grid-cols-2">{GATED.map(item => <div key={item} className="rounded-lg border border-white/10 bg-black/20 px-3 py-3 text-sm text-white/60">{item}</div>)}</CardContent></Card><Card className="border-white/10 bg-white/[0.03]"><CardHeader><ScanSearch className="h-5 w-5 text-cyan-200" /><CardTitle className="mt-2">Suggested local test loop</CardTitle><CardDescription className="text-white/50">Use the product in a sequence that produces useful evidence.</CardDescription></CardHeader><CardContent className="space-y-3 text-sm leading-6 text-white/60"><p><span className="font-semibold text-white">1.</span> Start with SkySchool and complete one lesson.</p><p><span className="font-semibold text-white">2.</span> Create a community thread and publish one feed update.</p><p><span className="font-semibold text-white">3.</span> Review profile/privacy, then file feedback against anything unclear.</p><p><span className="font-semibold text-white">4.</span> Finish with AI and Web3 controlled surfaces; do not treat drafts or fixtures as production evidence.</p></CardContent></Card></section>
      </div>
    </main>
  );
}
