import {
  AlertTriangle,
  FileKey2,
  Network,
  ShieldCheck,
  WalletCards,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const custodyRequirements = [
  {
    title: "Wallet connection and address ownership",
    icon: WalletCards,
    detail:
      "A wallet-provider integration, address validation, signed-message verification, and explicit account selection are required before showing connected wallets or balances.",
  },
  {
    title: "Key management and signing",
    icon: FileKey2,
    detail:
      "A documented custody model, hardware or external signer boundary, access controls, recovery process, and security review are required before any key or signing workflow is offered.",
  },
  {
    title: "Network and transaction operations",
    icon: Network,
    detail:
      "Verified RPC providers, chain-specific validation, fee estimation, nonce management, idempotency controls, broadcast handling, and confirmation monitoring are required before sending transactions.",
  },
  {
    title: "Custody assurance",
    icon: ShieldCheck,
    detail:
      "Independent architecture review, operational controls, monitoring, incident response, and audit evidence are required before the platform can represent a custody or non-custody security posture.",
  },
];

export default function BlockchainCustody() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Custody integration
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Blockchain Custody
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            This deployment has no verified wallet-custody or blockchain-signing
            integration. It does not display wallet addresses, token balances,
            transaction history, network fees, signing status, transaction
            hashes, or custody assurances.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No custody or transaction functionality is simulated
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                The platform does not create wallets, derive addresses, store or
                derive keys, sign transactions, broadcast transactions, or claim
                that it is non-custodial. Those actions stay unavailable until a
                secure, auditable implementation is in place.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2">
          {custodyRequirements.map(requirement => {
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
