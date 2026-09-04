# Social Consistency Hardening

## Purpose

The canonical social beta previously used application-level "check then insert" logic for likes and follows. Under concurrent requests, two workers could both observe no existing relationship and both attempt the insert. That made duplicate social edges and denormalized counters possible.

This hardening moves uniqueness to the database boundary and makes the application treat only the intended unique-constraint collision as an idempotent "already exists" result.

## Database invariants

Migration `0011_social_consistency.sql`:

1. removes duplicate non-null like edges while retaining a deterministic row;
2. adds `likes_post_user_unique (post_id, user_id)`;
3. recomputes each post's denormalized like counter from the surviving rows;
4. removes duplicate non-null follow edges;
5. adds `follows_follower_following_unique (follower_id, following_id)`.

The Drizzle schema declares the same indexes so generated schema state and migration intent do not drift.

These uniqueness constraints apply when both relationship columns are non-null. Historical nullable schema columns are not silently rewritten to NOT NULL by this migration.

## Concurrent likes

The like mutation still performs an inexpensive existing-row check for the normal path, but correctness no longer depends on that check.

If two requests race:

- one transaction inserts the unique edge and increments the post counter;
- the other database insert collides with `likes_post_user_unique`;
- that transaction rolls back before incrementing the counter;
- the application returns `{ liked: true, created: false }` only when the collision is specifically from that intended constraint.

Other duplicate-key failures remain errors.

## Follow atomicity

A new follow is committed as one transaction containing:

- the unique follow edge;
- the target user's follow notification;
- the `social.follow.created` domain outbox event.

A concurrent duplicate follow that collides with `follows_follower_following_unique` rolls the whole transaction back and returns the existing-state result. This prevents a losing race from leaving behind a duplicate notification or event.

## MySQL error classification

`server/_core/dbErrors.ts` walks wrapped `cause` chains used by database libraries and can classify:

- MySQL `ER_DUP_ENTRY`;
- errno `1062`;
- the specific named constraint involved.

Constraint-specific handling prevents unrelated unique-key failures from being accidentally swallowed as normal idempotency.

## Limitations

This change does not claim:

- a migrated production database;
- serializable isolation across every social operation;
- distributed locking;
- exactly-once event delivery;
- global idempotency for every mutation.

The event remains durably queued in the database outbox; external event transport is still unconfigured and unclaimed.
