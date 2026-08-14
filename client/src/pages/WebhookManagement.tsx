import {
  Activity,
  AlertTriangle,
  Database,
  ShieldCheck,
  Webhook,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authenticated endpoint and subscription management",
    icon: Database,
    detail:
      "Authenticated ownership, organization or tenant isolation, role-based authorization, validated endpoint records, event scopes, lifecycle controls, secure deletion, audit logs, and support procedures are required before creating, listing, changing, or removing a webhook endpoint or subscription.",
  },
  {
    title: "Secure delivery and secret handling",
    icon: ShieldCheck,
    detail:
      "Server-side secret storage, signed requests, endpoint validation, SSRF protections, TLS verification, payload schema validation, replay resistance, rate limits, delivery timeouts, retry and backoff policy, idempotency guidance, and incident response are required before sending a callback or representing that webhook delivery succeeded.",
  },
  {
    title: "Accurate event, delivery, and monitoring records",
    icon: Activity,
    detail:
      "Durable event records, timestamp integrity, delivery outcomes, error classification, redacted logs, data-retention controls, source-attributed metrics, alerting, observability, and reconciliation are required before showing live events, delivery attempts, failures, retries, throughput, success rates, latency, or analytics.",
  },
  {
    title: "Controlled integration and automation boundaries",
    icon: Webhook,
    detail:
      "Documented API contracts, versioning, sandbox and production separation, change controls, least-privilege integration permissions, input validation, external-service security review, user notices, and clear failure behavior are required before connecting third-party systems or automating actions through webhooks.",
  },
];

export default function WebhookManagement() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Webhook management service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Webhook Management
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Webhook endpoints, secrets, subscriptions, event scopes, delivery
            records, retries, callbacks, live updates, integration automation,
            usage data, success rates, latency, transactions, and operational
            analytics are not configured for this deployment. No endpoint,
            secret, event, integration, delivery attempt, callback, metric, or
            action is represented as active, verified, configured, or
            successful.
          </p>
        </header>
        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated endpoint, secret, event, callback, delivery, or
                automation
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not create or reveal an endpoint, store a secret,
                subscribe to an event, send a callback, record delivery, retry a
                request, access an external system, calculate a service metric,
                or report that an integration action succeeded.
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
