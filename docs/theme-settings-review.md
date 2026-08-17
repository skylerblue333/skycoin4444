# Theme settings review

## Selected screen

The next isolated screen is `/theme-settings`, currently a placeholder with a binary activate button and no usable theme controls. It is distinct from the completed accessibility and general-settings screens because this pass focuses on appearance presets and preview behavior.

## Upgrade scope

Replace the placeholder with local appearance presets for SKYCOIN, Midnight, and Soft Contrast, plus a density preview and reduced-glare preference. The screen will show a live preview card, defensive local storage parsing, explicit saved/reset feedback, and accessible status messaging. It will clearly state that the preview is scoped to this screen until a real global theme preference integration is connected.

## Visual and interaction checkpoint

**Route:** `/theme-settings`

**Initial screenshot:** `/home/ubuntu/screenshots/127_0_0_1_2026-08-17_09-25-39_4664.webp`

The upgraded screen renders three appearance presets, comfort controls, a scoped live preview, and a current appearance summary. Selecting `Midnight` updates the preview and summary to match, exposes `Save changes`, and reports `Unsaved theme preference changes.` through the live status region. The screen explicitly avoids claiming that the selected preset changes the global application theme until a real integration exists.

**Unsaved-state screenshot:** `/home/ubuntu/screenshots/127_0_0_1_2026-08-17_09-25-45_2357.webp`
