import {
  AlertTriangle,
  MailCheck,
  ShieldCheck,
  SlidersHorizontal,
  Waypoints,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authorized provider, sender, and configuration records",
    icon: SlidersHorizontal,
    detail:
      "Authenticated administrative ownership, scoped authorization, tenant isolation, provider credential protection, verified sender identities and domains, durable configuration records, source attribution, audit logging, change review, rollback procedures, and clear empty and error states are required before displaying or changing any email provider, host, port, sender, domain, credential, route, template, or configuration result.",
  },
  {
    title: "Verified delivery and provider integration",
    icon: MailCheck,
    detail:
      "Authorized email-provider integration, validated connection and sender checks, authenticated API or SMTP delivery, idempotent send controls, bounce and complaint handling, rate limits, retry and recovery workflows, delivery-status evidence, and availability monitoring are required before sending, testing, queuing, retrying, reporting, or representing an email, template, delivery, sender, or provider action as successful.",
  },
  {
    title: "Privacy, security, and administrative safeguards",
    icon: ShieldCheck,
    detail:
      "Secrets kept server-side, least-privilege access, secure credential rotation, recipient consent and preference controls, data minimization, secure logging, retention limits, anti-abuse controls, incident response, access reviews, and independently evidenced safeguards are required before exposing, using, storing, or reporting email settings, recipient information, message content, secrets, or administrative operations.",
  },
  {
    title: "Evidence-based messaging and operational reporting",
    icon: Waypoints,
    detail:
      "Source-attributed provider events, documented metric definitions, durable delivery and configuration records, observability, capacity monitoring, performance testing, incident management, and independently verifiable methods are required before reporting messages, deliveries, bounces, complaints, active users, transaction totals, success rates, response times, live updates, automation, advanced analytics, or production readiness.",
  },
];

export default function SMTPSettings() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Email-configuration
            service unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            SMTP Settings
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Email-provider settings, sender identities, domains, credentials,
            templates, messages, delivery events, logs, active user counts,
            transaction totals, live updates, automation, success rates, and
            response times are not configured for this deployment. No email,
            provider, sender, credential, delivery, metric, or service result is
            represented as current, complete, verified, active, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated provider, sender, credential, message, or delivery
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not retrieve or change an SMTP setting, expose a
                credential, validate a sender, send a test message, queue a
                delivery, retrieve a delivery event, calculate a metric, stream
                an update, or report that an email operation succeeded.
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
