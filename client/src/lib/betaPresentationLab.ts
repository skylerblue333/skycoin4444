export type CalendarCell = {
  key: string;
  day: number | null;
  isoDate: string | null;
};

export function buildMonthCells(year: number, monthIndex: number): CalendarCell[] {
  if (!Number.isInteger(year) || year < 1970 || year > 2100) {
    throw new Error("year must be between 1970 and 2100");
  }
  if (!Number.isInteger(monthIndex) || monthIndex < 0 || monthIndex > 11) {
    throw new Error("monthIndex must be between 0 and 11");
  }
  const first = new Date(Date.UTC(year, monthIndex, 1));
  const days = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
  const leading = first.getUTCDay();
  const cells: CalendarCell[] = [];
  for (let index = 0; index < leading; index += 1) {
    cells.push({ key: `leading-${index}`, day: null, isoDate: null });
  }
  for (let day = 1; day <= days; day += 1) {
    const isoDate = new Date(Date.UTC(year, monthIndex, day))
      .toISOString()
      .slice(0, 10);
    cells.push({ key: isoDate, day, isoDate });
  }
  while (cells.length % 7 !== 0) {
    cells.push({ key: `trailing-${cells.length}`, day: null, isoDate: null });
  }
  return cells;
}

export type CodeToken = {
  kind: "keyword" | "string" | "number" | "comment" | "plain";
  text: string;
};

const KEYWORDS = new Set([
  "const",
  "let",
  "function",
  "return",
  "if",
  "else",
  "for",
  "while",
  "type",
  "interface",
  "export",
  "import",
  "from",
  "async",
  "await",
]);

export function tokenizeCodeLine(line: string): CodeToken[] {
  const pattern = /(\/\/.*$|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\b\d+(?:\.\d+)?\b|\b[A-Za-z_$][\w$]*\b)/g;
  const tokens: CodeToken[] = [];
  let cursor = 0;
  for (const match of line.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > cursor) tokens.push({ kind: "plain", text: line.slice(cursor, index) });
    const text = match[0];
    let kind: CodeToken["kind"] = "plain";
    if (text.startsWith("//")) kind = "comment";
    else if (text.startsWith('"') || text.startsWith("'")) kind = "string";
    else if (/^\d/.test(text)) kind = "number";
    else if (KEYWORDS.has(text)) kind = "keyword";
    tokens.push({ kind, text });
    cursor = index + text.length;
  }
  if (cursor < line.length) tokens.push({ kind: "plain", text: line.slice(cursor) });
  return tokens;
}

export type GridRow = {
  id: string;
  name: string;
  category: string;
  score: number;
};

export function filterAndSortRows(
  rows: GridRow[],
  query: string,
  sortBy: "name" | "category" | "score",
  direction: "asc" | "desc"
): GridRow[] {
  const needle = query.trim().toLowerCase();
  const filtered = rows.filter(row =>
    !needle ||
    row.name.toLowerCase().includes(needle) ||
    row.category.toLowerCase().includes(needle) ||
    String(row.score).includes(needle)
  );
  const factor = direction === "asc" ? 1 : -1;
  return [...filtered].sort((a, b) => {
    const left = a[sortBy];
    const right = b[sortBy];
    if (typeof left === "number" && typeof right === "number") return (left - right) * factor;
    return String(left).localeCompare(String(right)) * factor;
  });
}

export function clampProgress(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, Math.round(value)));
}

export function getPageWindow<T>(items: T[], page: number, pageSize: number) {
  const safeSize = Math.max(1, Math.floor(pageSize));
  const pageCount = Math.max(1, Math.ceil(items.length / safeSize));
  const safePage = Math.min(pageCount, Math.max(1, Math.floor(page)));
  const start = (safePage - 1) * safeSize;
  return {
    page: safePage,
    pageCount,
    items: items.slice(start, start + safeSize),
  };
}

export type BreadcrumbItem = {
  label: string;
  path: string;
};

export function buildBreadcrumbs(path: string): BreadcrumbItem[] {
  const segments = path.split("/").filter(Boolean);
  const items: BreadcrumbItem[] = [{ label: "Home", path: "/" }];
  let current = "";
  for (const segment of segments) {
    current += `/${segment}`;
    const label = decodeURIComponent(segment)
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, character => character.toUpperCase());
    items.push({ label, path: current });
  }
  return items;
}
