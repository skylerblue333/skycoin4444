export type SkyEvent = {
  id: string;
  type: string;
  actorId?: string;
  subjectId?: string;
  occurredAt: string;
  payload?: Record<string, unknown>;
};

export type EventFilter = {
  type?: string;
  actorId?: string;
  subjectId?: string;
  since?: string;
  until?: string;
};

const MAX_ID = 200;
const MAX_TYPE = 160;
const EXPLICIT_ZONE = /(Z|[+-]\d{2}:\d{2})$/i;

function clean(value: string, field: string, max: number): string {
  const result = value.trim();
  if (!result) throw new Error(`${field} is required`);
  if (result.length > max) throw new Error(`${field} exceeds ${max} characters`);
  return result;
}

function parseInstant(value: string, field: string): string {
  const normalized = value.trim();
  if (!EXPLICIT_ZONE.test(normalized)) {
    throw new Error(`${field} must include Z or an explicit UTC offset`);
  }
  const ms = Date.parse(normalized);
  if (!Number.isFinite(ms)) throw new Error(`${field} must be an ISO-8601 instant`);
  return new Date(ms).toISOString();
}

function compareCodePoints(left: string, right: string): number {
  if (left === right) return 0;
  return left < right ? -1 : 1;
}

export function normalizeEvent(input: SkyEvent): SkyEvent {
  const id = clean(input.id, "event id", MAX_ID);
  const type = clean(input.type, "event type", MAX_TYPE);
  const occurredAt = parseInstant(input.occurredAt, "occurredAt");
  const actorId = input.actorId?.trim();
  const subjectId = input.subjectId?.trim();

  return {
    id,
    type,
    occurredAt,
    ...(actorId ? { actorId: clean(actorId, "actorId", MAX_ID) } : {}),
    ...(subjectId ? { subjectId: clean(subjectId, "subjectId", MAX_ID) } : {}),
    ...(input.payload ? { payload: { ...input.payload } } : {}),
  };
}

export function eventMatches(event: SkyEvent, filter: EventFilter): boolean {
  const item = normalizeEvent(event);
  if (filter.type?.trim() && item.type !== filter.type.trim()) return false;
  if (filter.actorId?.trim() && item.actorId !== filter.actorId.trim()) return false;
  if (filter.subjectId?.trim() && item.subjectId !== filter.subjectId.trim()) return false;

  const occurred = Date.parse(item.occurredAt);
  if (filter.since && occurred < Date.parse(parseInstant(filter.since, "since"))) return false;
  if (filter.until && occurred > Date.parse(parseInstant(filter.until, "until"))) return false;
  return true;
}

export function selectEvents(events: SkyEvent[], filter: EventFilter = {}): SkyEvent[] {
  return events
    .filter((event) => eventMatches(event, filter))
    .map(normalizeEvent)
    .sort((a, b) => compareCodePoints(a.occurredAt, b.occurredAt) || compareCodePoints(a.id, b.id));
}

export function createEventPublishedContract(event: SkyEvent) {
  const normalized = normalizeEvent(event);
  return {
    type: "sky.events.published.v1" as const,
    event: normalized,
  };
}
