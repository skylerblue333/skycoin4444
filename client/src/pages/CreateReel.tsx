import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function CreateReel() {
  return (
    <FeatureUnavailable
      title="Reel publishing is not enabled yet"
      description="Video upload, storage, transcoding, audio licensing, effects, moderation, premium access, and publishing require verified media infrastructure, content-safety review, copyright controls, durable storage, and entitlement persistence. The current release does not accept a file or claim that a reel was uploaded, processed, published, or monetized."
      capability="Short-form video creation, media processing, publishing, and premium access"
      nextStep="Explore the launch hub"
    />
  );
}
