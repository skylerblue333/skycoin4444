import {
  AlertTriangle,
  ClipboardCheck,
  Database,
  Scale,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Moderation policy and case-management workflow",
    icon: Scale,
    detail:
      "Published standards, trained reviewers, authenticated case records, evidence handling, user notice, appeal paths, escalation processes, and quality assurance are required before moderating content or applying an account action.",
  },
  {
    title: "Trust and risk assessment controls",
    icon: ShieldCheck,
    detail:
      "A validated methodology, appropriate data sources, consent and privacy review, bias testing, human oversight, correction rights, monitoring, and documented limitations are required before assigning a trust score or risk level.",
  },
  {
    title: "Security telemetry and rate limiting",
    icon: Database,
    detail:
      "Production enforcement middleware, scoped metrics, retention rules, tamper-resistant logs, alerting, incident response, and access controls are required before reporting blocked requests, abuse events, or rate-limit status.",
  },
  {
    title: "Auditability and accountability",
    icon: ClipboardCheck,
    detail:
      "Reliable audit trails, privacy-safe event records, retention and review policies, role-based access, incident handling, and independent operational ownership are required before displaying moderation actions or audit events.",
  },
];

export default function TrustSafetyDashboard() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Trust-and-safety service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Trust &amp; Safety
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Automated moderation, trust scores, risk levels, rule activation,
            account enforcement, audit logs, safety metrics, and rate-limit
            telemetry are not configured for this deployment. No user, content,
            request, or account is represented as evaluated, restricted,
            moderated, or cleared by this page.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated safety decisions or enforcement activity
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not infer behavior, assign a score, classify
                risk, moderate content, change a moderation rule, restrict an
                account, report a security event, or show an audit record. Those
                functions remain unavailable until their operational, legal, and
                governance controls are implemented.
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
