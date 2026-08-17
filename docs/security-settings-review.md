# Security settings review

## Selected screen

The next isolated screen is `/security-settings`, which is currently a 25-line placeholder and does not overlap the completed accessibility or notification settings work.

## Upgrade scope

The screen will become an account-security preference surface with local-only controls for sign-in alerts, session visibility, privacy-safe device recognition, and security education reminders. It will clearly distinguish preferences from actual authentication controls and will not claim that two-factor authentication, encryption, WAF protection, custody, threat monitoring, or audit logging is active when the screen has no backend integration for those functions.

The implementation will include defensive local storage parsing, explicit saved/reset feedback, accessible live status, a current-preferences summary, and a security notice explaining that sensitive account actions still require the platform’s real authentication flows.

## Visual and interaction checkpoint

**Route:** `/security-settings`

**Initial screenshot:** `/home/ubuntu/screenshots/127_0_0_1_2026-08-17_09-18-05_8305.webp`

The upgraded screen renders as a distinct security-preference surface with account-activity controls, privacy reminders, a local-only distinction notice, and a preference summary. The existing placeholder is gone, and the page does not claim that authentication, two-factor security, revocation, custody, or monitoring has been enabled. Toggling `Security digest` exposed the `Save changes` action and the live status `Unsaved security preference changes.`; the summary updated from 4 of 5 to 5 of 5 preferences enabled.

**Unsaved-state screenshot:** `/home/ubuntu/screenshots/127_0_0_1_2026-08-17_09-18-12_4269.webp`
