import {
  AlertTriangle,
  Bot,
  Brain,
  Code2,
  ShieldCheck,
  Workflow,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "AI provider and model configuration",
    icon: Brain,
    detail:
      "A server-side model provider configuration, approved model catalog, usage policy, rate limits, and health monitoring are required before offering chat, generation, analysis, or learning tools.",
  },
  {
    title: "Code-generation and review safeguards",
    icon: Code2,
    detail:
      "Input handling, output labeling, dependency and security review, error recovery, and clear user responsibility boundaries are required before presenting generated code or quality scores.",
  },
  {
    title: "Platform intelligence and automation",
    icon: Workflow,
    detail:
      "Validated data sources, authorization boundaries, moderation controls, audit logs, and human review are required before reporting recommendations, rankings, fraud signals, or autonomous actions.",
  },
  {
    title: "Transparent and safe operation",
    icon: ShieldCheck,
    detail:
      "Clear AI disclosure, retention controls, abuse prevention, monitoring, and incident response are required before this can be represented as a live, production AI service.",
  },
];

export default function AIBrain() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> AI service unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            AI Brain
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            The AI service has not been configured for this deployment. Chat,
            code generation, debugging, review, optimization, lessons,
            autonomous platform intelligence, model metrics, and performance
            claims are unavailable until a verified service is connected.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated model responses or operational metrics
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not fabricate model responses, code results,
                quality scores, user counts, moderation actions, latency,
                accuracy, or active-agent status. It will remain informational
                until the required AI controls are implemented and verifiable.
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

        <section className="mt-8 rounded-xl border border-slate-700 bg-slate-900 p-5 text-sm text-slate-300">
          <div className="flex items-center gap-3">
            <Bot className="h-5 w-5 text-sky-300" />
            <span className="font-medium text-white">Service boundary</span>
          </div>
          <p className="mt-3 leading-6">
            AI features should be enabled only after model routing, server-side
            credential storage, output moderation, tracing, quotas, error
            handling, and user disclosure are all in place. No AI operation can
            be safely inferred from this interface alone.
          </p>
        </section>
      </div>
    </main>
  );
}
