import UnavailableFeature from "@/components/UnavailableFeature";

export default function CompanySimulatorPage() {
  return (
    <UnavailableFeature
      name="Company simulator"
      reason="Revenue, valuation, user growth, churn, ARPU, profitability, and five-year scenario projections are not sourced from verified accounting or operating data. This static simulation is gated so projections are not presented as forecasts or financial guidance."
    />
  );
}
