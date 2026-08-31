export type Allocation = Readonly<{
  bucket: string;
  amount: bigint;
}>;

export type EmissionSchedule = Readonly<{
  initialSupply: bigint;
  annualInflationBps: number;
  years: number;
}>;

const BUCKET_RE = /^[a-zA-Z0-9:_ -]{2,80}$/;

export function validateAllocations(allocations: readonly Allocation[], expectedSupply: bigint): void {
  if (expectedSupply <= 0n) throw new Error('expectedSupply must be positive');
  if (allocations.length === 0 || allocations.length > 100) throw new Error('allocation count must be 1-100');
  const seen = new Set<string>();
  let total = 0n;
  for (const item of allocations) {
    if (!BUCKET_RE.test(item.bucket)) throw new Error('invalid allocation bucket');
    if (seen.has(item.bucket)) throw new Error('duplicate allocation bucket');
    seen.add(item.bucket);
    if (item.amount < 0n) throw new Error('allocation amount must be non-negative');
    total += item.amount;
  }
  if (total !== expectedSupply) throw new Error('allocations must equal expected supply');
}

export function projectSupply(schedule: EmissionSchedule): readonly bigint[] {
  if (schedule.initialSupply <= 0n) throw new Error('initialSupply must be positive');
  if (!Number.isInteger(schedule.annualInflationBps) || schedule.annualInflationBps < 0 || schedule.annualInflationBps > 10_000) {
    throw new Error('annualInflationBps must be 0-10000');
  }
  if (!Number.isInteger(schedule.years) || schedule.years < 0 || schedule.years > 100) throw new Error('years must be 0-100');
  const supplies: bigint[] = [schedule.initialSupply];
  let current = schedule.initialSupply;
  for (let year = 0; year < schedule.years; year += 1) {
    current += (current * BigInt(schedule.annualInflationBps)) / 10_000n;
    supplies.push(current);
  }
  return Object.freeze(supplies);
}

export function allocationPercentBps(amount: bigint, totalSupply: bigint): number {
  if (amount < 0n || totalSupply <= 0n || amount > totalSupply) throw new Error('invalid allocation ratio');
  return Number((amount * 10_000n) / totalSupply);
}
