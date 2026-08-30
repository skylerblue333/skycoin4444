import { describe, expect, it } from "vitest";
import { MemoryStore } from "./index";

describe("MemoryStore", () => {
  it("stores normalized records and searches deterministically", () => {
    const store = new MemoryStore();
    store.put({ id: "m1", namespace: "agent-a", content: "first", tags: ["Work", "urgent"], createdAt: "2026-08-30T10:00:00Z" });
    store.put({ id: "m2", namespace: "agent-a", content: "second", tags: ["work"], createdAt: "2026-08-30T11:00:00Z" });

    expect(store.search({ namespace: "agent-a", tags: ["WORK"] })).toEqual({
      contract: "sky.memory.search.v1",
      namespace: "agent-a",
      records: [
        { id: "m2", namespace: "agent-a", content: "second", tags: ["work"], createdAt: "2026-08-30T11:00:00.000Z" },
        { id: "m1", namespace: "agent-a", content: "first", tags: ["urgent", "work"], createdAt: "2026-08-30T10:00:00.000Z" },
      ],
    });
  });

  it("enforces namespaces, uniqueness, timestamps, and limits", () => {
    const store = new MemoryStore();
    store.put({ id: "m1", namespace: "a", content: "x", createdAt: "2026-08-30T10:00:00Z" });
    expect(() => store.put({ id: "m1", namespace: "a", content: "y", createdAt: "2026-08-30T11:00:00Z" })).toThrow("id already exists");
    expect(() => store.put({ id: "m2", namespace: "a", content: "y", createdAt: "not-a-date" })).toThrow("createdAt");
    expect(() => store.search({ namespace: " ", limit: 1 })).toThrow("namespace");
    expect(() => store.search({ namespace: "a", limit: 0 })).toThrow("limit");
    expect(store.search({ namespace: "other" }).records).toEqual([]);
  });
});
