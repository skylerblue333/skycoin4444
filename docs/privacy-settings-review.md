# Privacy settings review

## Selected screen

The next untouched screen is `/privacy-settings`. It currently contains placeholder feature cards, unsupported claims about live data and real-time updates, fabricated platform metrics, and missing icon imports. It is distinct from the local security-preference screen because this workstream focuses on visibility, sharing, and data-handling choices.

## Upgrade scope

Replace the fabricated content with local privacy preferences for public activity visibility, profile discoverability, message requests, personalization, and data-sharing reminders. Include defensive local storage parsing, accessible status feedback, a summary of the selected privacy posture, and explicit language that these controls are device-local until a real account privacy API is connected. Do not present fake user counts, transactions, success rates, or backend privacy enforcement.

## Visual and interaction checkpoint

**Route:** `/privacy-settings`

**Initial screenshot:** `/home/ubuntu/screenshots/127_0_0_1_2026-08-17_09-23-16_9233.webp`

The upgraded screen replaces fabricated feature cards, unsupported live-data claims, and fake platform metrics with visibility, discovery, message-request, personalization, and data-sharing preferences. The local-only notice is explicit about what the screen cannot do. Turning off `Public activity` updated the privacy posture summary from 5 of 5 to 4 of 5 and exposed the live status `Unsaved privacy preference changes.`

**Unsaved-state screenshot:** `/home/ubuntu/screenshots/127_0_0_1_2026-08-17_09-23-25_4625.webp`
