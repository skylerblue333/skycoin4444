import http from "node:http";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { afterEach, describe, expect, it } from "vitest";

const execFileAsync = promisify(execFile);
const servers: http.Server[] = [];

function json(
  res: http.ServerResponse,
  status: number,
  body: unknown,
  headers: Record<string, string> = {}
) {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    ...headers,
  });
  res.end(JSON.stringify(body));
}

async function readJson(req: http.IncomingMessage) {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
}

async function createMockHost(options?: {
  email?: string;
  accessKey?: string;
  sessionValue?: string;
}) {
  const email = options?.email ?? "tester@example.test";
  const accessKey = options?.accessKey ?? "K".repeat(64);
  const sessionValue = options?.sessionValue ?? "mock-session-jwt-value";

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", "http://127.0.0.1");

    if (req.method === "GET" && ["/", "/signin"].includes(url.pathname)) {
      res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      res.end("<!doctype html><title>SKYCOIN4444 Engineering Beta</title>");
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/beta/health") {
      json(res, 200, {
        status: "ok",
        releaseChannel: "invitation-only-engineering-beta",
        liveFinancialOrChainExecution: false,
      });
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/beta/readiness") {
      json(res, 200, {
        status: "ready",
        database: "ok",
        configuration: "ok",
        authMode: "access_key",
        authConfigured: true,
        identityVerification: false,
        liveFinancialOrChainExecution: false,
      });
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/runtime/ready") {
      json(res, 200, { status: "ready" });
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/beta/auth") {
      json(res, 200, {
        mode: "access_key",
        configured: true,
        identityVerification: false,
        invitationRequired: true,
      });
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/beta/access-login") {
      const input = await readJson(req);
      if (input.email === email && input.accessKey === accessKey) {
        json(
          res,
          200,
          {
            ok: true,
            redirect: "/",
            identityVerification: false,
            admission: "invite_allowlist_plus_access_key",
          },
          {
            "set-cookie":
              "__Host-app_session_id=" +
              sessionValue +
              "; Path=/; Secure; HttpOnly; SameSite=None",
          }
        );
      } else {
        json(res, 403, { error: "invalid invitation credentials" });
      }
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/trpc/auth.me") {
      const cookie = req.headers.cookie ?? "";
      if (cookie.includes(sessionValue)) {
        json(res, 200, {
          result: {
            data: {
              json: {
                id: "redacted-test-user",
                role: "user",
              },
            },
          },
        });
      } else {
        json(res, 200, { result: { data: { json: null } } });
      }
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/beta/access-logout") {
      json(res, 200, { ok: true });
      return;
    }

    json(res, 404, { error: "not found" });
  });

  servers.push(server);
  await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("mock server did not bind to a TCP port");
  }

  return {
    origin: `http://127.0.0.1:${address.port}`,
    email,
    accessKey,
    sessionValue,
  };
}

afterEach(async () => {
  await Promise.all(
    servers.splice(0).map(
      server =>
        new Promise<void>(resolve => server.close(() => resolve()))
    )
  );
});

describe("hosted beta smoke verifier", () => {
  it("verifies public readiness without requiring credentials", async () => {
    const host = await createMockHost();
    const script = path.resolve("scripts/hosted-beta-smoke.mjs");

    const { stdout, stderr } = await execFileAsync(process.execPath, [script], {
      cwd: process.cwd(),
      env: {
        ...process.env,
        HOSTED_BETA_ORIGIN: host.origin,
        HOSTED_BETA_SMOKE_ALLOW_HTTP: "true",
        BETA_SMOKE_EMAIL: "",
        BETA_ACCESS_KEY: "",
      },
    });

    expect(stderr).toBe("");
    expect(stdout).toMatch(/PASS public beta contract/);
    expect(stdout).toMatch(/SKIP credentialed session/);
    expect(stdout).toMatch(/Hosted beta smoke verification passed/);
  });

  it("verifies a credentialed session without leaking credentials or tokens", async () => {
    const host = await createMockHost({
      email: "secret.tester@example.test",
      accessKey: "S".repeat(64),
      sessionValue: "jwt-that-must-never-be-printed",
    });
    const script = path.resolve("scripts/hosted-beta-smoke.mjs");

    const { stdout, stderr } = await execFileAsync(process.execPath, [script], {
      cwd: process.cwd(),
      env: {
        ...process.env,
        HOSTED_BETA_ORIGIN: host.origin,
        HOSTED_BETA_SMOKE_ALLOW_HTTP: "true",
        BETA_SMOKE_EMAIL: host.email,
        BETA_ACCESS_KEY: host.accessKey,
      },
    });

    const combined = stdout + stderr;
    expect(stderr).toBe("");
    expect(stdout).toMatch(/PASS credentialed session issuance/);
    expect(stdout).toMatch(/PASS invalid credential denial/);
    expect(stdout).toMatch(/PASS credentialed logout/);
    expect(combined).not.toContain(host.email);
    expect(combined).not.toContain(host.accessKey);
    expect(combined).not.toContain(host.sessionValue);
    expect(combined).not.toContain("__Host-app_session_id=");
  });
});
