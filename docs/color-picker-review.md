# Color picker review

## Selected screen

The next untouched screen is `/color-picker-dialog`. It currently contains a generic title, placeholder content, and an activate toggle with no color-selection semantics.

## Upgrade scope

Replace the placeholder with a local palette editor supporting a native color input, preset swatches, a scoped preview card, a hex-value summary, and reset/save state feedback. The UI will clearly state that the color applies only to this preview and does not modify the global application theme or any user content.

## Visual and interaction checkpoint

**Route:** `/color-picker-dialog`

**Initial screenshot:** `/home/ubuntu/screenshots/127_0_0_1_2026-08-17_09-50-11_6234.webp`

The upgraded screen renders local palette presets, a native color input, validated hex input, scoped preview, contrast-oriented copy, and explicit no-global-theme boundaries. Selecting `Orbit violet` changes the preview to `#7C3AED`, exposes `Save changes`, and announces `Unsaved palette preview changes.` without affecting the global SKYCOIN4444 theme.

**Orbit preview screenshot:** `/home/ubuntu/screenshots/127_0_0_1_2026-08-17_09-50-22_7016.webp`
