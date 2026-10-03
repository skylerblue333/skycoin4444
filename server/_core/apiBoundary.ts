import type {
  ErrorRequestHandler,
  Express,
  Request,
  RequestHandler,
} from "express";
import { sanitizeOperationalError } from "./operationalError";
import { getRequestId } from "./requestContext";

export type ApiFailureRecord = Readonly<{
  contract: "skycoin4444.api-error.v1";
  event: "api_request_error";
  requestId: string | null;
  method: string;
  path: string;
  status: number;
  summary: string;
}>;

type ApiFailureLogger = (record: ApiFailureRecord) => void;

export function isApiRequestPath(pathname: string): boolean {
  return pathname === "/api" || pathname.startsWith("/api/");
}

function validatedClientStatus(value: unknown): number | null {
  return typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 400 &&
    value <= 499
    ? value
    : null;
}

export function apiErrorStatus(error: unknown): number {
  if (!error || typeof error !== "object") return 500;

  const candidate = error as {
    status?: unknown;
    statusCode?: unknown;
  };

  return (
    validatedClientStatus(candidate.status) ??
    validatedClientStatus(candidate.statusCode) ??
    500
  );
}

export function buildApiFailureRecord(
  error: unknown,
  request: Pick<Request, "method" | "path">,
  requestId: string | null,
  status = apiErrorStatus(error)
): ApiFailureRecord {
  return Object.freeze({
    contract: "skycoin4444.api-error.v1" as const,
    event: "api_request_error" as const,
    requestId,
    method: request.method,
    path: request.path,
    status,
    summary: sanitizeOperationalError(error),
  });
}

export function createApiNotFoundHandler(): RequestHandler {
  return (_req, res) => {
    res.set("Cache-Control", "no-store");
    res.status(404).json({
      error: "api_route_not_found",
      requestId: getRequestId() ?? null,
    });
  };
}

export function createApiErrorHandler(
  logFailure: ApiFailureLogger = record =>
    console.error(JSON.stringify(record))
): ErrorRequestHandler {
  return (error, req, res, next) => {
    if (!isApiRequestPath(req.path) || res.headersSent) {
      next(error);
      return;
    }

    const requestId = getRequestId() ?? null;
    const status = apiErrorStatus(error);
    logFailure(buildApiFailureRecord(error, req, requestId, status));

    res.set("Cache-Control", "no-store");
    res.status(status).json({
      error:
        status >= 400 && status <= 499
          ? "client_request_rejected"
          : "internal_server_error",
      requestId,
    });
  };
}

export function registerApiBoundary(app: Express): void {
  // Register only after every concrete API route and tRPC middleware. This
  // guarantees that unknown API requests never fall through to Vite or the SPA.
  app.use("/api", createApiNotFoundHandler());
  app.use(createApiErrorHandler());
}
