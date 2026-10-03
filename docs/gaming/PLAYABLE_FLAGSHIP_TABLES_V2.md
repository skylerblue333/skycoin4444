# Playable Flagship Tables + SkySchool Review Depth

## Scope

This beta slice adds dedicated playable routes for the flagship demo games that already had deterministic domain logic in `flagshipGameEngine.ts`:

- `/game-plinko`
- `/game-high-low`
- `/game-roulette`

Crash and Blackjack remain on their existing dedicated pages. The shared Arcade route continues to provide a compact multi-game lab.

## Game execution model

Plinko, High-Low, and Roulette use the repository's seeded deterministic engine. The same seed reproduces the same outcome, which makes regression tests and UI debugging possible.

This is **not** a claim of cryptographic randomness, regulated gambling infrastructure, real-money wagering, custody, deposits, withdrawals, token settlement, or redeemable rewards. Credits, stakes, multipliers, returns, streaks, and histories are browser-local game state.

## SkySchool review planning

`buildQuizReviewPlan` turns an authored quiz attempt into deterministic study guidance:

- completion percentage;
- missed and unanswered question IDs;
- per-category weighted performance;
- up to three weakest categories;
- a bounded recommendation string.

The canonical `SchoolQuiz` result page displays this review plan and can hand the learner to HopeAI to ask for an explanation. HopeAI remains an assistance surface; the review plan is not an accredited academic assessment, credential, professional qualification, or certification.

## Release gates

The release contract verifies:

1. the three dedicated routes exist;
2. each page calls the shared deterministic game engine;
3. financial/gambling boundaries remain visible;
4. SchoolQuiz uses the review-plan engine and retains credential truth boundaries.
