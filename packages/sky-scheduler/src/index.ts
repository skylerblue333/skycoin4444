export type ScheduleStatus = "active" | "paused" | "completed";

export interface ScheduleRecord {
  id: string;
  taskName: string;
  startAt: number;
  intervalMs: number | null;
  maxRuns: number | null;
  runCount: number;
  status: ScheduleStatus;
}

export interface SchedulerDispatchContract {
  contract: "skyscheduler.dispatch.v1";
  scheduleId: string;
  taskName: string;
  dueAt: number;
}

const IDENTIFIER = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
const MAX_INTERVAL_MS = 365 * 24 * 60 * 60 * 1000;

export class SchedulerService {
  private readonly schedules = new Map<string, ScheduleRecord>();

  create(input: {
    id: string;
    taskName: string;
    startAt: number;
    intervalMs?: number | null;
    maxRuns?: number | null;
  }): ScheduleRecord {
    const id = validateIdentifier("scheduleId", input.id);
    const taskName = validateIdentifier("taskName", input.taskName);
    const startAt = validateTimestamp(input.startAt);
    const intervalMs = validateInterval(input.intervalMs ?? null);
    const maxRuns = validateMaxRuns(input.maxRuns ?? null);
    if (intervalMs === null && maxRuns !== null && maxRuns !== 1) {
      throw new Error("one_time_schedule_max_runs_must_be_one");
    }
    if (this.schedules.has(id)) throw new Error("schedule_exists");

    const record: ScheduleRecord = {
      id,
      taskName,
      startAt,
      intervalMs,
      maxRuns: intervalMs === null ? 1 : maxRuns,
      runCount: 0,
      status: "active",
    };
    this.schedules.set(id, { ...record });
    return { ...record };
  }

  get(id: string): ScheduleRecord | undefined {
    const record = this.schedules.get(validateIdentifier("scheduleId", id));
    return record ? { ...record } : undefined;
  }

  pause(id: string): ScheduleRecord {
    const record = this.require(id);
    if (record.status === "completed") throw new Error("schedule_completed");
    return this.save({ ...record, status: "paused" });
  }

  resume(id: string): ScheduleRecord {
    const record = this.require(id);
    if (record.status === "completed") throw new Error("schedule_completed");
    return this.save({ ...record, status: "active" });
  }

  nextDueAt(id: string): number | null {
    const record = this.require(id);
    if (record.status !== "active") return null;
    if (record.maxRuns !== null && record.runCount >= record.maxRuns)
      return null;
    if (record.runCount === 0) return record.startAt;
    if (record.intervalMs === null) return null;
    return safeAdd(
      record.startAt,
      safeMultiply(record.intervalMs, record.runCount)
    );
  }

  due(at: number, limit = 100): SchedulerDispatchContract[] {
    const timestamp = validateTimestamp(at);
    if (!Number.isSafeInteger(limit) || limit <= 0 || limit > 1000) {
      throw new Error("invalid_due_limit");
    }
    return [...this.schedules.values()]
      .map(record => ({ record, dueAt: this.nextDueAt(record.id) }))
      .filter(
        (candidate): candidate is { record: ScheduleRecord; dueAt: number } =>
          candidate.dueAt !== null && candidate.dueAt <= timestamp
      )
      .sort(
        (a, b) => a.dueAt - b.dueAt || a.record.id.localeCompare(b.record.id)
      )
      .slice(0, limit)
      .map(({ record, dueAt }) => ({
        contract: "skyscheduler.dispatch.v1",
        scheduleId: record.id,
        taskName: record.taskName,
        dueAt,
      }));
  }

  acknowledge(input: { scheduleId: string; dueAt: number }): ScheduleRecord {
    const record = this.require(input.scheduleId);
    if (record.status !== "active") throw new Error("schedule_not_active");
    const expectedDueAt = this.nextDueAt(record.id);
    if (
      expectedDueAt === null ||
      expectedDueAt !== validateTimestamp(input.dueAt)
    ) {
      throw new Error("stale_or_unknown_dispatch");
    }
    const runCount = record.runCount + 1;
    const completed =
      (record.maxRuns !== null && runCount >= record.maxRuns) ||
      record.intervalMs === null;
    return this.save({
      ...record,
      runCount,
      status: completed ? "completed" : "active",
    });
  }

  private require(id: string): ScheduleRecord {
    const record = this.get(id);
    if (!record) throw new Error("schedule_not_found");
    return record;
  }

  private save(record: ScheduleRecord): ScheduleRecord {
    this.schedules.set(record.id, { ...record });
    return { ...record };
  }
}

function validateIdentifier(name: string, value: string): string {
  if (typeof value !== "string" || !IDENTIFIER.test(value)) {
    throw new Error(`invalid_${name}`);
  }
  return value;
}

function validateTimestamp(value: number): number {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error("invalid_timestamp");
  }
  return value;
}

function validateInterval(value: number | null): number | null {
  if (value === null) return null;
  if (!Number.isSafeInteger(value) || value <= 0 || value > MAX_INTERVAL_MS) {
    throw new Error("invalid_interval");
  }
  return value;
}

function validateMaxRuns(value: number | null): number | null {
  if (value === null) return null;
  if (!Number.isSafeInteger(value) || value <= 0 || value > 1_000_000) {
    throw new Error("invalid_max_runs");
  }
  return value;
}

function safeMultiply(a: number, b: number): number {
  const value = a * b;
  if (!Number.isSafeInteger(value)) throw new Error("schedule_time_overflow");
  return value;
}

function safeAdd(a: number, b: number): number {
  const value = a + b;
  if (!Number.isSafeInteger(value)) throw new Error("schedule_time_overflow");
  return value;
}
