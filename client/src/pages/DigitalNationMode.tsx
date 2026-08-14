import {
  Activity,
  AlertTriangle,
  Database,
  Scale,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authorized identity, membership, and access records",
    icon: Database,
    detail:
      "A defined program scope, authenticated and consented membership records, transparent eligibility rules, appropriate privacy controls, durable audit trails, correction and appeal processes, clear terms, and legally accurate representations are required before assigning citizenship, residency, delegation, office, privilege, membership level, voting weight, program status, or territory affiliation.",
  },
  {
    title: "Governed proposal and decision workflows",
    icon: Scale,
    detail:
      "Documented governance rules, authorized participants, quorum and voting methodology, identity and eligibility verification, conflict-of-interest controls, human review, complete audit logs, public record policy, dispute processes, and approved execution controls are required before presenting a constitution, law, amendment, proposal, ratification, vote, office, committee, governance right, or decision as active or binding.",
  },
  {
    title: "Verified financial and treasury operations",
    icon: ShieldCheck,
    detail:
      "Authorized custody, validated accounts and networks, source-attributed financial records, accounting and reconciliation, allocation approval, transaction signing and confirmation, spending controls, disclosure policy, incident response, and independent auditability are required before displaying a treasury, budget, economic output, revenue, burn, reward pool, staking pool, allocation, token balance, or financial metric.",
  },
  {
    title: "Safe AI assistance and operational transparency",
    icon: Activity,
    detail:
      "Versioned AI systems, documented intended use, approved source data, model validation, safety and bias review, human oversight, monitoring, decision traceability, correction channels, and explicit non-binding status are required before an AI system analyzes community data, proposes a rule, assigns confidence, estimates an impact, recommends a financial adjustment, or reports an operational event.",
  },
];

export default function DigitalNationMode() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Digital governance service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Digital Nation Mode
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Citizenship tiers, territories, citizen counts, constitutional
            articles, binding governance rights, proposals, voting power,
            election or office claims, treasury and budget figures, economic
            metrics, token staking, revenue sharing, national events,
            AI-proposed laws, confidence scores, and autonomous governance
            actions are not configured for this deployment. No legal status,
            public authority, financial record, policy, vote, member, AI
            recommendation, or decision is represented as active, official,
            verified, or enforceable.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated civic status, governance result, financial record,
                or AI law
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not confer membership or citizenship, verify an
                identity, assign a tier, count members, define a territory,
                receive a proposal, run a vote, ratify a policy, authorize
                spending, calculate a treasury, execute a token transaction,
                determine a reward, analyze community information, generate a
                binding AI proposal, or report that a governance action
                succeeded.
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
