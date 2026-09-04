import { describe, expect, it } from "vitest";
import {
  InvalidIdempotencyKeyError,
  buildIdempotencyScope,
  decidePersistedIdempotency,
  decodeIdempotencyResponse,
  encodeIdempotencyResponse,
  eventIdempotencyFingerprint,
  mutationRequestHash,
  readIdempotencyKey,
} from "./idempotency";

function request(headers: Record<string, string | undefined>) {
  return {
    get(name: string) {
      return headers[name.toLowerCase()];
    },
  };
}

describe("idempotency request contract", () => {
  it("accepts the standard header and matching legacy alias", () => {
    expect(
      readIdempotencyKey(
        request({ "idempotency-key": "post.123" })
      )
    ).toBe("post.123");

    expect(
      readIdempotencyKey(
        request({
          "idempotency-key": "same-key",
          "x-idempotency-key": "same-key",
        })
      )
    ).toBe("same-key");
  });

  it("rejects conflicting or malformed keys", () => {
    expect(() =>
      readIdempotencyKey(
        request({
          "idempotency-key": "one",
          "x-idempotency-key": "two",
        })
      )
    ).toThrow(InvalidIdempotencyKeyError);

    for (const key of [" has-space", "bad key", "", "x".repeat(129)]) {
      expect(() =>
        readIdempotencyKey(request({ "idempotency-key": key }))
      ).toThrow(InvalidIdempotencyKeyError);
    }
  });

  it("scopes keys by actor without exposing the actor id", () => {
    const first = buildIdempotencyScope("social.post.create", "user-secret");
    const second = buildIdempotencyScope("social.post.create", "other-user");

    expect(first).toMatch(/^social\.post\.create:actor:[a-f0-9]{24}$/);
    expect(first).not.toContain("user-secret");
    expect(first).not.toBe(second);
  });

  it("hashes canonical requests and event keys deterministically", () => {
    const scope = buildIdempotencyScope("social.post.create", "user-1");
    expect(
      mutationRequestHash(scope, { content: "hello", media: null })
    ).toBe(
      mutationRequestHash(scope, { media: null, content: "hello" })
    );

    expect(eventIdempotencyFingerprint(scope, "request-1")).toMatch(
      /^[a-f0-9]{64}$/
    );
  });
});

describe("persisted idempotency decisions", () => {
  const base = {
    requestHash: "hash",
    resourceId: "resource-1",
    responseStatus: 200,
    responseBody: "{\"ok\":true}",
    expiresAt: null,
  };

  it("replays completed matching records", () => {
    expect(
      decidePersistedIdempotency("hash", {
        ...base,
        state: "completed",
      })
    ).toEqual({
      action: "replay",
      resourceId: "resource-1",
      responseStatus: 200,
      responseBody: "{\"ok\":true}",
    });
  });

  it("rejects conflicting and invalid records", () => {
    expect(
      decidePersistedIdempotency("other", {
        ...base,
        state: "completed",
      }).action
    ).toBe("conflict");

    expect(
      decidePersistedIdempotency("hash", {
        ...base,
        state: "corrupt",
      })
    ).toEqual({ action: "invalid_record" });
  });

  it("round-trips bounded replay bodies", () => {
    const encoded = encodeIdempotencyResponse({ id: "abc", ok: true });
    expect(decodeIdempotencyResponse(encoded)).toEqual({
      id: "abc",
      ok: true,
    });
  });
});
