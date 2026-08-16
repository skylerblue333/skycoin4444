import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function WorldSimulationControl() {
  return (
    <FeatureUnavailable
      title="World Simulation Control is not enabled yet"
      description="Simulation ticks, personas, synthetic users, injected trends, economy flows, payment storms, scenario outcomes, and snapshots require an isolated non-production simulator, explicit operator authorization, synthetic-data labeling, deterministic replay, and auditable controls. The current release does not claim that a world tick, persona, user, payment, trend, or scenario was executed."
      capability="World simulation, synthetic users, scenarios, and snapshots"
      nextStep="Review the engineering and AI launch boundaries"
    />
  );
}
