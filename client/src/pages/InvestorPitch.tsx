import { useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  Boxes,
  Building2,
  ChevronLeft,
  ChevronRight,
  Coins,
  FileCheck2,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const SLIDES = [
  {
    id: "vision",
    title: "Vision",
    icon: Sparkles,
    status: "Narrative",
    body: "SKYCOIN4444 is being developed as a multi-area digital ecosystem connecting social, AI, learning, gaming, commerce, communication, creator, enterprise, and Web3 experiences through one product shell.",
    proof: "Product narrative only. It does not claim market leadership, adoption, revenue, or token value.",
  },
  {
    id: "product",
    title: "Product",
    icon: Boxes,
    status: "Engineering evidence",
    body: "The investor story should begin with what a reviewer can actually open, test, and verify in the engineering beta: coherent product areas, routes, account-gated flows, release checks, and documented capability boundaries.",
    proof: "Use route health, beta journeys, source code, tests, CI, and hosted-release evidence instead of unsupported user or revenue counts.",
  },
  {
    id: "business",
    title: "Business model",
    icon: Building2,
    status: "Hypothesis",
    body: "Potential monetization can be modeled across subscriptions, marketplace services, creator tools, enterprise software, and other platform services, but each line should remain a hypothesis until billing, contracts, accounting, and real customer evidence exist.",
    proof: "Do not present modeled pricing or market size as historical revenue, signed demand, or validated willingness to pay.",
  },
  {
    id: "token",
    title: "Token strategy",
    icon: Coins,
    status: "Planning",
    body: "A token can be evaluated for utility, governance, incentives, access, community participation, and treasury design, but the launch path must stay gated by contract identity, security review, approved tokenomics, legal analysis, custody/payment controls, and disclosures.",
    proof: "The current beta has no live token offering, verified sale, purchase flow, listing, or guaranteed liquidity.",
  },
  {
    id: "risk",
    title: "Risk & controls",
    icon: ShieldCheck,
    status: "Due diligence",
    body: "Investor-grade materials should surface product, security, financial, regulatory, operational, token, treasury, and execution risks alongside the controls and evidence that reduce them.",
    proof: "A credible pitch makes limitations easy to inspect instead of hiding them behind optimistic projections.",
  },
  {
    id: "raise",
    title: "Financing readiness",
    icon: Target,
    status: "Gate",
    body: "Before publishing a raise amount, valuation, runway, use of proceeds, or forecast, the data room should contain cap-table/entity documents, historical financials, budget assumptions, financing terms, legal review, and a versioned management forecast.",
    proof: "This slide intentionally contains no fabricated raise amount, valuation, revenue target, runway, or projected return.",
  },
] as const;

export default function InvestorPitch() {
  const [slideIndex, setSlideIndex] = useState(0);
  const slide = SLIDES[slideIndex];
  const Icon = slide.icon;

  return (
    <main className="min-h-screen bg-[#08070d] px-4 py-8 text-white md:px-8">
      <div className="mx-auto max-w-6xl space-y-7">
        <header className="flex flex-wrap items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-violet-300 text-black">
            <FileCheck2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-200/70">
              Evidence-first deck
            </p>
            <h1 className="mt-1 text-2xl font-black md:text-3xl">Investor Narrative</h1>
          </div>
          <Badge className="ml-auto border border-violet-300/25 bg-violet-300/10 text-violet-100">
            Draft for diligence
          </Badge>
        </header>

        <Card className="overflow-hidden border-white/10 bg-gradient-to-br from-white/[0.055] to-white/[0.015]">
          <CardContent className="p-0">
            <div className="border-b border-white/[0.08] px-6 py-4 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              Slide {slideIndex + 1} / {SLIDES.length}
            </div>
            <div className="p-6 md:p-10">
              <div className="flex flex-wrap items-start gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-violet-300/10 text-violet-200">
                  <Icon className="h-7 w-7" />
                </div>
                <div className="min-w-0 flex-1">
                  <Badge className="border border-white/10 bg-white/[0.05] text-slate-300">
                    {slide.status}
                  </Badge>
                  <h2 className="mt-3 text-3xl font-black md:text-4xl">{slide.title}</h2>
                </div>
              </div>

              <p className="mt-8 max-w-4xl text-lg leading-8 text-slate-300">{slide.body}</p>

              <div className="mt-8 rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.04] p-5">
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-200">
                  <ShieldCheck className="h-4 w-4" />
                  Evidence boundary
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-400">{slide.proof}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={slideIndex === 0}
            onClick={() => setSlideIndex(current => Math.max(0, current - 1))}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex gap-1.5">
            {SLIDES.map((item, index) => (
              <button
                key={item.id}
                type="button"
                aria-label={"Open " + item.title + " slide"}
                onClick={() => setSlideIndex(index)}
                className={
                  "h-2 rounded-full transition-all " +
                  (index === slideIndex
                    ? "w-8 bg-violet-300"
                    : "w-2 bg-white/15 hover:bg-white/30")
                }
              />
            ))}
          </div>

          <Button
            type="button"
            disabled={slideIndex === SLIDES.length - 1}
            onClick={() =>
              setSlideIndex(current => Math.min(SLIDES.length - 1, current + 1))
            }
            className="gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <section className="grid gap-3 md:grid-cols-3">
          {SLIDES.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSlideIndex(index)}
              className={
                "rounded-2xl border p-4 text-left transition " +
                (index === slideIndex
                  ? "border-violet-300/30 bg-violet-300/[0.07]"
                  : "border-white/[0.08] bg-white/[0.025] hover:border-white/15")
              }
            >
              <div className="text-xs font-black uppercase tracking-wider text-slate-600">
                {item.status}
              </div>
              <div className="mt-1 font-bold text-white">{item.title}</div>
            </button>
          ))}
        </section>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/investor-portal"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-black text-black"
          >
            Investor portal <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/i-c-o-launchpad"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2 text-sm font-bold text-white"
          >
            Token launch readiness <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
