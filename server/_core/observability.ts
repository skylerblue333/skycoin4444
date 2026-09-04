import { randomUUID } from "node:crypto";
import type { Express, Request, Response, NextFunction } from "express";
import { runWithRequestContext } from "./requestContext";

export type HttpRequestSignal = {
  event: "http_request";
  requestId: string;
  method: string;
  path: string;
  status: number;
  durationMs: number;
};

export function createHttpRequestSignal(
  requestId: string,
  request: Pick<Request, "method" | "path">,
  response: Pick<Response, "statusCode">,
  durationMs: number
): HttpRequestSignal {
  return {
    event: "http_request",
    requestId,
    method: request.method,
    path: request.path,
    status: response.statusCode,
    durationMs,
  };
}

export function registerObservability(app: Express): void {
  app.use((req: Request, res: Response, next: NextFunction) => {
    const suppliedRequestId = req.header("x-request-id")?.trim();
    const requestId =
      suppliedRequestId && suppliedRequestId.length <= 128
        ? suppliedRequestId
        : randomUUID();
    const startedAt = Date.now();

    res.setHeader("X-Request-ID", requestId);
    res.on("finish", () => {
      if (req.path.startsWith("/api/")) {
        console.info(
          JSON.stringify(
            createHttpRequestSignal(requestId, req, res, Date.now() - startedAt)
          )
        );
      }
    });

    runWithRequestContext(
      {
        requestId,
        startedAt,
        method: req.method,
        path: req.path,
      },
      next
    );
  });
}
