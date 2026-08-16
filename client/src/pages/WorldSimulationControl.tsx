import UnavailableFeature from "@/components/UnavailableFeature";

export default function WorldSimulationControl() {
  return (
    <UnavailableFeature
      name="World Simulation Control"
      reason="The former route exposed synthetic users, wallet balances, trust scores, circulation, treasury, transaction volume, active-wallet metrics, and spawn/clear success actions. These are not production data or financial operations, so the route is gated until simulation mode is isolated, explicitly labeled, and prevented from appearing as live ecosystem telemetry."
    />
  );
}
