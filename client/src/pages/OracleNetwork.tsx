import {
  AlertTriangle,
  Database,
  FileCheck2,
  ShieldCheck,
  Workflow,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authorized data-provider and oracle integration",
    icon: Database,
    detail:
      "Authorized provider integration, documented data coverage, validated source identifiers, timestamped source attribution, data-schema validation, aggregation and normalization rules, stale-data detection, outage handling, reconciliation, provenance records, defined empty states, and independently verifiable provider status are required before retrieving, publishing, aggregating, or reporting an oracle feed, market value, on-chain value, provider result, network status, or data result.",
  },
  {
    title: "Secure publication and blockchain-operation safeguards",
    icon: ShieldCheck,
    detail:
      "Validated network and contract configuration, protected key and secret handling, least-privilege access, signer authorization, transaction-parameter validation, replay and duplicate prevention, transaction-status verification, failure handling, secure audit logging, incident response, and independently evidenced controls are required before signing, submitting, updating, or reporting an on-chain oracle, transaction, contract, data publication, or blockchain operation.",
  },
  {
    title: "Governed data quality and operational controls",
    icon: FileCheck2,
    detail:
      "Documented data-quality policies, provider due diligence, integrity and availability review, incident and correction workflows, change management, escalation paths, retention requirements, independent review, and evidence-based operating policies are required before representing an oracle, provider, network, data feed, data value, security control, or related service as trusted, protected, available, operational, or production-ready.",
  },
  {
    title: "Evidence-based analytics and performance reporting",
    icon: Workflow,
    detail:
      "Verified service integrations, documented metric definitions and calculation basis, durable telemetry, source attribution, observability, performance testing, alerting, incident management, and independently verifiable methods are required before reporting real-time data, AI insights, autonomous automation, processing speed, uptime, latency, throughput, service availability, or production performance.",
  },
];

export default function OracleNetwork() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Oracle-network service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Oracle Network
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Oracle feeds, data providers, on-chain data publication, network
            status, analytics, AI insights, automation, security controls,
            processing speed, uptime, latency, throughput, and service
            availability are not configured for this deployment. No oracle,
            provider, network, data, transaction, metric, or service result is
            represented as current, complete, verified, active, secure,
            operational, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated oracle feed, data source, network, or transaction
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not retrieve or aggregate provider data, validate
                a feed, publish an on-chain value, access a network or contract,
                submit a transaction, generate an insight, trigger automation,
                or report that a blockchain or data operation succeeded.
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
