import {
  AlertTriangle,
  Bot,
  Database,
  ShieldCheck,
  Workflow,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authorized agent runtime and task execution",
    icon: Bot,
    detail:
      "A configured and governed agent runtime, authenticated identities, scoped permissions, tool allowlists, execution isolation, input validation, output review, approval controls, resource limits, idempotency, incident response, and durable task records are required before representing an agent as active or allowing it to act on a task.",
  },
  {
    title: "Workflow orchestration and operational controls",
    icon: Workflow,
    detail:
      "Persisted workflow definitions, authorized triggers, scheduling controls, dependency validation, pause and cancellation behavior, retry and rollback handling, concurrency limits, change management, monitoring, and emergency shutdown controls are required before running or displaying an automated workflow, delegation chain, or autonomous sprint.",
  },
  {
    title: "Security and financial safety boundaries",
    icon: ShieldCheck,
    detail:
      "Independent security review, verified market-data contracts, explicit financial authorization, wallet and custody controls, fraud safeguards, privacy protections, moderation policies, human escalation, and clear risk disclosures are required before an agent can monitor wallets, analyze markets, trade, adjust limits, enforce policy, or make decisions affecting users or funds.",
  },
  {
    title: "Verified telemetry, audit logs, and performance reporting",
    icon: Database,
    detail:
      "Source-of-truth telemetry, immutable audit events, structured logging, access controls, retention policies, data-quality checks, metric definitions, correction paths, and observability are required before displaying agent names, status, task counts, current tasks, workflow states, sprint history, generated code, or performance metrics.",
  },
];

export default function AgentCoordinationHub() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Agent coordination
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Agent Coordination Hub
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Agent teams, agent identities, task counts, autonomous workflows,
            scheduling, task delegation, coding sprints, content generation,
            market analysis, trading, wallet monitoring, security scanning,
            recommendations, performance metrics, and activity logs are not
            configured for this deployment. No agent, task, workflow, log,
            security operation, financial operation, or automated outcome is
            represented as current, verified, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated agent activity or automation
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not start an agent, accept a delegated task,
                create or run a workflow, schedule work, generate content or
                code, query market data, trade an asset, monitor a wallet, scan
                for threats, adjust controls, or report automated work as
                complete.
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
