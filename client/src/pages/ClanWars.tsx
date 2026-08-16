import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function ClanWars() {
  return (
    <FeatureUnavailable
      title="Clan Wars is not enabled yet"
      description="Clans, members, wars, scores, rankings, power ratings, token costs, applications, and multiplayer results require verified game servers, durable group and match records, authorization, anti-cheat controls, and reward settlement. The current release does not fabricate clans or claim that a war, application, or clan creation succeeded."
      capability="Clans, multiplayer wars, rankings, and game rewards"
      nextStep="Review the games and rewards launch boundaries"
    />
  );
}
