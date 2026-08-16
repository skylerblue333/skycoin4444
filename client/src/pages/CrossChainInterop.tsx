import UnavailableFeature from "@/components/UnavailableFeature";

export default function CrossChainInteropPage() {
  return (
    <UnavailableFeature
      name="Cross-chain bridge"
      reason="Verified bridge contracts, supported chain configuration, wallet signing, fee and gas estimation, transfer validation, confirmations, replay protection, failure recovery, and transaction history are not connected to production. The former route used static TVL and bridge records plus a bridge action, so it is gated rather than implying successful cross-chain settlement."
    />
  );
}
