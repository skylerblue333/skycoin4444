/**
 * Public, non-secret metadata for the external Official TRUMP asset configured
 * by SKYCOIN4444. Keeping the public descriptor in shared code prevents client
 * surfaces and server validation from drifting to different token addresses.
 *
 * This file is metadata only. It does not create custody, signing, settlement,
 * price feeds, swaps, endorsements, partnerships, or issuer authorization.
 */
export const OFFICIAL_TRUMP_MINT =
  "6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN" as const;

export const OFFICIAL_TRUMP_PUBLIC_ASSET = Object.freeze({
  symbol: "TRUMP",
  name: "Official Trump",
  network: "solana",
  decimals: 6,
  contractAddress: OFFICIAL_TRUMP_MINT,
} as const);
