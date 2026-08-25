import { describe, expect, it } from "vitest";
import { accountTotals, validateJournalEntry } from "./index";

describe("SkyAccounting", () => {
  const entry = { id: "j1", memo: "sale", occurredAt: "2026-08-25T12:00:00Z", lines: [{ account: "cash", debit: 10 }, { account: "revenue", credit: 10 }] };
  it("accepts balanced entries", () => expect(validateJournalEntry(entry).lines).toHaveLength(2));
  it("computes deterministic account totals", () => expect(accountTotals([entry])).toEqual({ cash: 10, revenue: -10 }));
  it("rejects unbalanced entries", () => expect(() => validateJournalEntry({ ...entry, lines: [{ account: "cash", debit: 10 }, { account: "revenue", credit: 9 }] })).toThrow("not balanced"));
});
