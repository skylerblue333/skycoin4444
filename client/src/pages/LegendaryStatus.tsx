import {
  AlertTriangle,
  Award,
  Database,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Verified identity and profile publication",
    icon: UserRoundCheck,
    detail:
      "A consented and authenticated profile record, source verification, privacy controls, correction and removal procedures, publication review, access control, and support ownership are required before presenting a personal profile, affiliation, role, credential, or public biographical claim.",
  },
  {
    title: "Auditable achievements and entitlements",
    icon: Award,
    detail:
      "Documented achievement criteria, secure event verification, durable issuance records, authorization rules, duplicate prevention, revocation handling, and appeal procedures are required before assigning a badge, legendary status, founder designation, level, rank, reward, or access entitlement.",
  },
  {
    title: "Reliable platform metrics and reputation methodology",
    icon: Database,
    detail:
      "Authoritative data sources, metric definitions, reproducible calculations, time-period controls, data-quality checks, privacy review, methodology disclosure, and review processes are required before showing platform statistics, test counts, value, uptime, user totals, rankings, or a reputation score.",
  },
  {
    title: "Safety, fairness, and access safeguards",
    icon: ShieldCheck,
    detail:
      "Clear policies, role-based authorization, abuse prevention, audit logging, correction mechanisms, incident response, and independent review are required before operating a profile-status or reputation system that can affect a person’s standing or access.",
  },
];

export default function LegendaryStatus() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Status and reputation
            service unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Legendary Status
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Personal profiles, founder or organization roles, credentials,
            achievements, platform metrics, rankings, reputation scores, value
            estimates, uptime, entitlements, and status-based access are not
            configured for this deployment. No person, organization, title,
            achievement, metric, rank, score, or privilege is represented as
            verified, current, or authoritative.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated achievements, reputation, or prestige
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not publish a personal claim, issue a status or
                badge, calculate a ranking or reputation score, report platform
                metrics, assert a company affiliation, or grant access based on
                prestige or achievement.
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
