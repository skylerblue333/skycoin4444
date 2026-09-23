import { SkyTokenRegistry } from './index';
import type { TokenDefinition } from './index';

/** Official TRUMP SPL mint used by the integration contract. */
export const OFFICIAL_TRUMP_MINT =
  '6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN';

export const OFFICIAL_TRUMP_TOKEN: Readonly<TokenDefinition> = Object.freeze({
  id: 'official-trump-solana-mainnet',
  symbol: 'TRUMP',
  name: 'Official Trump',
  network: 'solana',
  decimals: 6,
  contractAddress: OFFICIAL_TRUMP_MINT,
});

/**
 * SKYCOIN4444's own product designation for its primary supported external
 * crypto asset. This designation is internal to SKYCOIN4444 and does not claim
 * endorsement, partnership, issuer authorization, legal-tender status, or any
 * affiliation with Donald Trump or the $TRUMP issuer.
 */
export const SKYCOIN4444_OFFICIAL_CRYPTO_ASSET = Object.freeze({
  type: 'skycoin4444.crypto-asset-designation.v1',
  designation: 'official-skycoin4444-supported-external-crypto-asset',
  asset: OFFICIAL_TRUMP_TOKEN,
  scope: 'skycoin4444-engineering-beta',
  externalAffiliationClaimed: false,
  legalTenderClaimed: false,
  custodyEnabled: false,
  signingEnabled: false,
  broadcastEnabled: false,
  automatedTradingEnabled: false,
} as const);

/** Creates a fresh registry containing only the explicitly configured TRUMP asset. */
export function createOfficialTrumpRegistry(): SkyTokenRegistry {
  const registry = new SkyTokenRegistry();
  registry.register(OFFICIAL_TRUMP_TOKEN);
  return registry;
}

export type TrumpTransferAcknowledgements = Readonly<{
  mint: boolean;
  network: boolean;
  recipient: boolean;
  amount: boolean;
  irreversible: boolean;
}>;

export type TrumpTransferInput = Readonly<{
  sourceOwner: string;
  destinationOwner: string;
  amount: string;
  acknowledgements: TrumpTransferAcknowledgements;
}>;

export type UnsignedTrumpTransferIntent = Readonly<{
  type: 'sky.solana.spl-transfer-intent.v1';
  network: 'solana-mainnet-beta';
  token: typeof OFFICIAL_TRUMP_TOKEN;
  mint: typeof OFFICIAL_TRUMP_MINT;
  sourceOwner: string;
  destinationOwner: string;
  amount: string;
  amountBaseUnits: bigint;
  requiresWalletSignature: true;
  broadcasted: false;
  custodyCreated: false;
}>;

const SOLANA_ADDRESS = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
const AMOUNT = /^(?:0|[1-9]\d*)(?:\.\d{1,6})?$/;
const REQUIRED_ACKNOWLEDGEMENTS = [
  'mint',
  'network',
  'recipient',
  'amount',
  'irreversible',
] as const;

function requireSolanaAddress(value: string, field: string): string {
  if (typeof value !== 'string' || !SOLANA_ADDRESS.test(value.trim())) {
    throw new Error(`${field} must be a valid-looking Solana public key`);
  }
  return value.trim();
}

function parseTrumpAmount(value: string): { display: string; baseUnits: bigint } {
  const normalized = value.trim();
  if (!AMOUNT.test(normalized) || Number(normalized) <= 0) {
    throw new Error('amount must be positive with no more than 6 decimals');
  }
  const [whole, fraction = ''] = normalized.split('.');
  const baseUnits = BigInt(whole) * 1_000_000n + BigInt(fraction.padEnd(6, '0'));
  if (baseUnits <= 0n) throw new Error('amount must be positive with no more than 6 decimals');
  return { display: `${whole}.${fraction.padEnd(6, '0')}`, baseUnits };
}

function requireAcknowledgements(value: TrumpTransferAcknowledgements): void {
  if (!value || typeof value !== 'object') {
    throw new Error('all transfer acknowledgements are required');
  }

  for (const name of REQUIRED_ACKNOWLEDGEMENTS) {
    if (value[name] !== true) {
      throw new Error(`confirm ${name} before preparing a transfer`);
    }
  }
}

/**
 * Creates an unsigned, user-reviewed SPL transfer intent.
 * This function never accesses a wallet, signs, submits, or broadcasts a transaction.
 */
export function createOfficialTrumpTransferIntent(
  input: TrumpTransferInput,
): UnsignedTrumpTransferIntent {
  const sourceOwner = requireSolanaAddress(input.sourceOwner, 'sourceOwner');
  const destinationOwner = requireSolanaAddress(input.destinationOwner, 'destinationOwner');
  if (sourceOwner === destinationOwner) throw new Error('destinationOwner must differ from sourceOwner');
  requireAcknowledgements(input.acknowledgements);
  const amount = parseTrumpAmount(input.amount);

  return Object.freeze({
    type: 'sky.solana.spl-transfer-intent.v1',
    network: 'solana-mainnet-beta',
    token: OFFICIAL_TRUMP_TOKEN,
    mint: OFFICIAL_TRUMP_MINT,
    sourceOwner,
    destinationOwner,
    amount: amount.display,
    amountBaseUnits: amount.baseUnits,
    requiresWalletSignature: true,
    broadcasted: false,
    custodyCreated: false,
  });
}
