import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function Features() {
  return (
    <FeatureUnavailable
      title="Feature catalog evidence is not complete yet"
      description="The repository contains many routes and concepts, but feature counts, adoption totals, versions, voice-command totals, production readiness, and availability require route-level verification, integration evidence, tests, and operational ownership. This release does not label every listed capability as working or production-ready merely because a page or component exists."
      capability="Verified capability catalog and production-readiness matrix"
      nextStep="Review the truthful launch hub and release evidence"
    />
  );
}
