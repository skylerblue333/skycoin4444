import { AlertTriangle, Vote } from "lucide-react";

import { UnavailableService } from "@/pages/mission-control/UnavailableService";

const requirements = [
  {
    title: "Authenticated proposal and voting persistence",
    detail:
      "Server-side services for authenticated proposal creation, validation, persistence, versioning, voting periods, ballots, quorum, delegation, tallying, finalization, and immutable history are required before governance submissions or vote outcomes can be displayed or changed.",
  },
  {
    title: "Verified stake, eligibility, and treasury controls",
    detail:
      "A configured chain or governance authority, verified wallet ownership, current stake queries, snapshot rules, eligibility checks, treasury permissions, proposal deposits, and transaction confirmation are required before reporting stake, eligibility, balances, treasury effects, or submission requirements.",
  },
  {
    title: "Authorization, validation, and replay protection",
    detail:
      "Role-based authorization, proposal schema validation, duplicate and replay protection, signed actions, rate limits, audit records, failure handling, dispute procedures, and safe rollback semantics are required before a governance action can be represented as authorized or successful.",
  },
  {
    title: "Verifiable governance operations and disclosure",
    detail:
      "Defined voting semantics, quorum and threshold rules, time source, notification delivery, monitoring, incident handling, documentation, and independently verifiable proposal and ballot records are required before reporting live proposals, votes, participation, outcomes, or protocol changes.",
  },
];

export default function GovernanceWizard() {
  return (
    <main className="min-h-screen bg-background p-4 text-foreground sm:p-8">
      <div className="mx-auto max-w-5xl">
        <UnavailableService
          title="Create Governance Proposal"
          icon={Vote}
          summary="Governance proposal creation, stake and eligibility verification, voting, treasury controls, protocol changes, and finalization are not configured for this deployment. No proposal, stake, balance, vote, quorum, eligibility result, treasury action, or governance outcome is represented as current, verified, authorized, active, or successful."
          requirements={requirements}
        />
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-900/60 bg-amber-950/30 p-4 text-sm leading-6 text-amber-200">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <p>
            Do not submit governance, treasury, protocol, staking, or voting
            instructions through this page. No transaction, proposal, or vote is
            created by the disabled interface.
          </p>
        </div>
      </div>
    </main>
  );
}
