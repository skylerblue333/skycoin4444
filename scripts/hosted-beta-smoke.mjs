import process from "node:process";

const REQUEST_TIMEOUT_MS = 10_000;

function resolveOrigin() {
  const raw = (
    process.env.HOSTED_BETA_ORIGIN ??
    process.env.BETA_PUBLIC_ORIGIN ??
    ""
  ).trim();

  if (!raw) {
    throw new Error(
      "HOSTED_BETA_ORIGIN or BETA_PUBLIC_ORIGIN is required"
    );
  }

  const url = new URL(raw);
  if (
    (url.protocol !== "https:" &&
      process.env.HOSTED_BETA_SMOKE_ALLOW_HTTP !== "true") ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    (url.pathname !== "/" && url.pathname !== "")
  ) {
    throw new Error(
      "Hosted beta origin must be an exact HTTPS origin with no credentials, path, query, or fragment"
    );
  }

  return url.origin;
}

function timeoutSignal() {
  return AbortSignal.timeout(REQUEST_TIMEOUT_MS);
}

async function request(origin, path, init = {}) {
  return fetch(origin + path, {
    redirect: "manual",
    ...init,
    signal: timeoutSignal(),
  });
}

async function requireOk(origin, path, label) {
  const response = await request(origin, path);
  if (!response.ok) {
    throw new Error(`${label} returned HTTP ${response.status}`);
  }
  console.log(`PASS ${label}: ${response.status}`);
  return response;
}

async function requireJson(origin, path, label) {
  const response = await request(origin, path, {
    headers: { accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`${label} returned HTTP ${response.status}`);
  }
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    throw new Error(`${label} did not return JSON`);
  }
  return { response, json: await response.json() };
}

function requirePublicContracts(readiness, auth, runtimeReady, health) {
  if (
    readiness.status !== "ready" ||
    readiness.database !== "ok" ||
    readiness.configuration !== "ok" ||
    readiness.authConfigured !== true ||
    readiness.identityVerification !== false ||
    readiness.liveFinancialOrChainExecution !== false
  ) {
    throw new Error("Beta readiness contract is not satisfied");
  }

  if (
    runtimeReady.status !== "ready" &&
    runtimeReady.status !== "ok"
  ) {
    throw new Error("Runtime readiness contract is not satisfied");
  }

  if (
    health.status !== "ok" ||
    health.liveFinancialOrChainExecution !== false
  ) {
    throw new Error("Beta health safety boundary is not satisfied");
  }

  if (
    !["oauth", "access_key"].includes(auth.mode) ||
    auth.configured !== true ||
    auth.identityVerification !== false ||
    auth.invitationRequired !== true
  ) {
    throw new Error("Beta authentication contract is not satisfied");
  }
}

function credentialPair() {
  const email = (process.env.BETA_SMOKE_EMAIL ?? "").trim();
  const accessKey = process.env.BETA_ACCESS_KEY ?? "";

  if (Boolean(email) !== Boolean(accessKey)) {
    throw new Error(
      "BETA_SMOKE_EMAIL and BETA_ACCESS_KEY must be provided together"
    );
  }

  return email && accessKey ? { email, accessKey } : null;
}

async function verifyCredentialedAccess(origin, auth) {
  const credentials = credentialPair();
  if (!credentials) {
    console.log(
      "SKIP credentialed session: BETA_SMOKE_EMAIL and BETA_ACCESS_KEY were not provided"
    );
    return;
  }

  if (auth.mode !== "access_key") {
    throw new Error(
      "Credentialed hosted smoke currently supports access_key mode only"
    );
  }

  const loginResponse = await request(origin, "/api/beta/access-login", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      email: credentials.email,
      accessKey: credentials.accessKey,
    }),
  });

  if (!loginResponse.ok) {
    throw new Error(
      `Credentialed beta login returned HTTP ${loginResponse.status}`
    );
  }

  const login = await loginResponse.json();
  if (login?.ok !== true || login?.identityVerification !== false) {
    throw new Error("Credentialed beta login contract is invalid");
  }

  const setCookie = loginResponse.headers.get("set-cookie") ?? "";
  const cookiePair = setCookie.split(";", 1)[0] ?? "";
  if (!cookiePair.startsWith("__Host-app_session_id=")) {
    throw new Error(
      "Credentialed beta login did not issue the canonical production session cookie"
    );
  }

  const authMeResponse = await request(origin, "/api/trpc/auth.me", {
    headers: {
      accept: "application/json",
      cookie: cookiePair,
    },
  });

  if (!authMeResponse.ok) {
    throw new Error(
      `Authenticated auth.me returned HTTP ${authMeResponse.status}`
    );
  }

  const authMe = await authMeResponse.json();
  const user = authMe?.result?.data?.json;
  if (!user || typeof user !== "object") {
    throw new Error(
      "Authenticated auth.me did not return a non-null user object"
    );
  }

  const wrongKey =
    credentials.accessKey === "x".repeat(64)
      ? "y".repeat(64)
      : "x".repeat(64);
  const denied = await request(origin, "/api/beta/access-login", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      email: credentials.email,
      accessKey: wrongKey,
    }),
  });
  const deniedBody = await denied.json().catch(() => ({}));
  if (
    denied.status !== 403 ||
    deniedBody?.error !== "invalid invitation credentials"
  ) {
    throw new Error(
      "Invalid invitation credentials did not fail with the generic denial contract"
    );
  }

  const logout = await request(origin, "/api/beta/access-logout", {
    method: "POST",
    headers: {
      accept: "application/json",
      cookie: cookiePair,
    },
  });
  if (!logout.ok) {
    throw new Error(
      `Credentialed beta logout returned HTTP ${logout.status}`
    );
  }

  console.log(
    "PASS credentialed session issuance: canonical cookie issued and protected auth state confirmed"
  );
  console.log(
    "PASS invalid credential denial: generic 403 response confirmed"
  );
  console.log("PASS credentialed logout");
}

async function main() {
  const origin = resolveOrigin();

  await requireOk(origin, "/", "home");
  await requireOk(origin, "/signin", "sign in");

  const health = await requireJson(
    origin,
    "/api/beta/health",
    "beta health"
  );
  console.log(`PASS beta health: ${health.response.status}`);

  const readiness = await requireJson(
    origin,
    "/api/beta/readiness",
    "beta readiness"
  );
  console.log(`PASS beta readiness: ${readiness.response.status}`);

  const runtimeReady = await requireJson(
    origin,
    "/api/runtime/ready",
    "runtime readiness"
  );
  console.log(`PASS runtime readiness: ${runtimeReady.response.status}`);

  const auth = await requireJson(
    origin,
    "/api/beta/auth",
    "beta auth"
  );
  console.log(`PASS beta auth: ${auth.response.status}`);

  requirePublicContracts(
    readiness.json,
    auth.json,
    runtimeReady.json,
    health.json
  );
  console.log(
    "PASS public beta contract: readiness, auth, database, and safety boundaries verified"
  );

  await verifyCredentialedAccess(origin, auth.json);

  console.log("Hosted beta smoke verification passed");
}

main().catch(error => {
  const message =
    error instanceof Error ? error.message : "unknown smoke verification error";
  console.error(`Hosted beta smoke verification failed: ${message}`);
  process.exitCode = 1;
});
