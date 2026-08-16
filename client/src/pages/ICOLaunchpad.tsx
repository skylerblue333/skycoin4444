import UnavailableFeature from "@/components/UnavailableFeature";

export default function ICOLaunchpadPage() {
  return (
    <UnavailableFeature
      name="ICO launchpad"
      reason="Token-sale pricing, allocations, raised amounts, bonuses, purchase limits, and settlement are not connected to verified launchpad or wallet contracts. This route is gated to prevent unsupported fundraising claims."
    />
  );
}
