import { describe, expect, it, vi } from "vitest";
import {
  CapabilityGraphError,
  CircuitBreaker,
  CircuitOpenError,
  compileCapabilityGraph,
  computeBackoffDelay,
  createCapabilitySnapshot,
  retry,
  type CapabilityDefinition,
} from "./index";

const capability = (
  id: string,
  dependencies: CapabilityDefinition["dependencies"] = [],
  criticality: CapabilityDefinition["criticality"] = "optional"
): CapabilityDefinition => ({
  id,
  version: "1",
  owner: "platform",
  description: id + " capability",
  criticality,
  dependencies,
});

describe("platform kernel capability graph", () => {
  it("produces the same fingerprint regardless of declaration order", () => {
    const first = compileCapabilityGraph([
      capability("api", [{ id: "identity", kind: "hard" }]),
      capability("identity"),
    ]);
    const second = compileCapabilityGraph([
      capability("identity"),
      capability("api", [{ id: "identity", kind: "hard" }]),
    ]);

    expect(first.fingerprint).toMatch(/^[a-f0-9]{64}$/);
    expect(first.fingerprint).toBe(second.fingerprint);
    expect(first.topologicalOrder.indexOf("identity")).toBeLessThan(
      first.topologicalOrder.indexOf("api")
    );
  });

  it("rejects dependency cycles with an explicit cycle path", () => {
    expect(() =>
      compileCapabilityGraph([
        capability("alpha", [{ id: "beta", kind: "hard" }]),
        capability("beta", [{ id: "alpha", kind: "hard" }]),
      ])
    ).toThrowError(CapabilityGraphError);

    try {
      compileCapabilityGraph([
        capability("alpha", [{ id: "beta", kind: "hard" }]),
        capability("beta", [{ id: "alpha", kind: "hard" }]),
      ]);
    } catch (error) {
      expect(error).toBeInstanceOf(CapabilityGraphError);
      expect((error as CapabilityGraphError).code).toBe("CYCLIC_DEPENDENCY");
      expect((error as CapabilityGraphError).details).toEqual([
        "alpha",
        "beta",
        "alpha",
      ]);
    }
  });

  it("blocks hard dependents and only degrades soft dependents", () => {
    const graph = compileCapabilityGraph([
      capability("identity", [], "critical"),
      capability("payments", [{ id: "identity", kind: "hard" }]),
      capability("analytics", [{ id: "identity", kind: "soft" }]),
    ]);

    const snapshot = createCapabilitySnapshot(
      graph,
      [
        { id: "identity", state: "unavailable", reason: "provider absent" },
        { id: "payments", state: "available" },
        { id: "analytics", state: "available" },
      ],
      "2026-09-04T00:00:00.000Z"
    );

    expect(snapshot.criticalPath).toBe("blocked");
    expect(
      snapshot.assessments.find(item => item.id === "payments")?.effectiveState
    ).toBe("blocked");
    expect(
      snapshot.assessments.find(item => item.id === "analytics")?.effectiveState
    ).toBe("degraded");
    expect(snapshot.summary.blocked).toBe(1);
  });
});

describe("platform kernel resilience", () => {
  it("computes bounded exponential backoff", () => {
    const policy = {
      baseDelayMs: 100,
      maxDelayMs: 250,
      jitterRatio: 0,
    };
    expect(computeBackoffDelay(1, policy)).toBe(100);
    expect(computeBackoffDelay(2, policy)).toBe(200);
    expect(computeBackoffDelay(3, policy)).toBe(250);
  });

  it("retries retryable failures with injected sleeping", async () => {
    const sleep = vi.fn(async () => undefined);
    const operation = vi
      .fn<(attempt: number) => Promise<string>>()
      .mockRejectedValueOnce(new Error("transient"))
      .mockRejectedValueOnce(new Error("transient"))
      .mockResolvedValue("ok");

    await expect(
      retry(
        operation,
        {
          maxAttempts: 3,
          baseDelayMs: 10,
          maxDelayMs: 100,
          jitterRatio: 0,
        },
        { sleep }
      )
    ).resolves.toBe("ok");

    expect(operation).toHaveBeenCalledTimes(3);
    expect(sleep.mock.calls).toEqual([[10], [20]]);
  });

  it("opens, rejects, and recovers a circuit with a single half-open probe", async () => {
    let now = 1_000;
    const breaker = new CircuitBreaker(
      { failureThreshold: 2, resetTimeoutMs: 500 },
      () => now
    );

    await expect(
      breaker.execute(async () => {
        throw new Error("first");
      })
    ).rejects.toThrow("first");
    await expect(
      breaker.execute(async () => {
        throw new Error("second");
      })
    ).rejects.toThrow("second");

    expect(breaker.snapshot().state).toBe("open");
    await expect(breaker.execute(async () => "blocked")).rejects.toBeInstanceOf(
      CircuitOpenError
    );

    now += 500;
    expect(breaker.snapshot().state).toBe("half_open");
    await expect(breaker.execute(async () => "recovered")).resolves.toBe(
      "recovered"
    );
    expect(breaker.snapshot().state).toBe("closed");
  });
});
