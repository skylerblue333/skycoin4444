import { createHash } from 'node:crypto';

export type WalletAccount = Readonly<{
  accountId: string;
  publicKey: string;
  balance: bigint;
  nextNonce: bigint;
}>;

export type TransferPlan = Readonly<{
  accountId: string;
  destination: string;
  amount: bigint;
  fee: bigint;
  nonce: bigint;
  planId: string;
}>;

const ACCOUNT_RE = /^[a-zA-Z0-9:_-]{3,128}$/;
const KEY_RE = /^[a-f0-9]{64,130}$/;

export function validateWalletAccount(account: WalletAccount): void {
  if (!ACCOUNT_RE.test(account.accountId)) throw new Error('accountId must be 3-128 safe characters');
  if (!KEY_RE.test(account.publicKey)) throw new Error('publicKey must be lowercase hex');
  if (account.balance < 0n) throw new Error('balance must be non-negative');
  if (account.nextNonce < 0n) throw new Error('nextNonce must be non-negative');
}

export function planTransfer(input: {
  account: WalletAccount;
  destination: string;
  amount: bigint;
  fee: bigint;
}): TransferPlan {
  validateWalletAccount(input.account);
  if (!ACCOUNT_RE.test(input.destination)) throw new Error('destination must be 3-128 safe characters');
  if (input.destination === input.account.accountId) throw new Error('destination must differ from source');
  if (input.amount <= 0n) throw new Error('amount must be positive');
  if (input.fee < 0n) throw new Error('fee must be non-negative');
  const total = input.amount + input.fee;
  if (total > input.account.balance) throw new Error('insufficient wallet balance');
  const canonical = `${input.account.accountId}\n${input.destination}\n${input.amount}\n${input.fee}\n${input.account.nextNonce}`;
  const planId = createHash('sha256').update(canonical, 'utf8').digest('hex');
  return Object.freeze({
    accountId: input.account.accountId,
    destination: input.destination,
    amount: input.amount,
    fee: input.fee,
    nonce: input.account.nextNonce,
    planId,
  });
}

export function applyPlannedDebit(account: WalletAccount, plan: TransferPlan): WalletAccount {
  validateWalletAccount(account);
  if (plan.accountId !== account.accountId) throw new Error('plan/account mismatch');
  if (plan.nonce !== account.nextNonce) throw new Error('stale transfer nonce');
  const total = plan.amount + plan.fee;
  if (total > account.balance) throw new Error('insufficient wallet balance');
  return Object.freeze({ ...account, balance: account.balance - total, nextNonce: account.nextNonce + 1n });
}
