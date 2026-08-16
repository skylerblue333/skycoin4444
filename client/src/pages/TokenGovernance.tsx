import UnavailableFeature from "@/components/UnavailableFeature";

export default function TokenGovernancePage() {
  return (
    <UnavailableFeature
      name="Token governance"
      reason="Treasury balances, token values, proposals, vote counts, governance parameters, and voting execution are not sourced from verified contracts. This static surface is gated to prevent unsupported financial and governance claims."
    />
  );
}
