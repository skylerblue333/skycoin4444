import {
  Activity,
  AlertTriangle,
  Database,
  Hash,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Moderated, source-attributed content indexing",
    icon: Hash,
    detail:
      "A published content model, authenticated or appropriately scoped source records, tag-normalization rules, content moderation, deletion and correction propagation, privacy controls, authorization checks, pagination, and index-consistency monitoring are required before listing a hashtag, post, author, or conversation.",
  },
  {
    title: "Accurate trend and engagement measurement",
    icon: Activity,
    detail:
      "Documented metric definitions, attributable events, bot and abuse filtering, deduplication, time-window methodology, privacy review, quality monitoring, correction handling, and clear freshness information are required before labeling a tag as trending or displaying mentions, rank, like count, view count, activity, popularity, or engagement data.",
  },
  {
    title: "Safe search and discovery operations",
    icon: Database,
    detail:
      "Input validation, query limits, rate controls, authorization-aware filtering, safe handling of user-generated content, content visibility policy, error handling, auditability, and accessible empty states are required before accepting a tag search, retrieving posts, applying a hashtag filter, or reporting that a result set is complete.",
  },
  {
    title: "Privacy, safety, and operational assurance",
    icon: ShieldCheck,
    detail:
      "Data minimization, user and community controls, reporting and moderation workflows, platform policy enforcement, incident response, retention procedures, and production observability are required before exposing creator information, activity timing, public discussion data, or analytics to a user.",
  },
];

export default function HashtagExplorer() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Hashtag discovery service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Hashtag Explorer
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Hashtag search, trending topics, post feeds, content filtering,
            creator identities, mention totals, rankings, like counts, view
            counts, activity dates, and engagement analytics are not configured
            for this deployment. No tag, post, account, author, engagement
            event, ranking, or metric is represented as indexed, current,
            complete, public, or verified.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated tag, post, trend, creator, or engagement metric
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not search content, query a feed, infer a trend,
                count a mention, calculate a rank, display an author, expose a
                post, determine a view or like total, filter a conversation, or
                report that a hashtag result exists.
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
