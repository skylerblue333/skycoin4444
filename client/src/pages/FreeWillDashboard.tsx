import {
  AlertTriangle,
  Brain,
  Database,
  ShieldCheck,
  Workflow,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Scoped AI service and decision controls",
    icon: Brain,
    detail:
      "A configured AI provider, approved use cases, authenticated server-side execution, explicit action boundaries, human oversight, rate limits, prompt and output safeguards, monitoring, and safe failure handling are required before representing autonomous goals, decisions, or recommendations.",
  },
  {
    title: "Verified goal, memory, and event records",
    icon: Database,
    detail:
      "Durable and authorized goal records, explicit retention policies, consent controls, provenance, data-quality checks, user correction and deletion workflows, auditability, and secure event handling are required before displaying goal progress, memory nodes, behavioral information, or a live activity feed.",
  },
  {
    title: "Transparent behavioral and governance methodology",
    icon: Workflow,
    detail:
      "Defined inputs, documented methodology, fairness review, access controls, explanation and appeal processes, correction workflows, anti-manipulation measures, and independent validation are required before displaying archetypes, confidence, optimization scores, governance health, or behavior-based analysis.",
  },
  {
    title: "Operational and privacy safeguards",
    icon: ShieldCheck,
    detail:
      "Least-privilege authorization, privacy review, secrets management, structured logging without sensitive content, abuse protections, incident response, policy enforcement, and clear user disclosures are required before enabling an AI control center or platform command surface.",
  },
];

export default function FreeWillDashboard() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Autonomous AI service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Free Will Dashboard
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Autonomous AI goals, decision logs, reasoning, confidence scores,
            self-optimization, behavior profiles, archetypes, memory graphs,
            governance health, platform analytics, live event feeds, and AI
            action counts are not configured for this deployment. No AI process,
            behavioral signal, decision, optimization result, or platform metric
            is represented as active, current, verified, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated AI autonomy, behavioral inference, or decision
                history
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not initiate an AI action, create or progress a
                goal, infer a behavioral archetype, persist a memory graph,
                issue a recommendation, produce a confidence score, calculate
                governance health, or display a live platform metric.
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
