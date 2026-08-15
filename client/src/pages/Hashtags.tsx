import {
  AlertTriangle,
  Database,
  FileCheck2,
  Hash,
  Search,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Persisted tags, content, users, and relationship records",
    icon: Database,
    detail:
      "Authenticated and tenant-isolated services for tags, posts, media, users, creators, follows, reactions, moderation, timestamps, privacy, deletion, and search indexing are required before retrieving, creating, editing, deleting, aggregating, or reporting a hashtag, post, user, creator, relation, count, or content result.",
  },
  {
    title: "Verified discovery and trend semantics",
    icon: Search,
    detail:
      "Documented normalization, language and spelling rules, time windows, ranking and tie handling, duplicate and bot detection, moderation exclusions, privacy controls, pagination, indexing freshness, and reproducible queries are required before representing a hashtag as trending, popular, rising, relevant, safe, active, or associated with any engagement or discovery result.",
  },
  {
    title: "Authorization, moderation, and user-safety controls",
    icon: ShieldCheck,
    detail:
      "Authenticated authorization, content ownership, abuse and spam prevention, moderation and reporting workflows, rate limits, privacy safeguards, audit logs, deletion propagation, incident response, and evidence that controls operate as designed are required before enabling or representing a hashtag action, content association, notification, automation, export, or user-specific result as authorized, protected, complete, or successful.",
  },
  {
    title: "Evidence-based engagement and operational reporting",
    icon: FileCheck2,
    detail:
      "Traceable source data, metric definitions, monitoring, update timestamps, synchronization semantics, performance and failure testing, support procedures, and independently verifiable records are required before reporting active users, posts, reach, impressions, interactions, transactions, response times, success rates, analytics, automation outcomes, documentation availability, or production readiness.",
  },
];

export default function Hashtags() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Hashtags service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Hashtags
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Verified hashtag, content, user, creator, search, moderation,
            engagement, analytics, automation, operational, and support services
            are not configured for this deployment. No tag, content item, user,
            creator, post, count, trend, reach, interaction, metric, relation,
            or service status is represented as current, complete, verified,
            active, relevant, private, available, or successful.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated tags, content discovery, or engagement metrics
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not retrieve or create hashtags, search or rank
                content, count posts or users, calculate trends or engagement,
                moderate content, send notifications, synchronize records,
                automate actions, or report analytics or operational outcomes.
                It does not claim that any discovery, association, trend, or
                user action exists or succeeded.
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

        <div className="mt-8 flex items-center gap-3 text-sm text-slate-400">
          <Hash className="h-4 w-4" /> Hashtag discovery and engagement
          reporting will remain disabled until the required services are
          configured and verified.
        </div>
      </div>
    </main>
  );
}
