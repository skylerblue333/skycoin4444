import {
  AlertTriangle,
  Building2,
  FileCheck2,
  Landmark,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Legal offering and regulatory review",
    icon: FileCheck2,
    detail:
      "Jurisdiction-specific legal review, verified offering documentation, eligibility controls, disclosures, investor suitability processes, and ongoing compliance oversight are required before accepting or soliciting investments.",
  },
  {
    title: "Payment, custody, and settlement infrastructure",
    icon: Landmark,
    detail:
      "Licensed payment processing, customer verification, transaction monitoring, escrow or custody arrangements, reconciliation, refund handling, and verified settlement records are required before processing a purchase or crediting an asset.",
  },
  {
    title: "Token, wallet, and vesting operations",
    icon: ShieldCheck,
    detail:
      "Audited token contracts, supported-network verification, secure wallet controls, vesting administration, claim processing, transaction-status verification, and incident response are required before showing balances, allocations, or vesting results.",
  },
  {
    title: "Investor records and communications",
    icon: Building2,
    detail:
      "Authenticated investor records, access controls, complete source-of-truth reporting, privacy safeguards, risk disclosures, audit trails, and support processes are required before publishing fundraise metrics, portfolio information, or referral outcomes.",
  },
];

export default function InvestorPortal() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Investment service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Investor Portal
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Token sales, investments, fundraising, investor onboarding, payment
            collection, allocations, vesting, claims, referrals, tokenomics,
            valuations, market listings, and portfolio information are not
            configured for this deployment. No offering, price, return,
            allocation, balance, or transaction is represented as available or
            verified.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated sale, financial, or investment activity
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not accept payment, calculate token amounts,
                quote a price, show a funding total, create an investment
                record, process a vesting claim, issue a referral reward, or
                make any representation about future value, liquidity, exchange
                access, or investment performance.
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
