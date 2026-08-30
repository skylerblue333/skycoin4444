# SkyNFTCore (#148)

Bounded local NFT record and transfer-intent domain core for SKYCOIN4444 Wave 2. It validates local token/owner/metadata identifiers and uses optimistic versions for deterministic ownership-transition plans.

Integration contract: `sky.nft.transfer.v1`, which explicitly reports `chainExecutionPerformed: false`.

Boundaries: no blockchain minting or transactions, wallet/custody/signing, on-chain ownership verification, royalties/pricing, metadata fetching, IP-rights verification, token-standard compliance certification, persistence, or production deployment claims.
