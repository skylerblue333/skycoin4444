import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function CitizenPassport() {
  return (
    <FeatureUnavailable
      title="Citizen Passport is not enabled yet"
      description="Digital citizenship, trust scores, reputation dimensions, verification badges, progression tiers, voting rights, premium access, staking privileges, and council eligibility require verified identity, policy, authorization, audit, and reputation infrastructure. The current release does not fabricate a passport, score, citizenship tier, unlocked privilege, or verification status."
      capability="Digital identity, citizenship, reputation, and privilege controls"
      nextStep="Review account settings"
    />
  );
}
