import UnavailableFeature from "@/components/UnavailableFeature";

export default function BatchGeneration() {
  return (
    <UnavailableFeature
      name="Batch generation"
      reason="Batch generation is not connected to a verified production job service yet."
    />
  );
}
