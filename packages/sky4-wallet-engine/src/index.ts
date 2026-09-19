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
const PLAN_ID_RE = /^[a-f0-9]{64}$/;

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function requireAccountId(value: unknown, field: string): string {
  if (typeof value !== 'string' || !ACCOUNT_RE.test(value)) {
    throw new Error(`${field} must be 3-128 safe characters`);
  }
  return value;
}

function requireBigInt(
  value: unknown,
  field: string,
  options: { positive?: boolean } = {},
): bigint {
  if (typeof value !== 'bigint') throw new Error(`${field} must be a bigint`);
  if (options.positive ? value <= 0n : value < 0n) {
    throw new Error(
      options.positive
        ? `${field} must be positive`
        : `${field} must be non-negative`,
    );
  }
  return value;
}

function createPlanId(input: {
  accountId: string;
  destination: string;
  amount: bigint;
  fee: bigint;
  nonce: bigint;
}): string {
  const canonical = `${input.accountId}\n${input.destination}\n${input.amount}\n${input.fee}\n${input.nonce}`;
  return createHash('sha256').update(canonical, 'utf8').digest('hex');
}

export function validateWalletAccount(account: WalletAccount): void {
  if (!isObjectRecord(account)) throw new Error('wallet account is required');

  requireAccountId(account.accountId, 'accountId');
  if (typeof account.publicKey !== 'string' || !KEY_RE.test(account.publicKey)) {
    throw new Error('publicKey must be lowercase hex');
  }
  requireBigInt(account.balance, 'balance');
  requireBigInt(account.nextNonce, 'nextNonce');
}

export function validateTransferPlan(plan: TransferPlan): void {
  if (!isObjectRecord(plan)) throw new Error('transfer plan is required');

  const accountId = requireAccountId(plan.accountId, 'plan accountId');
  const destination = requireAccountId(plan.destination, 'destination');
  if (destination === accountId) {
    throw new Error('destination must differ from source');
  }

  const amount = requireBigInt(plan.amount, 'amount', { positive: true });
  const fee = requireBigInt(plan.fee, 'fee');
  const nonce = requireBigInt(plan.nonce, 'nonce');

  if (typeof plan.planId !== 'string' || !PLAN_ID_RE.test(plan.planId)) {
    throw new Error('planId must be a lowercase SHA-256 hex digest');
  }

  const expectedPlanId = createPlanId({
    accountId,
    destination,
    amount,
    fee,
    nonce,
  });
  if (plan.planId !== expectedPlanId) {
    throw new Error('transfer plan integrity check failed');
  }
}

export function planTransfer(input: {
  account: WalletAccount;
  destination: string;
  amount: bigint;
  fee: bigint;
}): TransferPlan {
  if (!isObjectRecord(input)) throw new Error('transfer input is required');

  validateWalletAccount(input.account);
  const destination = requireAccountId(input.destination, 'destination');
  if (destination === input.account.accountId) {
    throw new Error('destination must differ from source');
  }

  const amount = requireBigInt(input.amount, 'amount', { positive: true });
  const fee = requireBigInt(input.fee, 'fee');
  const total = amount + fee;
  if (total > input.account.balance) {
    throw new Error('insufficient wallet balance');
  }

  const planId = createPlanId({
    accountId: input.account.accountId,
    destination,
    amount,
    fee,
    nonce: input.account.nextNonce,
  });
  return Object.freeze({
    accountId: input.account.accountId,
    destination,
    amount,
    fee,
    nonce: input.account.nextNonce,
    planId,
  });
}

export function applyPlannedDebit(
  account: WalletAccount,
  plan: TransferPlan,
): WalletAccount {
  validateWalletAccount(account);
  validateTransferPlan(plan);

  if (plan.accountId !== account.accountId) {
    throw new Error('plan/account mismatch');
  }
  if (plan.nonce !== account.nextNonce) {
    throw new Error('stale transfer nonce');
  }

  const total = plan.amount + plan.fee;
  if (total > account.balance) {
    throw new Error('insufficient wallet balance');
  }

  return Object.freeze({
    ...account,
    balance: account.balance - total,
    nextNonce: account.nextNonce + 1n,
  });
}
