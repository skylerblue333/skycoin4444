import { Zap } from "lucide-react";

import { UnavailableService } from "./mission-control/UnavailableService";

export default function ActionObjects() {
  return (
    <UnavailableService
      title="Action Objects"
      icon={Zap}
      summary="Cross-ecosystem action execution is not configured for this deployment. No wallet balance, income flow, action cost, execution result, or completion state is represented as available."
      requirements={[
        { title: "Backed action contracts", detail: "Each action type needs a real authenticated procedure with validated inputs and an auditable result." },
        { title: "Wallet and ledger integration", detail: "Balances and debits require a verified ledger, idempotency, authorization, and reconciliation." },
        { title: "Failure-safe execution", detail: "Pending, failed, retried, and cancelled states must come from real service events rather than timers or local state." },
      ]}
    />
  );
}
