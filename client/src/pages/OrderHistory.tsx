import {
  AlertTriangle,
  FileText,
  PackageCheck,
  ShieldCheck,
  WalletCards,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authenticated order records and access controls",
    icon: PackageCheck,
    detail:
      "A persisted order model, authenticated buyer and seller access, authorization checks, immutable timestamps, item snapshots, order-state transitions, audit records, privacy controls, and error recovery are required before showing any purchase, sale, order number, delivery state, or order history.",
  },
  {
    title: "Verified payment, escrow, and refund processing",
    icon: WalletCards,
    detail:
      "A configured payment processor or authorized blockchain settlement provider, verified payment intent and settlement states, reconciliation, currency controls, duplicate-submission protection, escrow terms, refund workflows, fraud controls, and dispute handling are required before representing a payment, balance, price, escrow status, refund, or financial total.",
  },
  {
    title: "Fulfillment, delivery, and review verification",
    icon: ShieldCheck,
    detail:
      "Authorized merchant integrations, shipment or delivery confirmation, fulfillment status verification, review eligibility rules, abuse prevention, evidence retention, clear responsibility boundaries, and support escalation are required before representing processing, shipping, delivery, completed fulfillment, or a submitted review.",
  },
  {
    title: "Invoice and record-retention controls",
    icon: FileText,
    detail:
      "Jurisdictionally appropriate invoice generation, tax and merchant-of-record rules, secure document storage, authorized download access, correction controls, retention policies, and reliable audit trails are required before generating or presenting an invoice, receipt, or payment record.",
  },
];

export default function OrderHistory() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Order service unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Order History
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Marketplace order history, purchases, sales, order amounts,
            payments, escrow, shipping, fulfillment, delivery, reviews, refunds,
            receipts, and invoices are not configured for this deployment. No
            order, financial, delivery, merchant, or fulfillment information is
            represented as current, verified, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated orders, payments, or fulfillment states
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not create or retrieve an order, calculate an
                amount, confirm a payment or escrow state, issue an invoice,
                track fulfillment, verify delivery, submit a review, process a
                refund, or represent a marketplace transaction as successful.
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
