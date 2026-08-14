import {
  AlertTriangle,
  Database,
  Globe2,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authenticated content and user records",
    icon: Database,
    detail:
      "Authenticated content ownership, tenant isolation, scoped authorization, durable posts and reactions, safe pagination, deletion and correction workflows, audit logging, and clear empty and error states are required before displaying any social post, identity, avatar, comment, reaction, share, activity, or feed result.",
  },
  {
    title: "Verified translation-service integration",
    icon: Globe2,
    detail:
      "An authorized translation provider, documented language support, source and target language validation, request quotas, quality controls, consent and retention rules, error recovery, output attribution, and evidence-based availability monitoring are required before translating or labeling content as translated.",
  },
  {
    title: "Privacy and moderation controls",
    icon: ShieldCheck,
    detail:
      "Content visibility rules, user consent, report and appeal workflows, moderation review, abuse prevention, sensitive-data minimization, secure logging, retention limits, incident response, and independently evidenced protections are required before exposing multilingual community content.",
  },
  {
    title: "Evidence-based engagement reporting",
    icon: UsersRound,
    detail:
      "Source-attributed events, documented metric definitions, durable interaction records, anti-abuse controls, observability, capacity monitoring, and independently verifiable methods are required before reporting likes, comments, shares, reach, active users, real-time updates, engagement, success rates, or production readiness.",
  },
];

export function TranslationEnabledSocialFeed() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Translation-enabled social
            feed unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Global Social Feed
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Multilingual social posts, user identities, translations, reactions,
            comments, shares, engagement metrics, active user counts, live
            updates, automation, success rates, and response times are not
            configured for this deployment. No post, translation, identity,
            interaction, metric, or service result is represented as current,
            complete, verified, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated posts, translations, engagement, or live social
                activity
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not retrieve user content, translate text,
                disclose an identity, create a reaction or comment, share a
                post, stream an update, or report that an interaction succeeded.
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

export default TranslationEnabledSocialFeed;
