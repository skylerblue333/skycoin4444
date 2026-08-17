# Date picker review

## Selected screen

The next untouched screen is `/date-picker-dialog`. It currently contains a generic title, placeholder content, and an activate toggle with no date-selection behavior.

## Upgrade scope

Replace the placeholder with an accessible local date-selection surface showing a chosen date, quick presets, a native date input, clear/reset actions, and a confirmation summary. The screen will not claim booking, reminders, availability, or external calendar writes.

## Visual and interaction checkpoint

**Route:** `/date-picker-dialog`

**Initial screenshot:** `/home/ubuntu/screenshots/127_0_0_1_2026-08-17_09-55-49_5602.webp`

The upgraded screen renders a native date input, clear action, quick presets, selected-date summary, save/reset feedback, and explicit no-booking boundaries. Selecting `Next week` changes the date to Wednesday, January 21, 2026, exposes `Save date`, and announces `Unsaved local preview change.` without claiming availability, booking, reminders, or external calendar writes.

**Next-week screenshot:** `/home/ubuntu/screenshots/127_0_0_1_2026-08-17_09-55-57_6119.webp`
