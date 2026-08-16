import { Store } from "lucide-react";
import FeatureUnavailable from "@/components/FeatureUnavailable";

export function MarketplaceSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-white/70"><Store className="h-4 w-4 text-cyan-300" /><span>Marketplace provider boundary</span></div>
      <FeatureUnavailable
        title="AI marketplace is not enabled yet"
        description="Listings, balances, purchases, ratings, seller payouts, and paid content unlocks require a verified commerce provider, ledger, entitlement model, moderation workflow, and refund/reconciliation controls. No SKY444 balance, sale, or purchase is presented as real in this release."
        capability="AI marketplace commerce and paid content delivery"
        nextStep="Return to the launch hub"
      />
    </div>
  );
}
