import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function LegendaryStatus() {
  return (
    <FeatureUnavailable
      title="Founder Evidence Profile is not enabled yet"
      description="Founder credentials, platform metrics, user counts, uptime, reputation rankings, achievements, token claims, and investor positioning require independently verifiable source records, dated evidence, provenance, and permission to publish. The current release does not present unverified personal, business, performance, or financial claims as established facts."
      capability="Founder profile, achievement evidence, platform metrics, and reputation claims"
      nextStep="Explore the launch hub"
    />
  );
}
