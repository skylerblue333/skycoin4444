import { AsyncLocalStorage } from "node:async_hooks";

export type RequestContext = Readonly<{
  requestId: string;
  startedAt: number;
  method: string;
  path: string;
}>;

const requestContextStorage = new AsyncLocalStorage<RequestContext>();

export function runWithRequestContext<T>(
  context: RequestContext,
  operation: () => T
): T {
  return requestContextStorage.run(Object.freeze({ ...context }), operation);
}

export function getRequestContext(): RequestContext | undefined {
  return requestContextStorage.getStore();
}

export function getRequestId(): string | undefined {
  return getRequestContext()?.requestId;
}
