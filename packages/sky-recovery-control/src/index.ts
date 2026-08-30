export type RecoveryStatus = 'planned' | 'approved' | 'executed' | 'cancelled';
export type RecoveryPlan = Readonly<{ id: string; targetRef: string; status: RecoveryStatus; version: number; approvedBy?: string; executedAt?: string }>;

export const RECOVERY_PLAN_EVENT = 'sky.recovery.plan.changed.v1' as const;

const clean = (value: string, field: string) => {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${field} is required`);
  return normalized;
};

const strictIso = (value: string) => {
  const normalized = clean(value, 'timestamp');
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime()) || date.toISOString() !== normalized) throw new Error('timestamp must be strict ISO-8601 UTC');
  return normalized;
};

export function createRecoveryPlan(id: string, targetRef: string): RecoveryPlan {
  return Object.freeze({ id: clean(id, 'id'), targetRef: clean(targetRef, 'targetRef'), status: 'planned', version: 1 });
}

export function approveRecoveryPlan(plan: RecoveryPlan, approverId: string): RecoveryPlan {
  if (plan.status !== 'planned') throw new Error('only planned recovery can be approved');
  return Object.freeze({ ...plan, status: 'approved', approvedBy: clean(approverId, 'approverId'), version: plan.version + 1 });
}

export function executeRecoveryPlan(plan: RecoveryPlan, executedAt: string): RecoveryPlan {
  if (plan.status !== 'approved') throw new Error('only approved recovery can execute');
  return Object.freeze({ ...plan, status: 'executed', executedAt: strictIso(executedAt), version: plan.version + 1 });
}

export function cancelRecoveryPlan(plan: RecoveryPlan): RecoveryPlan {
  if (plan.status === 'executed') throw new Error('executed recovery cannot be cancelled');
  if (plan.status === 'cancelled') return plan;
  return Object.freeze({ ...plan, status: 'cancelled', version: plan.version + 1 });
}
