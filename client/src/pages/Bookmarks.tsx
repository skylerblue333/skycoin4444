import {
  AlertTriangle,
  Bookmark,
  Database,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authenticated private-save records",
    icon: UserRoundCheck,
    detail:
      "Durable per-user bookmark records, authenticated ownership, strict authorization, tenant isolation, consented collection, secure session handling, idempotent create and delete operations, audit logging, and recovery procedures are required before listing, modifying, or deleting a saved item.",
  },
  {
    title: "Authorized content retrieval and visibility",
    icon: Database,
    detail:
      "Source-attributed content records, current visibility and moderation rules, deletion propagation, pagination, safe search behavior, content access checks, privacy controls, and accurate empty states are required before showing an author, post, message, media type, note, date, or saved-content result.",
  },
  {
    title: "Accurate engagement and metadata operations",
    icon: Bookmark,
    detail:
      "Documented metric definitions, attributable event sources, bot and abuse controls, deduplication, data-quality monitoring, correction handling, and freshness policy are required before showing like, comment, share, view, content-type, or other engagement and metadata values.",
  },
  {
    title: "Privacy and operational safeguards",
    icon: ShieldCheck,
    detail:
      "Data minimization, encryption where appropriate, access logging, retention and deletion policy, incident response, support procedures, secure error handling, and production monitoring are required before processing or exposing a user’s saved-content history.",
  },
];

export default function Bookmarks() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Private bookmarks service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Bookmarks
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Saved-content retrieval, bookmark search, content filters, saved
            notes, author information, post content, engagement totals,
            timestamps, and bookmark deletion are not configured for this
            deployment. No user’s saved items, content history, relationship to
            a post, private note, interaction, or content metric is represented
            as current, complete, accessible, or verified.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated saved item, private note, content result, or
                removal action
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not authenticate a user, retrieve a bookmark,
                search saved content, access a post, identify an author, read a
                note, show an engagement result, filter private data, remove a
                bookmark, or report that a saved-content operation succeeded.
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
