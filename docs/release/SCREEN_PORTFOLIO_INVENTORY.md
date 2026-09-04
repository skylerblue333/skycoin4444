# Skycoin4444 Screen Portfolio Inventory

Generated from client/src/App.tsx and catalogs/beta-route-evidence.json. This report is an engineering inventory, not a claim that every historical screen is production-ready.

## Summary

| Measure | Count |
| --- | ---: |
| Registered routes | 1068 |
| Lazy page modules | 1056 |
| Launchable beta routes | 32 |
| Controlled or unavailable routes | 64 |
| Legacy unverified routes | 972 |
| Routes missing a lazy page source | 0 |

## Launchable beta routes

- /
- /a-i-tools-hub
- /accessibility-settings
- /activity-feed
- /activity-evidence
- /advanced-search
- /arcade
- /blog-editor
- /calculator
- /calendar
- /community-hub
- /course-catalog
- /creator-analytics
- /dating-profile-setup
- /event-planner
- /file-converter
- /help-center
- /language-partner-discovery
- /live-streaming
- /mission-control
- /beta-workspace
- /operational-readiness
- /discovery-center
- /beta-catalog
- /beta-journey
- /beta-commerce
- /beta-web3
- /beta-feedback
- /notification-preferences
- /onboarding
- /profile
- /sign-up-flow

## Safety boundary

Routes classified as controlled or unavailable must not be promoted merely because a component exists. Financial settlement, custody, signing, production-chain writes, transfers, staking, and provider-backed operations require separate evidence and release approval.

## Promotion evidence

Each launchable route must have an entry in `catalogs/beta-route-evidence.json` describing capability, persistence, evidence, and boundary. Registry membership without supporting implementation/tests is invalid.
