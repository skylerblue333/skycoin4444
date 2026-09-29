import { isIP } from "node:net";

export type RemoteAudioErrorCode =
  | "FILE_TOO_LARGE"
  | "INVALID_FORMAT"
  | "SERVICE_ERROR";

export class RemoteAudioFetchError extends Error {
  readonly code: RemoteAudioErrorCode;
  readonly publicMessage: string;

  constructor(
    code: RemoteAudioErrorCode,
    publicMessage: string,
    details?: string
  ) {
    super(details ? `${publicMessage}: ${details}` : publicMessage);
    this.name = "RemoteAudioFetchError";
    this.code = code;
    this.publicMessage = publicMessage;
  }
}

export type DownloadedAudio = Readonly<{
  buffer: Buffer;
  mimeType: string;
}>;

type FetchLike = typeof fetch;

type DownloadAudioOptions = Readonly<{
  env?: NodeJS.ProcessEnv;
  fetchImpl?: FetchLike;
  maxBytes?: number;
  timeoutMs?: number;
}>;

export const MAX_TRANSCRIPTION_AUDIO_BYTES = 16 * 1024 * 1024;
export const TRANSCRIPTION_AUDIO_TIMEOUT_MS = 15_000;

function normalizeHost(value: string): string {
  return value.trim().toLowerCase().replace(/\.$/, "");
}

export function allowedAudioHostsFromEnv(
  env: NodeJS.ProcessEnv = process.env
): ReadonlySet<string> {
  const hosts = (env.VOICE_TRANSCRIPTION_ALLOWED_HOSTS ?? "")
    .split(",")
    .map(normalizeHost)
    .filter(Boolean);

  return new Set(hosts);
}

function isForbiddenLiteralOrLocalHost(hostname: string): boolean {
  const host = normalizeHost(hostname).replace(/^\[/, "").replace(/\]$/, "");

  if (host === "localhost" || host.endsWith(".localhost")) return true;

  const ipVersion = isIP(host);
  if (ipVersion === 6) {
    // Literal IPv6 addresses are intentionally unsupported at this boundary.
    // Operators should allowlist stable HTTPS hostnames instead.
    return true;
  }
  if (ipVersion !== 4) return false;

  const [a, b] = host.split(".").map(Number);
  if (a === 0 || a === 10 || a === 127) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;

  // Documentation, benchmarking, multicast, reserved, and broadcast ranges
  // are also invalid remote media sources for this server-side fetch.
  if (a === 192 && b === 0) return true;
  if (a === 198 && (b === 18 || b === 19 || b === 51)) return true;
  if (a === 203 && b === 0) return true;
  if (a >= 224) return true;

  return false;
}

export function validateAudioSourceUrl(
  rawUrl: string,
  env: NodeJS.ProcessEnv = process.env
): URL {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new RemoteAudioFetchError(
      "INVALID_FORMAT",
      "Audio URL is invalid"
    );
  }

  if (url.protocol !== "https:") {
    throw new RemoteAudioFetchError(
      "INVALID_FORMAT",
      "Audio URL must use HTTPS"
    );
  }

  if (url.username || url.password) {
    throw new RemoteAudioFetchError(
      "INVALID_FORMAT",
      "Audio URL must not contain credentials"
    );
  }

  if (url.port && url.port !== "443") {
    throw new RemoteAudioFetchError(
      "INVALID_FORMAT",
      "Audio URL must use the standard HTTPS port"
    );
  }

  const hostname = normalizeHost(url.hostname);
  if (!hostname || isForbiddenLiteralOrLocalHost(hostname)) {
    throw new RemoteAudioFetchError(
      "INVALID_FORMAT",
      "Audio source host is not allowed"
    );
  }

  const allowedHosts = allowedAudioHostsFromEnv(env);
  if (allowedHosts.size === 0) {
    throw new RemoteAudioFetchError(
      "SERVICE_ERROR",
      "Voice transcription audio-source allowlist is not configured"
    );
  }

  if (!allowedHosts.has(hostname)) {
    throw new RemoteAudioFetchError(
      "INVALID_FORMAT",
      "Audio source host is not allowed"
    );
  }

  return url;
}

function parseContentLength(value: string | null): number | null {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed >= 0 ? parsed : null;
}

function normalizeAudioMimeType(value: string | null): string | null {
  if (!value) return null;
  const mimeType = value.split(";", 1)[0]?.trim().toLowerCase() ?? "";
  return /^audio\/[a-z0-9.+-]+$/i.test(mimeType) ? mimeType : null;
}

function validatePositiveBound(value: number, field: string): number {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new RangeError(`${field} must be a positive safe integer`);
  }
  return value;
}

async function cancelResponseBody(response: Response): Promise<void> {
  if (!response.body) return;
  await response.body.cancel().catch(() => undefined);
}

export async function downloadAllowedAudio(
  rawUrl: string,
  options: DownloadAudioOptions = {}
): Promise<DownloadedAudio> {
  const env = options.env ?? process.env;
  const fetchImpl = options.fetchImpl ?? fetch;
  const maxBytes = validatePositiveBound(
    options.maxBytes ?? MAX_TRANSCRIPTION_AUDIO_BYTES,
    "maxBytes"
  );
  const timeoutMs = validatePositiveBound(
    options.timeoutMs ?? TRANSCRIPTION_AUDIO_TIMEOUT_MS,
    "timeoutMs"
  );
  const url = validateAudioSourceUrl(rawUrl, env);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchImpl(url.toString(), {
      method: "GET",
      redirect: "error",
      signal: controller.signal,
      headers: {
        accept: "audio/*",
      },
    });

    if (!response.ok) {
      await cancelResponseBody(response);
      throw new RemoteAudioFetchError(
        "INVALID_FORMAT",
        "Failed to download audio file",
        `HTTP ${response.status}`
      );
    }

    const declaredLength = parseContentLength(
      response.headers.get("content-length")
    );
    if (declaredLength !== null && declaredLength > maxBytes) {
      await cancelResponseBody(response);
      throw new RemoteAudioFetchError(
        "FILE_TOO_LARGE",
        "Audio file exceeds maximum size limit"
      );
    }

    const mimeType = normalizeAudioMimeType(
      response.headers.get("content-type")
    );
    if (!mimeType) {
      await cancelResponseBody(response);
      throw new RemoteAudioFetchError(
        "INVALID_FORMAT",
        "Audio source returned an unsupported content type"
      );
    }

    if (!response.body) {
      throw new RemoteAudioFetchError(
        "INVALID_FORMAT",
        "Audio source returned an empty response body"
      );
    }

    const reader = response.body.getReader();
    const chunks: Buffer[] = [];
    let totalBytes = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value || value.byteLength === 0) continue;

      totalBytes += value.byteLength;
      if (totalBytes > maxBytes) {
        await reader.cancel().catch(() => undefined);
        throw new RemoteAudioFetchError(
          "FILE_TOO_LARGE",
          "Audio file exceeds maximum size limit"
        );
      }

      chunks.push(Buffer.from(value));
    }

    if (totalBytes === 0) {
      throw new RemoteAudioFetchError(
        "INVALID_FORMAT",
        "Audio source returned an empty file"
      );
    }

    return Object.freeze({
      buffer: Buffer.concat(chunks, totalBytes),
      mimeType,
    });
  } catch (error) {
    if (error instanceof RemoteAudioFetchError) throw error;

    if (
      error instanceof Error &&
      (error.name === "AbortError" || controller.signal.aborted)
    ) {
      throw new RemoteAudioFetchError(
        "SERVICE_ERROR",
        "Timed out downloading audio file"
      );
    }

    throw new RemoteAudioFetchError(
      "SERVICE_ERROR",
      "Failed to fetch audio file"
    );
  } finally {
    clearTimeout(timeout);
  }
}
