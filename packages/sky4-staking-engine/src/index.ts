export type StakePosition = Readonly<{
  ownerId: string;
  principal: bigint;
  rewardBpsPerEpoch: number;
  lockedUntilEpoch: bigint;
  lastClaimedEpoch: bigint;
}>;

const OWNER_RE = /^[a-zA-Z0-9:_-]{3,128}$/;

export function validateStake(position: StakePosition): void {
  if (!OWNER_RE.test(position.ownerId)) throw new Error('invalid owner id');
  if (position.principal <= 0n) throw new Error('principal must be positive');
  if (!Number.isInteger(position.rewardBpsPerEpoch) || position.rewardBpsPerEpoch < 0 || position.rewardBpsPerEpoch > 5000) {
    throw new Error('rewardBpsPerEpoch must be 0-5000');
  }
  if (position.lockedUntilEpoch < 0n || position.lastClaimedEpoch < 0n) throw new Error('epochs must be non-negative');
}

export function accruedReward(position: StakePosition, currentEpoch: bigint): bigint {
  validateStake(position);
  if (currentEpoch < position.lastClaimedEpoch) throw new Error('currentEpoch precedes last claimed epoch');
  const epochs = currentEpoch - position.lastClaimedEpoch;
  return (position.principal * BigInt(position.rewardBpsPerEpoch) * epochs) / 10_000n;
}

export function claimReward(position: StakePosition, currentEpoch: bigint): Readonly<{ reward: bigint; position: StakePosition }> {
  const reward = accruedReward(position, currentEpoch);
  return Object.freeze({
    reward,
    position: Object.freeze({ ...position, lastClaimedEpoch: currentEpoch }),
  });
}

export function canUnstake(position: StakePosition, currentEpoch: bigint): boolean {
  validateStake(position);
  if (currentEpoch < 0n) throw new Error('currentEpoch must be non-negative');
  return currentEpoch >= position.lockedUntilEpoch;
}
