export type ArithmeticOperator = "add" | "subtract" | "multiply" | "divide";

export function calculateArithmetic(
  left: number,
  right: number,
  operator: ArithmeticOperator
) {
  if (!Number.isFinite(left) || !Number.isFinite(right)) {
    throw new Error("Enter two finite numbers.");
  }
  if (operator === "divide" && right === 0) {
    throw new Error("Cannot divide by zero.");
  }
  const result =
    operator === "add"
      ? left + right
      : operator === "subtract"
        ? left - right
        : operator === "multiply"
          ? left * right
          : left / right;
  return Number(result.toFixed(12));
}

export type LocalCalendarEvent = {
  id: string;
  title: string;
  date: string;
  notes: string;
  completed: boolean;
};

export function validateCalendarEvent(input: {
  title: string;
  date: string;
  notes?: string;
}) {
  const errors: string[] = [];
  if (input.title.trim().length < 2) errors.push("Title must be at least 2 characters.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date)) errors.push("Choose a valid date.");
  if ((input.notes ?? "").trim().length > 500) errors.push("Notes must be 500 characters or fewer.");
  return errors;
}

export function normalizeCalendarEvents(value: unknown): LocalCalendarEvent[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(
      item =>
        item &&
        typeof item === "object" &&
        typeof item.id === "string" &&
        typeof item.title === "string" &&
        typeof item.date === "string" &&
        typeof item.notes === "string" &&
        typeof item.completed === "boolean"
    )
    .map(item => item as LocalCalendarEvent)
    .slice(0, 200);
}

export type TextConversionMode =
  | "json-pretty"
  | "json-minify"
  | "csv-to-tsv"
  | "tsv-to-csv"
  | "uppercase"
  | "lowercase";

export function convertText(input: string, mode: TextConversionMode) {
  if (mode === "json-pretty") {
    return JSON.stringify(JSON.parse(input), null, 2);
  }
  if (mode === "json-minify") {
    return JSON.stringify(JSON.parse(input));
  }
  if (mode === "csv-to-tsv") {
    return input
      .split(/\r?\n/)
      .map(line => line.split(",").join("\t"))
      .join("\n");
  }
  if (mode === "tsv-to-csv") {
    return input
      .split(/\r?\n/)
      .map(line => line.split("\t").join(","))
      .join("\n");
  }
  if (mode === "uppercase") return input.toUpperCase();
  return input.toLowerCase();
}

export function countWords(value: string) {
  const normalized = value.trim();
  return normalized ? normalized.split(/\s+/).length : 0;
}

export type AccessibilityPreview = {
  textScale: 100 | 110 | 125 | 150;
  highContrast: boolean;
  reducedMotion: boolean;
  underlineLinks: boolean;
};

export const defaultAccessibilityPreview: AccessibilityPreview = {
  textScale: 100,
  highContrast: false,
  reducedMotion: false,
  underlineLinks: false,
};

export function normalizeAccessibilityPreview(value: unknown): AccessibilityPreview {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return defaultAccessibilityPreview;
  }
  const input = value as Partial<AccessibilityPreview>;
  const scale = [100, 110, 125, 150].includes(Number(input.textScale))
    ? (Number(input.textScale) as AccessibilityPreview["textScale"])
    : 100;
  return {
    textScale: scale,
    highContrast: input.highContrast === true,
    reducedMotion: input.reducedMotion === true,
    underlineLinks: input.underlineLinks === true,
  };
}

export type FloorTable = {
  id: string;
  x: number;
  y: number;
  label: string;
  seats: number;
  color: string;
};

export function nextFloorTablePosition(index: number) {
  const column = index % 3;
  const row = Math.floor(index / 3) % 3;
  return { x: 70 + column * 150, y: 90 + row * 120 };
}

export function normalizeFloorTables(value: unknown): FloorTable[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(
      item =>
        item &&
        typeof item === "object" &&
        typeof item.id === "string" &&
        typeof item.label === "string" &&
        Number.isFinite(item.x) &&
        Number.isFinite(item.y) &&
        Number.isFinite(item.seats) &&
        typeof item.color === "string"
    )
    .map(item => ({
      ...(item as FloorTable),
      x: Math.max(0, Math.min(720, Math.round(Number(item.x)))),
      y: Math.max(0, Math.min(420, Math.round(Number(item.y)))),
      seats: Math.max(1, Math.min(20, Math.round(Number(item.seats)))),
    }))
    .slice(0, 40);
}

export type SearchableBetaRoute = {
  route: string;
  capability: string;
  persistence: string;
  boundary: string;
};

export function searchBetaRoutes(
  routes: readonly SearchableBetaRoute[],
  query: string
) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [...routes];
  return routes.filter(route =>
    [route.route, route.capability, route.persistence, route.boundary]
      .join(" ")
      .toLowerCase()
      .includes(normalized)
  );
}
