export type DemoRecord = {
  id: string;
  label: string;
  group: string;
  detail: string;
};

export function filterDemoRecords(
  records: DemoRecord[],
  query: string
): DemoRecord[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return [...records];
  return records.filter(record =>
    [record.label, record.group, record.detail].some(value =>
      value.toLowerCase().includes(needle)
    )
  );
}

export function toggleUnique(values: string[], value: string): string[] {
  return values.includes(value)
    ? values.filter(item => item !== value)
    : [...values, value];
}

export function normalizeSingleChoice(
  value: string,
  allowed: readonly string[],
  fallback: string
): string {
  return allowed.includes(value) ? value : fallback;
}

export function countSelected(values: string[], allowed: readonly string[]): number {
  const allowedSet = new Set(allowed);
  return new Set(values.filter(value => allowedSet.has(value))).size;
}

export function sortDemoRecords(
  records: DemoRecord[],
  field: "label" | "group",
  direction: "asc" | "desc"
): DemoRecord[] {
  const factor = direction === "asc" ? 1 : -1;
  return [...records].sort(
    (left, right) => left[field].localeCompare(right[field]) * factor
  );
}
