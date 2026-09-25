/**
 * Ported from skylerblue333/skycoin-analytics at
 * 170b5f197a618880d36160c2947de147511413da (MIT).
 */
export type AnalyticsEvent = {
  name: string;
  value?: number;
  timestamp?: string;
  dimensions?: Record<string, string>;
};

export type MetricSummary = {
  name: string;
  count: number;
  sum: number;
  min: number | null;
  max: number | null;
  average: number | null;
};

export type DimensionSummary = {
  dimension: string;
  values: Array<{ value: string; count: number }>;
};

const MAX_EVENTS = 100_000;
const MAX_NAME_LENGTH = 128;
const MAX_DIMENSIONS = 16;
const MAX_DIMENSION_LENGTH = 128;

export class AnalyticsAggregator {
  private readonly events: AnalyticsEvent[] = [];

  ingest(event: AnalyticsEvent): void {
    if (this.events.length >= MAX_EVENTS) {
      throw new RangeError(`event limit of ${MAX_EVENTS} reached`);
    }
    this.events.push(normalizeEvent(event));
  }

  ingestBatch(events: AnalyticsEvent[]): void {
    if (!Array.isArray(events)) throw new TypeError("events must be an array");
    if (this.events.length + events.length > MAX_EVENTS) {
      throw new RangeError(`event limit of ${MAX_EVENTS} reached`);
    }
    this.events.push(...events.map(normalizeEvent));
  }

  count(name?: string): number {
    if (name === undefined) return this.events.length;
    validateName(name);
    return this.events.filter((event) => event.name === name).length;
  }

  metric(name: string): MetricSummary {
    validateName(name);
    const values = this.events
      .filter((event) => event.name === name && event.value !== undefined)
      .map((event) => event.value as number);

    const sum = values.reduce((total, value) => total + value, 0);
    return {
      name,
      count: values.length,
      sum,
      min: values.length === 0 ? null : Math.min(...values),
      max: values.length === 0 ? null : Math.max(...values),
      average: values.length === 0 ? null : sum / values.length,
    };
  }

  dimension(name: string, dimension: string): DimensionSummary {
    validateName(name);
    validateDimensionKey(dimension);
    const counts = new Map<string, number>();
    for (const event of this.events) {
      if (event.name !== name) continue;
      const value = event.dimensions?.[dimension];
      if (value === undefined) continue;
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
    return {
      dimension,
      values: [...counts.entries()]
        .map(([value, count]) => ({ value, count }))
        .sort(
          (left, right) =>
            right.count - left.count || left.value.localeCompare(right.value),
        ),
    };
  }

  snapshot(): AnalyticsEvent[] {
    return this.events.map((event) => ({
      ...event,
      dimensions: event.dimensions ? { ...event.dimensions } : undefined,
    }));
  }

  reset(): void {
    this.events.length = 0;
  }
}

function normalizeEvent(event: AnalyticsEvent): AnalyticsEvent {
  if (typeof event !== "object" || event === null) {
    throw new TypeError("event must be an object");
  }
  validateName(event.name);
  if (event.value !== undefined && !Number.isFinite(event.value)) {
    throw new TypeError("event value must be a finite number");
  }

  const timestamp = event.timestamp ?? new Date().toISOString();
  if (Number.isNaN(Date.parse(timestamp))) {
    throw new TypeError("timestamp must be an ISO-compatible date string");
  }

  const dimensions = normalizeDimensions(event.dimensions);
  return {
    name: event.name,
    value: event.value,
    timestamp,
    dimensions,
  };
}

function validateName(name: string): void {
  if (
    typeof name !== "string" ||
    name.length === 0 ||
    name.length > MAX_NAME_LENGTH
  ) {
    throw new TypeError(
      `event name must be 1-${MAX_NAME_LENGTH} characters`,
    );
  }
}

function validateDimensionKey(key: string): void {
  if (
    typeof key !== "string" ||
    key.length === 0 ||
    key.length > MAX_NAME_LENGTH
  ) {
    throw new TypeError(
      `dimension key must be 1-${MAX_NAME_LENGTH} characters`,
    );
  }
}

function normalizeDimensions(
  dimensions: Record<string, string> | undefined,
): Record<string, string> | undefined {
  if (dimensions === undefined) return undefined;
  if (
    typeof dimensions !== "object" ||
    dimensions === null ||
    Array.isArray(dimensions)
  ) {
    throw new TypeError("dimensions must be an object");
  }
  const entries = Object.entries(dimensions);
  if (entries.length > MAX_DIMENSIONS) {
    throw new RangeError(`at most ${MAX_DIMENSIONS} dimensions are allowed`);
  }

  const normalized: Record<string, string> = {};
  for (const [key, value] of entries) {
    validateDimensionKey(key);
    if (
      typeof value !== "string" ||
      value.length === 0 ||
      value.length > MAX_DIMENSION_LENGTH
    ) {
      throw new TypeError(
        `dimension values must be 1-${MAX_DIMENSION_LENGTH} characters`,
      );
    }
    normalized[key] = value;
  }
  return normalized;
}
