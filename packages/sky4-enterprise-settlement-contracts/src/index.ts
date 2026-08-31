import { createHash } from 'node:crypto';

export type SettlementInstruction = Readonly<{
  reference: string;
  payerAccount: string;
  payeeAccount: string;
  asset: string;
  amount: bigint;
  dueAt: number;
}>;

export type SettlementPlan = Readonly<{
  instruction: SettlementInstruction;
  status: 'planned' | 'expired';
  planId: string;
}>;

const SAFE_RE = /^[a-zA-Z0-9:_-]{2,128}$/;

export function planSettlement(instruction: SettlementInstruction, now: number): SettlementPlan {
  if (!SAFE_RE.test(instruction.reference)) throw new Error('invalid settlement reference');
  if (!SAFE_RE.test(instruction.payerAccount) || !SAFE_RE.test(instruction.payeeAccount)) throw new Error('invalid account id');
  if (instruction.payerAccount === instruction.payeeAccount) throw new Error('payer and payee must differ');
  if (!SAFE_RE.test(instruction.asset)) throw new Error('invalid asset id');
  if (instruction.amount <= 0n) throw new Error('amount must be positive');
  if (!Number.isSafeInteger(instruction.dueAt) || instruction.dueAt < 0 || !Number.isSafeInteger(now) || now < 0) throw new Error('invalid settlement time');
  const status = now <= instruction.dueAt ? 'planned' : 'expired';
  const canonical = [instruction.reference, instruction.payerAccount, instruction.payeeAccount, instruction.asset, instruction.amount, instruction.dueAt].join('\n');
  const planId = createHash('sha256').update(canonical, 'utf8').digest('hex');
  return Object.freeze({ instruction: Object.freeze({ ...instruction }), status, planId });
}

export function reconcileSettlement(plan: SettlementPlan, evidence: {
  reference: string;
  amount: bigint;
  asset: string;
}): boolean {
  if (plan.status !== 'planned') return false;
  return evidence.reference === plan.instruction.reference && evidence.amount === plan.instruction.amount && evidence.asset === plan.instruction.asset;
}
