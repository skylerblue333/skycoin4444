import {
  AlertTriangle,
  ArrowLeftRight,
  Clock3,
  Cpu,
  Landmark,
  LineChart,
  ShieldCheck,
  Wallet,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const integrationRequirements = [
  {
    title: "Wallet custody and address ownership",
    icon: Wallet,
    detail:
      "Requires verified wallet connections, address validation, signature verification, and secure key-management boundaries.",
  },
  {
    title: "Market-data provider",
    icon: LineChart,
    detail:
      "Requires a licensed market-data source, symbol mapping, freshness controls, and clear source attribution before displaying prices.",
  },
  {
    title: "Trading and settlement",
    icon: ArrowLeftRight,
    detail:
      "Requires an exchange or DEX integration, transaction signing, network validation, idempotency protection, and confirmed settlement status.",
  },
  {
    title: "Mining, staking, and burn operations",
    icon: Cpu,
    detail:
      "Requires real protocol integrations, verifiable rewards, transaction hashes, and failure handling. No simulated rewards are shown.",
  },
];

export default function CryptoHub() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Financial integrations
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Crypto Hub
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Live wallet balances, market prices, swaps, mining, staking, token
            burns, and transaction history are not displayed because the
            required custody, blockchain, and market-data integrations have not
            been verified for this deployment.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated financial activity
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This environment does not invent balances, prices, rewards,
                order fills, ownership records, or successful transactions.
                Financial actions remain disabled until they can be executed and
                independently verified end to end.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2">
          {integrationRequirements.map(requirement => {
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
                  <p className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-slate-400">
                    <Clock3 className="h-3.5 w-3.5" /> Not configured
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <section className="mt-8 rounded-xl border border-slate-700 bg-slate-900 p-6">
          <div className="flex items-start gap-3">
            <Landmark className="mt-0.5 h-5 w-5 shrink-0 text-sky-300" />
            <div>
              <h2 className="font-semibold text-white">
                Implementation boundary
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Before financial functionality is enabled, the platform needs
                documented network support, secure transaction-signing
                architecture, authenticated provider credentials, input
                validation, transaction-state monitoring, rate limiting, audit
                logging, and user-facing error recovery. Until those controls
                are available, this page intentionally remains informational.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
