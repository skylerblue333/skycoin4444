import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function TournamentBracket() {
  return (
    <FeatureUnavailable
      title="Tournament Brackets are not enabled yet"
      description="Tournament schedules, player counts, brackets, entry fees, prize pools, standings, match results, and reward settlement require verified game sessions, anti-cheat controls, identity rules, escrow or prize custody, and auditable result processing. The current release does not claim that a tournament exists, that a player joined, or that a prize can be won."
      capability="Competitive gaming, tournaments, brackets, and prize settlement"
      nextStep="Explore the launch hub"
    />
  );
}
