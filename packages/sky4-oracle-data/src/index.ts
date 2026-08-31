export type OracleObservation = Readonly<{
  sourceId: string;
  feedId: string;
  value: bigint;
  observedAt: number;
}>;

export type OracleAggregate = Readonly<{
  feedId: string;
  median: bigint;
  sources: number;
  newestObservationAt: number;
}>;

const ID_RE = /^[a-zA-Z0-9:_-]{2,128}$/;

export function aggregateMedian(input: {
  feedId: string;
  observations: readonly OracleObservation[];
  now: number;
  maxAgeMs: number;
  minSources: number;
}): OracleAggregate {
  if (!ID_RE.test(input.feedId)) throw new Error('invalid feedId');
  if (!Number.isSafeInteger(input.now) || input.now < 0) throw new Error('invalid now');
  if (!Number.isSafeInteger(input.maxAgeMs) || input.maxAgeMs < 0) throw new Error('invalid maxAgeMs');
  if (!Number.isInteger(input.minSources) || input.minSources < 1 || input.minSources > 1000) throw new Error('invalid minSources');
  if (input.observations.length > 10_000) throw new Error('observation limit exceeded');

  const bySource = new Map<string, OracleObservation>();
  for (const observation of input.observations) {
    if (!ID_RE.test(observation.sourceId) || observation.feedId !== input.feedId) throw new Error('invalid observation identity');
    if (!Number.isSafeInteger(observation.observedAt) || observation.observedAt < 0 || observation.observedAt > input.now) throw new Error('invalid observation time');
    if (input.now - observation.observedAt > input.maxAgeMs) continue;
    const previous = bySource.get(observation.sourceId);
    if (!previous || observation.observedAt > previous.observedAt) bySource.set(observation.sourceId, observation);
  }
  if (bySource.size < input.minSources) throw new Error('insufficient fresh oracle sources');
  const fresh = [...bySource.values()].sort((a, b) => a.value < b.value ? -1 : a.value > b.value ? 1 : a.sourceId.localeCompare(b.sourceId));
  const mid = Math.floor(fresh.length / 2);
  const median = fresh.length % 2 === 1 ? fresh[mid].value : (fresh[mid - 1].value + fresh[mid].value) / 2n;
  const newestObservationAt = Math.max(...fresh.map((item) => item.observedAt));
  return Object.freeze({ feedId: input.feedId, median, sources: fresh.length, newestObservationAt });
}
