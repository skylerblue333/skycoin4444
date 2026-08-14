import {
  AlertTriangle,
  CreditCard,
  Database,
  Landmark,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authorized payment-provider and checkout integration",
    icon: CreditCard,
    detail:
      "Configured payment providers, authenticated customer records, secure provider-hosted checkout, server-side order creation, price validation, product and entitlement records, webhook signature verification, idempotency, failure handling, confirmation tracking, refunds, disputes, receipts, reconciliation, and audit trails are required before offering, creating, redirecting to, or reporting a payment, checkout, subscription, plan, order, or transaction.",
  },
  {
    title: "Secure financial, token, and settlement controls",
    icon: Landmark,
    detail:
      "Verified wallet or custody controls, network and transaction validation, balance reconciliation, settlement procedures, fee and pricing disclosure, anti-fraud safeguards, consumer protections, tax and legal review, financial recordkeeping, and independent auditability are required before representing token payments, cryptocurrency, cards, bank transfers, discounts, fees, token burns, balances, payouts, or any financial benefit.",
  },
  {
    title: "Reliable billing, entitlement, and order records",
    icon: Database,
    detail:
      "Durable authorization-scoped billing records, documented status definitions, immutable provider references, entitlement enforcement, privacy protections, data-quality validation, retention and deletion controls, correction processes, and support escalation are required before presenting purchase history, subscription status, order amounts, plan features, account access, billing status, or fulfillment results.",
  },
  {
    title: "Trust, security, and compliance assurance",
    icon: ShieldCheck,
    detail:
      "Appropriate security controls, tested encryption and security statements, access restrictions, secrets management, incident response, transparent refund and cancellation terms, privacy controls, legal compliance, and ongoing monitoring are required before presenting payment-security, refund, cancellation, service-level, provider, encryption, or compliance assurances.",
  },
];

export default function Payments() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Payment service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Payments and Subscriptions
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Subscription plans, pricing, plan features, payment methods,
            checkout, cards, bank transfers, cryptocurrency, token payments,
            token discounts, token burns, payment fees, refunds, security
            assurances, orders, receipts, billing history, account entitlements,
            and transaction outcomes are not configured for this deployment. No
            payment, subscription, purchase, order, token transfer, refund,
            provider integration, price, or financial result is represented as
            current, verified, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated checkout, subscription, balance, order, or payment
                outcome
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not create a checkout session, collect payment
                details, process a card or transfer, add a payment method, issue
                an entitlement, apply a discount, burn a token, reveal a billing
                record, initiate a refund, or report that a payment or
                subscription succeeded.
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
