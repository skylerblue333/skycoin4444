import {
  AlertTriangle,
  Compass,
  Database,
  Radio,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Verified discovery and content records",
    icon: Compass,
    detail:
      "Persisted and authorized content records, source attribution, moderation controls, visibility rules, search indexing, content lifecycle management, audit logging, and data-quality checks are required before displaying or ranking a post, topic, creator, channel, community, category, or discovery result.",
  },
  {
    title: "Live-stream and engagement verification",
    icon: Radio,
    detail:
      "Authorized stream providers, verified broadcast state, secure viewer authorization, reliable event telemetry, anti-abuse controls, moderation, delivery monitoring, and timestamped reconciliation are required before representing a stream as live or showing viewer counts, engagement, activity, or trend signals.",
  },
  {
    title: "Responsible recommendations and social controls",
    icon: UsersRound,
    detail:
      "Documented recommendation logic, privacy and consent controls, user block and report tools, profile authorization, anti-spam protections, transparency, non-discrimination review, and safety operations are required before suggesting people or creators to follow or inferring user interests.",
  },
  {
    title: "Supported feature integrations and safety review",
    icon: ShieldCheck,
    detail:
      "Each linked feature requires a configured service, authenticated and authorized backend contract, input and output validation, error handling, monitoring, dependency review, and clear user disclosures before it can be represented as available through exploration or discovery.",
  },
  {
    title: "Authoritative data and ranking methodology",
    icon: Database,
    detail:
      "Source-of-truth datasets, documented ranking methodology, integrity checks, correction paths, retention policies, and monitoring are required before showing trending scores, follower suggestions, popularity, views, counts, search results, or any other data-derived claim.",
  },
];

export default function Explore() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Discovery service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Explore
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Discovery categories, search results, live streams, creators, posts,
            trending topics, follow recommendations, engagement counts,
            marketplace activity, financial features, governance activity,
            gaming, charity, and community data are not configured for this
            deployment. No item, person, stream, activity, count, rank, or
            category is represented as current, verified, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated discovery, streams, trends, or recommendations
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not search or index content, identify a live
                stream, calculate a trend, suggest a person to follow, display
                engagement, collect views, retrieve a marketplace listing, or
                represent any linked ecosystem feature as configured.
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
