import {
  AlertTriangle,
  Database,
  FileCheck2,
  Scale,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authorized financial and tax-record access",
    icon: Database,
    detail:
      "Authenticated account ownership, tenant isolation, scoped authorization, durable transaction and source-document records, timestamp preservation, reconciliation workflows, correction handling, audit logging, secure pagination, and clear empty and error states are required before displaying any tax record, transaction, payment, cost basis, income, deduction, asset, balance, or report result.",
  },
  {
    title: "Verified tax calculation and reporting integration",
    icon: FileCheck2,
    detail:
      "Documented tax rules, jurisdiction and period validation, authoritative source data, calculation-version records, cost-basis and fee handling where applicable, reconciliation, correction workflows, document-generation controls, filing-status verification, and evidence-based availability monitoring are required before calculating, generating, filing, or labeling a tax report, form, estimate, liability, payment, or submission.",
  },
  {
    title: "Privacy, security, and compliance controls",
    icon: ShieldCheck,
    detail:
      "Role-based access, sensitive-data minimization, secure storage and transmission, retention limits, secure logging, incident response, identity verification where applicable, data-subject controls, compliance review, and independently evidenced protections are required before exposing financial or tax information.",
  },
  {
    title: "Professional review and evidence-based reporting",
    icon: Scale,
    detail:
      "Appropriate professional review, jurisdictional controls, documented metric definitions, source-attributed telemetry, observability, capacity monitoring, incident management, and independently verifiable methods are required before claiming tax compliance, tax outcomes, tax savings, filing success, active users, transaction totals, success rates, response times, real-time updates, automation, or production readiness.",
  },
];

export default function TaxReporting() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Tax-reporting service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Tax Reporting
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Tax records, calculations, reports, forms, filings, payments,
            liabilities, analytics, active user counts, transaction totals, live
            updates, automation, success rates, and response times are not
            configured for this deployment. No tax record, calculation,
            document, filing, payment, metric, or service result is represented
            as current, complete, verified, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated tax calculation, report, filing, payment, or
                compliance outcome
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not retrieve tax records, calculate a tax amount,
                prepare or file a document, submit a payment, claim a tax
                outcome, stream an update, or report that a financial or
                compliance action succeeded.
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
