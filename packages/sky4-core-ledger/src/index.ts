import { createHash } from 'node:crypto';

export type LedgerTransfer = Readonly<{
  from: string;
  to: string;
  amount: bigint;
  nonce: bigint;
}>;

export type LedgerBlock = Readonly<{
  height: bigint;
  previousHash: string;
  transfers: readonly LedgerTransfer[];
  hash: string;
}>;

const ACCOUNT_RE = /^[a-zA-Z0-9:_-]{3,128}$/;
const HASH_RE = /^[a-f0-9]{64}$/;

export function validateTransfer(transfer: LedgerTransfer): void {
  if (!ACCOUNT_RE.test(transfer.from) || !ACCOUNT_RE.test(transfer.to)) {
    throw new Error('ledger account identifiers must be 3-128 safe characters');
  }
  if (transfer.from === transfer.to) throw new Error('source and destination must differ');
  if (transfer.amount <= 0n) throw new Error('amount must be positive');
  if (transfer.nonce < 0n) throw new Error('nonce must be non-negative');
}

export function transferId(transfer: LedgerTransfer): string {
  validateTransfer(transfer);
  const canonical = `${transfer.from}\n${transfer.to}\n${transfer.amount}\n${transfer.nonce}`;
  return createHash('sha256').update(canonical, 'utf8').digest('hex');
}

export function createBlock(input: {
  height: bigint;
  previousHash: string;
  transfers: readonly LedgerTransfer[];
}): LedgerBlock {
  if (input.height < 0n) throw new Error('height must be non-negative');
  if (!HASH_RE.test(input.previousHash)) throw new Error('previousHash must be a lowercase sha256 digest');
  if (input.transfers.length > 10_000) throw new Error('block transfer limit exceeded');
  const seen = new Set<string>();
  const ids = input.transfers.map((transfer) => {
    const id = transferId(transfer);
    if (seen.has(id)) throw new Error('duplicate transfer in block');
    seen.add(id);
    return id;
  });
  const canonical = `${input.height}\n${input.previousHash}\n${ids.join('\n')}`;
  return Object.freeze({
    height: input.height,
    previousHash: input.previousHash,
    transfers: Object.freeze([...input.transfers]),
    hash: createHash('sha256').update(canonical, 'utf8').digest('hex'),
  });
}

export function applyBlock(
  balances: ReadonlyMap<string, bigint>,
  block: LedgerBlock,
): ReadonlyMap<string, bigint> {
  const next = new Map(balances);
  for (const transfer of block.transfers) {
    validateTransfer(transfer);
    const available = next.get(transfer.from) ?? 0n;
    if (available < transfer.amount) throw new Error(`insufficient balance for ${transfer.from}`);
    next.set(transfer.from, available - transfer.amount);
    next.set(transfer.to, (next.get(transfer.to) ?? 0n) + transfer.amount);
  }
  return next;
}
