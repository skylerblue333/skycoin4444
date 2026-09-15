import { Activity, Compass, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "wouter";
import SkyMarkEasterEgg from "@/components/SkyMarkEasterEgg";
import V4DemoDirector from "@/components/V4DemoDirector";
import V4DemoReviewCard from "@/components/V4DemoReviewCard";
import routeCatalog from "@/data/routeCatalog.json";
import V4Beta from "./V4Beta";
import V5PlatformHub from "./V5PlatformHub";

const routeCount = routeCatalog.routes.length;

const compatibilityEvidence = [
  {
    name: "Full route explorer",
    route: "/platform-map",
    detail: `Search the complete generated registry of ${routeCount.toLocaleString()} static routes.`,
  },
  {
    name: "Account activity evidence",
    route: "/activity-evidence",
    detail:
      "Inspect account-owned persisted product evidence without inferred engagement or financial analytics.",
  },
] as const;

const realityChecks = [
  "Payment processing and financial settlement are demo/planning boundaries until a verified provider is connected.",
  "Wallet custody, signing, transfers, and production-chain execution are not represented as live without verified infrastructure.",
  "Public livestream ingest, distribution, audience, and monetization are not claimed by the visual demo alone.",
  "Unverified people, sellers, products, ratings, or inventory remain clearly unverified demo data.",
  "Provider-backed AI actions and unsupported external integrations remain labeled honestly until connected and verified.",
] as const;

export default function BetaWorkspace() {
  return (
    <div className="min-h-screen bg-[#04040b] text-white">
      <V5PlatformHub />

      <section
        className="mx-auto max-w-7xl px-4 pb-8 sm:px-6"
        aria-label="V5 guided demo and product evidence"
      >
        <details className="group overflow-hidden rounded-[1.7rem] border border-white/10 bg-white/[0.025]">
          <summary className="cursor-pointer list-none p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50 sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-100/45">
                  <Sparkles className="h-3.5 w-3.5" />
                  Guided product demo
                </div>
                <strong className="mt-2 block text-lg text-white/85">
                  Want a curated walkthrough instead of free exploration?
                </strong>
                <p className="mt-1 max-w-3xl text-xs leading-5 text-white/38">
                  Run the existing cross-page V4/V5 demo story and review card without making it the first thing every visitor has to understand.
                </p>
              </div>
              <span className="text-xs font-bold text-cyan-200/60 group-open:hidden">
                Open tour ↓
              </span>
              <span className="hidden text-xs font-bold text-cyan-200/60 group-open:inline">
                Close tour ↑
              </span>
            </div>
          </summary>
          <div className="space-y-6 border-t border-white/[0.07] p-5 sm:p-6">
            <V4DemoDirector />
            <V4DemoReviewCard />
          </div>
        </details>
      </section>

      <section
        className="mx-auto max-w-7xl px-4 pb-8 sm:px-6"
        aria-label="Advanced V5 evidence console"
      >
        <details className="group overflow-hidden rounded-[1.7rem] border border-white/10 bg-white/[0.02]">
          <summary className="cursor-pointer list-none p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/50 sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-100/40">
                  Advanced evidence · V5
                </p>
                <strong className="mt-1 block text-lg text-white/80">
                  {"Open the V4 mission & evidence command center"}
                </strong>
                <p className="mt-1 max-w-3xl text-xs leading-5 text-white/35">
                  This remains available for testers and engineers, but it no longer dominates the product experience.
                </p>
              </div>
              <span className="text-xs font-bold text-violet-200/60 group-open:hidden">
                Expand ↓
              </span>
              <span className="hidden text-xs font-bold text-violet-200/60 group-open:inline">
                Collapse ↑
              </span>
            </div>
          </summary>
          <div className="border-t border-white/[0.07]">
            <V4Beta />
          </div>
        </details>
      </section>

      <section
        className="mx-auto max-w-7xl px-4 pb-10 sm:px-6"
        aria-label="V5 ecosystem transparency"
      >
        <div className="grid gap-4 rounded-[1.7rem] border border-white/10 bg-white/[0.025] p-5 lg:grid-cols-[1fr_1fr]">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-white/75">
              <Compass className="h-4 w-4 text-cyan-200" />
              The long-tail ecosystem is still one command away
            </div>
            <p className="mt-2 text-xs leading-6 text-white/40">
              V5 promotes ten recognizable platforms without deleting the larger catalog.
              Use Ctrl/⌘ K or the full explorer for social, creator, asset, commerce, language, dating, learning, and gaming surfaces beyond the flagship paths.
              The route breadth is not a claim of traffic, scale, custody, feature parity,
              or production readiness.
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {compatibilityEvidence.map(item => (
                <Link
                  key={item.route}
                  href={item.route}
                  className="rounded-xl border border-white/10 bg-black/20 p-3 transition hover:border-cyan-300/30"
                >
                  <strong className="text-xs text-white/75">{item.name}</strong>
                  <p className="mt-1 text-[11px] leading-5 text-white/35">{item.detail}</p>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-100/80">
              <ShieldCheck className="h-4 w-4" />
              Reality checks, not platform locks
            </div>
            <p className="mt-2 text-xs leading-5 text-white/38">
              Every flagship demo is directly navigable. These boundaries protect truth and users; they do not hide the platform UI.
            </p>
            <div className="mt-3 space-y-2">
              {realityChecks.map(item => (
                <div
                  key={item}
                  className="flex gap-2 rounded-xl border border-white/[0.08] bg-black/20 px-3 py-2.5 text-xs leading-5 text-white/45"
                >
                  <Activity className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-200/65" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <SkyMarkEasterEgg
          index={1}
          word="BUILD"
          message="A big vision becomes trustworthy one tested piece at a time. Build the piece in front of you, then make it better."
        />
      </section>
    </div>
  );
}
