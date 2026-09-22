# SKYCOIN4444 Flagship Arcade V1

## Product decision

The previous Games Center emphasized catalog size. The flagship beta now emphasizes a smaller set of replayable experiences:

- Crash
- Plinko
- High-Low
- Blackjack
- Roulette
- Crypto Ops (Hash Hunt + Wallet Defense)

Legacy game pages may remain in the repository for route compatibility, but they are no longer promoted from the primary Games Center.

## Engineering boundary

These are engineering-beta entertainment and skill simulations. Demo credits, multipliers, scores, chips, and payouts are browser-local game state with **no monetary or token value**.

The current implementation does not:

- accept deposits or purchases for game credits;
- connect a wallet for wagering;
- settle bets on a blockchain;
- custody user assets;
- redeem scores or credits for money or tokens;
- claim cryptographic/provably-fair randomness;
- provide real-money gambling.

The deterministic seed/proof strings exist for repeatable testing and transparent demo behavior only.

## Quality goals

1. One focused Games Center instead of a 50-game quantity claim.
2. Strong visual hierarchy and mobile-responsive layouts.
3. Shared, tested game math for cards, Plinko, roulette, crash points, and crypto challenges.
4. Clear local-demo boundaries everywhere wagering-like UI appears.
5. Preserve existing public routes such as /gaming, /arcade, /game-crash, and /game-blackjack.

## Follow-up

Before any real-money or token-value gaming work, legal/compliance review, age/region controls, certified RNG/fairness design, wallet/custody boundaries, responsible-gaming controls, and jurisdiction-specific product requirements would need separate implementation and verification.
