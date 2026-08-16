import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function VideoArea() {
  return (
    <FeatureUnavailable
      title="Sky Video is not enabled yet"
      description="Video catalogs, reels, thumbnails, playback, views, likes, comments, live streams, creator identities, and uploads require verified media storage, transcoding, moderation, rights controls, delivery infrastructure, and durable engagement records. The current release does not fabricate media or claim that a video was uploaded, played, streamed, or engaged with."
      capability="Video, reels, live streaming, uploads, and engagement"
      nextStep="Review the media and social launch boundaries"
    />
  );
}
