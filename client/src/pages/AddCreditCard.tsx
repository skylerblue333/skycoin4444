import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function AddCreditCard() {
  return (
    <FeatureUnavailable
      title="Add Credit Card is not active"
      description="This route currently contains a generic placeholder rather than a verified product workflow. It remains visible for roadmap continuity until its backend contract, authorization, persistence, loading and error states, tests, and operational evidence are complete."
      capability="Add Credit Card"
      nextStep="Return to the launch hub"
    />
  );
}
