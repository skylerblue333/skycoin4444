import UnavailableFeature from "@/components/UnavailableFeature";

export default function AnalyticsPage() {
  return (
    <UnavailableFeature
      name="Legacy analytics page"
      reason="This duplicate Wave 3 page depends on an unverified analytics namespace and would display unsupported wallet, marketplace, donation, and platform-value metrics. Use verified dashboard surfaces instead."
    />
  );
}
