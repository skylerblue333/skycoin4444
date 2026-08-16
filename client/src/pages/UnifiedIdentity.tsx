import UnavailableFeature from "@/components/UnavailableFeature";

export default function UnifiedIdentityPage() {
  return (
    <UnavailableFeature
      name="Unified identity"
      reason="Identity verification, reputation, follower counts, wallet connection, balances, net worth, and trust tiers are not sourced from verified identity, social, or wallet records. This static profile is gated to prevent fabricated account state."
    />
  );
}
