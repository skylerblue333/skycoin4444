import {
  AlertTriangle,
  Database,
  FileCheck2,
  Landmark,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Verifiable financial records and treasury controls",
    icon: Landmark,
    detail:
      "Authorized accounting systems, source transactions, reconciliation, period definitions, access controls, review and approval workflows, custody safeguards, independent assurance where applicable, correction records, and documented reporting methodology are required before displaying or characterizing revenue, donations, subscriptions, marketplace proceeds, treasury balances, fund allocations, or financial performance.",
  },
  {
    title: "Verified blockchain and wallet data",
    icon: Database,
    detail:
      "Configured network and explorer integrations, validated contract addresses, source-attributed block and transaction references, confirmation handling, indexer integrity checks, chain reorganization handling, wallet privacy protections, reconciliation, and independent verification links are required before reporting token supply, burns, holdings, staking, wallets, balances, liquidity, or other blockchain data.",
  },
  {
    title: "Independent audit and compliance evidence",
    icon: FileCheck2,
    detail:
      "Authentic, current, and authorized audit reports; disclosed scope and limitations; verifiable auditor identity; public-report links; legal and regulatory review; jurisdictional analysis; ongoing control testing; and correction procedures are required before representing an audit, legal entity, registration, token classification, privacy posture, regulatory status, certification, or compliance result.",
  },
  {
    title: "Security telemetry and transparency governance",
    icon: ShieldCheck,
    detail:
      "Source-attributed monitoring, integrity controls, documented metric methodology, incident processes, confidential-data review, retention policies, data-quality checks, public disclosure governance, access control, and remediation workflows are required before displaying a security state, moderation count, firewall status, encryption grade, uptime, live feed, verification state, or public transparency metric.",
  },
];

export default function ProofVault() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Transparency service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Proof Vault
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Revenue, donations, subscriptions, marketplace proceeds, treasury
            balances, token burns, wallet statistics, staking, token holdings,
            blockchain verification, security telemetry, moderation activity,
            uptime, audit reports, legal entity status, token classification,
            privacy posture, and compliance claims are not configured for this
            deployment. No financial, blockchain, legal, security, audit, or
            transparency claim is represented as current, independently
            verified, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated financial, audit, legal, or verification results
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not query or reconcile a ledger, retrieve a
                blockchain event, calculate a balance, verify a transaction or a
                wallet, attest to an audit, disclose a legal or regulatory
                status, calculate an uptime or security metric, or certify any
                public statement as independently verifiable.
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
