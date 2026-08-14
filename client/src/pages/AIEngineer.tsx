import { AlertTriangle, Bot, Code2, ShieldCheck, Workflow } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Agent orchestration and permissions",
    icon: Workflow,
    detail:
      "Authenticated agent identities, task boundaries, server-side tool permissions, audit logs, approval gates, and reliable failure recovery are required before orchestrating multi-agent engineering work.",
  },
  {
    title: "Code generation and execution controls",
    icon: Code2,
    detail:
      "Configured model providers, output labeling, sandboxed execution, dependency policy, source review, and human approval are required before generating, modifying, or running code on behalf of a user.",
  },
  {
    title: "Security analysis boundaries",
    icon: ShieldCheck,
    detail:
      "Validated scanners, permissioned targets, scope controls, reproducible evidence, and expert review are required before representing a security audit, penetration test, or remediation finding as complete.",
  },
  {
    title: "Operational transparency",
    icon: Bot,
    detail:
      "A versioned agent catalog, capability inventory, monitoring, rate limits, provider health checks, and user disclosures are required before exposing agent counts, levels, active sprints, or production-readiness claims.",
  },
];

export default function AIEngineer() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> AI engineering service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            AI Engineer Studio
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            No AI engineering service is configured for this deployment. The
            platform does not run named agents, generate or execute code, create
            tests, conduct audits, coordinate sprints, or report agent capacity,
            security findings, or production readiness.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No autonomous changes or simulated agent outputs
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This interface does not fabricate agent responses, code, review
                findings, security audits, sprint plans, operational metrics, or
                deployment outcomes. Engineering actions remain unavailable
                until their service boundaries and authorization controls are
                implemented.
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
