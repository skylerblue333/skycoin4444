import {
  AlertTriangle,
  Database,
  Scale,
  ShieldCheck,
  UserCog,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Human-reviewed moderation policy and workflow",
    icon: Scale,
    detail:
      "Published policies, scoped enforcement criteria, content-review procedures, notice and appeal mechanisms, accountable moderators, decision documentation, and quality review are required before flagging, approving, removing, or restricting content.",
  },
  {
    title: "Validated safety-model integration",
    icon: ShieldCheck,
    detail:
      "A configured provider or model, documented categories and thresholds, model evaluation, bias and error monitoring, privacy review, rate limits, secure failure handling, and human escalation are required before using AI to classify content or recommend a moderation action.",
  },
  {
    title: "Durable moderation records and auditability",
    icon: Database,
    detail:
      "Authorized server-side records, evidence retention, change history, reviewer attribution, access controls, reporting, deletion handling, and tamper-evident audit trails are required before presenting a queue item, risk score, action count, resolution, or accuracy measure.",
  },
  {
    title: "Server-enforced administrative authority",
    icon: UserCog,
    detail:
      "Least-privilege roles, strong session verification, protected server endpoints, re-authentication for sensitive actions, supervisory controls, rollback procedures, and incident response are required before an operator can take a moderation action.",
  },
];

export default function AIModerationQueue() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> AI moderation service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            AI Moderation Queue
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            AI safety classifications, moderation queue items, content flags,
            automatic removals, review decisions, risk or accuracy scores,
            enforcement history, and administrator actions are not configured
            for this deployment. No content, report, action, statistic,
            classification, or resolution is represented as current, verified,
            or authorized.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated AI classification or moderation action
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not classify content, create a safety signal,
                report a moderation count, calculate model accuracy, display a
                review queue, approve or remove content, or enact a platform
                restriction.
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
