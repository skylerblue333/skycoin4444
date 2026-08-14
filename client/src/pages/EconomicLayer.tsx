import {
  AlertTriangle,
  BarChart3,
  Coins,
  DatabaseZap,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const dataRequirements = [
  {
    title: "Token and ledger model",
    icon: Coins,
    detail:
      "A documented token model, authenticated ledger, reconciliation controls, transaction identifiers, and clear asset ownership rules are required before showing balances or granting rewards.",
  },
  {
    title: "Economic metrics and rankings",
    icon: BarChart3,
    detail:
      "Verified sources, defined calculation methods, appropriate aggregation, privacy review, and auditability are required before showing supply, volume, wallet, treasury, or ranking metrics.",
  },
  {
    title: "Fees and treasury operations",
    icon: DatabaseZap,
    detail:
      "A real payment or token-settlement flow, authorization controls, error recovery, reconciliation, and governance rules are required before charging fees or reporting treasury activity.",
  },
  {
    title: "Data integrity and disclosures",
    icon: ShieldCheck,
    detail:
      "Operational monitoring, access controls, retention rules, and clear user disclosures are required before the platform can represent economic values as accurate or complete.",
  },
];

export default function EconomicLayer() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Economic data unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Economic Layer
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            The platform does not currently have a verified token ledger or
            economic-data integration for this deployment. No balance, bonus,
            fee, transaction ledger, treasury figure, token supply, volume,
            wallet count, or user ranking is displayed.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No economic activity is simulated
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not issue token rewards, charge fees, modify user
                balances, or publish financial or token-market statistics. Those
                operations remain unavailable until they are backed by an
                auditable, secured implementation.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2">
          {dataRequirements.map(requirement => {
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
