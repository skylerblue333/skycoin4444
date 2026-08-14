import {
  AlertTriangle,
  Bot,
  Landmark,
  ShieldCheck,
  Workflow,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Verified payments and token settlement",
    icon: Landmark,
    detail:
      "Authorized payment or blockchain providers, wallet and recipient verification, transaction signing safeguards, network and parameter validation, confirmation tracking, duplicate-submission prevention, source-of-truth ledgers, fee disclosure, reconciliation, anti-fraud controls, refund and dispute handling, and audit records are required before initiating or representing a tip, transfer, payment, balance, fee, reward, volume, or other financial action.",
  },
  {
    title: "Controlled marketplace and service workflows",
    icon: Workflow,
    detail:
      "Authenticated and authorized listings, identity and ownership checks, product or service validation, content moderation, pricing and availability controls, durable request and fulfillment records, buyer and seller protections, tax and consumer review, cancellation and dispute processes, and auditability are required before creating a listing, requesting a service, matching participants, accepting work, or reporting a marketplace outcome.",
  },
  {
    title: "Safe AI-assisted action boundaries",
    icon: Bot,
    detail:
      "A documented AI capability, authenticated user consent, scoped permissions, human confirmation for consequential actions, provider and tool authorization, input and output validation, action logs, error recovery, abuse controls, privacy review, and clear non-execution disclosures are required before allowing an AI service to claim it can make payments, contact people, create listings, hire providers, or perform other real-world actions.",
  },
  {
    title: "Reliable activity and platform statistics",
    icon: ShieldCheck,
    detail:
      "Source-attributed event data, durable and authorized activity records, documented measurement methodology, privacy controls, deduplication, data-quality checks, access restrictions, retention rules, and correction procedures are required before showing action history, user counts, transaction volume, service status, or platform activity metrics.",
  },
];

export default function ActionPanel() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Action service unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Action Panel
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Tips, token transfers, service requests, creator hiring, product or
            service listings, marketplace sales, social matches, AI-assisted
            real-world actions, financial fees, action histories, transaction
            volume, user counts, and activity statistics are not configured for
            this deployment. No action, payment, service request, listing,
            match, AI execution, social record, financial value, or platform
            metric is represented as current, verified, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated action execution or successful outcome
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not send funds, calculate or collect a fee,
                create a marketplace offer, publish a service request, contact a
                provider, form a match, generate a financial record, execute an
                AI-directed action, or report that an operation succeeded.
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
