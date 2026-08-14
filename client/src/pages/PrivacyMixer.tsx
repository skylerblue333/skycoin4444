import {
  AlertTriangle,
  FileCheck2,
  Landmark,
  ShieldCheck,
  Workflow,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authorized financial and blockchain service integration",
    icon: Landmark,
    detail:
      "Authorized network and provider integration, authenticated ownership, validated account and transaction records, asset and network verification, scoped authorization, durable state, idempotency controls, failure handling, reconciliation, transaction-status verification, and evidence-based monitoring are required before displaying, preparing, submitting, processing, or reporting a financial, blockchain, wallet, privacy, or transaction result.",
  },
  {
    title: "Legal, compliance, and risk governance",
    icon: FileCheck2,
    detail:
      "Documented legal and regulatory review, jurisdictional controls, risk assessment, prohibited-use controls, transaction-monitoring governance where required, record-retention policy, escalation procedures, independent review, and approved operating policies are required before enabling or representing any financial privacy, transaction-routing, asset-transfer, wallet, or related service as available or compliant.",
  },
  {
    title: "Security and custody safeguards",
    icon: ShieldCheck,
    detail:
      "Secure key custody, least-privilege access, hardware-backed or otherwise approved secret management, input validation, transaction approval controls, access reviews, audit logging, incident response, dependency review, vulnerability management, and independently verified safeguards are required before handling assets, credentials, transactions, sensitive information, or security-sensitive service actions.",
  },
  {
    title: "Evidence-based operations and performance reporting",
    icon: Workflow,
    detail:
      "Verified service integrations, documented metric definitions, durable telemetry, source attribution, observability, resilience testing, alerting, incident management, and independently verifiable methods are required before reporting real-time processing, AI insights, autonomous automation, encryption protection, uptime, latency, throughput, processing performance, service availability, or production readiness.",
  },
];

export default function PrivacyMixer() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Privacy-mixing service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Privacy Mixer
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Privacy-mixing, financial or blockchain transaction processing,
            wallet operations, data protection, AI insights, automation,
            security controls, uptime, latency, throughput, and processing
            performance are not configured for this deployment. No asset,
            transaction, privacy outcome, security guarantee, metric, or service
            result is represented as current, complete, verified, active, or
            available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated transaction, privacy, or asset-transfer result
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not access a wallet, retrieve a balance,
                construct or submit a transaction, process an asset transfer,
                apply a privacy mechanism, generate an insight, trigger
                automation, calculate performance, or report that a financial or
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
