import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function Reels() {
  return (
    <FeatureUnavailable
      title="Reels discovery is not enabled yet"
      description="Short-form media discovery, thumbnails, playback, view counts, likes, comments, saves, creator attribution, audio tracks, and engagement records require verified media storage, transcoding, moderation, analytics, and durable social contracts. The current release does not fabricate reels or claim that content was viewed or engaged with."
      capability="Short-form video discovery, playback, and engagement"
      nextStep="Explore the media launch boundaries"
    />
  );
}
