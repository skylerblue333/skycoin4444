import {
  Activity,
  AlertTriangle,
  Database,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authorized content catalog and visibility controls",
    icon: Database,
    detail:
      "Authenticated content sources, durable records, ownership and moderation checks, visibility controls, deletion and correction workflows, source provenance, safe pagination, audit logging, tenant isolation, and clear empty and error states are required before displaying a content item, creator, title, media reference, category, tag, or feed result.",
  },
  {
    title: "Verified engagement and trend measurement",
    icon: TrendingUp,
    detail:
      "Source-attributed events, documented metric definitions, deduplication, timestamp integrity, freshness controls, anti-bot protections, quality monitoring, reconciliation, privacy safeguards, and independently verifiable calculations are required before reporting views, likes, shares, comments, popularity, velocity, engagement, or a trend ranking.",
  },
  {
    title: "Safe ranking and recommendation governance",
    icon: ShieldCheck,
    detail:
      "Documented ranking methodology, privacy-aware input handling, access controls, content-safety policy enforcement, bias and misuse review, user controls, explainability where appropriate, incident response, secure error handling, and human escalation are required before recommending, ranking, promoting, or labeling content as trending.",
  },
  {
    title: "Evidence-based live operations and performance reporting",
    icon: Activity,
    detail:
      "Source-attributed telemetry, observability, capacity monitoring, documented performance tests, quality controls, and independent evidence are required before claiming live data, real-time updates, advanced analytics, automation, active user counts, transactions, success rates, response times, or production readiness.",
  },
];

export default function Trending() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Trending service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Trending
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Content feeds, creator identities, titles, media references, trend
            rankings, recommendations, engagement metrics, active user counts,
            transactions, live updates, analytics, automation, success rates,
            and response times are not configured for this deployment. No
            content item, creator, rank, trend, engagement result, metric, or
            service result is represented as current, complete, verified, or
            available.
          </p>
        </header>
        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated content, creator, rank, trend, recommendation,
                metric, or live update
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not retrieve a content catalog, identify a
                creator, rank a post, calculate engagement, recommend media,
                stream a feed, create a trend, or report that a content action
                succeeded.
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
