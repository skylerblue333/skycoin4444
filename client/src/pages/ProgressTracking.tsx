import {
  AlertTriangle,
  Database,
  FileCheck2,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authorized learner records and activity history",
    icon: Database,
    detail:
      "Authenticated ownership, tenant isolation, validated learner and session records, durable activity history, source attribution, retention limits, audit logging, correction and deletion workflows, defined empty states, and clear error recovery are required before displaying a language, level, score, session, practice time, activity record, streak, or other learning-progress result.",
  },
  {
    title: "Reviewed curriculum, assessment, and achievement rules",
    icon: FileCheck2,
    detail:
      "Documented curriculum definitions, validated assessment inputs, versioned scoring rules, accessibility review, human oversight, reproducible calculations, anti-abuse controls, milestone eligibility rules, evidence-based completion records, and correction workflows are required before awarding a level, proficiency result, skill score, milestone, completion state, badge, reward, or achievement.",
  },
  {
    title: "Privacy, consent, and safety controls",
    icon: ShieldCheck,
    detail:
      "Transparent consent, data minimization, least-privilege access, secure handling of personal data, sensitive-data protections, access reviews, moderation where applicable, incident response, retention controls, and independently evidenced safeguards are required before collecting, using, exposing, or personalizing a learner profile, activity record, assessment, communication, or education result.",
  },
  {
    title: "Evidence-based progress analytics and service operations",
    icon: TrendingUp,
    detail:
      "Verified service integrations, durable telemetry, documented metric definitions, calculation lineage, observability, performance testing, alerting, incident management, and independently verifiable methods are required before reporting progress trends, analytics, recommendations, live updates, automation, totals, averages, completion rates, response times, or production readiness.",
  },
];

export default function ProgressTracking() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Learning-progress service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Progress Tracking
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Learner profiles, language levels, scores, practice history,
            sessions, streaks, milestones, rewards, achievements, skill
            assessments, activity records, learning analytics, live updates,
            automation, and performance results are not configured for this
            deployment. No learner record, progress result, assessment,
            achievement, metric, or service result is represented as current,
            complete, verified, active, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated learning activity, scores, milestones, or rewards
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not retrieve a learner profile, calculate a score
                or level, record practice, award a milestone or reward, evaluate
                an assessment, create a recommendation, stream an update,
                trigger automation, or report that a learning operation
                succeeded.
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
