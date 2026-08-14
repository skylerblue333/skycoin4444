import {
  AlertTriangle,
  BadgeDollarSign,
  BarChart3,
  Database,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authorized sponsor, campaign, and account records",
    icon: Database,
    detail:
      "Authenticated organization ownership, tenant isolation, role-based access, scoped authorization, durable sponsor and campaign records, documented deliverables, approval workflows, audit logging, safe pagination, deletion and correction handling, and clear empty and error states are required before displaying any sponsor, campaign, creator, agreement, inventory, communication, deliverable, or account result.",
  },
  {
    title: "Verified payment and contract workflow integration",
    icon: BadgeDollarSign,
    detail:
      "Authorized payment providers, server-side payment and webhook verification, validated agreements, invoice and receipt handling, idempotent charge controls, payout reconciliation, refund and dispute workflows, duplicate-submission prevention, status verification, and evidence-based financial controls are required before creating, confirming, charging, paying, invoicing, or reporting a sponsorship, payout, payment, or contract result.",
  },
  {
    title: "Privacy, safety, and partner-governance controls",
    icon: ShieldCheck,
    detail:
      "Least-privilege access, sensitive-data minimization, secure logging, retention limits, fraud and abuse prevention, brand-safety controls, consent and disclosure controls where applicable, incident response, access reviews, and independently evidenced safeguards are required before exposing or managing sponsor, creator, customer, payment, or campaign information.",
  },
  {
    title: "Evidence-based sponsorship and operational reporting",
    icon: BarChart3,
    detail:
      "Source-attributed campaign events, documented metric definitions, durable activity records, reconciliation, calculation-version records, observability, capacity monitoring, incident management, and independently verifiable methods are required before reporting campaign performance, spend, revenue, audiences, active users, transactions, success rates, response times, live updates, automation, advanced analytics, or production readiness.",
  },
];

export default function Sponsorships() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Sponsorship service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Sponsorships
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Sponsors, campaigns, creators, agreements, invoices, payments,
            payouts, performance data, active user counts, transaction totals,
            live updates, automation, success rates, and response times are not
            configured for this deployment. No sponsor, campaign, payment,
            payout, metric, or service result is represented as current,
            complete, verified, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated sponsor, campaign, payment, or performance result
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not retrieve a sponsor or campaign, create an
                agreement, process a payment or payout, issue an invoice,
                calculate performance, stream an update, or report that a
                commercial action succeeded.
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
