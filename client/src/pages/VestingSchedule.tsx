import {
  AlertTriangle,
  Database,
  Landmark,
  Scale,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Verified token issuance and allocation records",
    icon: Database,
    detail:
      "A documented token specification, authorized issuance records, independently verifiable allocation methodology, wallet and ownership validation, immutable source references, version control, reconciliation, disclosure controls, and independent review are required before displaying token supply, allocations, holders, circulating supply, token generation events, unlock schedules, or allocation categories.",
  },
  {
    title: "Secure vesting and claim infrastructure",
    icon: Landmark,
    detail:
      "Audited smart contracts or secure off-chain vesting controls, authenticated beneficiary records, custody safeguards, network and transaction validation, signature verification, eligibility checks, release calculations, duplicate-claim prevention, confirmation tracking, failure handling, and audit trails are required before calculating, unlocking, claiming, or representing a vesting position, cliff, schedule, balance, or distribution.",
  },
  {
    title: "Investor, issuer, and compliance governance",
    icon: Scale,
    detail:
      "Appropriate legal review, investor and issuer authorization, jurisdictional restrictions, securities and consumer-law analysis, contractual documentation, disclosure and recordkeeping processes, tax treatment, transfer controls, dispute handling, and regulatory compliance are required before referring to founders, advisors, investors, sales, token rights, financial participation, or token-related benefits.",
  },
  {
    title: "Reliable financial and security controls",
    icon: ShieldCheck,
    detail:
      "Reconciled ledgers, access controls, key management, privacy safeguards, security monitoring, incident response, fraud prevention, transparent methodology, error correction, retention controls, and independent auditability are required before presenting financial balances, locked or unlocked values, circulating percentages, activity, ownership, or other value-bearing records.",
  },
];

export default function VestingSchedule() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Vesting service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Token Vesting Schedule
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Token supply, allocation, founder, advisor, investor, ecosystem,
            community, reserve, token-generation, cliff, vesting, unlocked,
            locked, circulation, key-date, personal-vesting, claim, token-sale,
            and staking claims are not configured for this deployment. No token,
            wallet, allocation, schedule, ownership record, claim eligibility,
            transaction, balance, or financial value is represented as current,
            verified, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated token schedule, wallet position, or claim outcome
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not model an issued token supply, calculate a
                vesting or unlock event, determine an investor or beneficiary
                position, reveal an account balance, transfer tokens, call a
                claim contract, or report that a financial transaction or
                entitlement succeeded.
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
