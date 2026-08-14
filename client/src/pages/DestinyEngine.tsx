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
    title: "User-controlled goal and progress records",
    icon: Database,
    detail:
      "Authenticated ownership, explicit user-provided inputs, consent, access controls, edit and deletion functions, retention limits, data lineage, correction workflows, and clear purpose limitation are required before displaying a personal goal, progress record, skill, achievement, activity pattern, relationship, reputation, or individualized profile.",
  },
  {
    title: "Validated and bounded decision-support models",
    icon: Activity,
    detail:
      "A documented intended use, versioned model, representative evaluation data, independent validation, calibration and uncertainty testing, safety and bias review, drift monitoring, human oversight, and a meaningful correction or appeal process are required before presenting a personal probability, outcome projection, confidence score, ranking, risk, recommendation, or AI-generated insight.",
  },
  {
    title: "Financial, civic, and high-impact safeguards",
    icon: Scale,
    detail:
      "Appropriate authorization, legal and compliance review, clear non-advisory disclosures, evidence-based data, eligibility verification, transaction and governance controls, recordkeeping, and human decision authority are required before recommending financial activity, staking, investments, career or wealth outcomes, voting behavior, election or office prospects, governance action, or other high-impact personal decision.",
  },
  {
    title: "Privacy, safety, and accountable operations",
    icon: ShieldCheck,
    detail:
      "Privacy impact assessment, minimization, role-based access, audit logging, incident response, transparency notices, content controls, support procedures, and operational monitoring are required before processing personal information or representing that a system can compute, track, forecast, optimize, or advise on an individual’s future.",
  },
];

export default function DestinyEngine() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Personal prediction
            service unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Destiny Engine
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Life-path simulations, future probabilities, projected timeframes,
            wealth and investment outcomes, career or startup outcomes, civic or
            election outcomes, reputation outcomes, required action lists,
            personal-risk analysis, goal tracking, AI confidence values,
            individualized advice, and automated reports are not configured for
            this deployment. No person’s future, finances, capability, behavior,
            status, opportunity, risk, eligibility, or outcome is predicted,
            ranked, assessed, or actionable here.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated destiny, financial projection, civic forecast, or
                AI advice
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not inspect personal data, derive a behavioral
                signal, calculate a probability, forecast a life event, estimate
                financial performance, recommend an investment or transaction,
                determine a governance result, identify a personal risk,
                generate an advisor message, run a simulation, or report that
                any personalized analysis succeeded.
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
