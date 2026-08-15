import {
  AlertTriangle,
  Database,
  FileCheck2,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authorized catalog, inventory, and ownership records",
    icon: ShoppingBag,
    detail:
      "Authenticated ownership, tenant isolation, validated catalog and inventory records, durable item and entitlement definitions, availability and quantity controls, content and rights metadata, duplicate prevention, conflict handling, defined empty states, and clear error recovery are required before displaying, reserving, purchasing, delivering, equipping, granting, or reporting an item, inventory, collectible, NFT, reward, entitlement, availability, ownership, or shop result.",
  },
  {
    title: "Authorized wallet, payment, and ledger integration",
    icon: Database,
    detail:
      "Authorized wallet, payment, or blockchain-provider integration; authenticated account ownership; validated network and transaction parameters; durable balance and ledger records; price and fee provenance; reconciliation; idempotency; transaction-status verification; failure handling; and independently verifiable source data are required before displaying or processing a token balance, price, payment, purchase, transfer, transaction, wallet, or financial result.",
  },
  {
    title: "Secure transaction and account safeguards",
    icon: ShieldCheck,
    detail:
      "Least-privilege authorization, secure secret handling, validated purchase and transaction parameters, protected account actions, duplicate-submission prevention, receipt and transaction verification, abuse controls, secure audit logging, incident response, retention limits, and independently evidenced safeguards are required before handling account, wallet, payment, transaction, inventory, ownership, or other sensitive information or operation.",
  },
  {
    title: "Governed digital-goods and operational reporting",
    icon: FileCheck2,
    detail:
      "Documented product and content governance, required legal and policy review, fulfillment and support workflows, verified service integrations, durable telemetry, source attribution, observability, performance testing, incident management, and independently verifiable methods are required before reporting item availability, scarcity, ownership, purchase success, activity, analytics, automation, service availability, or production readiness.",
  },
];

export default function P2EShop() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> P2E-shop service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            P2E Shop
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Shop items, token balances, prices, inventory, ownership, rewards,
            NFTs, availability, purchases, payments, transfers, transactions,
            and fulfillment are not configured for this deployment. No item,
            balance, ownership, price, payment, transaction, metric, or service
            result is represented as current, complete, verified, active,
            available, purchased, owned, or delivered.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated catalog, balance, purchase, ownership, or
                transaction
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not access an account or wallet, retrieve a
                balance, inventory, ownership record, or item availability,
                calculate a price or fee, reserve or deliver an item, create a
                purchase, submit a payment or transaction, grant an entitlement,
                or report that an operation succeeded.
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
