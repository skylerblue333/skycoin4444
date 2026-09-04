import type { Express } from "express";

export type SecurityHeaderMap = Readonly<Record<string, string>>;

export const PRODUCTION_CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline'",
  "script-src-attr 'none'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https:",
  "connect-src 'self' https: wss:",
  "media-src 'self' blob: https:",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

export function securityHeadersFor(
  env: NodeJS.ProcessEnv = process.env
): SecurityHeaderMap {
  const headers: Record<string, string> = {
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
    "X-Frame-Options": "DENY",
    "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    "Cross-Origin-Resource-Policy": "same-origin",
    "Origin-Agent-Cluster": "?1",
    "X-DNS-Prefetch-Control": "off",
  };

  if (env.NODE_ENV === "production") {
    headers["Strict-Transport-Security"] = "max-age=31536000";
    headers["Content-Security-Policy"] = PRODUCTION_CONTENT_SECURITY_POLICY;
  }

  return Object.freeze(headers);
}

export function registerSecurityHeaders(
  app: Express,
  env: NodeJS.ProcessEnv = process.env
): void {
  const headers = securityHeadersFor(env);
  app.use((_req, res, next) => {
    for (const [name, value] of Object.entries(headers)) {
      res.setHeader(name, value);
    }
    next();
  });
}
