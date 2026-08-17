# General settings review

## Selected screen

The next isolated screen is `/general-settings`, currently a placeholder with no meaningful settings or persistence. It does not overlap the completed accessibility, notification, or security settings screens.

## Upgrade scope

The screen will provide local presentation preferences for language, regional date format, compact density, and confirmation prompts. These controls will change interface presentation or local interaction behavior only; they will not claim to change account profile data, financial settings, or server-side localization. The screen will include defensive storage parsing, explicit save/reset feedback, an accessible live status region, and a summary of the selected presentation profile.

## Visual and interaction checkpoint

**Route:** `/general-settings`

**Initial screenshot:** `/home/ubuntu/screenshots/127_0_0_1_2026-08-17_09-21-00_3019.webp`

The upgraded screen renders with language and date-format selectors, interface behavior switches, a local-only presentation notice, and a current profile summary. Selecting `Español (España)` updated the summary to match and exposed the `Save changes` action; the live status reported `Unsaved general preference changes.` The screen remains visually consistent with the preceding settings surfaces and contains no unsupported backend or account-data claims.

**Unsaved-state screenshot:** `/home/ubuntu/screenshots/127_0_0_1_2026-08-17_09-21-09_8127.webp`
