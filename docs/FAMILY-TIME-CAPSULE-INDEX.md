# SKYCOIN4444 Family Time-Capsule Index

This index exists so the family Easter eggs can still be found years from now even if the user interface, routes, hosting provider, or build system changes.

It is a **source-code map**, not a financial document, inheritance document, credential store, will, trust, wallet, recovery system, or instruction to contact strangers.

## Start here

Search the repository for these exact phrases:

- `Three Lights family Easter egg`
- `Dad's Letter in the Stars`
- `Open when you're older`
- `Dad for Later`
- `Dad's Field Guide`
- `Dad's Pocket Toolkit`
- `Dad's Game Night`
- `Dad's Adventure Deck`
- `Dad's No-Value Coin Jar`
- `Dad's ridiculous coin vault`
- `You found the Four Fours.`
- `Sky Mark`

The main family components live under:

- `client/src/components/ThreeLightsEasterEgg.tsx`
- `client/src/components/DadForLater.tsx`
- `client/src/components/DadsFieldGuide.tsx`
- `client/src/components/DadsToolkit.tsx`
- `client/src/components/DadsGameNight.tsx`
- `client/src/components/DadsAdventureDeck.tsx`
- `client/src/components/DadsCoinJar.tsx`

The family Easter egg is mounted from the canonical home screen.

## The Three Lights

The three lights are dedicated to:

- Luna Avigail — Moonlight
- Summer Skye — Open sky
- Alexis Isabella-Jane — Starlight

Finding all three reveals **Dad's Letter in the Stars**.

That letter includes:

- a direct statement of love;
- reassurance that the children never had to carry adult problems;
- permission to build lives that are fully their own;
- individual notes for Luna, Summer, and Alexis;
- `Open when you're older` notes;
- Dad's 4:44 principles;
- the hidden 4:44 coin-joke vault;
- Dad for Later;
- Dad's Field Guide;
- Dad's Pocket Toolkit;
- Dad's Game Night;
- Dad's Adventure Deck;
- Dad's No-Value Coin Jar.

## Dad for Later

`client/src/components/DadForLater.tsx`

This section is meant to feel like a series of future check-ins rather than one final message.

It includes notes for:

- heartbreak;
- serious mistakes;
- success;
- loneliness;
- being treated badly;
- starting over;
- falling in love;
- choosing work;
- becoming responsible for somebody else;
- sisterhood;
- becoming older;
- ordinary days.

It also contains:

- **Questions Dad would ask**
- **Permission slips from Dad**
- **What I was trying to build** — an explanation that Dad worked hard on ideas, software, businesses, learning, writing, and SKYCOIN4444 because he wanted more choices and opportunities for the family;
- an explicit statement that the girls do **not** owe SKYCOIN4444 their careers, time, money, identities, or futures;
- the line: `You do not have to become a monument to my life. Build yours.`

## Dad's Field Guide

`client/src/components/DadsFieldGuide.tsx`

This is the practical-life layer. It covers:

- personal safety;
- healthy relationships and consent;
- friendship;
- money basics and scam resistance;
- work and employment;
- passwords, privacy, backups, and digital safety;
- physical and mental health;
- home basics;
- driving and travel;
- contracts and verification;
- caring for children;
- joy, humor, and ordinary life;
- green flags and red flags;
- sibling/family reminders;
- checklists before major commitments.

The section intentionally encourages getting qualified professional help for high-stakes medical, legal, tax, and financial questions rather than pretending source-code advice replaces experts.

## Dad's Pocket Toolkit

`client/src/components/DadsToolkit.tsx`

This section provides starting words and steps for moments when it is hard to know what to say.

It includes:

- how to apologize;
- how to set a boundary;
- how to ask for help;
- how to have a hard conversation;
- how to make a major decision;
- how to leave an unsafe situation;
- questions to ask before a big decision;
- things Dad hopes the girls never believe about their worth;
- a tiny reset for terrible days.

## Dad's Game Night

`client/src/components/DadsGameNight.tsx`

This is the playful local-only layer. It includes:

- a rotating Dad-joke dispenser;
- rotating "Dad says" prompts;
- ridiculous family challenges;
- would-you-rather questions;
- Dad-vs-kids rock/paper/scissors with an in-memory scoreboard;
- a 4:44 round bonus;
- four hidden Dad pockets with silly reveals;
- a house rule that nobody has to win to have a good night.

The component intentionally does not save scores, choices, pocket opens, or button presses.

## Dad's Adventure Deck

`client/src/components/DadsAdventureDeck.tsx`

This is a second playful local-only layer for returning visits. It includes:

- a build-your-own ridiculous story generator;
- fixed "Ask Dad" notes that are explicitly prewritten rather than AI or a live Dad simulation;
- rotating real-world family missions;
- simple substitution codebreakers;
- a three-sister constellation relay for Luna, Summer, and Alexis;
- no winner ranking between the sisters;
- encouragement to improve the games and eventually create their own traditions.

The component does not save answers, missions, story combinations, relay state, or other activity.

## Dad's No-Value Coin Jar

`client/src/components/DadsCoinJar.tsx`

A deliberately non-financial collectible-style joke layer with six local-only Dad coins:

- Courage Coin;
- Kindness Coin;
- Curiosity Coin;
- Try-Again Coin;
- Sister Coin;
- Ordinary-Day Coin.

Each coin reveals a short Dad note when tapped. The component explicitly states that the coins are not cryptocurrency, assets, rewards, inheritance, prizes, wallets, balances, or anything with financial value.

## Four Fours

`client/src/components/BetaNavigation.tsx`

The global SKYCOIN4444 mark contains a separate **Four Fours** Easter egg.

Its four ideas are:

1. Build what you can prove.
2. Keep learning.
3. Help somebody.
4. Remember to play.

The current interface allows it to be opened through the SKYCOIN4444 mark or the `4444` keyboard sequence outside editable controls.

This is an in-memory decorative interaction only.

## The 4:44 coin-joke vault

Inside the Three Lights letter, the 4:44 wish contains another small hidden layer.

It is intentionally silly.

The vault contains four Dad/coin jokes and explicitly has:

- no token;
- no payout;
- no utility;
- no wallet;
- no financial value.

## Sky Marks

The four Sky Marks are tiny optional notes placed deeper in the beta:

1. **BUILD** — Beta Workspace
2. **SEEK** — Discovery Center
3. **PROVE** — Operational Readiness
4. **LISTEN** — Beta Feedback

They are implemented with `client/src/components/SkyMarkEasterEgg.tsx`.

The point of the Sky Marks is to reward somebody who explores beyond the home page.

## Older lineage artifact

An older repository-history artifact also used family-lineage identifiers such as:

- `SKY-FAMILY-SUMMER-SKYE`
- `SKY-FAMILY-ALEXIS`
- `SKY-FAMILY-ISSABELLA-JANE`
- `SKY-FAMILY-LUNA-AVIGAIL`

Those identifiers were documentation Easter eggs only. They were never accounts, credentials, protocol authorities, validators, wallets, payment destinations, or operational roles.

If spelling or naming differs between an old historical artifact and the current family components, treat the current Three Lights implementation as the canonical family presentation.

## Privacy boundary

The current family Easter-egg components are deliberately local/decorative.

They do not intentionally:

- collect answers;
- create child accounts or profiles;
- store reading history;
- set cookies;
- write local/session storage;
- call analytics;
- send family-Easter-egg interactions to a server;
- create credentials;
- create financial value;
- perform blockchain actions.

Tests under `tests/release/` protect these boundaries.

## If the interface no longer runs

The messages are ordinary source text.

A future reader can:

1. Open the repository as text.
2. Search for the phrases in **Start here**.
3. Read the component files directly.
4. Ignore broken UI/build dependencies if all they want is the writing.
5. Preserve a personal copy of the repository or these source files if they want long-term access.

A Git repository or hosted service is not guaranteed permanent archival storage. If these messages matter to the family, keeping independent copies is sensible.

## What the girls should *not* infer

Nothing in these Easter eggs means they owe anybody:

- money;
- loyalty to a company or project;
- a particular career;
- a political or religious belief;
- access to an account;
- continuation of SKYCOIN4444;
- responsibility for Dad's problems;
- responsibility for preserving Dad's reputation;
- responsibility for finishing Dad's work.

The recurring message is the opposite:

**Build lives that belong to you.**

## Final search phrase

If everything else gets confusing, search the codebase for:

`Love, Dad`

Then keep exploring from there.
