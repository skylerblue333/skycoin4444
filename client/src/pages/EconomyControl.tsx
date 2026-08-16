import UnavailableFeature from "@/components/UnavailableFeature";

export default function EconomyControl() {
  return (
    <UnavailableFeature
      name="Economy Control"
      reason="Treasury balances, revenue streams, supply metrics, fee structures, monetary-policy controls, and governance actions require verified accounting, authorization, audit logging, and on-chain or backend settlement integrations. The former route used static financial data and local controls, so it is gated until those production contracts are implemented and tested."
    />
  );
}
