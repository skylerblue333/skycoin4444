import { AlertTriangle, Bot, Code2, Database, ShieldCheck } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "AI code-generation service",
    icon: Bot,
    detail: "A configured server-side model provider, authenticated request handling, scoped usage controls, prompt security, output labeling, and failure handling are required before generating code or representing any model as available.",
  },
  {
    title: "Safe code analysis and execution boundary",
    icon: ShieldCheck,
    detail: "Sandbox isolation, dependency controls, secret redaction, abuse prevention, vulnerability review, audit logs, and human approval are required before analyzing, executing, or rating user-provided code.",
  },
  {
    title: "Project and result persistence",
    icon: Database,
    detail: "Authenticated project storage, ownership checks, version history, retention controls, export restrictions, and deletion workflows are required before retaining prompts, code, analyses, or task histories.",
  },
  {
    title: "Repository integration and review",
    icon: Code2,
    detail: "Least-privilege source-control access, branch protections, protected secrets, pull-request review, explicit user confirmation, and rollback procedures are required before changing or pushing repository content.",
  },
];

export default function AICodeStudio() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> AI code service unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">AI Code Studio</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            AI code generation, streaming output, code analysis, autonomous task cycles, bot activity, repository modifications, push history, and quality scores are not configured for this deployment. No generated result, analysis, runtime state, or source-control action is represented as available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">No simulated coding or autonomous-engineering activity</h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not generate, review, refactor, test, execute, score, retain, or publish code. It does not report bot activity, task completion, generated lines, system status, or repository updates.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2">
          {serviceRequirements.map(requirement => {
            const Icon = requirement.icon;
            return (
              <Card key={requirement.title} className="border-slate-700 bg-slate-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-base text-white">
                    <span className="rounded-lg bg-slate-800 p-2 text-sky-300"><Icon className="h-5 w-5" /></span>
                    {requirement.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-slate-300">{requirement.detail}</p>
                  <p className="mt-4 text-xs font-medium text-slate-400">Status: not configured</p>
                </CardContent>
              </Card>
            );
          })}
        </section>
      </div>
    </main>
  );
}
