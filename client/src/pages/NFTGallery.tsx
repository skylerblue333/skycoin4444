import {
  AlertTriangle,
  Database,
  FileCheck2,
  Image,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authorized asset, metadata, and ownership records",
    icon: Image,
    detail:
      "Authenticated account ownership, tenant isolation, validated asset and metadata records, durable collection and entitlement definitions, provenance and rights information, content review, ownership-verification rules, duplicate prevention, defined empty states, and clear error recovery are required before displaying, minting, importing, transferring, reporting, or claiming ownership of an NFT, collection, digital asset, image, metadata record, entitlement, creator result, or gallery item.",
  },
  {
    title: "Authorized wallet, marketplace, and transaction integration",
    icon: Database,
    detail:
      "Authorized wallet, marketplace, blockchain-provider, or storage integration; validated network and contract configuration; authenticated account ownership; durable transaction and listing records; source attribution; transaction-status verification; reconciliation; idempotency; failure handling; and independently verifiable source data are required before displaying or processing a listing, price, offer, purchase, sale, transfer, wallet, transaction, balance, ownership, marketplace, or valuation result.",
  },
  {
    title: "Secure asset and account safeguards",
    icon: ShieldCheck,
    detail:
      "Least-privilege authorization, protected key and secret handling, validated asset and transaction parameters, network and contract checks, duplicate-submission prevention, secure audit logging, content and file safeguards, abuse controls, incident response, retention limits, and independently evidenced safeguards are required before handling asset, wallet, ownership, transaction, creator, marketplace, or other sensitive information or operation.",
  },
  {
    title: "Governed operations and evidence-based reporting",
    icon: FileCheck2,
    detail:
      "Documented legal and policy review, required rights and content governance, verified service integrations, durable telemetry, source attribution, observability, performance testing, incident management, and independently verifiable methods are required before reporting availability, ownership, provenance, asset value, analytics, AI insights, automation, security assurances, processing speed, uptime, latency, throughput, or production readiness.",
  },
];

export default function NFTGallery() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> NFT-gallery service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            NFT Gallery
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            NFT assets, collections, images, metadata, ownership, provenance,
            wallet connections, marketplace data, listings, prices, offers,
            purchases, sales, transfers, transactions, analytics, AI insights,
            automation, security assurances, and performance metrics are not
            configured for this deployment. No asset, ownership, wallet,
            transaction, marketplace, metric, or service result is represented
            as current, complete, verified, active, available, minted, listed,
            owned, purchased, sold, or transferred.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated asset, ownership, wallet, marketplace, or
                transaction
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not access a wallet, retrieve asset, metadata,
                ownership, listing, or price data, create or mint an asset,
                submit a purchase, sale, transfer, or transaction, calculate a
                valuation or market metric, trigger automation, or report that
                an asset operation succeeded.
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
