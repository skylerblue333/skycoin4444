# SKYCOIN4444 Core Experience Journeys

This document defines the canonical user-facing routes for the main engineering-beta experiences. The release test in `tests/release/core-experience-journeys.test.ts` protects these paths from accidental route or navigation regressions.

## Flagship routes

- HopeAI: `/hope-a-i`
- Social home: `/activity-feed`
- Games center: `/gaming`
- Arcade: `/arcade`
- Crash: `/game-crash`
- Blackjack: `/game-blackjack`
- Education / SkySchool: `/sky-school`
- Course catalog: `/course-catalog`
- Quiz experience: `/sky-school-quiz`
- SkyHope / Charity: `/charity`
- Charity gaming path: `/gaming-for-charity`

## Intended journey

A user should be able to move through the platform without needing to know the historical 1,000+ route inventory:

1. Use HopeAI for bounded assistance and specialist workflows.
2. Enter Social for the persisted beta feed and community activity.
3. Enter Games for the five flagship demo experiences and crypto-safety skill modes.
4. Enter SkySchool for learning, courses, quizzes, and progress.
5. Enter SkyHope for community-impact planning, evidence checklists, and charity-oriented learning/game loops.

The global beta navigation should always expose direct entry points to HopeAI, Social, Games, SkySchool, and SkyHope.

## Product truth boundaries

These paths are an **engineering beta**, not a certification of external integrations or real-world outcomes.

- HopeAI may use deterministic local tools and configured provider integrations, but must not claim an external action occurred unless a configured integration actually executed and returned evidence.
- Games are demo/skill experiences. There is **no real-money gaming**, wallet wagering, redeemable payout, custody, or token settlement in the flagship game floor.
- SkyHope provides planning, learning, local commitments, and evidence workflows. There is **no donation settlement**, tax receipt, charity disbursement, beneficiary verification, or blockchain write unless a future approved integration explicitly provides and verifies it.
- Social engagement shown by the canonical feed must come from persisted beta records rather than fabricated audience scale.
- Education progress and quizzes are product features; they do not imply accredited credentials unless an external credential path is separately implemented and verified.

## Release rule

A feature can add deeper routes, but the canonical paths above should remain stable or gain a deliberate migration path. Changes that remove one of these routes or remove its primary navigation entry should fail the release contract until the replacement journey is documented and tested.
