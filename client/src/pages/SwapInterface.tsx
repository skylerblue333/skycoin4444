import UnavailableFeature from "@/components/UnavailableFeature";

export default function SwapInterfacePage() {
  return (
    <UnavailableFeature
      name="Swap interface"
      reason="Token balances, quote pricing, slippage controls, wallet signing, transaction submission, confirmation, and failure recovery are not connected to a verified blockchain or exchange integration. This route remains gated so it cannot imply a successful swap."
    />
  );
}
