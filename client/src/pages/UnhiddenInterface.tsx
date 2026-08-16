import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function UnhiddenInterface() {
  return (
    <FeatureUnavailable
      title="Raw infrastructure console is not enabled yet"
      description="API execution, event logs, database inspection, system-state metrics, tokenomics, route counts, test totals, simulation state, and health indicators require authenticated operator controls, server-side authorization, redacted observability data, and independently verified infrastructure evidence. The current release does not simulate query success or claim that databases, simulations, tokens, or services are healthy."
      capability="Operator API console, event log, system state, and database inspection"
      nextStep="Review the engineering readiness evidence"
    />
  );
}
