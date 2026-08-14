import {
  AlertTriangle,
  BadgeCheck,
  Landmark,
  ShieldCheck,
  Workflow,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authorized task-marketplace and contracting controls",
    icon: Workflow,
    detail:
      "Verified task owners and workers, scope and acceptance criteria, eligibility controls, conflict handling, intellectual-property terms, platform policies, audit records, moderation, privacy protection, jurisdictional review, and dispute procedures are required before publishing, accepting, assigning, or completing a bounty or other work opportunity.",
  },
  {
    title: "Secure submission, review, and quality assurance workflow",
    icon: BadgeCheck,
    detail:
      "Authenticated submission ownership, secure file and text handling, review assignment, documented quality standards, reviewer accountability, correction requests, appeal handling, abuse prevention, durable workflow state, and retention controls are required before accepting a deliverable or representing a task as submitted, reviewed, rated, accepted, or completed.",
  },
  {
    title: "Verified rewards, payments, and settlement",
    icon: Landmark,
    detail:
      "Authorized payment or token-settlement providers, escrow or custody controls where applicable, eligibility checks, payout authorization, transaction confirmation, reconciliation, tax and consumer review, fraud prevention, refund and dispute handling, and audit trails are required before presenting or granting a reward, payment, XP, currency amount, bonus, or earnings outcome.",
  },
  {
    title: "Trust, safety, and personal-data safeguards",
    icon: ShieldCheck,
    detail:
      "Identity and access controls, qualification verification, privacy-by-design practices, sensitive-content safeguards, human escalation, monitoring, incident response, legal review, and clear user disclosures are required before showing worker qualifications, deadlines, performance ratings, feedback, streaks, milestones, or personal completion history.",
  },
];

export default function BountySystem() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Bounty service unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Bounty System
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Task listings, translation jobs, qualifications, deadlines, task
            acceptance, submissions, reviews, completion records, ratings,
            feedback, XP, rewards, payments, earnings, streaks, milestones, and
            payout claims are not configured for this deployment. No
            opportunity, task assignment, submission, payment, rating, reward,
            or work outcome is represented as current, verified, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated task acceptance, submission, review, or reward
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not publish or accept a task, verify a
                qualification, receive a submission, assign a reviewer,
                calculate a quality score, issue feedback, mark work complete,
                award XP, release funds, or create a payment or payout record.
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
