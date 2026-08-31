export type IndexedTransfer = Readonly<{
  id: string;
  blockHeight: bigint;
  from: string;
  to: string;
  amount: bigint;
}>;

export type ExplorerIndex = Readonly<{
  byId: ReadonlyMap<string, IndexedTransfer>;
  byAccount: ReadonlyMap<string, readonly string[]>;
}>;

const ID_RE = /^[a-f0-9]{64}$/;
const ACCOUNT_RE = /^[a-zA-Z0-9:_-]{3,128}$/;

export function buildExplorerIndex(transfers: readonly IndexedTransfer[]): ExplorerIndex {
  if (transfers.length > 100_000) throw new Error('transfer index limit exceeded');
  const byId = new Map<string, IndexedTransfer>();
  const byAccount = new Map<string, string[]>();
  for (const transfer of transfers) {
    if (!ID_RE.test(transfer.id)) throw new Error('transfer id must be a lowercase sha256 digest');
    if (transfer.blockHeight < 0n) throw new Error('blockHeight must be non-negative');
    if (!ACCOUNT_RE.test(transfer.from) || !ACCOUNT_RE.test(transfer.to)) throw new Error('invalid account id');
    if (transfer.amount <= 0n) throw new Error('amount must be positive');
    if (byId.has(transfer.id)) throw new Error('duplicate transfer id');
    byId.set(transfer.id, Object.freeze({ ...transfer }));
    for (const account of new Set([transfer.from, transfer.to])) {
      const ids = byAccount.get(account) ?? [];
      ids.push(transfer.id);
      byAccount.set(account, ids);
    }
  }
  const frozenAccounts = new Map<string, readonly string[]>();
  for (const [account, ids] of byAccount) frozenAccounts.set(account, Object.freeze([...ids]));
  return Object.freeze({ byId, byAccount: frozenAccounts });
}

export function getTransfer(index: ExplorerIndex, id: string): IndexedTransfer | undefined {
  if (!ID_RE.test(id)) throw new Error('transfer id must be a lowercase sha256 digest');
  return index.byId.get(id);
}

export function listAccountTransfers(
  index: ExplorerIndex,
  accountId: string,
  options: { offset?: number; limit?: number } = {},
): readonly IndexedTransfer[] {
  if (!ACCOUNT_RE.test(accountId)) throw new Error('invalid account id');
  const offset = options.offset ?? 0;
  const limit = options.limit ?? 50;
  if (!Number.isInteger(offset) || offset < 0) throw new Error('offset must be non-negative');
  if (!Number.isInteger(limit) || limit < 1 || limit > 200) throw new Error('limit must be 1-200');
  return Object.freeze((index.byAccount.get(accountId) ?? [])
    .slice(offset, offset + limit)
    .map((id) => index.byId.get(id)!)
    .sort((a, b) => Number(a.blockHeight - b.blockHeight) || a.id.localeCompare(b.id)));
}
