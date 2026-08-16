import UnavailableFeature from "@/components/UnavailableFeature";

export default function LegacySignUpPage() {
  return (
    <UnavailableFeature
      name="Legacy signup page"
      reason="This obsolete page simulated account creation and exposed an unverified AI code-generation workflow. Use the canonical signup and authentication routes for production account creation."
    />
  );
}
