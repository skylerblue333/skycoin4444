import {
  AlertTriangle,
  BadgeDollarSign,
  Database,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authorized subscriber and entitlement records",
    icon: Database,
    detail:
      "Authenticated organization ownership, tenant isolation, role-based access, scoped authorization, durable subscriber and entitlement records, subscription-effective dates, cancellation workflows, deletion and correction handling, audit logging, safe pagination, and clear empty and error states are required before displaying any subscriber, account, access level, plan, creator relationship, communication preference, or management result.",
  },
  {
    title: "Verified billing and account-status integration",
    icon: BadgeDollarSign,
    detail:
      "Authorized payment processors, server-side event verification, idempotent billing updates, recurring-charge controls, failed-payment recovery, refund and cancellation handling, reconciliation, customer-support escalation, and processor evidence are required before creating, changing, charging, canceling, or reporting a subscriber plan, payment, billing status, entitlement, or financial result.",
  },
  {
    title: "Subscriber privacy and security controls",
    icon: ShieldCheck,
    detail:
      "Privacy controls, consent and communication-preference management, sensitive-data minimization, secure logging, retention limits, abuse prevention, incident response, access reviews, policy enforcement, and independently evidenced protections are required before exposing or managing subscriber identity, activity, contact, payment, engagement, or account information.",
  },
  {
    title: "Evidence-based engagement and operational reporting",
    icon: UsersRound,
    detail:
      "Source-attributed events, documented metric definitions, anti-abuse controls, durable activity records, observability, capacity monitoring, incident management, and independently verifiable methods are required before reporting subscriber counts, activity, engagement, transactions, success rates, response times, live updates, automation, advanced analytics, or production readiness.",
  },
];

export default function SubscriberManagement() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Subscriber-management
            service unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Subscriber Management
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Subscriber records, plans, entitlements, payments, communication
            preferences, engagement analytics, active user counts, transaction
            totals, live updates, automation, success rates, and response times
            are not configured for this deployment. No subscriber, plan,
            entitlement, payment, metric, or service result is represented as
            current, complete, verified, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated subscriber, plan, entitlement, payment, or
                engagement record
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not retrieve a subscriber, disclose identity or
                account data, create or change a plan, manage an entitlement,
                process a payment, message a user, calculate an engagement
                metric, or report that an account action succeeded.
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
