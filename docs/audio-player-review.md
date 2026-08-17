# Audio player review

## Selected screen

The next untouched screen is `/audio-player`. It currently contains a generic title, placeholder content, and an activate toggle with no playback semantics.

## Upgrade scope

Replace the placeholder with a local audio-player preview that uses a small set of metadata-only sample tracks, supports play-state and progress interaction without claiming that audio is actually streamed, and exposes a clear unavailable-source state. The UI will not invent audio files, report playback completion, or claim a live media integration.

## Visual and interaction checkpoint

**Route:** `/audio-player`

**Initial screenshot:** `/home/ubuntu/screenshots/127_0_0_1_2026-08-17_09-47-51_7464.webp`

The upgraded screen renders a metadata-only preview library with selected track details, seek and volume controls, previous/next controls, and an explicit no-audio-source warning. Selecting `Play playback preview` changes the state to `Playback preview enabled`, shows a toast explaining that audio remains unavailable until a verified source is connected, and does not claim playback completion or streaming.

**Playback-state screenshot:** `/home/ubuntu/screenshots/127_0_0_1_2026-08-17_09-47-59_1039.webp`
