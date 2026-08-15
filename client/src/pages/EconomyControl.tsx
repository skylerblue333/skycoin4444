import { DollarSign } from "lucide-react";

import { UnavailableService } from "./mission-control/UnavailableService";

export default function EconomyControl() {
  return (
    <UnavailableService
      title="Economy Control"
      icon={DollarSign}
      summary="Platform economy administration is not configured for this deployment. No revenue, treasury, token supply, fee, staking, or tokenomics values are represented as available."
      requirements={[
        { title: "Authoritative financial records", detail: "Revenue, treasury, and fee values require a controlled ledger, accounting source, and reconciliation policy." },
        { title: "Token infrastructure", detail: "Token supply and staking data require a verified chain integration, network configuration, and transaction state handling." },
        { title: "Privileged administration", detail: "Economic controls require admin authorization, change approvals, audit logs, and rollback or review procedures." },
      ]}
    />
  );
}
