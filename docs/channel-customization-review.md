# Channel customization review

## Selected screen

The next untouched screen is `/channel-customization`. It currently claims live real-time data, contains generic feature cards, fabricated platform metrics, and missing icon imports.

## Upgrade scope

Replace the placeholder with a local channel preview editor containing a channel name, description, color preset, visibility preference, and a scoped preview card. Changes will be explicitly marked local and unsaved/saved; no real channel will be edited, no users will be notified, and no server-side community configuration will be claimed.

## Visual and interaction checkpoint

**Route:** `/channel-customization`

**Initial screenshot:** `/home/ubuntu/screenshots/127_0_0_1_2026-08-17_09-45-43_3705.webp`

The upgraded screen renders a local presentation editor with channel name, description, accent presets, visibility control, scoped live preview, character counts, and explicit no-live-channel boundaries. Selecting the `Orbit` accent changes the preview gradient, exposes `Save changes`, and announces `Unsaved channel preview changes.` without claiming a live channel mutation.

**Orbit preview screenshot:** `/home/ubuntu/screenshots/127_0_0_1_2026-08-17_09-45-52_9105.webp`
