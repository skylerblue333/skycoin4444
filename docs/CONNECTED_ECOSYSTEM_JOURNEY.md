# Connected HopeAI / Social / Gaming / Education / SkyHope Journey

## Why this tranche exists

The V5 launch-readiness control freezes unrelated feature expansion but explicitly calls out cross-system integration as a P1 launch blocker. This tranche therefore does not create a new feature family. It connects existing Social, SkySchool, Gaming, HopeAI and SkyHope surfaces around persisted account evidence.

## SkyHope repair

The previous canonical Charity page called `trpc.charity.*`, while the server still exposed `charity` through the generic unavailable-feature stub. The page also contained hard-coded donor rankings, DAO vote totals, partner-verification language and an on-chain donation claim that were not backed by the live server contract.

The canonical `charity` namespace now provides:

- a small reviewed campaign catalog;
- account-owned pledge-intent persistence;
- account-owned volunteer-action persistence;
- aggregate pledged-intent counts and amounts;
- an authenticated impact summary;
- an authenticated cross-system journey query.

A pledge is **not** a payment. The system does not charge a card, move crypto, reserve funds, prove tax deductibility, verify a beneficiary, or claim settlement.

Volunteer records are user-entered activity evidence. The beta does not independently verify attendance or convert volunteer time into money.

## Cross-system journey

`sky.ecosystem.journey.v1` derives four missions from persisted records:

1. Social — at least one persisted account-owned post.
2. Learn — at least one persisted SkySchool lesson completion.
3. Play — at least one synced Arcade Passport play.
4. Impact — at least one SkyHope pledge intent or at least 15 recorded volunteer minutes.

The contract returns completion percentage, evidence text, and the next incomplete route.

HopeAI is deliberately exposed as an assist route rather than a completion metric because the current canonical HopeAI workspace does not claim server-persisted conversation completion evidence. The active HopeAI agent/tool PR remains independently owned and is not overwritten by this tranche.

## Navigation

The global beta shell now promotes:

- Social;
- Gaming;
- SkySchool;
- HopeAI;
- SkyHope;
- the connected Journey.

The home launchpad includes SkyHope as a headline area, changes the local four-step loop from generic exploration to impact, and provides a direct route to the persisted journey.

## Canonical impact routes

Legacy charity leaderboard, impact-map, impact-metrics, donation-processing, fundraiser-tools, and gaming-for-charity pages now resolve to the canonical SkyHope Impact Center. This prevents old mock metrics or financial wording from presenting a conflicting product truth boundary.

## Database activation

Migration `0015_skyhope_impact.sql` adds:

- `charity_pledges`;
- `charity_volunteer_actions`.

Production-like hosted migration is guarded by:

```bash
BETA_DB_MIGRATION_CONFIRM=SKYHOPE_IMPACT_V1 pnpm beta:db:migrate:skyhope-impact
```

The runner refuses missing/non-MySQL/localhost configuration, uses `CREATE TABLE IF NOT EXISTS`, verifies required columns, indexes and user foreign keys, and does not update or delete existing application rows.

Until that migration is applied to a hosted database, the public campaign catalog remains readable while account impact persistence reports the migration requirement rather than pretending writes succeeded.

## Truth boundary

This work does not prove or enable:

- payment processing or settlement;
- wallet custody or blockchain donation transfer;
- charity/beneficiary verification;
- tax-deductibility determination;
- fundraising regulatory compliance;
- authoritative volunteer verification;
- external HopeAI provider availability;
- financial rewards from games or learning.

Those require separate providers, legal/region review, credentials, operational evidence and release approval.
