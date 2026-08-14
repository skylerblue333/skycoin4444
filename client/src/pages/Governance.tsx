import {
  AlertTriangle,
  Database,
  Scale,
  ShieldCheck,
  Vote,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Governance authority and voting rules",
    icon: Vote,
    detail:
      "A documented governance charter, eligible-voter rules, identity or token-weight verification, delegation controls, quorum and threshold definitions, timing rules, conflict procedures, and independent auditability are required before accepting or displaying a vote.",
  },
  {
    title: "Proposal, result, and execution records",
    icon: Database,
    detail:
      "Durable proposal records, author authorization, versioning, secure voting receipts, tamper-evident result calculation, outcome publication, change tracking, and execution evidence are required before presenting a proposal, tally, participation rate, or passed result.",
  },
  {
    title: "Treasury and financial safeguards",
    icon: ShieldCheck,
    detail:
      "Custody architecture, multi-party approvals, transaction controls, reconciliation, disclosure, authorization boundaries, incident response, and compliance review are required before displaying a treasury balance or letting governance affect financial assets.",
  },
  {
    title: "Policy and dispute-resolution operations",
    icon: Scale,
    detail:
      "Clear scope, community policies, moderation, legal review where applicable, appeal mechanisms, enforcement ownership, and support procedures are required before operating a governance system or claiming protocol control.",
  },
];

export default function Governance() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Governance service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Governance
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Proposals, voting, abstentions, delegation, quorum, participation,
            passed or failed outcomes, treasury balances, token approvals, and
            protocol-governance controls are not configured for this deployment.
            No proposal, vote, result, token decision, treasury amount, or
            governance authority is represented as active, final, or verified.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated proposals, votes, or treasury activity
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not submit a proposal, count a vote, calculate
                quorum or participation, delegate voting power, announce an
                outcome, alter a protocol, approve a token, or move or report
                treasury funds.
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
