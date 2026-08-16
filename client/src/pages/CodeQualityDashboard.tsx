import UnavailableFeature from "@/components/UnavailableFeature";

export default function CodeQualityDashboardPage() {
  return (
    <UnavailableFeature
      name="Code quality dashboard"
      reason="Automated code evaluation, quality grades, issue counts, and security findings are not connected to a verified production analysis service. This page is gated until its metrics can be sourced and audited truthfully."
    />
  );
}
