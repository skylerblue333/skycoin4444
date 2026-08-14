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
    title: "Verified DeFi and liquidity infrastructure",
    icon: Landmark,
    detail:
      "Audited and deployed smart contracts, network and contract-address validation, custody controls, wallet authorization, transaction simulation and signature verification, pool accounting, liquidity and reward reconciliation, slippage and impermanent-loss disclosure, duplicate-submission prevention, failure handling, and on-chain confirmation are required before displaying or enabling a liquidity pool, farming position, stake, reward, APY, TVL, multiplier, balance, swap, or token transfer.",
  },
  {
    title: "Reliable financial and portfolio records",
    icon: Database,
    detail:
      "Source-attributed on-chain or reconciled off-chain records, documented metrics methodology, durable transaction history, ownership validation, time-aware pricing, privacy safeguards, data-quality checks, correction controls, and independent auditability are required before presenting token values, holdings, total value locked, yield, pool size, reward amount, investment outcome, or other financial metric.",
  },
  {
    title: "Authorized fundraising and launchpad governance",
    icon: Scale,
    detail:
      "Legal and regulatory review, project due diligence, issuer authorization, investor eligibility, jurisdictional restrictions, allocation policies, offering documentation, consumer protections, disclosure controls, recordkeeping, dispute handling, tax treatment, and compliance monitoring are required before presenting a project, sale, launchpad, IDO, fundraising total, target, participant count, allocation, tier, token right, or investment opportunity.",
  },
  {
    title: "Security, risk, and operational assurance",
    icon: ShieldCheck,
    detail:
      "Documented security assessments, independently verified audit reports, key management, access control, monitoring, incident response, anti-fraud controls, accurate risk disclosures, support procedures, and ongoing operational governance are required before asserting smart-contract safety, audit status, impermanent-loss protection, token qualification, project vetting, rewards, or financial protection.",
  },
];

export default function Farming() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> DeFi and launchpad service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Farming and Launchpad
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Liquidity pools, token pairs, farming, staking, APY, TVL,
            multipliers, rewards, smart-contract audits, launchpad projects,
            token sales, IDOs, fundraising totals, participant counts,
            allocation tiers, token qualification, financial metrics, portfolio
            positions, and investment outcomes are not configured for this
            deployment. No pool, token, wallet, contract, transaction, project,
            investment, reward, or financial value is represented as current,
            verified, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated yield, asset, allocation, sale, contract, or
                investment result
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not discover a liquidity pool, quote yield, value
                a wallet, verify a token, call a contract, initiate a stake or
                farm action, award a reward, list a funded project, determine
                eligibility, accept an investment, allocate a sale, or report
                that any financial action succeeded.
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
