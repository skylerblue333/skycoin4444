export const GENESIS_MILESTONE = Object.freeze({
  type: 'skycoin4444.genesis-milestone.v1',
  id: 'skycoin4444-genesis-2026-09-19-trump-integration',
  title: 'One-time ecosystem genesis milestone',
  description:
    'A commemorative record of the first verified Official TRUMP Solana integration boundary in the SKYCOIN4444 ecosystem.',
  tokenMint: '6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN',
  network: 'solana-mainnet-beta',
  sourcePullRequest: 'https://github.com/skylerblue333/skycoin4444/pull/391',
  verification: Object.freeze({
    tokenRegistryTests: 8,
    fullTestFiles: 125,
    fullTests: 613,
    typecheck: 'passed',
    productionBuild: 'passed',
  }),
  createdAt: '2026-09-19T15:31:34Z',
  oneTime: true,
  monetaryValue: 0,
  transferable: false,
  claimable: false,
  custodyCreated: false,
} as const);

export type GenesisMilestone = typeof GENESIS_MILESTONE;

/**
 * Checks the immutable milestone shape without contacting a wallet or chain.
 * The record is commemorative metadata, not a token, entitlement, or claim.
 */
export function verifyGenesisMilestone(value: unknown): value is GenesisMilestone {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const candidate = value as Record<string, unknown>;
  const verification = candidate.verification;
  if (!verification || typeof verification !== 'object' || Array.isArray(verification)) return false;
  const checks = verification as Record<string, unknown>;

  return (
    candidate.type === GENESIS_MILESTONE.type &&
    candidate.id === GENESIS_MILESTONE.id &&
    candidate.tokenMint === GENESIS_MILESTONE.tokenMint &&
    candidate.network === GENESIS_MILESTONE.network &&
    candidate.sourcePullRequest === GENESIS_MILESTONE.sourcePullRequest &&
    candidate.oneTime === true &&
    candidate.monetaryValue === 0 &&
    candidate.transferable === false &&
    candidate.claimable === false &&
    candidate.custodyCreated === false &&
    checks.tokenRegistryTests === GENESIS_MILESTONE.verification.tokenRegistryTests &&
    checks.fullTestFiles === GENESIS_MILESTONE.verification.fullTestFiles &&
    checks.fullTests === GENESIS_MILESTONE.verification.fullTests &&
    checks.typecheck === 'passed' &&
    checks.productionBuild === 'passed'
  );
}
