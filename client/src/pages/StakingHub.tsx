import {
  AlertTriangle,
  BarChart3,
  Database,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authorized account, validator, and position records",
    icon: Database,
    detail:
      "Authenticated account ownership, tenant isolation, scoped authorization, authorized network and validator configuration, durable position records, source attribution, safe pagination, audit logging, reconciliation, and clear empty and error states are required before displaying any account, address, validator, delegation, stake, balance, reward, lockup, transaction, or position result.",
  },
  {
    title: "Verified network and transaction integration",
    icon: LockKeyhole,
    detail:
      "Authorized network providers, network and address validation, validated transaction parameters, signature verification where applicable, transaction-status confirmation, duplicate-submission prevention, replay protection where applicable, fee handling, failure recovery, and transaction-hash evidence are required before preparing, submitting, confirming, changing, or reporting any staking, delegation, reward, validator, transfer, lockup, or on-chain operation.",
  },
  {
    title: "Secure custody and financial controls",
    icon: ShieldCheck,
    detail:
      "Secure key and credential handling, no plaintext private keys or seed phrases, least-privilege access, sensitive-data minimization, secure logging, incident response, withdrawal and authorization controls, fraud and abuse prevention, jurisdictional controls where applicable, and independently evidenced safeguards are required before exposing or managing a wallet, balance, account, staking position, or financial operation.",
  },
  {
    title: "Evidence-based staking and operational reporting",
    icon: BarChart3,
    detail:
      "Source-attributed ledger events, documented reward and yield calculation methods, calculation-version records, provider reconciliation, risk disclosures, observability, capacity monitoring, incident management, and independently verifiable methods are required before reporting rewards, yield, balances, performance, returns, active users, transactions, success rates, response times, real-time updates, automation, advanced analytics, or production readiness.",
  },
];

export default function StakingHub() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Staking service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Staking Hub
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Staking positions, validators, delegations, balances, rewards,
            yields, transactions, performance, analytics, live updates,
            automation, success rates, and response times are not configured for
            this deployment. No account, wallet, validator, position, reward,
            yield, transaction, market metric, or service result is represented
            as current, complete, verified, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated staking position, reward, yield, or transaction
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not access an account or balance, retrieve
                validator data, calculate a reward or yield, create or submit a
                transaction, change a delegation, stream an update, or report
                that a financial or on-chain action succeeded.
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
