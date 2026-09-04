import { randomUUID } from "node:crypto";
import type { Express, Request, Response, NextFunction } from "express";
import { runWithRequestContext } from "./requestContext";

export type HttpRequestSignal = {
  event: "http_request";
  requestId: string;
  externalRequestId: string | null;
  method: string;
  path: string;
  status: number;
  durationMs: number;
};

export function normalizeExternalRequestId(
  value: string | undefined
): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  if (trimmed.length > 64) return null;
  if (!/^[A-Za-z0-9][A-Za-z0-9._:-]*$/.test(trimmed)) {
    return null;
  }
  return trimmed;
}

export function createRequestIdentity(
  supplied: string | undefined,
  generate: () => string = randomUUID
): Readonly<{
  requestId: string;
  externalRequestId: string | null;
}> {
  return Object.freeze({
    requestId: generate(),
    externalRequestId: normalizeExternalRequestId(supplied),
  });
}

export function createHttpRequestSignal(
  requestId: string,
  externalRequestId: string | null,
  request: Pick<Request, "method" | "path">,
  response: Pick<Response, "statusCode">,
  durationMs: number
): HttpRequestSignal {
  return {
    event: "http_request",
    requestId,
    externalRequestId,
    method: request.method,
    path: request.path,
    status: response.statusCode,
    durationMs,
  };
}

export function registerObservability(app: Express): void {
  app.use((req: Request, res: Response, next: NextFunction) => {
    const identity = createRequestIdentity(
      req.header("x-request-id")
    );
    const { requestId, externalRequestId } = identity;
    const startedAt = Date.now();

    res.setHeader("X-Request-ID", requestId);
    res.on("finish", () => {
      if (req.path.startsWith("/api/")) {
        console.info(
          JSON.stringify(
            createHttpRequestSignal(
              requestId,
              externalRequestId,
              req,
              res,
              Date.now() - startedAt
            )
          )
        );
      }
    });

    runWithRequestContext(
      {
        requestId,
        externalRequestId,
        startedAt,
        method: req.method,
        path: req.path,
      },
      next
    );
  });
}
