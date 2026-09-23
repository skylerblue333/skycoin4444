import { Link } from "wouter";
import {
  ArrowRight,
  Boxes,
  FileCheck2,
  FolderOpen,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  investorDataRoomLinks,
  offeringReadinessGates,
} from "@/data/investorReadiness";

const diligenceSections = [
  {
    title: "Product & release evidence",
    body: "Source, tests, CI, route health, hosted beta behavior, known limitations, and release identity should be reviewable without translating demo UI into production claims.",
    route: "/route-health",
    icon: Boxes,
  },
  {
    title: "Token & offering readiness",
    body: "Token design, contract identity, security review, legal structure, payments, KYC/AML, custody, vesting, disclosures, and launch controls belong in one gated review chain.",
    route: "/i-c-o-launchpad",
    icon: ShieldCheck,
  },
  {
    title: "Metrics methodology",
    body: "Investor KPIs stay unpublished until each number has a named source, period, definition, exclusions, and last-updated timestamp.",
    route: "/investor-metrics",
    icon: FileCheck2,
  },
] as const;

export default function InvestorRoom() {
  const blocked = offeringReadinessGates.filter(
    gate => gate.status === "blocked"
  ).length;
  const needsEvidence = offeringReadinessGates.filter(
    gate => gate.status === "needs_evidence"
  ).length;

  return (
    <main className="min-h-screen bg-[#08070d] px-4 py-8 text-white md:px-8">
      <div className="mx-auto max-w-6xl space-y-7">
        <header className="rounded-3xl border border-violet-300/15 bg-gradient-to-br from-violet-500/[0.08] via-white/[0.025] to-blue-500/[0.06] p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-violet-300 text-black">
              <FolderOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-200/70">
                Due diligence workspace
              </p>
              <h1 className="mt-1 text-3xl font-black md:text-4xl">Investor Room</h1>
            </div>
            <Badge className="ml-auto border border-violet-300/25 bg-violet-300/10 text-violet-100">
              Evidence room
            </Badge>
          </div>

          <p className="mt-5 max-w-3xl text-sm leading-6 text-slate-300 md:text-base">
            A review index for engineering evidence, investor methodology, token
            planning, and launch controls. This room intentionally does not invent
            revenue, users, treasury balances, token prices, token supply on-chain,
            sale progress, valuation, or fundraising results.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-xs uppercase tracking-wider text-slate-600">Offering</div>
              <div className="mt-1 font-bold text-amber-200">Not live</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-xs uppercase tracking-wider text-slate-600">Blocked gates</div>
              <div className="mt-1 font-bold text-rose-200">{blocked}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-xs uppercase tracking-wider text-slate-600">Evidence-needed gates</div>
              <div className="mt-1 font-bold text-amber-200">{needsEvidence}</div>
            </div>
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-3">
          {diligenceSections.map(section => (
            <Link
              key={section.route}
              href={section.route}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-violet-300/25 hover:bg-violet-300/[0.05]"
            >
              <section.icon className="h-5 w-5 text-violet-200" />
              <h2 className="mt-3 font-bold text-white">{section.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">{section.body}</p>
              <div className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-violet-200">
                Review <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </section>

        <Card className="border-white/10 bg-white/[0.03]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-300" />
              Investor data-room index
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {investorDataRoomLinks.map(item => (
              <Link
                key={item.route}
                href={item.route}
                className="rounded-xl border border-white/[0.08] bg-black/20 p-4 transition hover:border-amber-300/20"
              >
                <div className="font-bold text-white">{item.title}</div>
                <div className="mt-1 text-sm leading-6 text-slate-500">{item.description}</div>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="border-emerald-300/15 bg-emerald-300/[0.035]">
          <CardContent className="p-5">
            <div className="flex gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
              <div>
                <h2 className="font-bold text-emerald-100">What belongs here next</h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Real historical financials, cap-table/entity documents, customer
                  evidence, named telemetry sources, treasury reconciliation, token
                  contract identity, security review artifacts, approved tokenomics,
                  legal/compliance documents, and a versioned forecast with explicit
                  assumptions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Link
          href="/investor-portal"
          className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-black text-black"
        >
          Back to investor portal <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </main>
  );
}
