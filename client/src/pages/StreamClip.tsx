import UnavailableFeature from "@/components/UnavailableFeature";

export default function StreamClip() {
  return (
    <UnavailableFeature
      name="Stream Clips"
      reason="The former route used static trending clips, fabricated view and like counts, a SKY444 price claim, and local-only play/share/download success feedback without persisted media or verified market data. It is gated until clip storage, playback, moderation, analytics, and truthful action states are implemented."
    />
  );
}
