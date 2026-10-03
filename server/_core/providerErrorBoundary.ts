export class UpstreamHttpError extends Error {
  readonly status: number;
  readonly operation: string;

  constructor(operation: string, status: number) {
    super(`${operation} failed with upstream status ${status}`);
    this.name = "UpstreamHttpError";
    this.operation = operation;
    this.status = status;
  }
}

export async function createUpstreamHttpError(
  response: Response,
  operation: string
): Promise<UpstreamHttpError> {
  if (response.body) {
    await response.body.cancel().catch(() => undefined);
  }

  return new UpstreamHttpError(operation, response.status);
}
