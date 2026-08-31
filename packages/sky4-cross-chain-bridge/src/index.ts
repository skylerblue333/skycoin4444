import { createHash } from 'node:crypto';

export type BridgeRoute = Readonly<{
  sourceChain: string;
  destinationChain: string;
  asset: string;
  minAmount: bigint;
  maxAmount: bigint;
  feeBps: number;
}>;

export type BridgePlan = Readonly<{
  route: BridgeRoute;
  sender: string;
  recipient: string;
  amount: bigint;
  fee: bigint;
  netAmount: bigint;
  planId: string;
}>;

const NAME_RE = /^[a-zA-Z0-9:_-]{2,64}$/;
const ADDRESS_RE = /^[a-zA-Z0-9:_-]{3,160}$/;

export function validateRoute(route: BridgeRoute): void {
  if (!NAME_RE.test(route.sourceChain) || !NAME_RE.test(route.destinationChain)) throw new Error('invalid chain identifier');
  if (route.sourceChain === route.destinationChain) throw new Error('source and destination chains must differ');
  if (!NAME_RE.test(route.asset)) throw new Error('invalid asset identifier');
  if (typeof route.minAmount !== 'bigint' || typeof route.maxAmount !== 'bigint') {
    throw new Error('route amounts must be bigint values');
  }
  if (route.minAmount <= 0n || route.maxAmount < route.minAmount) throw new Error('invalid route amount bounds');
  if (!Number.isInteger(route.feeBps) || route.feeBps < 0 || route.feeBps > 5000) throw new Error('feeBps must be 0-5000');
}

export function planBridgeTransfer(input: {
  route: BridgeRoute;
  sender: string;
  recipient: string;
  amount: bigint;
}): BridgePlan {
  validateRoute(input.route);
  if (!ADDRESS_RE.test(input.sender) || !ADDRESS_RE.test(input.recipient)) throw new Error('invalid bridge address');
  if (typeof input.amount !== 'bigint') throw new Error('amount must be a bigint');
  if (input.amount < input.route.minAmount || input.amount > input.route.maxAmount) throw new Error('amount outside route bounds');
  const fee = (input.amount * BigInt(input.route.feeBps)) / 10_000n;
  const netAmount = input.amount - fee;
  if (netAmount <= 0n) throw new Error('net amount must be positive');
  const canonical = [
    input.route.sourceChain,
    input.route.destinationChain,
    input.route.asset,
    input.sender,
    input.recipient,
    input.amount,
    input.route.feeBps,
  ].join('\n');
  const planId = createHash('sha256').update(canonical, 'utf8').digest('hex');
  return Object.freeze({ route: Object.freeze({ ...input.route }), sender: input.sender, recipient: input.recipient, amount: input.amount, fee, netAmount, planId });
}
