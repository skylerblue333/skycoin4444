import { Swords } from "lucide-react";

import { UnavailableService } from "./mission-control/UnavailableService";

export default function ClanWars() {
  return (
    <UnavailableService
      title="Clan Wars"
      icon={Swords}
      summary="Clan creation, wars, rankings, and rewards are not configured for this deployment. No clans, scores, leaderboards, token costs, or join/create outcomes are represented as available."
      requirements={[
        { title: "Persistent clan domain", detail: "Clan identities, membership, permissions, seasons, and moderation require backed tables and authorization rules." },
        { title: "Verified game events", detail: "War scores and rankings require real game events, anti-cheat controls, and reproducible settlement." },
        { title: "Reward settlement", detail: "Any token or prize flow requires a verified ledger, policy, and transaction reconciliation." },
      ]}
    />
  );
}
