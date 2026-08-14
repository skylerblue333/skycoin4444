import {
  AlertTriangle,
  Coins,
  FileCheck2,
  LockKeyhole,
  Network,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stakingRequirements = [
  {
    title: "Protocol and network integration",
    icon: Network,
    detail:
      "A verified staking protocol, supported network configuration, contract addresses, and independent transaction monitoring are required before displaying pools or accepting deposits.",
  },
  {
    title: "Reward and lock calculation",
    icon: Coins,
    detail:
      "A verifiable reward source, token accounting, lock-state tracking, fees, penalty rules, and transaction-confirmation handling are required before showing APY or reward estimates.",
  },
  {
    title: "Authorization and asset protection",
    icon: LockKeyhole,
    detail:
      "Secure wallet authorization, transaction signing, nonce protection, contract-allowance controls, and withdrawal flows are required before stake, claim, or withdrawal actions can be enabled.",
  },
  {
    title: "Operational assurance",
    icon: FileCheck2,
    detail:
      "Documented governance, audit evidence, monitoring, incident response, and accurate user disclosures are required before claiming any audit, security, or performance status.",
  },
];

export default function StakingPortal() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Staking protocol
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Staking Portal
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Staking is not configured for this deployment. The platform does not
            display pools, APY, projected or earned rewards, token locks,
            participant counts, contract audit claims, or available balances
            because those values cannot be verified through a live protocol
            integration.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No deposits, reward claims, or withdrawals are simulated
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This interface does not create a staking position or affect a
                wallet. Financial actions remain disabled until they can be
                submitted, confirmed on the configured network, reconciled, and
                clearly reported to the user.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2">
          {stakingRequirements.map(requirement => {
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
