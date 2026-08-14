import {
  AlertTriangle,
  BrainCircuit,
  Database,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "AI intelligence and recommendation service",
    icon: BrainCircuit,
    detail:
      "A configured server-side model provider, reviewed data inputs, measurable evaluation, prompt and output safeguards, human oversight, transparent limitations, and user controls are required before generating a suggestion, prediction, recommendation, or insight.",
  },
  {
    title: "Consented social and behavioral data processing",
    icon: UsersRound,
    detail:
      "Consent-aware data collection, privacy review, data minimization, retention limits, access controls, bias testing, correction rights, and a defined legal basis are required before processing social interactions or inferring behavior, preferences, or relationships.",
  },
  {
    title: "Reliable event, trend, and market-data infrastructure",
    icon: Database,
    detail:
      "Verified source data, provenance, timestamping, event integrity, stale-data handling, aggregation controls, observability, and clear methodology are required before presenting world state, trends, activity, prices, sentiment, or momentum.",
  },
  {
    title: "Action authorization and safety controls",
    icon: ShieldCheck,
    detail:
      "Authenticated ownership, scoped permissions, explicit confirmation, financial and privacy protections, audit logs, rollback, incident response, and support processes are required before an AI system can create content, change a feed, initiate an action, or affect an account.",
  },
];

export default function WorldBrain() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> World Brain service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            World Brain
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Ambient intelligence, world simulations, AI personas, context-aware
            feed changes, behavioral predictions, autonomous actions, trend
            analysis, market signals, prices, sentiment, and action-impact
            forecasts are not configured for this deployment. No simulated
            event, entity, insight, recommendation, prediction, or financial
            result is represented as real, current, or actionable.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated collective-intelligence or autonomous activity
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not create an ambient world state, monitor people
                or activity, infer behavior, rank trends, generate posts, modify
                a feed, recommend a financial or social action, calculate an
                expected impact, or execute an action on a user’s behalf.
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
