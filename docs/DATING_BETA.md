# SKYCOIN4444 Dating Beta

## Purpose

The dating surface is an adult-only engineering-beta journey focused on profile quality, discovery, mutual-match messaging, and explicit safety boundaries.

## Current journey

1. **Profile setup** saves a draft only in the active browser session.
2. **Discovery** loads candidates from the existing dating API and rejects malformed or under-18 records before rendering.
3. A saved browser-session draft can explain only transparent overlap such as exact shared interests or the same general location.
4. **Likes, super-likes, and passes** advance only after the server accepts the action.
5. **Matches and messages** come from the existing API. A new message is shown as sent only after the server accepts it and the conversation is reloaded.
6. Safety reminders remain visible around first meetings and financial/credential requests.

## Product boundaries

This beta does **not** claim:

- identity or age verification beyond client/server data validation;
- background checks or safety certification;
- relationship-outcome prediction;
- precise location tracking;
- durable profile persistence beyond the existing API and the explicitly labeled browser-session draft;
- guaranteed message delivery outside the current API response;
- live billing, premium entitlement, or paid boosts unless separately integrated and verified.

The compatibility number returned by the discovery service is labeled as a **service score**. Client-side connection signals do not manufacture a new score; they only explain exact overlap from information the user chose to save in the browser-session draft.

## Verification

Relevant automated coverage:

- `client/src/lib/datingDiscovery.test.ts`
- `client/src/lib/datingExperience.test.ts`
- `tests/release/dating-profile-placeholder.test.ts`
- `tests/release/dating-experience-upgrade.test.ts`
