import { Zap } from "lucide-react";

import { UnavailableService } from "@/pages/mission-control/UnavailableService";

const requirements = [
  {
    title: "Verified protocol, market, and liquidity integration",
    detail:
      "A configured protocol and network, supported assets, reserve and liquidity checks, oracle validation, fee and rate semantics, slippage controls, and current market data are required before presenting a flash-loan capability or quote.",
  },
  {
    title: "Atomic transaction and repayment guarantees",
    detail:
      "Audited contracts, transaction simulation, signature and nonce handling, atomic repayment enforcement, gas estimation, network confirmation, failure recovery, and transaction hashes are required before enabling or representing any flash-loan operation as safe or successful.",
  },
  {
    title: "Security, authorization, and risk controls",
    detail:
      "Server-side authorization, private-key protections, contract allowlists, reentrancy and oracle-manipulation defenses, rate limits, monitoring, incident response, and independent security review are required before exposing automation or execution controls.",
  },
  {
    title: "Evidence-based performance and documentation",
    detail:
      "Traceable production telemetry, defined uptime and latency measurements, throughput methodology, reproducible analytics, versioned documentation, integration tests, and support ownership are required before reporting performance, availability, security, or operational metrics.",
  },
];

export default function FlashLoans() {
  return (
    <main className="min-h-screen bg-background p-4 text-foreground sm:p-8">
      <div className="mx-auto max-w-5xl">
        <UnavailableService
          title="Flash Loans"
          icon={Zap}
          summary="Flash-loan protocol, liquidity, oracle, transaction, repayment, security, automation, analytics, and operational services are not configured for this deployment. No asset, rate, quote, balance, transaction, profit, latency, throughput, uptime, security, or execution status is represented as current, verified, safe, available, or successful."
          requirements={requirements}
        />
      </div>
    </main>
  );
}
