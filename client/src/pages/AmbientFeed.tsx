import {
  Activity,
  AlertTriangle,
  Database,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authorized content and interaction records",
    icon: Database,
    detail:
      "Authenticated and appropriately scoped source records, current visibility and moderation rules, author authorization, content provenance, deletion propagation, safe pagination, content access checks, durable interaction records, idempotent actions, and error handling are required before showing a post, creator, tag, reaction, comment, share, bookmark, timestamp, stream, or content action.",
  },
  {
    title: "Privacy-safe social and behavioral context",
    icon: UserRoundCheck,
    detail:
      "Explicit user consent where required, purpose limitation, minimization, relationship provenance, visibility settings, sensitive-data controls, correction and deletion pathways, audit logs, and transparency notices are required before representing interests, network activity, people a user knows, follow relationships, personal relevance, behavioral context, or inferred social information.",
  },
  {
    title: "Governed AI ranking and insight operations",
    icon: Activity,
    detail:
      "Versioned models, documented intended use, representative evaluation data, validation and calibration, bias and safety assessment, quality and drift monitoring, human oversight, explainability policy, and correction channels are required before assigning relevance, sentiment, energy, virality, trend, personalization, engagement likelihood, prediction accuracy, recommendation, or AI insight.",
  },
  {
    title: "Verified real-time and financial-data assurance",
    icon: ShieldCheck,
    detail:
      "Source-attributed telemetry, documented metric methodology, data-quality monitoring, anti-abuse controls, freshness indicators, secure financial integrations, accounting and reconciliation, incident response, and independent auditability are required before presenting a live stream, recent event, reaction count, view rate, trend percentage, token yield, treasury amount, governance outcome, dating compatibility, or other current operational or financial claim.",
  },
];

export default function AmbientFeed() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Personalized ambient feed
            service unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ambient Feed
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Content feeds, authors, reactions, comments, shares, bookmarks, live
            streams, tags, activity counts, trending topics, engagement rates,
            social-graph information, interest matching, behavioral
            personalization, sentiment, AI highlights, relevance scores, viral
            indicators, financial updates, token yields, treasury values,
            governance results, dating compatibility, and other real-time
            metrics are not configured for this deployment. No post, person,
            relationship, metric, inference, financial record, or activity state
            is represented as current, verified, or actionable.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated feed, interaction, social inference, AI insight, or
                live metric
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not retrieve or rank content, identify an author,
                infer an interest, access a social relationship, calculate
                sentiment or compatibility, measure engagement, report a live
                stream, create a reaction, save a bookmark, query a financial
                source, generate an AI insight, or report that an interaction or
                analysis succeeded.
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
