import {
  AlertTriangle,
  Database,
  Search,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authorized searchable records and data contracts",
    icon: Database,
    detail:
      "Authenticated access, tenant isolation, scoped authorization, documented searchable-record types, durable records, source attribution, index freshness controls, safe pagination, deletion and correction workflows, audit logging, and clear empty and error states are required before returning any user, post, token, community, game, marketplace, tournament, charity, media, profile, or external-data search result.",
  },
  {
    title: "Verified search, indexing, and relevance integration",
    icon: Search,
    detail:
      "Authorized indexing providers, input validation, query controls, documented ranking and filtering behavior, query and result limits, source-data reconciliation, reindexing workflows, availability monitoring, retry handling, and evidence-based relevance evaluation are required before processing a search, presenting a ranking, providing a recommendation, or reporting a result count.",
  },
  {
    title: "Privacy, safety, and content-governance controls",
    icon: ShieldCheck,
    detail:
      "Visibility and consent enforcement, sensitive-data minimization, content moderation, abuse prevention, safe logging, retention limits, incident response, report and appeal workflows, access reviews, and independently evidenced safeguards are required before making identity, content, activity, financial, community, or external records discoverable.",
  },
  {
    title: "Evidence-based search and operational reporting",
    icon: SlidersHorizontal,
    detail:
      "Source-attributed query and interaction events, documented metric definitions, durable telemetry, anti-abuse controls, observability, capacity monitoring, performance testing, incident management, and independently verifiable methods are required before reporting trending topics, verified identities, prices, balances, treasury amounts, community membership, player counts, rewards, download counts, ratings, fundraising totals, activity, live status, analytics, or production readiness.",
  },
];

export default function UniversalSearch() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Universal-search service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Universal Search
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Search indexes, account and content records, tokens, communities,
            games, marketplace items, tournaments, charities, trending topics,
            rankings, recommendations, financial data, audience activity, and
            external-data results are not configured for this deployment. No
            search result, content record, financial result, metric,
            recommendation, or service result is represented as current,
            complete, verified, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated search index, trend, result, or ranking
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not query an index, retrieve an account or
                content record, access financial or external data, rank or
                recommend a result, record a search, disclose a trend, or claim
                that a search action succeeded.
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
