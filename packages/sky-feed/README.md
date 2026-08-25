# SkyFeed — Wave 2 #103 (Lane 07)

SkyFeed is an **engineering-beta social feed domain core**. It validates caller-supplied feed records, excludes private records from public/follower page construction, provides deterministic rank/time ordering and bounded cursor pagination, and emits a small publication event contract.

## Integration
`toFeedIntegrationEvent()` can be consumed by SkyNotificationsHub, SkyReactions, SkyComments, moderation, or analytics layers without coupling those systems to feed storage.

## Boundaries
This package does not provide authentication, follower-graph authorization, moderation decisions, persistence, recommendation ML, realtime delivery, or production ranking. Callers must enforce viewer-specific visibility and policy before using returned pages.
