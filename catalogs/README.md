# Learning + Gaming Catalog

This directory is a coordination layer for closing product-content gaps without overstating implementation status.

## Learning

The production archive already contains three populated lesson records in `client/src/data/cryptoCourses.ts`: Bitcoin Fundamentals, Ethereum & Smart Contracts, and Decentralized Finance (DeFi). The gap-fill catalog defines nine additional tracks so SkySchool can grow toward a broader curriculum: wallet security, blockchain fundamentals, smart-contract security, tokenomics, Web3 development, DAOs/governance, crypto risk management, NFTs/digital ownership, and Layer 2 scaling.

A catalog entry is not the same as a finished course. Full lesson bodies, quizzes, navigation wiring, persistence, and learner-progress verification still need implementation before a new track should be labeled complete.

## Gaming

The uploaded production archive contains identifiable surfaces for Blackjack, Roulette, Slots, Dice, Snake, Tic-Tac-Toe, Assembly Puzzle, Crash, Block Builder, Crypto Quiz, Token Tap, and GameFi Quest Board. Those are marked `existingSurface: true`.

Eight additional concepts are intentionally marked `existingSurface: false`: Web3 Chess, High-Low, Memory Match, Word Chain, Crypto Trivia, Tower Stack, Mines, and Checkers. This makes the backlog machine-readable without falsely claiming those games already operate.

## Safety and product boundaries

The registry is engineering-beta metadata. It does not represent live wagering, custody, blockchain settlement, payment processing, production multiplayer infrastructure, regulatory approval, or guaranteed persistence. Game rewards should remain simulated/test values unless a separately reviewed integration supplies a real settlement path.

## Validation

Run:

```bash
node --test catalogs/learning-gaming-gap-fill.test.js
```

The validation checks unique IDs, minimum learning/game coverage, implemented-vs-gap accounting, and truthful beta labeling.
