import { describe, expect, it } from "vitest";
import { InMemoryQueue } from "./index";

describe("SkyQueue", () => {
  it("claims eligible jobs in deterministic order", () => {
    const queue = new InMemoryQueue<{ value: number }>();
    queue.enqueue({
      id: "job:b",
      payload: { value: 2 },
      availableAt: "2026-08-25T09:00:00.000Z",
    });
    queue.enqueue({
      id: "job:a",
      payload: { value: 1 },
      availableAt: "2026-08-25T09:00:00.000Z",
    });
    expect(queue.claim("2026-08-25T09:00:00.000Z")?.id).toBe("job:a");
    expect(queue.claim("2026-08-25T09:00:00.000Z")?.id).toBe("job:b");
  });

  it("does not claim future or already-claimed jobs", () => {
    const queue = new InMemoryQueue<string>();
    queue.enqueue({
      id: "job:1",
      payload: "x",
      availableAt: "2026-08-25T10:00:00.000Z",
    });
    expect(queue.claim("2026-08-25T09:59:59.000Z")).toBeUndefined();
    expect(queue.claim("2026-08-25T10:00:00.000Z")?.attempts).toBe(1);
    expect(queue.claim("2026-08-25T10:00:00.000Z")).toBeUndefined();
  });

  it("supports explicit retry and completion", () => {
    const queue = new InMemoryQueue<string>();
    queue.enqueue({
      id: "job:1",
      payload: "x",
      availableAt: "2026-08-25T09:00:00.000Z",
      maxAttempts: 2,
    });
    queue.claim("2026-08-25T09:00:00.000Z");
    queue.retry("job:1", "2026-08-25T09:01:00.000Z");
    expect(queue.claim("2026-08-25T09:01:00.000Z")?.attempts).toBe(2);
    expect(queue.complete("job:1")).toBe(true);
    expect(queue.size()).toBe(0);
  });

  it("rejects duplicate and malformed job inputs", () => {
    const queue = new InMemoryQueue<string>();
    queue.enqueue({
      id: "job:1",
      payload: "x",
      availableAt: "2026-08-25T09:00:00.000Z",
    });
    expect(() =>
      queue.enqueue({
        id: "job:1",
        payload: "y",
        availableAt: "2026-08-25T09:00:00.000Z",
      }),
    ).toThrow("duplicate");
    expect(() =>
      queue.enqueue({
        id: "../bad",
        payload: "y",
        availableAt: "2026-08-25T09:00:00.000Z",
      }),
    ).toThrow("invalid job id");
  });
});
