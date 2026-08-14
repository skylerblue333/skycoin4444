import {
  AlertTriangle,
  FileCheck2,
  KeyRound,
  ShieldCheck,
  Workflow,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Reviewed cryptographic architecture and threat model",
    icon: FileCheck2,
    detail:
      "A documented threat model, approved cryptographic architecture, protocol and implementation review, versioned design records, compatibility testing, independent security assessment, remediation tracking, and governance approval are required before representing any encryption, cryptographic control, post-quantum mechanism, security assurance, or protection claim as active or effective.",
  },
  {
    title: "Secure key and secret lifecycle management",
    icon: KeyRound,
    detail:
      "Hardware-backed or otherwise approved key storage, authenticated key generation, rotation, revocation, backup and recovery controls, access isolation, least privilege, audit trails, compromise response, and validated deletion workflows are required before creating, storing, using, distributing, or reporting cryptographic keys, secrets, credentials, certificates, or protected data.",
  },
  {
    title: "Authorized integration and change controls",
    icon: Workflow,
    detail:
      "Authenticated service integration, input validation, authorization, secure configuration management, code review, deployment approval, rollback plans, dependency review, supply-chain safeguards, rate limits, failure handling, and incident response are required before processing data, enabling automation, applying a security policy, or reporting that a security operation succeeded.",
  },
  {
    title: "Evidence-based security and reliability monitoring",
    icon: ShieldCheck,
    detail:
      "Durable telemetry, structured security logging, alerting, independent verification, documented metric definitions, performance and resilience testing, vulnerability management, incident management, and regular access review are required before reporting protection, safety, uptime, latency, throughput, processing performance, real-time activity, analytics, automation, or production readiness.",
  },
];

export default function QuantumSafe() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Quantum-safe security
            service unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Quantum Safe Encryption
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Quantum-safe encryption, cryptographic key management, data
            protection, AI insights, automation, security analytics, uptime,
            latency, throughput, and processing performance are not configured
            for this deployment. No encryption mechanism, cryptographic control,
            security protection, performance metric, or service result is
            represented as current, complete, verified, active, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated encryption, protection, or security guarantee
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not generate or manage keys, encrypt or decrypt
                data, apply a security control, process a protected workload,
                trigger automation, calculate performance, or report that a
                security operation succeeded.
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
