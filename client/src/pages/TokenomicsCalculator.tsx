import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Calculator, Coins, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { tokenAllocationDraft } from "@/data/investorReadiness";

function parseNonNegative(value: string) {
  const parsed = Number(value.replace(/,/g, ""));
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function formatWhole(value: number) {
  return Number.isFinite(value) ? Math.round(value).toLocaleString() : "0";
}

export default function TokenomicsCalculator() {
  const [supply, setSupply] = useState("1000000000");
  const [referencePrice, setReferencePrice] = useState("0");
  const [allocations, setAllocations] = useState<Record<string, string>>(
    Object.fromEntries(
      tokenAllocationDraft.map(item => [item.id, String(item.percentage)])
    )
  );

  const supplyValue = parseNonNegative(supply);
  const priceValue = parseNonNegative(referencePrice);

  const allocationRows = useMemo(
    () =>
      tokenAllocationDraft.map(item => {
        const percentage = parseNonNegative(allocations[item.id] ?? "0");
        return {
          ...item,
          percentage,
          tokenCount: supplyValue * (percentage / 100),
        };
      }),
    [allocations, supplyValue]
  );

  const allocationTotal = allocationRows.reduce(
    (total, row) => total + row.percentage,
    0
  );
  const impliedFdv = supplyValue * priceValue;

  return (
    <main className="min-h-screen bg-[#08070d] px-4 py-8 text-white md:px-8">
      <div className="mx-auto max-w-6xl space-y-7">
        <header className="rounded-3xl border border-amber-300/15 bg-gradient-to-br from-amber-300/[0.08] via-white/[0.025] to-violet-500/[0.06] p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-300 text-black">
              <Calculator className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-200/70">
                Scenario modeling
              </p>
              <h1 className="mt-1 text-3xl font-black md:text-4xl">Tokenomics Calculator</h1>
            </div>
            <Badge className="ml-auto border border-amber-300/25 bg-amber-300/10 text-amber-100">
              Draft math only
            </Badge>
          </div>
          <p className="mt-5 max-w-3xl text-sm leading-6 text-slate-300 md:text-base">
            Explore supply and allocation scenarios without turning planning numbers
            into a live offering. This planning surface does not create tokens, price a sale,
            allocates purchaser balances, moves funds, or changes a blockchain.
          </p>
        </header>

        <section className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <Card className="border-white/10 bg-white/[0.03]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-amber-300" />
                Scenario inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <label className="block">
                <span className="text-sm font-bold text-slate-200">Total token supply</span>
                <input
                  value={supply}
                  onChange={event => setSupply(event.target.value)}
                  inputMode="decimal"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 font-mono text-white outline-none focus:border-amber-300/50"
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-slate-200">Reference price</span>
                <input
                  value={referencePrice}
                  onChange={event => setReferencePrice(event.target.value)}
                  inputMode="decimal"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 font-mono text-white outline-none focus:border-amber-300/50"
                />
                <span className="mt-2 block text-xs leading-5 text-slate-500">
                  Optional scenario input. It is not a sale price, market quote,
                  valuation opinion, forecast, or promise of return.
                </span>
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-white/[0.08] bg-black/20 p-4">
                  <div className="text-xs uppercase tracking-wider text-slate-600">Allocation total</div>
                  <div
                    className={
                      "mt-1 text-2xl font-black " +
                      (Math.abs(allocationTotal - 100) < 0.0001
                        ? "text-emerald-200"
                        : "text-rose-200")
                    }
                  >
                    {allocationTotal.toFixed(2)}%
                  </div>
                </div>
                <div className="rounded-xl border border-white/[0.08] bg-black/20 p-4">
                  <div className="text-xs uppercase tracking-wider text-slate-600">Scenario FDV</div>
                  <div className="mt-1 text-2xl font-black text-amber-200">
                    {priceValue > 0 ? "$" + formatWhole(impliedFdv) : "Enter price"}
                  </div>
                </div>
              </div>

              {Math.abs(allocationTotal - 100) >= 0.0001 && (
                <div className="flex gap-3 rounded-xl border border-rose-400/20 bg-rose-400/[0.06] p-4">
                  <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-rose-300" />
                  <p className="text-sm leading-6 text-rose-100/80">
                    Allocation percentages should total 100% before this scenario is
                    used in a draft tokenomics document.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.03]">
            <CardHeader>
              <CardTitle>Editable allocation scenario</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {allocationRows.map(row => (
                <div
                  key={row.id}
                  className="rounded-xl border border-white/[0.08] bg-black/20 p-4"
                >
                  <div className="grid gap-3 md:grid-cols-[1fr_110px_160px] md:items-center">
                    <div>
                      <div className="font-bold text-white">{row.label}</div>
                      <div className="mt-1 text-xs leading-5 text-slate-500">{row.note}</div>
                    </div>
                    <label>
                      <span className="sr-only">{row.label} percentage</span>
                      <input
                        value={allocations[row.id] ?? "0"}
                        onChange={event =>
                          setAllocations(current => ({
                            ...current,
                            [row.id]: event.target.value,
                          }))
                        }
                        inputMode="decimal"
                        className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-right font-mono text-white outline-none focus:border-amber-300/50"
                      />
                    </label>
                    <div className="text-right font-mono text-sm text-slate-300">
                      {formatWhole(row.tokenCount)} tokens
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <Card className="border-amber-300/15 bg-amber-300/[0.035]">
          <CardContent className="p-5 text-sm leading-6 text-slate-300">
            <strong className="text-amber-100">Planning boundary:</strong> the starter
            allocation is a draft scenario for review. Before it becomes authoritative,
            it needs versioned approval, vesting terms, governance controls, treasury
            authorization, legal analysis, tax/accounting treatment, contract mapping,
            and disclosure of conflicts and unlock risks.
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/i-c-o-launchpad"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-black text-black"
          >
            Launch readiness <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/investor-portal"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2 text-sm font-bold text-white"
          >
            Investor portal <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
