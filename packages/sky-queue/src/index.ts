export interface QueueJob<T> {
  id: string;
  payload: T;
  availableAt: string;
  attempts: number;
  maxAttempts: number;
}

export interface EnqueueInput<T> {
  id: string;
  payload: T;
  availableAt: string;
  maxAttempts?: number;
}

const ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;

function parseTime(value: string, field: string): number {
  const ms = Date.parse(value);
  if (!Number.isFinite(ms)) throw new Error(`invalid ${field}`);
  return ms;
}

export class InMemoryQueue<T> {
  private readonly jobs = new Map<string, QueueJob<T>>();
  private readonly claimed = new Set<string>();

  enqueue(input: EnqueueInput<T>): QueueJob<T> {
    if (!ID.test(input.id)) throw new Error("invalid job id");
    parseTime(input.availableAt, "availableAt");
    const maxAttempts = input.maxAttempts ?? 3;
    if (
      !Number.isSafeInteger(maxAttempts) ||
      maxAttempts < 1 ||
      maxAttempts > 100
    ) {
      throw new Error("invalid maxAttempts");
    }
    if (this.jobs.has(input.id)) throw new Error("duplicate job id");
    const job: QueueJob<T> = { ...input, attempts: 0, maxAttempts };
    this.jobs.set(job.id, job);
    return { ...job };
  }

  claim(now: string): QueueJob<T> | undefined {
    const nowMs = parseTime(now, "now");
    const eligible = [...this.jobs.values()]
      .filter(
        job =>
          !this.claimed.has(job.id) &&
          job.attempts < job.maxAttempts &&
          parseTime(job.availableAt, "availableAt") <= nowMs
      )
      .sort(
        (a, b) =>
          parseTime(a.availableAt, "availableAt") -
            parseTime(b.availableAt, "availableAt") || a.id.localeCompare(b.id)
      );
    const job = eligible[0];
    if (!job) return undefined;
    job.attempts += 1;
    this.claimed.add(job.id);
    return { ...job };
  }

  complete(id: string): boolean {
    if (!ID.test(id)) throw new Error("invalid job id");
    this.claimed.delete(id);
    return this.jobs.delete(id);
  }

  retry(id: string, availableAt: string): QueueJob<T> {
    if (!ID.test(id)) throw new Error("invalid job id");
    parseTime(availableAt, "availableAt");
    const job = this.jobs.get(id);
    if (!job) throw new Error("job not found");
    if (!this.claimed.has(id)) throw new Error("job is not claimed");
    if (job.attempts >= job.maxAttempts) {
      throw new Error("max attempts reached");
    }
    job.availableAt = availableAt;
    this.claimed.delete(id);
    return { ...job };
  }

  size(): number {
    return this.jobs.size;
  }
}
