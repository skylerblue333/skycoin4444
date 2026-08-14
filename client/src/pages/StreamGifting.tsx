import {
  AlertTriangle,
  CreditCard,
  Database,
  PlaySquare,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Verified payment, token, and payout infrastructure",
    icon: CreditCard,
    detail:
      "Configured payment or blockchain providers, authenticated sender and recipient verification, custody or wallet safeguards, transaction and signature validation, balance reconciliation, price and fee disclosure, settlement confirmation, duplicate-submission prevention, refunds and dispute controls, anti-fraud monitoring, and audit records are required before selling, topping up, sending, receiving, rewarding, or reporting a gift, token, balance, payment, payout, or financial benefit.",
  },
  {
    title: "Authorized live-stream and creator records",
    icon: PlaySquare,
    detail:
      "Creator authorization, media rights verification, secure stream delivery, access control, recording and retention rules, playback monitoring, content moderation, reporting and appeals, availability handling, and durable activity records are required before representing a live stream, streamer, viewer count, creator interaction, gift animation, stream status, or media event.",
  },
  {
    title: "Reliable gift and engagement data",
    icon: Database,
    detail:
      "Authenticated event sources, durable gift records, documented measurement methodology, data-quality validation, deduplication, privacy safeguards, anti-abuse controls, retention and correction processes, and access restrictions are required before showing recent gifts, top gifters, rankings, quantities, engagement history, amounts, or real-time activity.",
  },
  {
    title: "Safety, user protection, and compliance controls",
    icon: ShieldCheck,
    detail:
      "User authorization, transparent terms, age-appropriate safeguards where applicable, spending controls, rate limits, account security, privacy controls, incident response, financial and consumer compliance review, content safety procedures, and support escalation are required before enabling or representing gifting, creator monetization, top-ups, social interaction, or rewards.",
  },
];

export default function StreamGifting() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Stream-gifting service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Live Gifting
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Livestream gifting, animated gifts, token balances, gift prices,
            quantities, top-ups, gift activity, rankings, senders, creators,
            viewers, real-time stream status, payment settlement, payouts, and
            rewards are not configured for this deployment. No gift, token,
            payment, balance, stream, creator, social interaction, or financial
            outcome is represented as current, verified, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated gift, balance, payment, payout, or stream activity
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not add funds, display a wallet balance, send a
                gift, trigger a creator payout, count viewers, present a live
                stream, create an animation from a real user event, or report
                that a payment, reward, or gift action succeeded.
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
