import { describe, expect, it } from "vitest";
import {
  HOPEAI_MESSAGING_DRAFT_KEY,
  MAX_HOPEAI_LAUNCH_DRAFT_CHARS,
  consumeMessagingHopeAILaunch,
  normalizeHopeAILaunchDraft,
  prepareMessagingHopeAILaunch,
} from "./hopeAILaunchContext";

class MemoryStorage {
  private values = new Map<string, string>();

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }

  removeItem(key: string) {
    this.values.delete(key);
  }
}

describe("HopeAI launch context", () => {
  it("bounds and trims messaging drafts before handoff", () => {
    const input = "  " + "x".repeat(MAX_HOPEAI_LAUNCH_DRAFT_CHARS + 50) + "  ";
    expect(normalizeHopeAILaunchDraft(input)).toHaveLength(
      MAX_HOPEAI_LAUNCH_DRAFT_CHARS
    );
  });

  it("stores and consumes the draft exactly once", () => {
    const storage = new MemoryStorage();
    expect(prepareMessagingHopeAILaunch("  hello HopeAI  ", storage)).toBe(true);
    expect(storage.getItem(HOPEAI_MESSAGING_DRAFT_KEY)).toBe("hello HopeAI");
    expect(consumeMessagingHopeAILaunch(storage)).toBe("hello HopeAI");
    expect(consumeMessagingHopeAILaunch(storage)).toBe("");
  });

  it("fails closed for empty drafts", () => {
    const storage = new MemoryStorage();
    expect(prepareMessagingHopeAILaunch("   ", storage)).toBe(false);
    expect(storage.getItem(HOPEAI_MESSAGING_DRAFT_KEY)).toBeNull();
  });
});
