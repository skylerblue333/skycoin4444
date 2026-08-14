import {
  Activity,
  AlertTriangle,
  Database,
  ShieldCheck,
  User,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authenticated and authorized profile access",
    icon: User,
    detail:
      "Authenticated request context, account ownership, privacy-aware visibility rules, tenant isolation, role-based authorization, blocking and reporting controls, secure profile routing, audit logging, and clear empty and error states are required before displaying, editing, sharing, or enumerating a user profile.",
  },
  {
    title: "Verified profile and social records",
    icon: Database,
    detail:
      "Authorized data sources, durable profile records, safe display fields, ownership verification, profile moderation, content provenance, deletion and correction workflows, freshness controls, data minimization, and integrity checks are required before showing an identity, biography, avatar, relationship, activity, content reference, or other personal information.",
  },
  {
    title: "Privacy and account-protection safeguards",
    icon: ShieldCheck,
    detail:
      "Consent-aware disclosure controls, sensitive-data classification, secure logging, secure error handling, access restrictions, abuse prevention, retention limits, incident response, policy enforcement, support procedures, and human escalation are required before exposing profile or account-related information.",
  },
  {
    title: "Evidence-based metrics and operations reporting",
    icon: Activity,
    detail:
      "Source-attributed telemetry, documented metric definitions, data-quality monitoring, observability, capacity controls, performance testing, and independent evidence are required before claiming live data, advanced analytics, active users, transactions, success rates, response times, automation, or production readiness.",
  },
];

export default function UserProfiles() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> User profiles service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            User Profiles
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            User profiles, identity details, account settings, relationship
            data, activity records, social metrics, active user counts,
            transactions, live updates, analytics, success rates, response
            times, and automation are not configured for this deployment. No
            person, profile, account, relationship, activity, metric, or service
            result is represented as current, complete, verified, or available.
          </p>
        </header>
        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated person, profile, account, relationship, metric, or
                live update
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not retrieve a profile, reveal account data,
                expose relationship information, create a user record, calculate
                an audience metric, stream an update, or report that a user-data
                action succeeded.
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
