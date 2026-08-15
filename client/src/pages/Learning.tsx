import {
  AlertTriangle,
  Award,
  BookOpen,
  Database,
  FileCheck2,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Persisted curriculum, course, and lesson services",
    icon: Database,
    detail:
      "Authenticated and tenant-scoped education services with documented course, curriculum, lesson, quiz, assignment, enrollment, instructor, content, versioning, accessibility, progress, and completion schemas are required before retrieving or reporting a course, lesson, module, quiz, assignment, enrollment, instructor, content item, or completion state as current, complete, or available.",
  },
  {
    title: "Validated learner progress and assessment records",
    icon: BookOpen,
    detail:
      "Persisted learner identity, authorization, progress, attempt, grading, completion, feedback, prerequisite, and synchronization contracts with duplicate and missing-event detection, retry behavior, auditability, and tested recovery are required before starting, continuing, grading, completing, or reporting a lesson, quiz, assessment, learning path, progress value, or achievement.",
  },
  {
    title: "Credential and reward integrity controls",
    icon: Award,
    detail:
      "Verified certificate issuance, identity binding, assessment evidence, revocation, issuer records, reward eligibility, accounting, anti-abuse controls, and explicit distinction between educational achievement and financial or token value are required before issuing, displaying, or reporting a certificate, credential, badge, lesson reward, SKY444 amount, user achievement, or financial outcome.",
  },
  {
    title: "Privacy, safety, and operational evidence",
    icon: ShieldCheck,
    detail:
      "Role-based access, privacy and deletion controls, sensitive-data minimization, secure sessions, content and learner safety controls, audit trails, monitoring, support procedures, performance testing, traceable metric definitions, and independently verifiable operational records are required before exposing or reporting learner data, analytics, automation outcomes, active users, completions, response times, documentation availability, or production readiness.",
  },
];

export default function Learning() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Learning service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Learning Center
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Courses, curriculum, lessons, quizzes, learner progress, grading,
            certificates, rewards, token amounts, instructors, analytics,
            automation, operational metrics, and support documentation are not
            configured for this deployment. No course, lesson, progress value,
            completion, certificate, reward, user, metric, educational result,
            financial outcome, or service status is represented as current,
            complete, verified, active, private, available, or successful.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated courses, progress, certificates, or rewards
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not list or serve courses, start lessons, record
                progress, grade assessments, issue certificates, award tokens,
                calculate rewards, synchronize learner data, apply automation,
                or report educational, financial, analytics, or operational
                outcomes. It does not claim that a learning action, completion,
                credential, or reward succeeded.
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

        <div className="mt-8 flex items-center gap-3 text-sm text-slate-400">
          <FileCheck2 className="h-4 w-4" /> Educational content and
          credentialing will remain disabled until the required services are
          configured and verified.
        </div>
      </div>
    </main>
  );
}
