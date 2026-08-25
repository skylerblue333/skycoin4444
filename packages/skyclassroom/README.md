# SkyClassroom — Wave 2 Slot #115

SkyClassroom is an **engineering-beta classroom membership domain library**. It models invitations, activation/removal, roles, and a small local management rule.

## SKYCOIN4444 integration contract

SkySchool or another education module can persist its own classroom records and map authenticated application users to `ClassroomMembership` values. An active instructor in the same classroom can be recognized by `canManageMembership` as eligible to request a membership change for another user.

That return value is only a domain-policy signal. The calling API must still authenticate the actor, load authoritative membership state, enforce tenant/school boundaries, write audit events, and persist changes transactionally.

## Boundaries

This package does not authenticate users, issue credentials, store grades, send invitations, persist records, verify instructor status externally, or provide a production authorization layer. It validates bounded local identifiers and deterministic lifecycle transitions only.

## Validation

```sh
pnpm --filter @skycoin/skyclassroom test
pnpm run check:packages
pnpm --filter @skycoin/skyclassroom format:check
```
