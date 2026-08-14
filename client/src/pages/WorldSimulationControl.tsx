import {
  Activity,
  AlertTriangle,
  Database,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Isolated non-production simulation environment",
    icon: Activity,
    detail:
      "A formally isolated environment, documented simulation scope, non-production credentials and datasets, change-control approvals, resource limits, reproducible scenarios, access logging, monitoring, rollback procedures, and explicit safeguards against production side effects are required before running or controlling a simulation.",
  },
  {
    title: "Authorized synthetic identities and data handling",
    icon: UserRoundCheck,
    detail:
      "Clearly designated test-only identities, no connection to real users or credentials, synthetic data provenance, consent and privacy review, content and abuse controls, deletion procedures, and auditable lifecycle management are required before creating, displaying, activating, or managing simulated people, personas, relationships, posts, trust scores, or user behavior.",
  },
  {
    title: "Safe scenario and system-intervention controls",
    icon: ShieldCheck,
    detail:
      "Role-based authorization, approved runbooks, rate limits, circuit breakers, preflight checks, human approval, safe execution boundaries, idempotency, failure recovery, incident response, and audit logs are required before advancing a system state, injecting a trend, spawning users, running a stress test, changing AI load, exercising payment behavior, or executing any control action.",
  },
  {
    title: "Verified economic and operational measurements",
    icon: Database,
    detail:
      "Source-attributed data, documented calculation methods, network and account validation, accounting and reconciliation, freshness controls, quality monitoring, privacy safeguards, and independent auditability are required before displaying circulation, treasury, wallet, transaction, user, trust, influence, activity, price, volume, reward, or other financial and operational values.",
  },
];

export default function WorldSimulationControl() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Simulation control service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            World Simulation Control
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Simulation timelines, snapshots, synthetic identities, personas,
            trend injection, behavior controls, testing scenarios, payment and
            AI stress operations, user activity, trust scores, wallet balances,
            economic circulation, treasury values, transaction volume, prices,
            and other simulation or operational metrics are not configured for
            this deployment. No real system, person, payment, asset, model,
            network, or production state is simulated, controlled, measured, or
            changed here.
          </p>
        </header>
        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated users, trend injection, system control, payment
                stress, or financial metric
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not advance a system tick, run a scenario,
                activate a persona, create a synthetic user, inject a trend,
                perform a payment test, load an AI system, access a wallet,
                calculate an economic value, or report that a control or
                simulation action succeeded.
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
