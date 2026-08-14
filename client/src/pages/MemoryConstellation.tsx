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
    title: "User-controlled memory records",
    icon: Database,
    detail:
      "Authenticated ownership, clear collection purpose, informed consent, granular visibility settings, edit and deletion controls, retention limits, encrypted storage, export capability, and data-quality safeguards are required before showing a memory, skill, goal, relationship, achievement, personal event, or activity history.",
  },
  {
    title: "Safe relationship and profile modeling",
    icon: ShieldCheck,
    detail:
      "Documented permissions, relationship provenance, user review, contextual integrity, privacy impact assessment, access controls, sensitive-data handling, and correction mechanisms are required before inferring or displaying a connection, mentor, partner, group affiliation, capability, achievement, or personal characteristic.",
  },
  {
    title: "Governed AI insight and prediction operations",
    icon: Activity,
    detail:
      "Versioned models, documented inputs and intended use, representative evaluation data, independent validation, calibration and drift monitoring, bias and safety assessments, confidence policy, human oversight, and an appeal path are required before presenting an AI-generated pattern, insight, ranking, confidence value, recommendation, or prediction.",
  },
  {
    title: "Transparent policy and operational controls",
    icon: Scale,
    detail:
      "Published user notices, appropriate legal basis, role-based authorization, audit logs, incident response, redaction, moderation, and support procedures are required before operating a personal-knowledge graph or representing that derived information is complete, accurate, current, or suitable for a decision.",
  },
];

export default function MemoryConstellation() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Personal memory
            intelligence service unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Memory Constellation
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Personal memory maps, skills, goals, relationships, achievements,
            graph nodes, connections, behavioral patterns, model-generated
            predictions, confidence values, and AI-derived insights are not
            configured for this deployment. No personal information,
            association, accomplishment, capability, activity, or prediction is
            represented as collected, inferred, current, verified, or
            actionable.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated personal record, relationship graph, or AI
                prediction
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not collect or inspect personal data, create a
                user profile, generate random memories, derive a relationship,
                assign a skill or achievement, build a graph, measure a pattern,
                run an AI model, calculate confidence, or make a prediction
                about a person.
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
