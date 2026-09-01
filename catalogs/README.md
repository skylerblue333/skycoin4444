# Learning + Gaming Gap Fill

This directory tracks learning and gaming capability expansion without overstating production status.

## Learning

The uploaded production archive documented three baseline crypto course records: Bitcoin Fundamentals, Ethereum & Smart Contracts, and Decentralized Finance (DeFi). This branch adds nine authored course cores in `client/src/data/gapCourses.ts`: wallet security, blockchain fundamentals, smart-contract security, tokenomics, Web3 development, DAOs/governance, crypto risk management, NFTs/digital ownership, and Layer 2 scaling.

Each new course has five or six authored lessons, an objective and summary per lesson, and deterministic assessment questions with answer keys. These are content/domain cores; navigation wiring, persistence, certificates, learner accounts, and production analytics remain separate integration work.

## Gaming

The live repository and uploaded archive did not agree on every historical game surface, so the catalog now tracks three concepts separately: `existingSurface`, `gapDomainCore`, and archive baseline evidence.

Seven game surfaces are verified in the live repository catalog: Blackjack, Slots, Crash, Block Builder, Crypto Quiz, Token Tap, and GameFi Quest Board. Roulette, Dice, Snake, Tic-Tac-Toe, and Assembly Puzzle are not counted as live routed surfaces merely because they appeared in archive material or links.

Eight prior gaps now have deterministic local domain cores in `client/src/lib/gapGames.ts`: Web3 Chess move geometry, High-Low resolution, Memory Match pairing, Word Chain validation, Crypto Trivia scoring, Tower Stack scoring, Mines adjacency generation, and Checkers step validation. They are not labeled complete UI games until routed interfaces and broader game-state rules are added.

## Safety and product boundaries

Everything here remains engineering beta. No game module performs wagering, custody, blockchain settlement, real-money rewards, production matchmaking, or payment processing. Course material is educational content and does not provide financial, legal, or security guarantees.

## Validation

Run the repository test suite with `pnpm test`. The release suite includes `tests/release/gap-games.test.ts` and `tests/release/gap-courses.test.ts`. The standalone catalog validation can also be run with `node --test catalogs/learning-gaming-gap-fill.test.js`.
