export type TextTransform =
  | "uppercase"
  | "lowercase"
  | "title-case"
  | "trim-lines"
  | "sort-lines"
  | "dedupe-lines";

export function countText(value: string) {
  const trimmed = value.trim();
  return {
    characters: value.length,
    charactersNoSpaces: value.replace(/\s/g, "").length,
    words: trimmed ? trimmed.split(/\s+/).length : 0,
    lines: value ? value.split(/\r?\n/).length : 0,
  };
}

export function transformText(value: string, mode: TextTransform): string {
  if (mode === "uppercase") return value.toUpperCase();
  if (mode === "lowercase") return value.toLowerCase();
  if (mode === "title-case") {
    return value.replace(/\b\p{L}[\p{L}\p{N}'’-]*/gu, word =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );
  }
  const lines = value.split(/\r?\n/);
  if (mode === "trim-lines") {
    return lines.map(line => line.trim()).join("\n");
  }
  if (mode === "sort-lines") {
    return [...lines].sort((a, b) => a.localeCompare(b)).join("\n");
  }
  if (mode === "dedupe-lines") {
    return [...new Set(lines)].join("\n");
  }
  return value;
}

export function normalizeDateOnly(value: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return value;
}

export function compareDateOnly(a: string, b: string): number {
  const left = normalizeDateOnly(a);
  const right = normalizeDateOnly(b);
  if (!left || !right) throw new Error("invalid date");
  return left.localeCompare(right);
}

export function dateDistanceDays(a: string, b: string): number {
  const left = normalizeDateOnly(a);
  const right = normalizeDateOnly(b);
  if (!left || !right) throw new Error("invalid date");
  const [ay, am, ad] = left.split("-").map(Number);
  const [by, bm, bd] = right.split("-").map(Number);
  return Math.round(
    (Date.UTC(by, bm - 1, bd) - Date.UTC(ay, am - 1, ad)) / 86_400_000
  );
}

export type MonthCell = {
  date: string;
  day: number;
  inMonth: boolean;
};

function pad2(value: number) {
  return String(value).padStart(2, "0");
}

export function buildMonthGrid(year: number, monthIndex: number): MonthCell[] {
  if (!Number.isInteger(year) || year < 1900 || year > 2100) {
    throw new Error("year out of range");
  }
  if (!Number.isInteger(monthIndex) || monthIndex < 0 || monthIndex > 11) {
    throw new Error("month out of range");
  }

  const first = new Date(Date.UTC(year, monthIndex, 1));
  const startOffset = first.getUTCDay();
  const gridStart = new Date(Date.UTC(year, monthIndex, 1 - startOffset));
  const cells: MonthCell[] = [];

  for (let index = 0; index < 42; index += 1) {
    const date = new Date(gridStart.getTime() + index * 86_400_000);
    const cellYear = date.getUTCFullYear();
    const cellMonth = date.getUTCMonth();
    const day = date.getUTCDate();
    cells.push({
      date: `${cellYear}-${pad2(cellMonth + 1)}-${pad2(day)}`,
      day,
      inMonth: cellMonth === monthIndex,
    });
  }

  return cells;
}

export type PasswordAnalysis = {
  score: 0 | 1 | 2 | 3 | 4;
  label: "empty" | "weak" | "fair" | "good" | "strong";
  checks: {
    length: boolean;
    upper: boolean;
    lower: boolean;
    number: boolean;
    symbol: boolean;
  };
};

export function analyzePassword(value: string): PasswordAnalysis {
  const checks = {
    length: value.length >= 12,
    upper: /[A-Z]/.test(value),
    lower: /[a-z]/.test(value),
    number: /\d/.test(value),
    symbol: /[^A-Za-z0-9]/.test(value),
  };
  if (!value) return { score: 0, label: "empty", checks };

  const passed = Object.values(checks).filter(Boolean).length;
  const score = Math.min(4, Math.max(1, passed - (value.length < 8 ? 1 : 0))) as
    | 1
    | 2
    | 3
    | 4;
  const label =
    score === 1 ? "weak" : score === 2 ? "fair" : score === 3 ? "good" : "strong";
  return { score, label, checks };
}

export function clampMenuPosition(
  x: number,
  y: number,
  viewportWidth: number,
  viewportHeight: number,
  menuWidth = 220,
  menuHeight = 180
) {
  return {
    x: Math.max(8, Math.min(x, Math.max(8, viewportWidth - menuWidth - 8))),
    y: Math.max(8, Math.min(y, Math.max(8, viewportHeight - menuHeight - 8))),
  };
}
