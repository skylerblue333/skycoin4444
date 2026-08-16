import UnavailableFeature from "@/components/UnavailableFeature";

export default function GasTrackerPage() {
  return (
    <UnavailableFeature
      name="Gas tracker"
      reason="Live chain gas data, fee estimates, and alert persistence are not connected to a verified network provider. This placeholder is gated instead of implying that gas tracking is operational."
    />
  );
}
