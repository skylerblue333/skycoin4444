import {
  AlertTriangle,
  BadgeCheck,
  CreditCard,
  ReceiptText,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Configured payment-provider integration",
    icon: CreditCard,
    detail:
      "An authorized payment-provider account, server-side credentials, environment separation, signed webhooks, authenticated checkout-session creation, price and currency validation, origin controls, idempotency, provider error handling, and continuous monitoring are required before initiating or representing a payment checkout.",
  },
  {
    title: "Verified subscription and entitlement management",
    icon: BadgeCheck,
    detail:
      "Persisted subscription records, verified provider events, entitlement enforcement, plan and feature definitions, renewal and cancellation handling, access revocation, payment-failure recovery, support workflows, and reconciliation are required before offering a plan, activating access, or representing subscription features as available.",
  },
  {
    title: "Billing, refunds, promotions, and consumer disclosures",
    icon: ReceiptText,
    detail:
      "Authorized pricing, taxes and merchant-of-record rules, valid promotional terms, refund and cancellation policies, billing records, receipt delivery, chargeback handling, lawful customer disclosures, and auditability are required before displaying a charge, discount, promotion, recurring bill, refund guarantee, or commercial term.",
  },
  {
    title: "Security and compliance assurance",
    icon: ShieldCheck,
    detail:
      "Validated security controls, provider-scope assessment, independent compliance evidence where required, documented data handling, incident response, access review, vulnerability management, and accurate legal disclosures are required before asserting payment security, encryption standards, PCI compliance, or similar certifications.",
  },
];

export default function StripeCheckout() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Payment service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Checkout
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Payment checkout, subscriptions, plan pricing, promotions, billing,
            payment processing, refunds, activation, storage quotas, AI
            generation allowances, analytics access, support tiers, service
            guarantees, and payment-security claims are not configured for this
            deployment. No charge, subscription, entitlement, discount, receipt,
            refund, or successful payment is represented as current, verified,
            or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated checkout, payment, or subscription success
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not collect or transmit payment information,
                create a checkout session, validate a promotion, charge an
                account, activate a plan, grant an entitlement, issue a receipt,
                process a refund, or make a payment-security or compliance
                claim.
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
