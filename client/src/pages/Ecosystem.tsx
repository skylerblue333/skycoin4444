import {
  AlertTriangle,
  Database,
  Landmark,
  ShieldCheck,
  Workflow,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Verified module availability and integration status",
    icon: Workflow,
    detail:
      "An implemented module inventory, authenticated service dependencies, documented API contracts, authorization controls, health checks, deployment records, change management, user-facing error handling, and continuous monitoring are required before presenting a platform area, integration, or capability as active, connected, available, or fully integrated.",
  },
  {
    title: "Trusted operational and activity metrics",
    icon: Database,
    detail:
      "Source-attributed, durable event records; documented definitions and methodology; privacy protections; deduplication; validation; retention controls; authorization; data-quality monitoring; and correction processes are required before displaying users, posts, streams, bots, courses, activity, reach, adoption, live status, or other platform metrics.",
  },
  {
    title: "Authorized financial, token, and commerce services",
    icon: Landmark,
    detail:
      "Configured payment and blockchain providers, secure custody or wallet controls, contract and network validation, transaction confirmation, pricing and fee disclosure, reconciliation, consumer protections, settlement, tax and legal review, fraud controls, and auditability are required before representing staking, swaps, yield, token price or supply, treasury management, pools, rewards, NFTs, subscriptions, payment processing, revenue, or financial benefits.",
  },
  {
    title: "Security, governance, and AI assurance",
    icon: ShieldCheck,
    detail:
      "Documented security controls, tested encryption claims, key management, rate limits, incident response, audit logging, compliance assessment, governance rules, participant authorization, human oversight, privacy review, safety evaluations, and accountable AI boundaries are required before presenting security certifications, governance, automated decision-making, AI agents, predictive systems, compliance frameworks, or platform trust guarantees.",
  },
];

export default function Ecosystem() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Ecosystem status
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            SKYCOIN4444 Ecosystem
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Ecosystem-wide feature availability, external integrations,
            open-source activity, artificial intelligence services, finance and
            DeFi, token metrics, education, gaming, social networking, commerce,
            governance, security controls, deployment infrastructure, platform
            statistics, technology certifications, and operational claims are
            not configured for this deployment. No sector, service, metric,
            integration, certification, or operational capability is represented
            as active, connected, current, verified, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated ecosystem status, data, or service integration
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not retrieve external repositories, query live
                platform statistics, verify a service health state, enable a
                financial or token action, grant a governance or security
                capability, or claim that any ecosystem sector is live,
                complete, or connected.
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
