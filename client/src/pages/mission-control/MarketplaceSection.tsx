import { Store } from "lucide-react";

import { UnavailableService } from "./UnavailableService";

export function MarketplaceSection() {
  return (
    <UnavailableService
      title="Mission Marketplace"
      icon={Store}
      summary="Marketplace listings, purchases, seller claims, ratings, and settlement are not configured for this deployment. No digital asset, prompt, workflow, template, balance, or transaction is represented as available for purchase."
      requirements={[
        {
          title: "Catalog and seller management",
          detail:
            "Persisted listings, seller verification, content review, ownership rules, licensing terms, and moderation workflows are required before publishing a marketplace catalog.",
        },
        {
          title: "Payment and settlement",
          detail:
            "A verified payment provider or token settlement system, transaction confirmation, idempotency controls, refunds, dispute handling, and accounting reconciliation are required before accepting a purchase.",
        },
        {
          title: "Content access and ratings",
          detail:
            "Authorized content delivery, purchaser entitlement checks, privacy controls, audit logs, and abuse-resistant rating mechanisms are required before unlocking content or collecting reviews.",
        },
        {
          title: "User disclosures",
          detail:
            "Clear pricing, fees, refund terms, seller identity, risk disclosures, and support paths are required before representing any marketplace action as complete.",
        },
      ]}
    />
  );
}
