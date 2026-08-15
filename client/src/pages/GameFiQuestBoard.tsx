import { Sword } from "lucide-react";

import { UnavailableService } from "@/pages/mission-control/UnavailableService";

const requirements = [
  {
    title: "Authoritative quest, achievement, and progress records",
    detail:
      "Authenticated server-side quest definitions, event ingestion, completion rules, progress records, anti-replay controls, timestamps, daily reset semantics, and an auditable history are required before displaying quests, completion state, progress, XP, ranks, or daily status.",
  },
  {
    title: "Verified token, wallet, and reward settlement",
    detail:
      "A configured network, wallet ownership verification, eligibility checks, reward policy, token accounting, transaction signing, idempotency, confirmation, failure handling, refunds or reversals, and transaction hashes are required before promising, calculating, issuing, or reporting SKY444 rewards or other financial or token outcomes.",
  },
  {
    title: "Secure claim and abuse-prevention workflows",
    detail:
      "Authenticated claims, authorization, fraud and sybil controls, rate limits, duplicate prevention, cooldowns, disclosure, support procedures, and an auditable settlement record are required before a claim button can create or represent a successful reward transfer.",
  },
  {
    title: "Verifiable GameFi operations and disclosure",
    detail:
      "Defined game and governance integrations, source data, current time and reset rules, monitoring, incident handling, privacy controls, documentation, and integration tests are required before reporting users, quests, progress, token amounts, ranks, bonuses, multipliers, or service availability.",
  },
];

export default function GameFiQuestBoard() {
  return (
    <main className="min-h-screen bg-background p-4 text-foreground sm:p-8">
      <div className="mx-auto max-w-5xl">
        <UnavailableService
          title="GameFi Quest Board"
          icon={Sword}
          summary="GameFi quests, achievements, progress, XP, rankings, daily resets, token rewards, wallet claims, and settlement services are not configured for this deployment. No quest, user, progress, balance, token amount, rank, multiplier, countdown, claim, transaction, or reward outcome is represented as current, verified, eligible, authorized, available, or successful."
          requirements={requirements}
        />
      </div>
    </main>
  );
}
