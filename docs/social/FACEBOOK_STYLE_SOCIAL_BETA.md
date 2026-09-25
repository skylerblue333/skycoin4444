# Facebook-style Social Home — Engineering Beta

## Purpose

The canonical SKYCOIN4444 Social entry at /activity-feed now uses a familiar three-column social-home information architecture inspired by mainstream social networks while retaining SKYCOIN4444 branding and product boundaries.

The goal is usability, not visual cloning. The page is organized around a primary feed, persistent social shortcuts, discovery, a compact composer, story-style recent highlights, and the familiar Like / Comment / Share interaction hierarchy.

## Live data used

The screen continues to consume the existing beta contracts:

- feed.getFeed for persisted posts, authors, stored like/comment counts, followed state, and viewer-like state.
- social.createPost for authenticated publishing.
- social.likePost / social.unlikePost for account-owned likes.
- social.comments / social.addComment for persisted comments.
- user.follow / user.unfollow for the social graph.
- user.suggestedFollows for the right-rail people suggestions.

No synthetic audience scale or engagement fixtures are introduced.

## Product changes

- Sticky social header with Home, Friends, Groups, Video, and Events navigation.
- Desktop left rail for profile, feed, friends/follows, communities, events, messages, and a device-local Saved feed filter.
- Mobile shortcut rail for the same product areas.
- Story-style recent-highlight cards derived only from existing feed records.
- Facebook-like "What's on your mind?" compact composer that expands into the existing persisted post flow.
- Post cards with author avatar, timestamp, media, real stored counts, and familiar Like / Comment / Share actions.
- Suggested-follows right rail backed by the existing social-graph query.
- Social discovery links for communities, events, video/reels, and messaging.
- Existing SKY crypto tip safety rehearsal retained as a secondary action rather than presented as a live transfer.

## Truth boundaries

This is an engineering-beta UI and interaction upgrade. It does not claim:

- Facebook integration or affiliation.
- Production-scale moderation.
- Real stories infrastructure.
- Reaction types beyond the persisted like model.
- Share/repost counters.
- Real friend counts or group activity that the database does not provide.
- Identity verification. The social home intentionally does not render the existing profile verification flag as verification evidence.
- Server-persisted saves or reports in this iteration; Saved filters the currently loaded feed using device-local post IDs, and reports remain device-local.
- Live crypto transfer or tipping; tip practice remains educational only.

## Regression gate

tests/release/facebook-style-social-home.test.ts locks the canonical data-backed contracts, familiar information architecture, routed social discovery, and no-fake-engagement boundary.
