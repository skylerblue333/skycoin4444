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
const INTEGER_RE = /^-?\d{1,78}$/;
const MAX_VALUE_LENGTH = 4096;
const MAX_STATE_ENTRIES = 10_000;
const MAX_OPERATIONS = 10_000;

function validateValue(value: unknown): asserts value is string {
  if (typeof value !== 'string') throw new Error('contract value must be a string');
  if (value.length > MAX_VALUE_LENGTH) throw new Error('contract value limit exceeded');
}

function validateOperation(operation: ContractOperation): void {
  if (!operation || typeof operation !== 'object') throw new Error('invalid contract operation');
  if (typeof operation.key !== 'string' || !KEY_RE.test(operation.key)) {
    throw new Error('contract key must be 1-128 safe characters');
  }

  if (operation.op === 'set' || operation.op === 'assert-eq') {
    validateValue(operation.value);
    return;
  }
  if (operation.op === 'increment') {
    if (typeof operation.delta !== 'bigint') throw new Error('increment delta must be a bigint');
    if (operation.delta < -1_000_000_000n || operation.delta > 1_000_000_000n) {
      throw new Error('increment delta limit exceeded');
    }
    return;
  }
  throw new Error('unsupported contract operation');
}

function validateInitialState(state: ReadonlyMap<string, string>): void {
  if (state.size > MAX_STATE_ENTRIES) throw new Error('state entry limit exceeded');
  for (const [key, value] of state) {
    if (typeof key !== 'string' || !KEY_RE.test(key)) {
      throw new Error('contract key must be 1-128 safe characters');
    }
    validateValue(value);
  }
}

function compareText(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function executeContract(input: {
  program: ContractProgram;
  state?: ReadonlyMap<string, string>;
  gasLimit: bigint;
}): ContractResult {
  if (!ID_RE.test(input.program.contractId)) throw new Error('invalid contractId');
  if (!Number.isSafeInteger(input.program.version) || input.program.version < 1) {
    throw new Error('version must be a positive safe integer');
  }
  if (input.program.operations.length > MAX_OPERATIONS) throw new Error('operation limit exceeded');
  if (typeof input.gasLimit !== 'bigint' || input.gasLimit <= 0n) {
    throw new Error('gasLimit must be a positive bigint');
  }

  const initialState = input.state ?? new Map<string, string>();
  validateInitialState(initialState);
  const state = new Map(initialState);
  let gasUsed = 0n;
  const operationLog: unknown[] = [];

  for (const operation of input.program.operations) {
    validateOperation(operation);
    const gas = operation.op === 'assert-eq' ? 1n : 2n;
    gasUsed += gas;
    if (gasUsed > input.gasLimit) throw new Error('gas limit exceeded');

    if (operation.op === 'set') {
      state.set(operation.key, operation.value);
      operationLog.push(['set', operation.key, operation.value]);
    } else if (operation.op === 'increment') {
      const currentText = state.get(operation.key) ?? '0';
      if (!INTEGER_RE.test(currentText)) throw new Error(`increment state is not a bounded integer for ${operation.key}`);
      const nextText = (BigInt(currentText) + operation.delta).toString();
      if (!INTEGER_RE.test(nextText)) throw new Error(`increment result exceeds integer bound for ${operation.key}`);
      state.set(operation.key, nextText);
      operationLog.push(['increment', operation.key, operation.delta.toString()]);
    } else {
      if ((state.get(operation.key) ?? '') !== operation.value) throw new Error(`assertion failed for ${operation.key}`);
      operationLog.push(['assert-eq', operation.key, operation.value]);
    }
  }

  const stateEntries = [...state.entries()].sort(([a], [b]) => compareText(a, b));
  const canonical = JSON.stringify({
    contractId: input.program.contractId,
    version: input.program.version,
    operations: operationLog,
    gasUsed: gasUsed.toString(),
    state: stateEntries,
  });
  const receiptHash = createHash('sha256').update(canonical, 'utf8').digest('hex');
  return Object.freeze({ state, gasUsed, receiptHash });
}
