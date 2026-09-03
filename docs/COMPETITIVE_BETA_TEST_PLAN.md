# Competitive Ecosystem Beta Test Plan

## Purpose

This plan covers the connected social, creator, digital-asset, commerce,
language-exchange, and dating-profile beta journeys. The goal is a coherent,
useful test experience inspired by established product patterns—not a claim of
competitor-scale traffic, feature parity, custody, payment, or streaming
infrastructure.

## Test matrix

| Area                   | Route                          | Evidence available now                                                 | Explicit boundary                                                                              |
| ---------------------- | ------------------------------ | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Social and community   | /activity-feed, /community-hub | Authenticated persisted posts, replies, reactions, and communities     | No scale, recommendation-quality, or comprehensive-moderation claim                            |
| Creator live studio    | /live-streaming                | Browser camera/microphone preview and local stream brief               | No ingest, broadcast, recording, viewers, chat, subscription, or revenue                       |
| Digital assets         | /beta-web3                     | Labeled local/testnet metadata fixtures                                | No custody, signing, transfer, swap, staking, settlement, or production-chain write            |
| Privacy-first commerce | /beta-commerce                 | Searchable fixture catalog, persistent local cart, deterministic quote | No real seller, inventory, order, payment, shipping, review, commission, or illicit trade      |
| Language exchange      | /language-partner-discovery    | Local profile and deterministic balanced practice plan                 | No fabricated partners, matching, presence, messages, calls, ratings, or verification          |
| Dating profile         | /dating-profile-setup          | Validated 18+ browser-session draft and restore                        | No discovery, matching, messaging, server persistence, verification, or safety-screening claim |

## Manual acceptance pass

### 1. Social and community

1. Create or use a beta account.
2. Publish an activity-feed post.
3. React and reply.
4. Create or join a community and publish a thread.
5. Refresh and confirm the persisted records return.
6. Confirm account activity shows only evidence owned by the signed-in account.

### 2. Creator live studio

1. Open /live-streaming and confirm no fabricated audience or performance
   metrics appear.
2. Start the local preview and approve browser camera/microphone access.
3. Toggle camera and microphone independently.
4. Stop the preview and confirm the device indicator turns off.
5. Save a valid stream brief, refresh, and confirm it restores.
6. Confirm no upload, recording, broadcast, chat, or monetization control is
   presented as live.

### 3. Digital-asset evidence

1. Open /beta-web3.
2. Identify the displayed environment for every fixture.
3. Confirm fixtures are labeled and cannot be mistaken for owned assets or
   live balances.
4. Confirm signing, custody, transfers, settlement, and production-chain
   execution remain unavailable.

### 4. Privacy-first commerce

1. Search the fixture catalog and filter by category.
2. Add multiple items and change quantities.
3. Confirm each quantity is capped at ten.
4. Refresh and confirm the local cart restores.
5. Recalculate subtotal, 8% tax fixture, and total independently.
6. Confirm checkout/payment is disabled and every item is clearly fictional.

### 5. Language exchange

1. Enter two different languages, CEFR level, availability, goal, and topics.
2. Save the profile and refresh to confirm local restoration.
3. Generate a 30-, 45-, and 60-minute practice plan.
4. Confirm the two language-practice segments are balanced and all steps total
   the requested duration.
5. Confirm the page contains no fabricated partners or live matching claims.

### 6. Dating profile

1. Confirm the page is explicitly limited to adults 18 and older.
2. Exercise required-field, age, bio, and interest validation.
3. Select local images and confirm they are previewed but not uploaded.
4. Save a valid draft, refresh in the same browser session, and confirm text
   fields restore.
5. Confirm the UI explains that browser file handles cannot be restored.
6. Confirm matching, messaging, identity verification, safety screening, and
   server persistence are not claimed.

## Automated release gates

Run these commands in order:

1. pnpm install --frozen-lockfile
2. pnpm run check
3. pnpm run check:packages
4. pnpm run lint
5. pnpm run check:secrets
6. pnpm run audit:markers
7. pnpm run audit:screens
8. pnpm test
9. pnpm run test:integration
10. pnpm run build
11. pnpm audit --prod --audit-level high

The screen audit must report 1,068 registered routes, 23 launchable beta
routes, 64 controlled/unavailable routes, 981 legacy-unverified routes, and
zero missing source routes.

## Promotion blockers

Do not promote the local or controlled labs as live services until their
server contracts, authorization, consent, privacy, abuse prevention,
moderation, observability, recovery, and end-to-end tests exist. Financial,
custody, chain, payment, marketplace, public streaming, partner-matching, and
dating-discovery capabilities require separate specialist review and release
approval.

## Evidence rule

A route, component, fixture, local-storage record, or passing unit test proves
only that specific behavior. It does not prove production capacity, real users,
real inventory, financial authorization, identity, safety, or external service
availability.
