# SkyGroups (#104)

SkyGroups is an engineering-beta group membership domain core for SKYCOIN4444. It creates groups, assigns bounded roles, and enforces deterministic membership mutation rules.

## Integration
Use `createGroup()` to establish an owner, then `addMember()` and `removeMember()` through an authenticated caller context supplied by the integrating service.

## Limitations
This library does not authenticate users, persist groups, host communities, deliver moderation tooling, provide invitations, encrypt content, or guarantee tenant isolation. Authorization decisions here are only local domain checks; production callers remain responsible for identity verification, persistence, rate limiting, abuse controls, moderation, privacy, and access enforcement.
