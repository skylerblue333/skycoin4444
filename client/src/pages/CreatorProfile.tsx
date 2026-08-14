import {
  AlertTriangle,
  BadgeCheck,
  CreditCard,
  Database,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Verified creator identity and audience records",
    icon: BadgeCheck,
    detail:
      "Authenticated and consented creator profiles, verified identity procedures where a verification signal is displayed, ownership validation, durable profile records, privacy controls, role-based authorization, moderation, correction processes, and auditability are required before showing a creator, verified status, biography, handle, follower, subscriber, post, or like count.",
  },
  {
    title: "Secure media and content-access controls",
    icon: Database,
    detail:
      "Authorized media ingestion, content ownership checks, file and rights validation, secure storage and delivery, visibility rules, entitlement enforcement, content moderation, reporting and appeals, retention policies, and reliable playback are required before showing, locking, unlocking, publishing, or recommending creator media or content.",
  },
  {
    title: "Authorized subscriptions and recurring billing",
    icon: CreditCard,
    detail:
      "Configured payment providers, authenticated subscription lifecycle handling, tax and merchant-of-record review, transparent pricing and fees, entitlement reconciliation, provider-webhook verification, refunds and chargeback controls, cancellation workflows, settlement records, and consumer disclosures are required before offering or representing a subscription plan, price, benefit, checkout, payment, or access state.",
  },
  {
    title: "Trust, safety, and social-interaction governance",
    icon: ShieldCheck,
    detail:
      "Authenticated follow and share records, consent and notification controls, privacy safeguards, rate limits, anti-abuse monitoring, platform policies, human escalation, incident response, and data-quality checks are required before recording or displaying follows, shares, audience engagement, subscriber access, social metrics, or other interactions.",
  },
];

export default function CreatorProfile() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Creator profile service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Creator Profile
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Creator identities, verification status, profile records, subscriber
            counts, posts, likes, media previews, gated content, subscription
            tiers, recurring prices, benefits, checkout, follow status, shares,
            and content-access states are not configured for this deployment. No
            creator identity, social metric, media asset, subscription,
            entitlement, payment, or engagement record is represented as
            current, verified, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated creator, subscription, or content-access record
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not verify a creator, retrieve a profile or
                metric, host or unlock media, accept a subscription, collect a
                payment, grant a tier benefit, record a follow or share, or
                report a successful checkout or access outcome.
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
