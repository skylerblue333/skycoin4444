type ErrorRecord = Readonly<{
  code?: unknown;
  errno?: unknown;
  message?: unknown;
  cause?: unknown;
}>;

function asErrorRecord(error: unknown): ErrorRecord | null {
  return error && typeof error === "object" ? (error as ErrorRecord) : null;
}

function errorChain(error: unknown): readonly ErrorRecord[] {
  const seen = new Set<object>();
  const chain: ErrorRecord[] = [];
  let current: unknown = error;

  while (current && typeof current === "object") {
    if (seen.has(current)) break;
    seen.add(current);

    const record = asErrorRecord(current);
    if (!record) break;
    chain.push(record);
    current = record.cause;
  }

  return chain;
}

export function isMysqlDuplicateEntry(error: unknown): boolean {
  return errorChain(error).some(record => {
    if (record.code === "ER_DUP_ENTRY" || record.errno === 1062) return true;
    return (
      typeof record.message === "string" &&
      /duplicate entry/i.test(record.message)
    );
  });
}

export function isMysqlDuplicateEntryFor(
  error: unknown,
  constraintName: string
): boolean {
  if (!constraintName.trim() || !isMysqlDuplicateEntry(error)) return false;

  return errorChain(error).some(
    record =>
      typeof record.message === "string" &&
      record.message.includes(constraintName)
  );
}
