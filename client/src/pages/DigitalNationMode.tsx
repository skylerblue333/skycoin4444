import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function DigitalNationMode() {
  return (
    <FeatureUnavailable
      title="Digital Nation Mode is not enabled yet"
      description="Citizenship tiers, populations, platform zones, treasury balances, governance proposals, constitutional rights, AI legislation, and national events require verified governance contracts, identity rules, financial records, authorization, and accountable human review. The current release does not present a digital nation, population, treasury, or governance outcome as real."
      capability="Digital nation, citizenship, governance, and treasury"
      nextStep="Review the truthful ecosystem boundaries"
    />
  );
}
