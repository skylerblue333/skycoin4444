import UnavailableFeature from "@/components/UnavailableFeature";

export default function AICopyStudio() {
  return (
    <UnavailableFeature
      name="AI Copy Studio"
      reason="Verified model-provider connectivity and production AI generation are unavailable. The former studio presented real-AI generation controls and financial APY examples without an executable model contract, output validation, or production failure handling, so it is gated until those controls are verified."
    />
  );
}
