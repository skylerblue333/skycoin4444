import {
  AlertTriangle,
  Brain,
  Database,
  FileCheck2,
  Network,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authenticated, consent-aware personal-memory graph data service",
    icon: Database,
    detail:
      "Authenticated account ownership, strict tenant isolation, explicit consent, durable and attributable memory, relationship, identity, content, and metadata records, documented data classification and purpose, retention and deletion controls, access control, audit history, export and correction workflows, defined empty states, and reliable recovery are required before retrieving, creating, searching, changing, removing, or reporting a memory, relationship, connection, graph node, graph edge, user profile, personal data item, or graph result.",
  },
  {
    title:
      "Validated graph, inference, clustering, and visualization processing",
    icon: Network,
    detail:
      "A documented and evaluated graph-processing architecture, versioned schemas, data provenance, validated graph layout and rendering logic, deterministic interaction behavior, bounds and performance controls, accessible nonvisual alternatives, approved model and retrieval contracts, confidence-calibration methods, user controls, safety assessments, and independently verifiable evaluation evidence are required before generating or reporting a graph, constellation, cluster, label, description, strength score, confidence score, relationship, insight, AI inference, visualization, or interaction result.",
  },
  {
    title: "Privacy, security, and AI-data governance controls",
    icon: ShieldCheck,
    detail:
      "Privacy impact assessment, data-minimization rules, encryption with managed keys, authorization enforcement, secure secret handling, abuse prevention, rate limits, monitoring, incident response, access reviews, deletion verification, and evidence that the controls operate as designed are required before representing personal memory data, graph relationships, profiles, AI processing, rendered details, or a stored graph as private, protected, available, or successfully processed.",
  },
  {
    title: "Evidence-based graph operations and reporting",
    icon: FileCheck2,
    detail:
      "Traceable metric definitions, observable graph generation, monitoring, alerting, capacity and performance testing, documented synchronization semantics, retry and failure handling, support procedures, and independently verifiable operational evidence are required before reporting memory totals, connection counts, cluster counts, activity, graph depth, strengths, analytics, visualizer status, documentation availability, or production readiness.",
  },
];

export default function MemoryGraphVisualizer() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Memory graph visualizer
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Memory Constellation
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Personal memory graphs, graph connections and clusters, graph
            rendering, node selection, memory details, user profiles, AI
            inferences, confidence or strength scores, analytics, and
            operational metrics are not configured for this deployment. No
            memory, relationship, graph node, graph edge, cluster,
            visualization, profile, personal data item, inference, confidence
            score, strength score, metric, or service status is represented as
            current, complete, verified, active, private, protected, available,
            or delivered.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated graph, personal-memory, or AI result
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not retrieve, generate, render, select, infer,
                cluster, score, summarize, create, modify, remove, synchronize,
                or report a memory graph, graph node, graph connection, personal
                data item, profile, AI output, metric, or operational result. It
                does not claim that a personal memory graph has been stored,
                processed, protected, or visualized.
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
