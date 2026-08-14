import {
  AlertTriangle,
  Bell,
  BrainCircuit,
  Database,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authenticated notification delivery",
    icon: Bell,
    detail:
      "A persisted notification model, recipient authorization, delivery-channel configuration, opt-in preferences, retry handling, unsubscribe controls, and delivery-status records are required before sending or displaying notifications.",
  },
  {
    title: "AI prioritization and summarization",
    icon: BrainCircuit,
    detail:
      "A configured server-side model provider, data-minimization controls, prompt safety, measurable ranking criteria, review workflows, output labeling, and user controls are required before prioritizing or summarizing notifications with AI.",
  },
  {
    title: "Analytics and behavioral measurement",
    icon: Database,
    detail:
      "Consent-aware event collection, retention limits, accurate aggregation, privacy review, access controls, and clear methodology are required before presenting read rates, engagement metrics, priority scores, or behavioral analytics.",
  },
  {
    title: "Safety, fairness, and support controls",
    icon: ShieldCheck,
    detail:
      "Abuse prevention, bias monitoring, correction and appeal processes, incident response, audit logging, and documented service ownership are required before automated notification decisions affect a user’s experience.",
  },
];

export default function NotificationIntelligence() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Notification-intelligence
            service unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Notification Intelligence
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            AI-ranked notification feeds, automatic batching, priority scores,
            AI summaries, delivery records, unread counts, user analytics,
            engagement metrics, and automated read-state updates are not
            configured for this deployment. No notification, score, summary, or
            metric is represented as generated, delivered, or verified.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated notification or intelligence activity
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not create, prioritize, batch, summarize,
                deliver, mark as read, analyze, or score notifications. It does
                not infer user behavior or report activity and engagement
                outcomes.
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
