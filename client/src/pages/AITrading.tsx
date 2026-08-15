import { Bot } from "lucide-react";

import { UnavailableService } from "./mission-control/UnavailableService";

export default function AITrading() {
  return (
    <UnavailableService
      title="AI Trading"
      icon={Bot}
      summary="AI-assisted trading is not configured for this deployment. No strategy, market signal, order, balance, return, or execution result is represented as available."
      requirements={[
        { title: "Verified market data", detail: "A supported market-data provider, freshness policy, and failure handling are required." },
        { title: "Order execution", detail: "Broker or exchange integration, signing controls, idempotency, and transaction reconciliation are required." },
        { title: "Risk controls", detail: "Position limits, user consent, audit logs, and independent review are required before any live action." },
      ]}
    />
  );
}
