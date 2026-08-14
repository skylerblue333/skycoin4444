import {
  AlertTriangle,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  Siren,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Verified identity, session, and account-security controls",
    icon: LockKeyhole,
    detail:
      "Authenticated account ownership, server-side session management, verified multi-factor enrollment, recovery and revocation workflows, device and sign-in evidence, scoped authorization, audit logging, secure credential handling, and clear error states are required before representing authentication, two-factor protection, recovery, account safeguards, or session security as active.",
  },
  {
    title: "Verified data-protection and infrastructure safeguards",
    icon: ShieldCheck,
    detail:
      "Documented encryption architecture, key-management controls, verified transport protections, validated infrastructure configuration, source-attributed monitoring, alert routing, incident response, access reviews, vulnerability management, and independently evidenced safeguards are required before representing encryption, firewall protection, threat blocking, uptime, availability, alerting, infrastructure health, or security posture as active or complete.",
  },
  {
    title: "Authorized reporting, disclosure, and vulnerability workflows",
    icon: Siren,
    detail:
      "Defined reporting channels, accountable owners, triage standards, response targets, disclosure policy, scope, eligibility rules, payment controls where applicable, audit trails, abuse prevention, and approved communications are required before accepting a vulnerability report, offering a bounty, assigning a severity, promising a reward, disclosing a finding, or reporting remediation status.",
  },
  {
    title: "Evidence-based API and security-operation reporting",
    icon: KeyRound,
    detail:
      "Authorized API-key infrastructure, server-side lifecycle controls, scope enforcement, expiration and revocation, rate-limit evidence, documented metric definitions, durable telemetry, observability, capacity monitoring, and independently verifiable methods are required before creating, listing, revoking, or reporting API keys, alerts, bugs, active users, transaction totals, success rates, response times, live data, automation, advanced analytics, security scores, or production readiness.",
  },
];

export default function Security() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Security-center service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Security Center
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Account-security controls, encryption, multi-factor authentication,
            audit logs, web-application firewall protection, API keys,
            vulnerability reporting, rewards, alerts, uptime, operational
            metrics, and security scores are not configured for this deployment.
            No protection, finding, security result, payment, metric, or service
            result is represented as current, complete, verified, active, or
            available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated security control, scan, alert, bounty, or metric
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not enable or verify a security control, create
                an API key, retrieve a log or alert, execute a scan, accept a
                vulnerability report, issue a reward, calculate a metric, or
                report that a security action succeeded.
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
