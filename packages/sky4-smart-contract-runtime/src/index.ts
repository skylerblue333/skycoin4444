import { createHash } from 'node:crypto';

export type ContractProgram = Readonly<{
  contractId: string;
  version: number;
  operations: readonly ContractOperation[];
}>;

export type ContractOperation = Readonly<
  | { op: 'set'; key: string; value: string }
  | { op: 'increment'; key: string; delta: bigint }
  | { op: 'assert-eq'; key: string; value: string }
>;

export type ContractResult = Readonly<{
  state: ReadonlyMap<string, string>;
  gasUsed: bigint;
  receiptHash: string;
}>;

const ID_RE = /^[a-zA-Z0-9:_-]{3,128}$/;
const KEY_RE = /^[a-zA-Z0-9:._-]{1,128}$/;

function validateOperation(operation: ContractOperation): void {
  if (!KEY_RE.test(operation.key)) throw new Error('contract key must be 1-128 safe characters');
  if (operation.op === 'set' || operation.op === 'assert-eq') {
    if (operation.value.length > 4096) throw new Error('contract value limit exceeded');
  } else if (operation.delta < -1_000_000_000n || operation.delta > 1_000_000_000n) {
    throw new Error('increment delta limit exceeded');
  }
}

export function executeContract(input: {
  program: ContractProgram;
  state?: ReadonlyMap<string, string>;
  gasLimit: bigint;
}): ContractResult {
  if (!ID_RE.test(input.program.contractId)) throw new Error('invalid contractId');
  if (!Number.isInteger(input.program.version) || input.program.version < 1) throw new Error('version must be a positive integer');
  if (input.program.operations.length > 10_000) throw new Error('operation limit exceeded');
  if (input.gasLimit <= 0n) throw new Error('gasLimit must be positive');

  const state = new Map(input.state ?? []);
  let gasUsed = 0n;
  const transcript: string[] = [input.program.contractId, String(input.program.version)];

  for (const operation of input.program.operations) {
    validateOperation(operation);
    const gas = operation.op === 'assert-eq' ? 1n : 2n;
    gasUsed += gas;
    if (gasUsed > input.gasLimit) throw new Error('gas limit exceeded');

    if (operation.op === 'set') {
      state.set(operation.key, operation.value);
      transcript.push(`set:${operation.key}:${operation.value}`);
    } else if (operation.op === 'increment') {
      const current = BigInt(state.get(operation.key) ?? '0');
      const next = current + operation.delta;
      state.set(operation.key, next.toString());
      transcript.push(`increment:${operation.key}:${operation.delta}`);
    } else {
      if ((state.get(operation.key) ?? '') !== operation.value) throw new Error(`assertion failed for ${operation.key}`);
      transcript.push(`assert-eq:${operation.key}:${operation.value}`);
    }
  }

  transcript.push(`gas:${gasUsed}`);
  const receiptHash = createHash('sha256').update(transcript.join('\n'), 'utf8').digest('hex');
  return Object.freeze({ state, gasUsed, receiptHash });
}
