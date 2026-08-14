import {
  AlertTriangle,
  CreditCard,
  Database,
  Palette,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Verified catalog and authenticity records",
    icon: Palette,
    detail:
      "A source-of-truth product catalog, creator authorization, media provenance, edition and inventory controls, authenticity documentation, and correction procedures are required before publishing art, signed editions, certificates, limited quantities, or product claims.",
  },
  {
    title: "Secure checkout and payment processing",
    icon: CreditCard,
    detail:
      "A live payment provider configuration, server-side price verification, tax handling, customer confirmation, refund workflows, fraud controls, and order reconciliation are required before accepting payment or representing a checkout as available.",
  },
  {
    title: "Orders, delivery, and ownership fulfillment",
    icon: Database,
    detail:
      "Authenticated order records, authorization checks, digital-delivery controls, fulfillment tracking, customer support, and reliable ownership records are required before delivering an item, granting access, or confirming a sale.",
  },
  {
    title: "Consumer protection and operational safeguards",
    icon: ShieldCheck,
    detail:
      "Clear terms, privacy controls, returns and cancellation policies, dispute handling, incident response, and operational ownership are required before operating a consumer marketplace or storefront.",
  },
];

export default function DigitalArtStore() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Digital art store
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Digital Art Store
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Product listings, edition quantities, availability, prices,
            certificates of authenticity, carts, checkout, payment collection,
            orders, fulfillment, downloads, and ownership records are not
            configured for this deployment. No artwork, price, inventory level,
            payment, order, or authenticity claim is represented as verified or
            available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated sales, checkout, or ownership activity
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not add items to a cart, reserve an edition,
                quote a price, collect payment, issue a certificate, create an
                order, grant a download, or confirm a purchase. A mock checkout
                is not presented as a sale flow.
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
