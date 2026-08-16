import UnavailableFeature from "@/components/UnavailableFeature";

export default function GameTokenTapPage() {
  return (
    <UnavailableFeature
      name="Game token tap"
      reason="Gameplay scores are local-only and are not connected to verified token rewards, donation settlement, a charity partner, persistent leaderboards, or an auditable impact record. This route is gated so a local score cannot be presented as a real SKY444 transfer or clean-water donation."
    />
  );
}
