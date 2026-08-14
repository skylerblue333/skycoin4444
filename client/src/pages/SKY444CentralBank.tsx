import {
  AlertTriangle,
  Database,
  Landmark,
  Scale,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Legal, policy, and governance authority",
    icon: Landmark,
    detail:
      "A documented mandate, legal review, accountable governance process, transparent policy rules, separation of duties, independent oversight, public disclosures, and an appeal or dispute process are required before presenting a central-bank, monetary-policy, or treasury-management service.",
  },
  {
    title: "Verified token and blockchain data",
    icon: Database,
    detail:
      "Supported networks, validated contract addresses, indexed on-chain data, reconciliation, supply methodology, transaction verification, reliable availability handling, and source attribution are required before displaying a token, supply, circulating amount, burn, reserve, or market state.",
  },
  {
    title: "Custody and financial-control infrastructure",
    icon: ShieldCheck,
    detail:
      "Secure custody, key management, multi-party approval, transaction controls, accounting reconciliation, reserve attestations, incident response, and authorization boundaries are required before representing a treasury balance, protocol revenue, reserve, allocation, or fund movement.",
  },
  {
    title: "Economic-model safeguards",
    icon: Scale,
    detail:
      "A documented model, controlled issuance process, validated calculations, risk review, independent testing, monitoring, clear disclosures, and change-management controls are required before claiming an emission rate, yield, burn rate, governance weight, allocation, or economic health status.",
  },
];

export default function SKY444CentralBank() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Central-bank service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            SKY444 Central Bank
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Monetary policy, token registries, supplies, issuance, circulation,
            token roles, market health, treasury balances, protocol revenue,
            reserves, burn pools, economic controls, governance weights, staking
            yields, and allocations are not configured for this deployment. No
            token, financial value, reserve, policy, reward, or market state is
            represented as current, verified, or authoritative.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated central bank, token economics, or treasury
                management
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not create, issue, list, price, burn, stake,
                allocate, reserve, transfer, or custody an asset; it also does
                not calculate monetary policy, yield, token supply, or economic
                health.
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
