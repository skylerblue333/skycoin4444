import {
  AlertTriangle,
  BellOff,
  Database,
  FileCheck2,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authorized market-data integration and provenance",
    icon: Database,
    detail:
      "Authorized market-data providers, documented instrument and venue coverage, validated symbol mapping, time-zone and market-calendar handling, timestamped source attribution, stale-data detection, corporate-action handling where applicable, error recovery, and independently verified data quality are required before displaying a price, market condition, market-data result, or price-derived calculation.",
  },
  {
    title: "Authenticated alert records and threshold controls",
    icon: FileCheck2,
    detail:
      "Authenticated ownership, tenant isolation, validated alert criteria, explicit instrument and currency definitions, idempotent evaluation, durable preference records, duplicate prevention, rate limits, edit and cancellation workflows, audit history, clear empty states, and error handling are required before creating, changing, evaluating, or reporting a price alert, threshold, trigger, or alert status.",
  },
  {
    title: "Verified notification delivery and privacy safeguards",
    icon: BellOff,
    detail:
      "Authorized notification providers, documented consent, verified delivery channels, retry and failure handling, unsubscribe controls, data minimization, secure handling of contact information, access controls, retention limits, and evidence-based delivery monitoring are required before sending, delivering, or reporting an email, push, SMS, webhook, in-app notification, or other alert outcome.",
  },
  {
    title: "Security and evidence-based service operations",
    icon: ShieldCheck,
    detail:
      "Least-privilege authorization, secure secret management, input validation, structured logging, observability, documented metric definitions, performance testing, alerting, incident management, and independently verifiable methods are required before reporting real-time data, live updates, analytics, automation, active users, transaction totals, success rates, response times, service availability, or production readiness.",
  },
];

export default function PriceAlerts() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Price-alert service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Price Alerts
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Market prices, price-derived calculations, alert criteria, trigger
            evaluations, notification delivery, live updates, analytics,
            automation, active user counts, transaction totals, success rates,
            and response times are not configured for this deployment. No price,
            alert, notification, metric, or service result is represented as
            current, complete, verified, active, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated market price, alert trigger, or notification
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not retrieve market data, calculate a price
                condition, create or evaluate an alert, send a notification,
                stream an update, trigger automation, or report that an alert
                operation succeeded.
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
