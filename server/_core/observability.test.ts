import { describe, expect, it } from "vitest";
import {
  createHttpRequestSignal,
  createRequestIdentity,
  normalizeExternalRequestId,
} from "./observability";

describe("HTTP observability signal", () => {
  it("captures safe request metadata without request bodies", () => {
    expect(
      createHttpRequestSignal(
        "request-beta-1",
        "edge-123",
        { method: "POST", path: "/api/trpc/betaFeedback.submit" },
        { statusCode: 201 },
        37
      )
    ).toEqual({
      event: "http_request",
      requestId: "request-beta-1",
      externalRequestId: "edge-123",
      method: "POST",
      path: "/api/trpc/betaFeedback.submit",
      status: 201,
      durationMs: 37,
    });
  });
});


describe("request correlation trust boundary", () => {
  it("never promotes a caller-supplied ID to the canonical request ID", () => {
    const identity = createRequestIdentity(
      "caller-controlled",
      () => "internal-generated"
    );

    expect(identity).toEqual({
      requestId: "internal-generated",
      externalRequestId: "caller-controlled",
    });
    expect(identity.requestId).not.toBe(identity.externalRequestId);
  });

  it("rejects malformed or oversized external IDs", () => {
    expect(normalizeExternalRequestId(" ok-id_1:edge ")).toBe(
      "ok-id_1:edge"
    );
    expect(normalizeExternalRequestId("contains space")).toBeNull();
    expect(normalizeExternalRequestId("x".repeat(65))).toBeNull();
    expect(normalizeExternalRequestId("line\nbreak")).toBeNull();
  });
});
