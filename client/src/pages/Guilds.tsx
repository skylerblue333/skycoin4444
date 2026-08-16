import UnavailableFeature from "@/components/UnavailableFeature";

export default function GuildsPage() {
  return (
    <UnavailableFeature
      name="Guild Arena"
      reason="Guild creation, membership, wars, XP, and guild leaderboards are not connected to verified GameFi procedures. This route is gated to prevent unsupported game-state or reward claims."
    />
  );
}
