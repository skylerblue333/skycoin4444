# SKYCOIN4444 Flagship Arcade V2

## Product decision

The quantity-first Games Center has been retired from the flagship experience. The promoted game floor is intentionally smaller and deeper:

- Crash
- Plinko
- High-Low
- Blackjack
- Roulette
- Crypto Ops (Hash Hunt + Wallet Defense)

Legacy game routes may remain for compatibility, but the flagship lobby does not promote them as if route count were product quality.

## V2 quality bar

Each promoted experience now has a dedicated replay loop and visible round state:

- **Crash** — elapsed-time multiplier curve, animated runway, manual cash-out, auto cash-out, seeded round history.
- **Plinko** — animated ball path across a ten-row board, eleven multiplier buckets, recent-drop history.
- **High-Low** — animated card reveal, streak state, recent run history.
- **Blackjack** — animated card dealing, Hit / Stand / Double, dealer draw rules, natural-blackjack payout math, hand history.
- **Roulette** — 37-pocket European ordering, animated wheel rotation, color/parity/straight-number bets, spin history.
- **Crypto Ops** — wallet-safety and hash-recognition skill modes without pretending mining income, token rewards, or wallet execution exists.

Shared UI primitives live under `client/src/features/gaming/components`; shared deterministic math lives in `client/src/lib/flagshipGameEngine.ts`.

## Open-source foundation

The rebuild uses the permissive open-source packages already declared by the repository instead of copying an unrelated casino backend:

- React
- Framer Motion
- Radix UI
- Lucide
- Tailwind CSS

No third-party casino server, payment rail, custody layer, wallet wagering backend, or proprietary game source has been vendored into this change. This keeps licensing, security assumptions, and product boundaries auditable.

## Engineering boundary

These are engineering-beta entertainment and skill simulations. Demo credits, multipliers, scores, chips, stakes, and payouts are browser-local game state with **no monetary or token value**.

The current implementation does not:

- accept live deposits or withdrawals;
- connect a wallet for live wagering;
- settle bets on a blockchain;
- custody user assets;
- redeem scores or credits for money or tokens;
- claim cryptographic/provably-fair randomness;
- provide live real-money gambling.

The deterministic seed/proof strings exist for repeatable testing and transparent demo behavior only.

## Charity-only finance policy

If real-value gaming finance is introduced, SKYCOIN4444 restricts it to the charity path. The policy covers:

- deposits;
- withdrawals;
- real-money wagering;
- custody;
- token settlement;
- redeemable crypto rewards.

A finance action is blocked unless it is associated with a verified charity beneficiary, an approved external provider, legal review, and an allowed region. Real-money wagering has additional age-gate and regulated-gaming-provider requirements.

The current server contract is authorization/planning only. It does not execute a payment or wager, hold custody, or broadcast a blockchain transaction. Approved financial execution must happen through separately configured external providers.

## Release requirements

Before merge:

1. TypeScript check passes.
2. Engine unit tests pass.
3. Gaming release-contract tests pass.
4. Production build passes.
5. Exact-head CI is green.
6. Default branch contains the merged head.

Before any future real-money or token-value gaming work, the product would require separate legal/compliance review, age and region controls, certified randomness/fairness design, responsible-gaming controls, wallet/custody boundaries, and jurisdiction-specific implementation.
