import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function Community() {
  return (
    <FeatureUnavailable
      title="Communities are not enabled yet"
      description="Community discovery, memberships, channels, roles, token-gated access, premium benefits, external social links, and join actions require verified social persistence, authorization, moderation, wallet ownership checks, billing or entitlement controls, and privacy-safe activity records. The current release does not render featured communities or claim that a membership or access grant succeeded."
      capability="Community discovery, membership, channels, roles, and token-gated access"
      nextStep="Explore the launch hub"
    />
  );
}
