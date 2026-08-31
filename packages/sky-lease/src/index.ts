export type Lease = Readonly<{ resourceId: string; holderId: string; acquiredAt: number; expiresAt: number; generation: number }>;
const ID_RE = /^[a-zA-Z0-9:_-]{2,96}$/;

function validTime(value: number): boolean { return Number.isSafeInteger(value) && value >= 0; }

export function acquireLease(resourceId: string, holderId: string, now: number, ttlMs: number, current?: Lease): Lease {
  if (!ID_RE.test(resourceId) || !ID_RE.test(holderId)) throw new Error('invalid lease identifier');
  if (!validTime(now) || !Number.isSafeInteger(ttlMs) || ttlMs < 1 || ttlMs > 86_400_000) throw new Error('invalid lease timing');
  if (current && current.resourceId !== resourceId) throw new Error('resource mismatch');
  if (current && current.expiresAt > now) throw new Error('lease already active');
  const expiresAt = now + ttlMs;
  if (!Number.isSafeInteger(expiresAt)) throw new Error('lease time overflow');
  return Object.freeze({ resourceId, holderId, acquiredAt: now, expiresAt, generation: (current?.generation ?? 0) + 1 });
}

export function renewLease(lease: Lease, holderId: string, now: number, ttlMs: number): Lease {
  if (lease.holderId !== holderId) throw new Error('lease holder mismatch');
  if (!validTime(now) || now < lease.acquiredAt || now >= lease.expiresAt) throw new Error('lease is not renewable');
  if (!Number.isSafeInteger(ttlMs) || ttlMs < 1 || ttlMs > 86_400_000) throw new Error('invalid lease timing');
  const expiresAt = now + ttlMs;
  if (!Number.isSafeInteger(expiresAt)) throw new Error('lease time overflow');
  return Object.freeze({ ...lease, expiresAt });
}

export function isLeaseActive(lease: Lease, now: number): boolean {
  if (!validTime(now)) throw new Error('invalid current time');
  return now >= lease.acquiredAt && now < lease.expiresAt;
}
