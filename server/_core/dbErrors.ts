type ErrorRecord = Readonly<{
  code?: unknown;
  errno?: unknown;
  message?: unknown;
  cause?: unknown;
}>;

function asErrorRecord(error: unknown): ErrorRecord | null {
  return error && typeof error === "object" ? (error as ErrorRecord) : null;
}

export function isMysqlDuplicateEntry(error: unknown): boolean {
  const seen = new Set<object>();
  let current: unknown = error;

  while (current && typeof current === "object") {
    if (seen.has(current)) return false;
    seen.add(current);

    const record = asErrorRecord(current);
    if (!record) return false;

    if (record.code === "ER_DUP_ENTRY" || record.errno === 1062) return true;

    if (
      typeof record.message === "string" &&
      /duplicate entry/i.test(record.message)
    ) {
      return true;
    }

    current = record.cause;
  }

  return false;
}
