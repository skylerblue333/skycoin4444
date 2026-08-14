import {
  AlertTriangle,
  BrainCircuit,
  Database,
  ShieldCheck,
  UserRoundCog,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Consent-based personal data model",
    icon: UserRoundCog,
    detail:
      "Clear user consent, a documented personal-data model, purpose limitation, data minimization, access and deletion controls, privacy notices, retention rules, authenticated access, and audit records are required before collecting or displaying a personal profile, life history, activity record, or inferred attribute.",
  },
  {
    title: "Verified activity and outcome records",
    icon: Database,
    detail:
      "Authoritative persisted records, source attribution, authorization, event integrity, reconciliation, correction controls, and transparent definitions are required before representing course completion, tasks, missions, reputation, governance activity, tokens, staking, community activity, skills, accomplishments, or historical events.",
  },
  {
    title: "Responsible AI assistance and digital-twin controls",
    icon: BrainCircuit,
    detail:
      "A configured and governed AI service, clear capability boundaries, model and prompt controls, user consent, secure memory handling, content safeguards, output validation, human escalation, monitoring, and an incident process are required before generating or representing an AI profile, digital twin, personal suggestion, or automated recommendation.",
  },
  {
    title: "Transparent scoring and safety governance",
    icon: ShieldCheck,
    detail:
      "A validated scoring methodology, non-discrimination review, source-of-truth inputs, explanation and correction paths, security review, risk assessment, support procedures, and ongoing governance are required before calculating or displaying a life score, rank, trend, level, priority, performance, or personal assessment.",
  },
];

export default function LifeCommand() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Life Command service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Life Command
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Personal life scores, ranks, trends, profiles, digital-twin
            attributes, action recommendations, mission history, activity
            records, reputation, learning, governance, token, staking, and
            community metrics are not configured for this deployment. No
            personal attribute, achievement, score, event, financial state, or
            AI recommendation is represented as current, verified, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated personal score, history, or AI assessment
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not create a digital twin, infer a personality or
                archetype, calculate a score or rank, evaluate personal
                performance, retain a personal history, present an AI
                recommendation, or represent a financial, social, learning, or
                governance outcome as verified.
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
