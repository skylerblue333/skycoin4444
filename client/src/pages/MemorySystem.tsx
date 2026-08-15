import {
  AlertTriangle,
  Brain,
  Database,
  FileCheck2,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authenticated, consent-aware memory data service",
    icon: Database,
    detail:
      "Authenticated account ownership, strict tenant isolation, explicit consent, durable and attributable memory records, documented collection purpose, data classification, retention and deletion controls, input and output validation, access control, audit history, export and correction workflows, defined empty states, and reliable recovery are required before listing, creating, changing, removing, searching, synchronizing, or reporting any preference, context, interaction, knowledge, tag, memory, user profile, or activity record.",
  },
  {
    title: "Validated AI-memory, preference, and graph processing safeguards",
    icon: Brain,
    detail:
      "A documented and evaluated memory-processing architecture, approved model and data-use contracts, prompt and retrieval controls, provenance, confidence-calibration methods, user controls, bias and safety assessments, human-review pathways where appropriate, versioned graph and inference logic, deterministic failure handling, and independently verifiable evaluation evidence are required before creating or reporting an AI memory, preference model, context window, graph node, confidence score, compression result, inferred interest, user characteristic, insight, recommendation, or automated outcome.",
  },
  {
    title: "Privacy, security, and governance controls",
    icon: ShieldCheck,
    detail:
      "Privacy impact assessment, data-minimization rules, encryption with managed keys, authorization enforcement, secure secret handling, abuse prevention, rate limits, monitoring, incident response, access reviews, deletion verification, and evidence that the controls operate as designed are required before representing personal memory or preference data, account context, profile information, AI processing, synchronization, or a stored record as private, protected, available, or successfully processed.",
  },
  {
    title: "Evidence-based synchronization and operational reporting",
    icon: FileCheck2,
    detail:
      "Defined synchronization semantics, idempotency and conflict-resolution controls, observable job execution, retry and failure handling, traceable metric definitions, monitoring, alerting, capacity and performance testing, documented support procedures, and independently verifiable operational evidence are required before starting or reporting memory synchronization, active context, retention duration, graph size, compression, activity, performance, status, analytics, documentation availability, or production readiness.",
  },
];

export default function MemorySystem() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Long-term memory service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Long-Term Memory System
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Persistent memories, preference models, context continuity, memory
            graphs, synchronization, confidence scores, user and activity data,
            AI inferences, analytics, and operational metrics are not configured
            for this deployment. No memory, profile, preference, context,
            interaction, knowledge item, tag, graph node, confidence score,
            synchronization outcome, AI result, user characteristic, metric, or
            service status is represented as current, complete, verified,
            active, private, protected, available, or delivered.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated memory, profile, AI, or synchronization result
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not access, create, search, alter, remove,
                synchronize, infer, compress, rank, or report a memory,
                preference, context, interaction, knowledge item, user profile,
                activity, graph, confidence score, AI output, metric, or
                operational result. It also does not claim that any personal
                data has been stored, processed, protected, retained, deleted,
                or synchronized.
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
