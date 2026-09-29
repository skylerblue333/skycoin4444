import { describe, expect, it, vi } from "vitest";
import {
  apiErrorStatus,
  buildApiFailureRecord,
  createApiErrorHandler,
  createApiNotFoundHandler,
  isApiRequestPath,
} from "./apiBoundary";

function createResponseDouble() {
  const response = {
    headersSent: false,
    set: vi.fn(),
    status: vi.fn(),
    json: vi.fn(),
  };
  response.status.mockReturnValue(response);
  return response;
}

describe("API request path boundary", () => {
  it("matches the API root and API descendants only", () => {
    expect(isApiRequestPath("/api")).toBe(true);
    expect(isApiRequestPath("/api/beta/readiness")).toBe(true);
    expect(isApiRequestPath("/apian")).toBe(false);
    expect(isApiRequestPath("/dashboard")).toBe(false);
  });
});

describe("API error status classification", () => {
  it("preserves validated client-error statuses from body/parser failures", () => {
    expect(apiErrorStatus({ status: 400 })).toBe(400);
    expect(apiErrorStatus({ statusCode: 413 })).toBe(413);
    expect(apiErrorStatus({ status: 415 })).toBe(415);
  });

  it("fails closed to 500 for untrusted or server-side status values", () => {
    expect(apiErrorStatus({ status: 503 })).toBe(500);
    expect(apiErrorStatus({ status: "400" })).toBe(500);
    expect(apiErrorStatus(new Error("boom"))).toBe(500);
  });
});

describe("API failure record", () => {
  it("redacts secret-bearing error details before logging", () => {
    const record = buildApiFailureRecord(
      new Error(
        "upstream mysql://admin:secret@db.example/sky?password=hidden"
      ),
      {
        method: "POST",
        path: "/api/provider/run",
      } as never,
      "request-123"
    );

    expect(record).toMatchObject({
      contract: "skycoin4444.api-error.v1",
      event: "api_request_error",
      requestId: "request-123",
      method: "POST",
      path: "/api/provider/run",
      status: 500,
    });
    expect(record.summary).not.toContain("secret");
    expect(record.summary).not.toContain("hidden");
    expect(record.summary).toContain("[redacted]");
  });
});

describe("API not-found boundary", () => {
  it("returns a cache-safe JSON 404 instead of a browser shell", () => {
    const response = createResponseDouble();
    const handler = createApiNotFoundHandler();

    handler({} as never, response as never, vi.fn());

    expect(response.set).toHaveBeenCalledWith(
      "Cache-Control",
      "no-store"
    );
    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith({
      error: "api_route_not_found",
      requestId: null,
    });
  });
});

describe("API error boundary", () => {
  it("returns a generic JSON 500 and emits only the sanitized record", () => {
    const response = createResponseDouble();
    const next = vi.fn();
    const log = vi.fn();
    const handler = createApiErrorHandler(log);

    handler(
      new Error("token=supersecret"),
      {
        method: "POST",
        path: "/api/example",
      } as never,
      response as never,
      next
    );

    expect(next).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({
      error: "internal_server_error",
      requestId: null,
    });
    expect(log).toHaveBeenCalledTimes(1);
    expect(log.mock.calls[0]?.[0]).toMatchObject({ status: 500 });
    expect(JSON.stringify(log.mock.calls[0]?.[0])).not.toContain(
      "supersecret"
    );
  });

  it("preserves client parser/body-limit statuses without exposing details", () => {
    const response = createResponseDouble();
    const next = vi.fn();
    const log = vi.fn();
    const handler = createApiErrorHandler(log);
    const error = Object.assign(
      new Error("entity too large token=private-value"),
      { status: 413 }
    );

    handler(
      error,
      {
        method: "POST",
        path: "/api/upload",
      } as never,
      response as never,
      next
    );

    expect(next).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(413);
    expect(response.json).toHaveBeenCalledWith({
      error: "client_request_rejected",
      requestId: null,
    });
    expect(log.mock.calls[0]?.[0]).toMatchObject({ status: 413 });
    expect(JSON.stringify(log.mock.calls[0]?.[0])).not.toContain(
      "private-value"
    );
  });

  it("delegates non-API errors to the next error middleware", () => {
    const response = createResponseDouble();
    const next = vi.fn();
    const error = new Error("page failed");
    const handler = createApiErrorHandler(vi.fn());

    handler(
      error,
      {
        method: "GET",
        path: "/dashboard",
      } as never,
      response as never,
      next
    );

    expect(next).toHaveBeenCalledWith(error);
    expect(response.status).not.toHaveBeenCalled();
  });

  it("delegates after headers have already been sent", () => {
    const response = {
      ...createResponseDouble(),
      headersSent: true,
    };
    const next = vi.fn();
    const error = new Error("late failure");
    const handler = createApiErrorHandler(vi.fn());

    handler(
      error,
      {
        method: "GET",
        path: "/api/example",
      } as never,
      response as never,
      next
    );

    expect(next).toHaveBeenCalledWith(error);
    expect(response.status).not.toHaveBeenCalled();
  });
});
