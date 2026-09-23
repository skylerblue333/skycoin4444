import { useState } from "react";
import { Link } from "wouter";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Calculator,
  Coins,
  FileCheck2,
  Scale,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  offeringReadinessGates,
  tokenAllocationDraft,
} from "@/data/investorReadiness";

type Tab = "readiness" | "model" | "controls";

function formatWhole(value: number) {
  if (!Number.isFinite(value)) return "0";
  return Math.round(value).toLocaleString();
}

function safeNumber(value: string) {
  const parsed = Number(value.replace(/,/g, ""));
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

export default function ICOLaunchpad() {
  const [tab, setTab] = useState<Tab>("readiness");
  const [supply, setSupply] = useState("1000000000");
  const [referencePrice, setReferencePrice] = useState("0");

  const supplyValue = safeNumber(supply);
  const referencePriceValue = safeNumber(referencePrice);
  const impliedFdv = supplyValue * referencePriceValue;
  const allocationTotal = tokenAllocationDraft.reduce(
    (sum, allocation) => sum + allocation.percentage,
    0
  );

  return (
    <main className="min-h-screen bg-[#08070d] px-4 py-8 text-white md:px-8">
      <div className="mx-auto max-w-6xl space-y-7">
        <header className="rounded-3xl border border-amber-300/15 bg-gradient-to-br from-amber-300/[0.09] via-white/[0.025] to-orange-500/[0.06] p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-300 text-black">
              <Coins className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-200/70">
                ICO / token launch
              </p>
              <h1 className="mt-1 text-3xl font-black md:text-4xl">Launch Readiness Lab</h1>
            </div>
            <Badge className="ml-auto border border-amber-300/25 bg-amber-300/10 text-amber-100">
              No live offering
            </Badge>
          </div>

          <p className="mt-5 max-w-3xl text-sm leading-6 text-slate-300 md:text-base">
            Plan token supply, allocation, disclosures, security, payments, and
            compliance without pretending a sale exists. This beta does not accept
            funds, connect a purchase wallet, issue tokens, perform KYC/AML, settle
            payments, or execute blockchain transactions.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              href="/investor-portal"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-black text-black"
            >
              Investor portal <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/tokenomics-calculator"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold text-white"
            >
              Tokenomics calculator <Calculator className="h-4 w-4" />
            </Link>
          </div>
        </header>

        <div className="flex w-fit max-w-full gap-1 overflow-x-auto rounded-xl border border-white/10 bg-white/[0.035] p-1">
          {([
            ["readiness", "Readiness"],
            ["model", "Draft model"],
            ["controls", "Launch controls"],
          ] as const).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={
                "rounded-lg px-4 py-2 text-sm font-bold transition " +
                (tab === id
                  ? "bg-amber-300 text-black"
                  : "text-slate-400 hover:bg-white/[0.05] hover:text-white")
              }
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "readiness" && (
          <section className="space-y-4">
            <Card className="border-amber-300/15 bg-amber-300/[0.035]">
              <CardContent className="flex gap-3 p-5">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
                <div>
                  <h2 className="font-bold text-amber-100">Launch is gated, not live</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    A token contract, named security review, offering structure,
                    KYC/AML workflow, payment/custody path, approved tokenomics, and
                    disclosures must be independently evidenced before this surface
                    can truthfully become a purchase flow.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              {offeringReadinessGates.map(gate => (
                <Card key={gate.id} className="border-white/10 bg-white/[0.03]">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <CardTitle className="text-base">{gate.title}</CardTitle>
                      <Badge
                        className={
                          gate.status === "blocked"
                            ? "border border-rose-400/25 bg-rose-400/10 text-rose-200"
                            : "border border-amber-300/25 bg-amber-300/10 text-amber-100"
                        }
                      >
                        {gate.status === "blocked" ? "Blocked" : "Evidence needed"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div>
                      <div className="text-xs uppercase tracking-wider text-slate-600">Owner</div>
                      <div className="mt-1 text-slate-300">{gate.owner}</div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wider text-slate-600">Required evidence</div>
                      <div className="mt-1 leading-6 text-slate-400">{gate.evidence}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {tab === "model" && (
          <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <Card className="border-white/10 bg-white/[0.03]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-amber-300" />
                  Scenario assumptions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <label className="block">
                  <span className="text-sm font-bold text-slate-200">Draft total supply</span>
                  <input
                    value={supply}
                    onChange={event => setSupply(event.target.value)}
                    inputMode="decimal"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 font-mono text-white outline-none focus:border-amber-300/50"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-bold text-slate-200">Reference price for scenario math</span>
                  <input
                    value={referencePrice}
                    onChange={event => setReferencePrice(event.target.value)}
                    inputMode="decimal"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 font-mono text-white outline-none focus:border-amber-300/50"
                  />
                  <span className="mt-2 block text-xs leading-5 text-slate-500">
                    A reference price is not a sale price, valuation opinion, forecast,
                    or promise of market value.
                  </span>
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/[0.08] bg-black/20 p-4">
                    <div className="text-xs uppercase tracking-wider text-slate-600">Allocation total</div>
                    <div className="mt-1 text-2xl font-black text-white">{allocationTotal}%</div>
                  </div>
                  <div className="rounded-xl border border-white/[0.08] bg-black/20 p-4">
                    <div className="text-xs uppercase tracking-wider text-slate-600">Scenario FDV</div>
                    <div className="mt-1 text-2xl font-black text-amber-200">
                      {referencePriceValue > 0
                        ? "$" + formatWhole(impliedFdv)
                        : "Enter price"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/[0.03]">
              <CardHeader>
                <CardTitle>Draft allocation model</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {tokenAllocationDraft.map(allocation => {
                  const tokens = supplyValue * (allocation.percentage / 100);
                  return (
                    <div
                      key={allocation.id}
                      className="rounded-xl border border-white/[0.08] bg-black/20 p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="font-bold text-white">{allocation.label}</div>
                        <div className="font-mono text-amber-200">{allocation.percentage}%</div>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                        <div
                          className="h-full rounded-full bg-amber-300/80"
                          style={{ width: allocation.percentage + "%" }}
                        />
                      </div>
                      <div className="mt-2 flex flex-wrap justify-between gap-2 text-xs">
                        <span className="text-slate-500">{allocation.note}</span>
                        <span className="font-mono text-slate-300">{formatWhole(tokens)} tokens</span>
                      </div>
                    </div>
                  );
                })}
                <p className="pt-2 text-xs leading-5 text-slate-500">
                  This is a planning scenario carried into the beta for review. It is
                  not approved tokenomics, a contract state, a purchaser allocation,
                  or a binding commitment.
                </p>
              </CardContent>
            </Card>
          </section>
        )}

        {tab === "controls" && (
          <section className="grid gap-4 md:grid-cols-2">
            {[
              {
                icon: Scale,
                title: "Eligibility before purchase",
                body: "Jurisdiction, purchaser eligibility, disclosures, sanctions screening, and required identity checks must resolve before any order can be created.",
              },
              {
                icon: WalletCards,
                title: "Money and custody boundaries",
                body: "A named payment/custody architecture must define who holds funds, settlement timing, refund paths, reconciliations, and incident ownership.",
              },
              {
                icon: ShieldCheck,
                title: "Contract and admin security",
                body: "Contract address, verified source, permissions, upgradeability, pause controls, signer policy, and independent review must be published together.",
              },
              {
                icon: FileCheck2,
                title: "Versioned disclosures",
                body: "Tokenomics, vesting, risks, use of proceeds, conflicts, and material changes need version control so investors can see exactly what changed.",
              },
              {
                icon: BadgeCheck,
                title: "Evidence-backed status",
                body: "The UI should only display Live, Audited, Verified, Raised, Sold, Listed, or Completed when the underlying evidence is attached and current.",
              },
            ].map(item => (
              <Card key={item.title} className="border-white/10 bg-white/[0.03]">
                <CardContent className="p-5">
                  <item.icon className="h-5 w-5 text-amber-300" />
                  <h2 className="mt-3 font-bold text-white">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{item.body}</p>
                </CardContent>
              </Card>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
