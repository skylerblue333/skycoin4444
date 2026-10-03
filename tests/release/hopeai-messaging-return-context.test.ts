import { describe, expect, it } from "vitest";
import {
  HOPEAI_MESSAGING_RETURN_KEY,
  MAX_HOPEAI_LAUNCH_DRAFT_CHARS,
  consumeHopeAIMessagingReturn,
  prepareHopeAIMessagingReturn,
} from "@/lib/hopeAILaunchContext";

class MemoryStorage {
  private readonly values = new Map<string, string>();

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

describe("HopeAI to Messaging return context", () => {
  it("stores and consumes a bounded output exactly once", () => {
    const storage = new MemoryStorage();

    expect(prepareHopeAIMessagingReturn("  reviewed response  ", storage)).toBe(
      "prepared"
    );
    expect(storage.getItem(HOPEAI_MESSAGING_RETURN_KEY)).toBe(
      "reviewed response"
    );
    expect(consumeHopeAIMessagingReturn(storage)).toEqual({
      status: "restored",
      draft: "reviewed response",
    });
    expect(consumeHopeAIMessagingReturn(storage)).toEqual({
      status: "empty",
      draft: "",
    });
  });

  it("rejects oversized output without truncating or reviving stale data", () => {
    const storage = new MemoryStorage();
    storage.setItem(HOPEAI_MESSAGING_RETURN_KEY, "stale response");

    expect(
      prepareHopeAIMessagingReturn(
        "x".repeat(MAX_HOPEAI_LAUNCH_DRAFT_CHARS + 1),
        storage
      )
    ).toBe("too_large");
    expect(storage.getItem(HOPEAI_MESSAGING_RETURN_KEY)).toBeNull();
    expect(consumeHopeAIMessagingReturn(storage)).toEqual({
      status: "empty",
      draft: "",
    });
  });

  it("discards malformed stored output after the first read", () => {
    const storage = new MemoryStorage();
    storage.setItem(
      HOPEAI_MESSAGING_RETURN_KEY,
      "x".repeat(MAX_HOPEAI_LAUNCH_DRAFT_CHARS + 1)
    );

    expect(consumeHopeAIMessagingReturn(storage)).toEqual({
      status: "invalid",
      draft: "",
    });
    expect(storage.getItem(HOPEAI_MESSAGING_RETURN_KEY)).toBeNull();
  });

  it("fails closed when session storage is unavailable", () => {
    const unavailable = {
      getItem() {
        throw new Error("blocked");
      },
      setItem() {
        throw new Error("blocked");
      },
      removeItem() {
        throw new Error("blocked");
      },
    };

    expect(prepareHopeAIMessagingReturn("response", unavailable)).toBe(
      "storage_unavailable"
    );
    expect(consumeHopeAIMessagingReturn(unavailable)).toEqual({
      status: "storage_unavailable",
      draft: "",
    });
  });
});
