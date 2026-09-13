# SkyLive small-room WebRTC beta

SkyLive now includes a bounded browser-to-browser live media path for invited SKYCOIN4444 beta testers. This is an engineering-beta transport, not a Twitch-scale media service.

## End-to-end loop

1. A signed-in creator grants browser camera/microphone permission.
2. The application creates an authenticated process-local live room.
3. Signed-in viewers discover and join the room.
4. The server validates room membership and relays bounded WebRTC signaling metadata (ready/offer/answer/ICE).
5. The creator browser sends camera/microphone tracks directly to each viewer with `RTCPeerConnection`.
6. Creator and viewer heartbeats refresh their bounded room-presence leases; viewer heartbeat drives the active viewer count.
7. Room participants exchange bounded live chat messages; the creator can delete room chat messages.
8. The creator can explicitly end the room. If the creator stops heartbeating, the server marks the room ended after the host lease expires instead of advertising a stale broadcast. Process restart also clears room/signaling/chat state.

## Security boundaries

- Hosting, joining, signaling, heartbeat, and chat require the existing authenticated beta session.
- Public room discovery exposes only room id, title, category, status, viewer count, and creation timestamp.
- Peer ids are random UUIDs and are validated against the authenticated user before signaling/chat operations.
- Signals can target only peers already in the same room.
- Signal payloads are bounded to 24 KB and buffers/room counts/viewer fan-out/chat history are bounded.
- A room supports at most 12 viewer peers because the creator browser sends one direct media stream per viewer.
- Viewer presence expires after 45 seconds without a heartbeat. Creator room presence expires after 90 seconds without a heartbeat.
- A signed-in creator can refresh the existing host participant lease through the host-session contract before it expires; the current browser UI still requires a normal active-page session and does not promise seamless reload recovery.
- Host-only chat deletion is basic room moderation; it is not automated content-safety classification.
- Existing application request-security/origin checks remain in front of unsafe REST operations.

## Transport limitations

- No server media ingest or media relay.
- No transcoding, adaptive bitrate ladder, HLS/DASH packaging, or CDN delivery.
- No TURN relay is bundled.
- Optional browser STUN discovery can be configured at build time with `VITE_SKYLIVE_STUN_URL`; without it, connectivity is limited to ICE routes the browsers can discover directly.
- NAT/firewall traversal is therefore not guaranteed.
- No recording, VOD, clips, subscriptions, tipping, payout/revenue accounting, DRM, captions, or media moderation pipeline.
- Room, signaling, presence, and chat state are process-local rather than durable/distributed. A server restart clears them, and horizontal multi-instance routing is not supported by this beta.
- Viewer count is heartbeat-derived presence, not an audited analytics metric.
- No production availability/SLA or compliance guarantee is claimed.

## Relationship to SkyStreamingGateway

Wave-2 SkyStreamingGateway remains a provider-neutral route-policy core for HLS/DASH/WebRTC metadata. This small-room beta does not pretend that policy metadata is a deployed media provider. A future media-service adapter can use that routing contract when real ingest/transcoding/CDN infrastructure exists.

## Verification

Repository validation should cover:

- `server/features/live-rooms/index.test.ts` room lifecycle, creator lease expiry/recovery, peer authorization, signaling, chat moderation, and viewer-cap behavior;
- TypeScript/build/lint gates for the REST transport and browser WebRTC page;
- exact-head pull-request CI before merge;
- two-account browser validation on the deployed beta after merge, with camera/mic permission and an ICE environment appropriate for the test network.

A successful repository build proves the integration contract and browser/server implementation compile. It does **not** by itself prove cross-network WebRTC reachability; that requires an actual two-browser deployed-media test.
