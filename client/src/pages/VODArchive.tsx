import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function VODArchive() {
  return (
    <FeatureUnavailable
      title="VOD Archive is not enabled yet"
      description="Archived streams, creator identities, view totals, durations, playback, downloads, and live status require verified media storage, CDN or HLS delivery, rights controls, retention policy, and durable view records. The current release does not seed or fabricate recordings, or claim that a replay is available or playable."
      capability="Recorded streams, VOD playback, archive search, and downloads"
      nextStep="Review the media and streaming launch boundaries"
    />
  );
}
