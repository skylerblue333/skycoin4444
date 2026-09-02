import { describe, expect, it } from "vitest";
import { createHttpRequestSignal } from "./observability";

describe("HTTP observability signal", () => {
  it("captures safe request metadata without request bodies", () => {
    expect(
      createHttpRequestSignal(
        "request-beta-1",
        { method: "POST", path: "/api/trpc/betaFeedback.submit" },
        { statusCode: 201 },
        37
      )
    ).toEqual({
      event: "http_request",
      requestId: "request-beta-1",
      method: "POST",
      path: "/api/trpc/betaFeedback.submit",
      status: 201,
      durationMs: 37,
    });
  });
});
