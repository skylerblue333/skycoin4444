import UnavailableFeature from "@/components/UnavailableFeature";

export default function TokenomicsCalculatorPage() {
  return (
    <UnavailableFeature
      name="Tokenomics calculator"
      reason="Verified token supply, allocation schedules, unlocks, burn rules, price inputs, holder data, and projection methodology are not connected to audited contracts or an approved economics model. The current route is only an incomplete shell, so it is gated instead of presenting unsupported token projections."
    />
  );
}
