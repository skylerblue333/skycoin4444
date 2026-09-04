import { createHash } from "node:crypto";

export type DependencyKind = "hard" | "soft";
export type CapabilitySignal =
  | "available"
  | "degraded"
  | "unavailable"
  | "disabled"
  | "unknown";
export type CapabilityState = CapabilitySignal | "blocked";
export type CapabilityCriticality = "critical" | "important" | "optional";

export type CapabilityDependency = Readonly<{
  id: string;
  kind: DependencyKind;
}>;

export type CapabilityDefinition = Readonly<{
  id: string;
  version: string;
  owner: string;
  description: string;
  criticality: CapabilityCriticality;
  dependencies?: readonly CapabilityDependency[];
  boundaries?: readonly string[];
}>;

export type CapabilityObservation = Readonly<{
  id: string;
  state: CapabilitySignal;
  reason?: string;
  observedAt?: string;
  latencyMs?: number;
}>;

export type CapabilityAssessment = Readonly<{
  id: string;
  directState: CapabilitySignal;
  effectiveState: CapabilityState;
  reasons: readonly string[];
  blockingDependencies: readonly string[];
  degradedDependencies: readonly string[];
}>;

export type CapabilityGraph = Readonly<{
  definitions: readonly CapabilityDefinition[];
  topologicalOrder: readonly string[];
  fingerprint: string;
}>;

export type CapabilitySnapshot = Readonly<{
  schemaVersion: 1;
  generatedAt: string;
  fingerprint: string;
  criticalPath: "satisfied" | "degraded" | "blocked";
  summary: Readonly<Record<CapabilityState, number>>;
  assessments: readonly CapabilityAssessment[];
}>;

export type KernelErrorCode =
  | "INVALID_ID"
  | "INVALID_DEFINITION"
  | "DUPLICATE_CAPABILITY"
  | "DUPLICATE_DEPENDENCY"
  | "UNKNOWN_DEPENDENCY"
  | "CYCLIC_DEPENDENCY"
  | "DUPLICATE_OBSERVATION";

export class CapabilityGraphError extends Error {
  readonly code: KernelErrorCode;
  readonly details: readonly string[];

  constructor(code: KernelErrorCode, message: string, details: readonly string[] = []) {
    super(message);
    this.name = "CapabilityGraphError";
    this.code = code;
    this.details = details;
  }
}

const ID_PATTERN = /^[a-z0-9][a-z0-9:._/-]{0,127}$/;

function assertDefinition(definition: CapabilityDefinition): void {
  if (!ID_PATTERN.test(definition.id)) {
    throw new CapabilityGraphError(
      "INVALID_ID",
      "Capability id must be a lowercase stable identifier",
      [definition.id]
    );
  }
  if (!definition.version.trim() || !definition.owner.trim() || !definition.description.trim()) {
    throw new CapabilityGraphError(
      "INVALID_DEFINITION",
      "Capability version, owner, and description are required",
      [definition.id]
    );
  }
}

function normalizedDefinition(definition: CapabilityDefinition): CapabilityDefinition {
  const dependencies = [...(definition.dependencies ?? [])]
    .map(dependency => ({ ...dependency }))
    .sort((left, right) => {
      const byId = left.id.localeCompare(right.id);
      return byId !== 0 ? byId : left.kind.localeCompare(right.kind);
    });

  const seen = new Set<string>();
  for (const dependency of dependencies) {
    if (seen.has(dependency.id)) {
      throw new CapabilityGraphError(
        "DUPLICATE_DEPENDENCY",
        "A capability may declare each dependency only once",
        [definition.id, dependency.id]
      );
    }
    seen.add(dependency.id);
  }

  return {
    ...definition,
    dependencies,
    boundaries: [...(definition.boundaries ?? [])].sort(),
  };
}

function graphFingerprint(definitions: readonly CapabilityDefinition[]): string {
  const canonical = definitions.map(definition => ({
    id: definition.id,
    version: definition.version,
    owner: definition.owner,
    description: definition.description,
    criticality: definition.criticality,
    dependencies: definition.dependencies ?? [],
    boundaries: definition.boundaries ?? [],
  }));

  return createHash("sha256").update(JSON.stringify(canonical)).digest("hex");
}

export function compileCapabilityGraph(
  input: readonly CapabilityDefinition[]
): CapabilityGraph {
  const definitions = input
    .map(definition => {
      assertDefinition(definition);
      return normalizedDefinition(definition);
    })
    .sort((left, right) => left.id.localeCompare(right.id));

  const byId = new Map<string, CapabilityDefinition>();
  for (const definition of definitions) {
    if (byId.has(definition.id)) {
      throw new CapabilityGraphError(
        "DUPLICATE_CAPABILITY",
        "Capability ids must be unique",
        [definition.id]
      );
    }
    byId.set(definition.id, definition);
  }

  for (const definition of definitions) {
    for (const dependency of definition.dependencies ?? []) {
      if (!byId.has(dependency.id)) {
        throw new CapabilityGraphError(
          "UNKNOWN_DEPENDENCY",
          "Capability dependency is not declared in the graph",
          [definition.id, dependency.id]
        );
      }
    }
  }

  const visitState = new Map<string, "visiting" | "visited">();
  const topologicalOrder: string[] = [];

  const visit = (id: string, stack: readonly string[]): void => {
    const state = visitState.get(id);
    if (state === "visited") return;
    if (state === "visiting") {
      const cycleStart = stack.indexOf(id);
      const cycle =
        cycleStart >= 0 ? [...stack.slice(cycleStart), id] : [...stack, id];
      throw new CapabilityGraphError(
        "CYCLIC_DEPENDENCY",
        "Capability dependency graph contains a cycle",
        cycle
      );
    }

    visitState.set(id, "visiting");
    const definition = byId.get(id);
    if (!definition) {
      throw new CapabilityGraphError(
        "UNKNOWN_DEPENDENCY",
        "Capability vanished while compiling graph",
        [id]
      );
    }

    for (const dependency of definition.dependencies ?? []) {
      visit(dependency.id, [...stack, id]);
    }

    visitState.set(id, "visited");
    topologicalOrder.push(id);
  };

  for (const definition of definitions) {
    visit(definition.id, []);
  }

  return Object.freeze({
    definitions: Object.freeze(definitions),
    topologicalOrder: Object.freeze(topologicalOrder),
    fingerprint: graphFingerprint(definitions),
  });
}

const BLOCKING_STATES = new Set<CapabilityState>([
  "blocked",
  "disabled",
  "unavailable",
  "unknown",
]);

export function evaluateCapabilities(
  graph: CapabilityGraph,
  observations: readonly CapabilityObservation[]
): readonly CapabilityAssessment[] {
  const observationById = new Map<string, CapabilityObservation>();
  for (const observation of observations) {
    if (observationById.has(observation.id)) {
      throw new CapabilityGraphError(
        "DUPLICATE_OBSERVATION",
        "Only one observation may be supplied per capability",
        [observation.id]
      );
    }
    observationById.set(observation.id, observation);
  }

  const definitionById = new Map(
    graph.definitions.map(definition => [definition.id, definition] as const)
  );
  const assessmentById = new Map<string, CapabilityAssessment>();

  for (const id of graph.topologicalOrder) {
    const definition = definitionById.get(id);
    if (!definition) continue;

    const observation = observationById.get(id);
    const directState = observation?.state ?? "unknown";
    const reasons: string[] = [];
    if (observation?.reason) reasons.push(observation.reason);
    if (!observation) reasons.push("No runtime observation supplied");

    const blockingDependencies: string[] = [];
    const degradedDependencies: string[] = [];

    for (const dependency of definition.dependencies ?? []) {
      const dependencyAssessment = assessmentById.get(dependency.id);
      const dependencyState = dependencyAssessment?.effectiveState ?? "unknown";

      if (dependency.kind === "hard") {
        if (BLOCKING_STATES.has(dependencyState)) {
          blockingDependencies.push(dependency.id);
        } else if (dependencyState === "degraded") {
          degradedDependencies.push(dependency.id);
        }
      } else if (dependencyState !== "available") {
        degradedDependencies.push(dependency.id);
      }
    }

    let effectiveState: CapabilityState = directState;
    if (directState !== "disabled" && directState !== "unavailable") {
      if (blockingDependencies.length > 0) {
        effectiveState = "blocked";
        reasons.push(
          "Hard dependency unavailable: " + blockingDependencies.join(", ")
        );
      } else if (
        directState === "available" &&
        degradedDependencies.length > 0
      ) {
        effectiveState = "degraded";
        reasons.push(
          "Dependency degradation: " + degradedDependencies.join(", ")
        );
      }
    }

    assessmentById.set(
      id,
      Object.freeze({
        id,
        directState,
        effectiveState,
        reasons: Object.freeze(reasons),
        blockingDependencies: Object.freeze(blockingDependencies),
        degradedDependencies: Object.freeze(degradedDependencies),
      })
    );
  }

  return Object.freeze(
    graph.definitions.map(definition => {
      const assessment = assessmentById.get(definition.id);
      if (!assessment) {
        throw new CapabilityGraphError(
          "INVALID_DEFINITION",
          "Capability could not be assessed",
          [definition.id]
        );
      }
      return assessment;
    })
  );
}

function criticalPathState(
  graph: CapabilityGraph,
  assessments: readonly CapabilityAssessment[]
): CapabilitySnapshot["criticalPath"] {
  const definitionById = new Map(
    graph.definitions.map(definition => [definition.id, definition] as const)
  );

  let degraded = false;
  for (const assessment of assessments) {
    const definition = definitionById.get(assessment.id);
    if (definition?.criticality !== "critical") continue;
    if (BLOCKING_STATES.has(assessment.effectiveState)) return "blocked";
    if (assessment.effectiveState === "degraded") degraded = true;
  }
  return degraded ? "degraded" : "satisfied";
}

export function createCapabilitySnapshot(
  graph: CapabilityGraph,
  observations: readonly CapabilityObservation[],
  generatedAt: string = new Date().toISOString()
): CapabilitySnapshot {
  const assessments = evaluateCapabilities(graph, observations);
  const summary: Record<CapabilityState, number> = {
    available: 0,
    degraded: 0,
    unavailable: 0,
    disabled: 0,
    unknown: 0,
    blocked: 0,
  };

  for (const assessment of assessments) {
    summary[assessment.effectiveState] += 1;
  }

  return Object.freeze({
    schemaVersion: 1 as const,
    generatedAt,
    fingerprint: graph.fingerprint,
    criticalPath: criticalPathState(graph, assessments),
    summary: Object.freeze(summary),
    assessments,
  });
}

export type RetryPolicy = Readonly<{
  maxAttempts: number;
  baseDelayMs: number;
  maxDelayMs: number;
  jitterRatio?: number;
  retryable?: (error: unknown, attempt: number) => boolean;
}>;

export type RetryRuntime = Readonly<{
  sleep?: (delayMs: number) => Promise<void>;
  random?: () => number;
}>;

function assertRetryPolicy(policy: RetryPolicy): void {
  if (!Number.isInteger(policy.maxAttempts) || policy.maxAttempts < 1) {
    throw new RangeError("maxAttempts must be an integer greater than zero");
  }
  if (policy.baseDelayMs < 0 || policy.maxDelayMs < policy.baseDelayMs) {
    throw new RangeError("Retry delay bounds are invalid");
  }
  const jitter = policy.jitterRatio ?? 0;
  if (jitter < 0 || jitter > 1) {
    throw new RangeError("jitterRatio must be between 0 and 1");
  }
}

export function computeBackoffDelay(
  failedAttempt: number,
  policy: Pick<RetryPolicy, "baseDelayMs" | "maxDelayMs" | "jitterRatio">,
  random: () => number = Math.random
): number {
  if (!Number.isInteger(failedAttempt) || failedAttempt < 1) {
    throw new RangeError("failedAttempt must be an integer greater than zero");
  }

  const raw = Math.min(
    policy.maxDelayMs,
    policy.baseDelayMs * 2 ** (failedAttempt - 1)
  );
  const jitter = policy.jitterRatio ?? 0;
  const delta = raw * jitter * (random() * 2 - 1);
  return Math.max(0, Math.min(policy.maxDelayMs, Math.round(raw + delta)));
}

export async function retry<T>(
  operation: (attempt: number) => Promise<T>,
  policy: RetryPolicy,
  runtime: RetryRuntime = {}
): Promise<T> {
  assertRetryPolicy(policy);
  const sleep =
    runtime.sleep ??
    ((delayMs: number) =>
      new Promise<void>(resolve => {
        setTimeout(resolve, delayMs);
      }));
  const random = runtime.random ?? Math.random;

  let lastError: unknown;
  for (let attempt = 1; attempt <= policy.maxAttempts; attempt += 1) {
    try {
      return await operation(attempt);
    } catch (error) {
      lastError = error;
      const retryable = policy.retryable?.(error, attempt) ?? true;
      if (!retryable || attempt === policy.maxAttempts) throw error;
      await sleep(computeBackoffDelay(attempt, policy, random));
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Retry operation failed without an Error object");
}

export type CircuitState = "closed" | "open" | "half_open";

export type CircuitBreakerConfig = Readonly<{
  failureThreshold: number;
  resetTimeoutMs: number;
}>;

export type CircuitBreakerSnapshot = Readonly<{
  state: CircuitState;
  consecutiveFailures: number;
  openedAt: number | null;
  retryAt: number | null;
  probeInFlight: boolean;
}>;

export class CircuitOpenError extends Error {
  readonly retryAt: number | null;

  constructor(retryAt: number | null) {
    super("Circuit breaker is open");
    this.name = "CircuitOpenError";
    this.retryAt = retryAt;
  }
}

export class CircuitBreaker {
  private state: CircuitState = "closed";
  private consecutiveFailures = 0;
  private openedAt: number | null = null;
  private probeInFlight = false;

  constructor(
    private readonly config: CircuitBreakerConfig,
    private readonly now: () => number = Date.now
  ) {
    if (
      !Number.isInteger(config.failureThreshold) ||
      config.failureThreshold < 1
    ) {
      throw new RangeError("failureThreshold must be an integer greater than zero");
    }
    if (config.resetTimeoutMs < 0) {
      throw new RangeError("resetTimeoutMs cannot be negative");
    }
  }

  private refreshState(): void {
    if (
      this.state === "open" &&
      this.openedAt !== null &&
      this.now() - this.openedAt >= this.config.resetTimeoutMs
    ) {
      this.state = "half_open";
    }
  }

  snapshot(): CircuitBreakerSnapshot {
    this.refreshState();
    return Object.freeze({
      state: this.state,
      consecutiveFailures: this.consecutiveFailures,
      openedAt: this.openedAt,
      retryAt:
        this.openedAt === null
          ? null
          : this.openedAt + this.config.resetTimeoutMs,
      probeInFlight: this.probeInFlight,
    });
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    this.refreshState();

    if (this.state === "open") {
      throw new CircuitOpenError(
        this.openedAt === null
          ? null
          : this.openedAt + this.config.resetTimeoutMs
      );
    }

    if (this.state === "half_open") {
      if (this.probeInFlight) {
        throw new CircuitOpenError(
          this.openedAt === null
            ? null
            : this.openedAt + this.config.resetTimeoutMs
        );
      }
      this.probeInFlight = true;
    }

    try {
      const result = await operation();
      this.state = "closed";
      this.consecutiveFailures = 0;
      this.openedAt = null;
      return result;
    } catch (error) {
      this.consecutiveFailures += 1;
      if (
        this.state === "half_open" ||
        this.consecutiveFailures >= this.config.failureThreshold
      ) {
        this.state = "open";
        this.openedAt = this.now();
      }
      throw error;
    } finally {
      this.probeInFlight = false;
    }
  }
}
