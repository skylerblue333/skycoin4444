import {
  AlertTriangle,
  Cpu,
  FileCheck2,
  ShieldCheck,
  Workflow,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authorized quantum-compute provider integration",
    icon: Cpu,
    detail:
      "An authorized provider account, scoped credentials, documented hardware and simulator availability, workload validation, tenant isolation, quota and cost controls, error recovery, cancellation handling, reproducible execution records, and verified result retrieval are required before submitting, processing, or reporting a quantum-computing workload, job, result, availability, or capacity claim.",
  },
  {
    title: "Reviewed workloads and result validation",
    icon: FileCheck2,
    detail:
      "Documented algorithm requirements, input validation, test vectors, baseline comparisons, result provenance, reproducibility controls, independent review, defined uncertainty and failure states, model and dependency versioning, and retained execution evidence are required before presenting computation results, analytics, insights, predictions, recommendations, or processing claims.",
  },
  {
    title: "Secure access and operational change controls",
    icon: ShieldCheck,
    detail:
      "Authenticated authorization, least-privilege access, secure secret management, network protections, change approval, code review, dependency review, rate limits, audit logging, incident response, and access reviews are required before enabling a compute workload, handling sensitive inputs, exposing a result, applying a security policy, or reporting that an operation succeeded.",
  },
  {
    title: "Evidence-based operations and performance reporting",
    icon: Workflow,
    detail:
      "Durable telemetry, documented metric definitions, workload attribution, observability, provider-status monitoring, resilience and performance testing, alerting, incident management, and independently verifiable methods are required before reporting real-time processing, AI insights, autonomous automation, encryption protection, uptime, latency, throughput, processing speed, or production readiness.",
  },
];

export default function QuantumComputing() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Quantum-computing service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Quantum Computing Hub
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Quantum-computing workloads, hardware access, simulation, processing
            results, AI insights, automation, encryption protection, uptime,
            latency, throughput, and processing performance are not configured
            for this deployment. No workload, computation, metric, security
            control, or service result is represented as current, complete,
            verified, active, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated compute workload, result, or performance claim
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not submit a quantum workload, access hardware,
                run a simulator, retrieve a compute result, generate an insight,
                trigger automation, apply a security control, calculate
                performance, or report that an operation succeeded.
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
