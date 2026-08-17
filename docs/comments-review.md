# Comments review

## Selected screen

The next untouched screen is `/comments`. It currently claims live real-time data, contains generic feature cards, fabricated platform metrics, and missing icon imports.

## Upgrade scope

Replace the placeholder with a local comment-review workspace using clearly labeled demo comments, search, moderation intent controls, local archive/remove confirmation, and empty-state messaging. The UI will not claim that comments are posted, synchronized, or moderated server-side. Every mutation will remain local and be announced through accessible status feedback.

## Visual and interaction checkpoint

**Route:** `/comments`

**Initial screenshot:** `/home/ubuntu/screenshots/127_0_0_1_2026-08-17_09-35-00_7467.webp`

The upgraded screen replaces fabricated live-data claims and metrics with a local review queue of clearly labeled demo comments, search, moderation-state badges, and an explicit local-only warning. Selecting archive reveals an inline `Confirm` and `Cancel archive` decision rather than mutating immediately, while the live region identifies the pending example comment.

**Confirmation screenshot:** `/home/ubuntu/screenshots/127_0_0_1_2026-08-17_09-35-06_8485.webp`
