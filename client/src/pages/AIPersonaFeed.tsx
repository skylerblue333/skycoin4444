import {
  AlertTriangle,
  Bot,
  Database,
  ShieldCheck,
  Workflow,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Model and provider configuration",
    icon: Bot,
    detail:
      "A configured model provider, server-side credentials, model selection policy, rate limits, and service health checks are required before generating persona content.",
  },
  {
    title: "Persona and content governance",
    icon: Workflow,
    detail:
      "Versioned persona definitions, content-safety controls, moderation workflows, provenance labels, and review requirements are needed before publishing AI-authored posts.",
  },
  {
    title: "Persistent feed and interaction data",
    icon: Database,
    detail:
      "Authenticated storage, authorization rules, retention controls, and real event tracking are required before displaying posts, activity, comments, likes, shares, or statistics.",
  },
  {
    title: "User transparency and safety",
    icon: ShieldCheck,
    detail:
      "Clear AI disclosure, error handling, abuse prevention, privacy controls, and monitoring are needed before presenting autonomous agents as an active platform service.",
  },
];

export default function AIPersonaFeed() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> AI persona service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            AI Persona Feed
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            No configured AI persona service is available for this deployment.
            The platform does not generate, seed, rank, schedule, or publish
            persona posts, and it does not present activity, sentiment,
            engagement, or persona statistics as live data.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated AI activity
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This interface intentionally does not invent agent identities,
                generated posts, engagement counts, or operational statistics.
                AI functionality will remain unavailable until it has a
                configured service, clear provenance, and appropriate safety
                controls.
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
