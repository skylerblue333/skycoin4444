# Skycoin4444 Screen Portfolio Inventory

Generated from client/src/App.tsx and catalogs/beta-route-evidence.json. This report is an engineering inventory, not a claim that every historical screen is production-ready.

## Summary

| Measure | Count |
| --- | ---: |
| Registered routes | 1068 |
| Lazy page modules | 1056 |
| Launchable beta routes | 43 |
| Controlled or unavailable routes | 64 |
| Legacy unverified routes | 961 |
| Routes missing a lazy page source | 0 |

## Launchable beta routes

- /
- /a-i-tools-hub
- /about
- /accessibility-settings
- /activity-evidence
- /activity-feed
- /advanced-search
- /arcade
- /beta-catalog
- /beta-commerce
- /beta-feedback
- /beta-journey
- /beta-web3
- /beta-workspace
- /blog-editor
- /calculator
- /calendar
- /color-picker-dialog
- /community-hub
- /course-catalog
- /creator-analytics
- /data-export
- /dating-profile-setup
- /delete-account
- /discovery-center
- /event-planner
- /file-converter
- /help-center
- /language-partner-discovery
- /live-streaming
- /markdown-rendering
- /mission-control
- /notes-app
- /notification-preferences
- /onboarding
- /operational-readiness
- /privacy-settings
- /profile
- /quiz-builder
- /satisfaction-survey
- /sign-up-flow
- /theme-settings
- /todo-list

## Safety boundary

Routes classified as controlled or unavailable must not be promoted merely because a component exists. Financial settlement, custody, signing, production-chain writes, transfers, staking, and provider-backed operations require separate evidence and release approval.

## Promotion evidence

Each launchable route must have an entry in `catalogs/beta-route-evidence.json` describing capability, persistence, evidence, and boundary. Registry membership without supporting implementation/tests is invalid.
