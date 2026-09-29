import type { Express } from "express";
import { ENV } from "./env";
import { sanitizeOperationalError } from "./operationalError";

const STORAGE_PROXY_ERROR_SUMMARY_MAX = 1_000;
export const STORAGE_PROXY_REQUEST_TIMEOUT_MS = 10_000;
const LOCAL_REDIRECT_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

export function normalizeStorageRedirectUrl(
  value: unknown,
  env: NodeJS.ProcessEnv = process.env
): string | null {
  if (typeof value !== "string") return null;
  const original = value.trim();
  if (!original) return null;

  try {
    const url = new URL(original);
    if (url.username || url.password) return null;

    if (url.protocol === "https:") {
      // Validate with WHATWG URL parsing, but preserve the provider's exact
      // signed URL bytes. Re-serializing can normalize signature-sensitive
      // host, port, or path representation.
      return original;
    }

    if (
      env.NODE_ENV !== "production" &&
      url.protocol === "http:" &&
      LOCAL_REDIRECT_HOSTS.has(url.hostname)
    ) {
      return original;
    }

    return null;
  } catch {
    return null;
  }
}

export function createStorageProxyRequestInit(apiKey: string): RequestInit {
  return {
    headers: { Authorization: `Bearer ${apiKey}` },
    signal: AbortSignal.timeout(STORAGE_PROXY_REQUEST_TIMEOUT_MS),
  };
}

export function registerStorageProxy(app: Express) {
  app.get("/manus-storage/*key", async (req, res) => {
    res.set("Cache-Control", "no-store");

    const params = req.params as unknown as Record<string, string | string[]>;
    const rawKey = params.key;
    const key = Array.isArray(rawKey) ? rawKey[0] : rawKey;
    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }

    if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
      res.status(500).send("Storage proxy not configured");
      return;
    }

    try {
      const forgeUrl = new URL(
        "v1/storage/presign/get",
        ENV.forgeApiUrl.replace(/\/+$/, "") + "/"
      );
      forgeUrl.searchParams.set("path", key);

      const forgeResp = await fetch(
        forgeUrl,
        createStorageProxyRequestInit(ENV.forgeApiKey)
      );

      if (!forgeResp.ok) {
        // Do not log an untrusted provider response body. It may contain
        // credentials, signed URLs, internal diagnostics, or arbitrarily large
        // content. Status is enough for operator triage.
        console.error(
          `[StorageProxy] forge error: HTTP ${forgeResp.status}`
        );
        res.status(502).send("Storage backend error");
        return;
      }

      const payload = (await forgeResp.json()) as { url?: unknown };
      const redirectUrl = normalizeStorageRedirectUrl(payload.url);
      if (!redirectUrl) {
        console.error(
          "[StorageProxy] forge returned an unsafe or invalid signed URL"
        );
        res.status(502).send("Invalid signed URL from backend");
        return;
      }

      res.redirect(307, redirectUrl);
    } catch (error) {
      console.error(
        `[StorageProxy] failed: ${sanitizeOperationalError(
          error,
          STORAGE_PROXY_ERROR_SUMMARY_MAX
        )}`
      );
      res.status(502).send("Storage proxy error");
    }
  });
}
