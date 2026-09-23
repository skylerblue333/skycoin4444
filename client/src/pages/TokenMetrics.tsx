import { Link } from "wouter";
import {
  ArrowRight,
  Blocks,
  Database,
  Gauge,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const REQUIRED_FIELDS = [
  {
    label: "Network identity",
    value: "Not verified",
    detail: "Chain ID, network name, RPC/indexer source, and deployment environment.",
    icon: Blocks,
  },
  {
    label: "Token contract",
    value: "Not verified",
    detail: "Contract address, verified source, bytecode identity, decimals, and admin/upgrade controls.",
    icon: ShieldCheck,
  },
  {
    label: "Supply source",
    value: "Not connected",
    detail: "Total, minted, burned, locked, treasury, and circulating values from an authoritative indexer.",
    icon: Database,
  },
  {
    label: "Market data",
    value: "Not connected",
    detail: "Named venue or data provider, pair, timestamp, liquidity context, and stale-data handling.",
    icon: Gauge,
  },
] as const;

export default function TokenMetrics() {
  return (
    <main className="min-h-screen bg-[#08070d] px-4 py-8 text-white md:px-8">
      <div className="mx-auto max-w-5xl space-y-7">
        <header className="rounded-3xl border border-blue-300/15 bg-gradient-to-br from-blue-500/[0.08] via-white/[0.025] to-violet-500/[0.06] p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-300 text-black">
              <Gauge className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-200/70">
                Token verification
              </p>
              <h1 className="mt-1 text-3xl font-black md:text-4xl">Token Metrics</h1>
            </div>
            <Badge className="ml-auto border border-blue-300/25 bg-blue-300/10 text-blue-100">
              Evidence not connected
            </Badge>
          </div>

          <p className="mt-5 max-w-3xl text-sm leading-6 text-slate-300 md:text-base">
            Token statistics should only become authoritative when they can be traced
            to a verified contract, network, indexer, block height, and timestamp.
            This page does not currently claim a deployed SKY444 contract, live token
            price, market cap, holder count, circulating supply, staking ratio, burn
            activity, or exchange listing.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          {REQUIRED_FIELDS.map(item => (
            <Card key={item.label} className="border-white/10 bg-white/[0.03]">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <item.icon className="h-4 w-4 text-blue-200" />
                    {item.label}
                  </CardTitle>
                  <Badge className="border border-amber-300/25 bg-amber-300/10 text-amber-100">
                    {item.value}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-slate-400">{item.detail}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <Card className="border-emerald-300/15 bg-emerald-300/[0.035]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-300" />
              Publication rule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-slate-300">
            <p>
              When token data is connected, every metric should show its source,
              network, block height or provider timestamp, refresh status, and
              calculation method. Cached or unavailable data should fail closed
              rather than reusing a demo value.
            </p>
            <p>
              Contract state, price feeds, exchange data, custody, treasury balances,
              and investor allocations are separate evidence domains and should not be
              inferred from one another.
            </p>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/tokenomics-calculator"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-black text-black"
          >
            Tokenomics calculator <ArrowRight className="h-4 w-4" />
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
