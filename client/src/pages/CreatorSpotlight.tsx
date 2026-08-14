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
    title: "Authorized creator and content records",
    icon: Database,
    detail:
      "Authenticated creator ownership, consented public-profile fields, verified content records, visibility controls, moderation workflows, deletion and correction propagation, secure media handling, access controls, and auditability are required before displaying a creator name, handle, bio, badge, category, content preview, profile, or publication.",
  },
  {
    title: "Accurate audience and activity measurement",
    icon: Activity,
    detail:
      "Documented metric definitions, source-attributed events, bot and abuse prevention, deduplication, privacy review, time-window methodology, freshness controls, quality monitoring, and correction procedures are required before displaying a subscriber, follower, view, post, viewer, live-stream, ranking, popularity, or platform-wide creator metric.",
  },
  {
    title: "Safe follow, subscription, and creator actions",
    icon: ShieldCheck,
    detail:
      "Authenticated user actions, durable relationship records, authorization checks, consent and notification preferences, idempotency, transaction safety where relevant, failure handling, privacy controls, and accessible state feedback are required before following, subscribing to, supporting, onboarding, or changing a relationship with a creator.",
  },
  {
    title: "Governed monetization and promotion operations",
    icon: Scale,
    detail:
      "Authorized payment processing, creator agreements, tax and payout controls, verified balances, fraud prevention, disclosure policy, moderation, consumer protection, accounting and reconciliation, and support procedures are required before reporting creator earnings, offering paid subscriptions or tips, promoting revenue opportunities, or representing financial outcomes.",
  },
];

export default function CreatorSpotlight() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Creator discovery and
            monetization service unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Creator Spotlight
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Creator discovery, profile information, verification badges,
            subscriber and follower totals, post and view metrics, live-stream
            status, viewer counts, creator tiers, rankings, content previews,
            follow and subscription actions, platform creator totals, earnings,
            tips, paid content, and monetization claims are not configured for
            this deployment. No person, account, content item, relationship,
            audience event, verification, payment, balance, or financial result
            is represented as current, verified, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated creator, live stream, audience result,
                subscription, or earning
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not retrieve a creator profile, verify an
                account, expose creator content, measure an audience, count a
                view, report a live stream, follow or subscribe a user, create a
                creator account, take a payment, calculate a payout, or report
                that any creator or monetization action succeeded.
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
