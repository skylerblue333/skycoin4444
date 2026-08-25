export interface JournalLine { account: string; debit?: number; credit?: number; }
export interface JournalEntry { id: string; memo: string; occurredAt: string; lines: JournalLine[]; }

function money(value: number | undefined): number { return Math.round((value ?? 0) * 100) / 100; }
export function validateJournalEntry(entry: JournalEntry): JournalEntry {
  if (!entry.id.trim() || !entry.memo.trim()) throw new Error("id and memo are required");
  if (Number.isNaN(new Date(entry.occurredAt).getTime())) throw new Error("occurredAt must be valid");
  if (entry.lines.length < 2) throw new Error("at least two journal lines are required");
  let debits = 0; let credits = 0;
  const lines = entry.lines.map((line) => {
    if (!line.account.trim()) throw new Error("account is required");
    const debit = money(line.debit); const credit = money(line.credit);
    if (debit < 0 || credit < 0 || (debit > 0 && credit > 0)) throw new Error("each line must contain one non-negative side");
    debits += debit; credits += credit;
    return { account: line.account.trim(), debit, credit };
  });
  if (Math.round(debits * 100) !== Math.round(credits * 100)) throw new Error("journal entry is not balanced");
  return { ...entry, id: entry.id.trim(), memo: entry.memo.trim(), occurredAt: new Date(entry.occurredAt).toISOString(), lines };
}
export function accountTotals(entries: JournalEntry[]): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const entry of entries.map(validateJournalEntry)) for (const line of entry.lines) totals[line.account] = money((totals[line.account] ?? 0) + (line.debit ?? 0) - (line.credit ?? 0));
  return totals;
}
