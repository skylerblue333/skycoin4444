# SKYCOIN4444 V4 Beta Live Promotion — 2026-09-15

This document records the release-evidence trigger for promoting the current protected `main` ecosystem to the existing Railway invitation-only engineering beta.

## Current release baseline

- Protected `main` before this release-evidence commit: `065752efe743814d6a1a01b4a512724972e9ce59`
- V3 launchpad/capability explorer polish is included.
- Seven deep flagship journeys (Social, Gaming, Live, Commerce, Learning, HopeAI, Web3) are included.
- Evidence-backed journey receipts are included.
- V4 flagship command center and cross-product missions from PR #368 are included.
- The `main` CI run for `065752efe743814d6a1a01b4a512724972e9ce59` completed successfully before this promotion trigger.

## Railway promotion boundary

The promotion must reuse the existing `skycoin4444-beta-app` Railway service, Railway domain, invitation auth configuration, managed MySQL service, healthcheck, and one-replica topology. It must not create a duplicate service or database.

The previously completed one-time arcade progress migration must not be replayed on every deployment. The stale Railway pre-deploy migration hook was removed before this promotion trigger.

## Truth boundary

This remains an invitation-only engineering beta. This promotion does not imply GA, production certification, identity verification, live payment settlement, banking, custody, blockchain signing/transfers, regulatory approval, universal provider-backed AI, Twitch-scale streaming, or an SLA.

A live Railway deployment is considered verified only after Railway reports the promoted `main` revision as `SUCCESS` and `/api/beta/readiness` responds successfully.
