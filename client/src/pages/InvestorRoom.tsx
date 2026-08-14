import {
  AlertTriangle,
  BarChart3,
  Database,
  Landmark,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Verified financial reporting and controls",
    icon: BarChart3,
    detail:
      "Authoritative source systems, accounting controls, period definitions, reconciliations, review and approval workflows, audit trails, correction procedures, and access controls are required before presenting users, revenue, treasury, transaction, liquidity, or financial-performance metrics.",
  },
  {
    title: "Token and market-data verification",
    icon: Database,
    detail:
      "Validated contract addresses, supported networks, indexed data, supply methodology, market-data licensing, source attribution, price validation, availability handling, and reconciliation are required before presenting a token distribution, supply, allocation, circulation amount, market price, or staking figure.",
  },
  {
    title: "Investment and fundraising compliance",
    icon: Landmark,
    detail:
      "Appropriate legal review, investor eligibility controls, jurisdictional restrictions, risk disclosures, offering documentation, recordkeeping, communication approval, anti-fraud procedures, and a compliant transaction process are required before inviting investment, offering a private sale, or describing a partnership opportunity.",
  },
  {
    title: "Secure deal-room and document management",
    icon: ShieldCheck,
    detail:
      "Authenticated investor access, least-privilege authorization, approved confidential-material handling, document versioning, audit logs, secure communications, incident response, and data-retention controls are required before operating an investor room or providing a pitch deck.",
  },
];

export default function InvestorRoom() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Investor service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Investor Room
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Investment opportunities, private sales, funding allocations,
            partnerships, pitch materials, tokenomics, token prices, token
            supply, financial KPIs, revenue, treasury balances, staking figures,
            growth metrics, valuations, and investment roadmaps are not
            configured for this deployment. No financial, market, fundraising,
            performance, or investment claim is represented as current,
            verified, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated investor data, fundraising, or financial
                performance
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not publish a pitch deck, identify an investment
                offering, accept an investment, allocate a token, calculate or
                display a price, show a treasury balance, represent revenue, or
                make a claim about investment performance or valuation.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2">
          {serviceRequirements.map(requirement => {
            const Icon = requirement.icon;
            return (
              <Card
                key={requirement.title}
                className="border-slate-700 bg-slate-900"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-base text-white">
                    <span className="rounded-lg bg-slate-800 p-2 text-sky-300">
                      <Icon className="h-5 w-5" />
                    </span>
                    {requirement.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-slate-300">
                    {requirement.detail}
                  </p>
                  <p className="mt-4 text-xs font-medium text-slate-400">
                    Status: not configured
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </section>
      </div>
    </main>
  );
}
