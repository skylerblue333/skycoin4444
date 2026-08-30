# SkyComments (#106)

SkyComments is a bounded engineering-beta domain core for creating, editing, and deleting user-authored comments attached to a caller-supplied subject identifier.

## Capability

- Validates bounded identifiers and comment bodies.
- Normalizes line endings and surrounding whitespace.
- Supports optional parent-comment identifiers without claiming a persisted thread graph.
- Provides deterministic versioned edit/delete lifecycle behavior.
- Tombstones deleted comment content in the returned domain record.
- Emits the provider-neutral `sky.comment.changed.v1` integration contract.

## Security and product boundaries

This package does **not** provide authentication, tenant authorization, moderation, abuse/spam prevention, durable persistence, thread-consistency enforcement, notifications, analytics/ranking, legal retention, compliance certification, or production deployment. The delete helper only enforces actor equality inside the supplied domain record; callers must independently authenticate and authorize real requests.

No external provider, database, network service, or production environment is contacted by this package.
