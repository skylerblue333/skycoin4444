import { describe, expect, it } from 'vitest';
import {
  createOfficialTrumpRegistry,
  createOfficialTrumpTransferIntent,
  OFFICIAL_TRUMP_MINT,
  OFFICIAL_TRUMP_TOKEN,
} from './officialTrump';

const sourceOwner = '11111111111111111111111111111111';
const destinationOwner = 'So11111111111111111111111111111111111111112';
const acknowledgements = {
  mint: true,
  network: true,
  recipient: true,
  amount: true,
  irreversible: true,
} as const;

describe('Official TRUMP Solana transfer boundary', () => {
  it('exposes the configured mainnet SPL token identity', () => {
    expect(OFFICIAL_TRUMP_TOKEN).toMatchObject({
      symbol: 'TRUMP',
      name: 'Official Trump',
      network: 'solana',
      decimals: 6,
      contractAddress: OFFICIAL_TRUMP_MINT,
    });
  });

  it('registers the asset in a fresh ecosystem registry', () => {
    const snapshot = createOfficialTrumpRegistry().snapshot();
    expect(snapshot).toEqual({
      type: 'sky.token-registry.snapshot.v1',
      tokenCount: 1,
      tokens: [OFFICIAL_TRUMP_TOKEN],
    });
  });

  it('creates a precise unsigned transfer intent', () => {
    const intent = createOfficialTrumpTransferIntent({
      sourceOwner,
      destinationOwner,
      amount: '12.345678',
      acknowledgements,
    });

    expect(intent.network).toBe('solana-mainnet-beta');
    expect(intent.mint).toBe(OFFICIAL_TRUMP_MINT);
    expect(intent.amount).toBe('12.345678');
    expect(intent.amountBaseUnits).toBe(12_345_678n);
    expect(intent.requiresWalletSignature).toBe(true);
    expect(intent.broadcasted).toBe(false);
    expect(intent.custodyCreated).toBe(false);
  });

  it('rejects unacknowledged or imprecise transaction inputs', () => {
    expect(() =>
      createOfficialTrumpTransferIntent({
        sourceOwner,
        destinationOwner,
        amount: '1',
        acknowledgements: { ...acknowledgements, irreversible: false },
      }),
    ).toThrow('confirm irreversible');

    expect(() =>
      createOfficialTrumpTransferIntent({
        sourceOwner,
        destinationOwner,
        amount: '1.0000001',
        acknowledgements,
      }),
    ).toThrow('no more than 6 decimals');
  });

  it('rejects self-transfers and secret-like invalid addresses', () => {
    expect(() =>
      createOfficialTrumpTransferIntent({
        sourceOwner,
        destinationOwner: sourceOwner,
        amount: '1',
        acknowledgements,
      }),
    ).toThrow('must differ');

    expect(() =>
      createOfficialTrumpTransferIntent({
        sourceOwner: 'private key should never be accepted here',
        destinationOwner,
        amount: '1',
        acknowledgements,
      }),
    ).toThrow('valid-looking Solana public key');
  });
});
