import UnavailableFeature from "@/components/UnavailableFeature";

export default function MarketingROIPage() {
  return (
    <UnavailableFeature
      name="Marketing ROI"
      reason="Campaign spend, attributed revenue, conversion events, and ROI calculations are not connected to a verified analytics or accounting integration. The current page is only an incomplete shell, so it is gated instead of presenting an empty or misleading production dashboard."
    />
  );
}
