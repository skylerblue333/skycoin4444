import {
  AlertTriangle,
  Brain,
  Database,
  FileCheck2,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Configured AI providers, models, agents, and prompts",
    icon: Brain,
    detail:
      "Server-side provider configuration, model identifiers and versions, agent definitions, prompts, tools, permissions, quotas, safety policies, environment separation, secrets handling, and reproducible request records are required before representing an AI agent, model, prompt, output, task, load, token count, response, or capability as configured, active, available, current, or successful.",
  },
  {
    title: "Persisted control-plane, usage, and audit records",
    icon: Database,
    detail:
      "Authenticated and access-controlled services for agents, controls, model deployments, requests, responses, usage, errors, timestamps, approvals, policy changes, user scope, retention, privacy, and audit history are required before retrieving, changing, restarting, pausing, deploying, exporting, or reporting an AI control, agent state, task count, usage value, user, or operational event.",
  },
  {
    title: "Verified safety, evaluation, and authorization controls",
    icon: ShieldCheck,
    detail:
      "Least-privilege authorization, prompt and data protection, PII handling, moderation, abuse prevention, hallucination evaluation, bias and toxicity testing, human review, model and tool allowlists, rate limits, incident response, rollback, and evidence that controls operate as designed are required before claiming an AI safety control is enabled, effective, monitored, or protective.",
  },
  {
    title: "Evidence-based AI and operational reporting",
    icon: FileCheck2,
    detail:
      "Traceable source data, metric definitions, evaluation datasets, test results, monitoring, latency and error measurements, synchronization semantics, support procedures, and independently verifiable records are required before reporting active agents, tasks, load, checks, entities, events, ticks, response times, success rates, analytics, automation outcomes, documentation availability, or production readiness.",
  },
];

export default function HOPEAIControl() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> HOPEAI Control service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            HOPEAI Control
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Verified AI providers, models, agents, prompts, tools, control-plane
            services, ethics controls, world simulation state, usage records,
            telemetry, analytics, automation, operational, and support services
            are not configured for this deployment. No agent, model, prompt,
            response, task, load, safety state, entity, event, tick, user,
            metric, capability, or service status is represented as current,
            complete, verified, active, safe, effective, available, or
            successful.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated AI agents, model controls, safety states, or world
                metrics
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not call AI providers, create or manage agents,
                execute prompts, generate outputs, change model configuration,
                restart or pause services, toggle safety controls, retrieve
                world simulation state, count tasks, calculate load, synchronize
                records, automate actions, or report analytics or operational
                outcomes. It does not claim that any AI operation, safety
                control, or deployment action succeeded.
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

        <div className="mt-8 flex items-center gap-3 text-sm text-slate-400">
          <SlidersHorizontal className="h-4 w-4" /> AI control, model
          operations, safety enforcement, and telemetry will remain disabled
          until the required services are configured and verified.
        </div>
      </div>
    </main>
  );
}
