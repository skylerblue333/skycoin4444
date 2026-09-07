import process from "node:process";
import { randomUUID } from "node:crypto";
import {
  createTRPCUntypedClient,
  httpBatchLink,
} from "@trpc/client";
import superjson from "superjson";

const REQUEST_TIMEOUT_MS = 10_000;
const DELETE_CONFIRMATION = "DELETE MY BETA ACCOUNT";

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

function credentialPair() {
  const email = (process.env.BETA_SMOKE_EMAIL ?? "").trim();
  const accessKey = process.env.BETA_ACCESS_KEY ?? "";

  if (!email || !accessKey) {
    throw new Error(
      "BETA_SMOKE_EMAIL and BETA_ACCESS_KEY are required for the full hosted journey"
    );
  }

  return { email, accessKey };
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

function sessionCookie(response) {
  const setCookie = response.headers.get("set-cookie") ?? "";
  const cookiePair = setCookie.split(";", 1)[0] ?? "";
  if (!cookiePair.startsWith("__Host-app_session_id=")) {
    throw new Error(
      "Credentialed beta login did not issue the canonical production session cookie"
    );
  }
  return cookiePair;
}

async function login(origin, credentials) {
  const response = await request(origin, "/api/beta/access-login", {
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

  if (!response.ok) {
    throw new Error(
      `Credentialed beta login returned HTTP ${response.status}`
    );
  }

  const body = await response.json();
  if (body?.ok !== true || body?.identityVerification !== false) {
    throw new Error("Credentialed beta login contract is invalid");
  }

  return sessionCookie(response);
}

async function logout(origin, cookiePair) {
  const response = await request(origin, "/api/beta/access-logout", {
    method: "POST",
    headers: {
      accept: "application/json",
      cookie: cookiePair,
    },
  });
  if (!response.ok) {
    throw new Error(`Credentialed logout returned HTTP ${response.status}`);
  }
}

function trpcClient(origin, cookiePair) {
  return createTRPCUntypedClient({
    links: [
      httpBatchLink({
        url: origin + "/api/trpc",
        transformer: superjson,
        fetch(input, init) {
          const headers = new Headers(init?.headers);
          headers.set("cookie", cookiePair);
          headers.set("accept", "application/json");
          return fetch(input, {
            ...(init ?? {}),
            headers,
            redirect: "manual",
            signal: timeoutSignal(),
          });
        },
      }),
    ],
  });
}

async function requirePage(origin, path, label) {
  const response = await request(origin, path, {
    headers: { accept: "text/html" },
  });
  if (!response.ok) {
    throw new Error(`${label} returned HTTP ${response.status}`);
  }
  console.log(`PASS ${label}: ${response.status}`);
}

function requireOwnedExport(exported, userId, markers) {
  if (
    exported?.subjectId !== userId ||
    exported?.schemaVersion !== 1 ||
    typeof exported?.data !== "object" ||
    !exported.data
  ) {
    throw new Error("Authenticated data export subject contract is invalid");
  }

  const profile = exported.data.profile;
  if (!profile || profile.id !== userId) {
    throw new Error("Authenticated export profile does not match session subject");
  }

  const socialPosts = exported.data.social?.posts;
  if (
    !Array.isArray(socialPosts) ||
    !socialPosts.some(
      row => row?.id === markers.postId && row?.userId === userId
    ) ||
    socialPosts.some(row => row?.userId && row.userId !== userId)
  ) {
    throw new Error("Authenticated social export is not scoped to the smoke subject");
  }

  const learning = exported.data.learning;
  if (
    !Array.isArray(learning) ||
    !learning.some(
      row =>
        row?.courseId === markers.courseId &&
        row?.lessonId === markers.lessonId &&
        row?.userId === userId
    ) ||
    learning.some(row => row?.userId && row.userId !== userId)
  ) {
    throw new Error("Authenticated learning export is not scoped to the smoke subject");
  }

  const feedback = exported.data.feedback;
  if (
    !Array.isArray(feedback) ||
    !feedback.some(
      row => row?.id === markers.feedbackId && row?.userId === userId
    ) ||
    feedback.some(row => row?.userId && row.userId !== userId)
  ) {
    throw new Error("Authenticated feedback export is not scoped to the smoke subject");
  }
}

async function main() {
  const origin = resolveOrigin();
  const credentials = credentialPair();
  const runId = randomUUID().replaceAll("-", "").slice(0, 12);
  const username = `release_smoke_${runId}`;
  const courseId = "release-smoke-course";
  const lessonId = `release-smoke-${runId}`;
  const postContent = `Release smoke social persistence ${runId}`;
  const feedbackSummary = `Release smoke feedback ${runId}`;

  await requirePage(origin, "/signin", "sign-in page");

  let cookiePair = await login(origin, credentials);
  console.log("PASS invited login: canonical production session issued");

  let client = trpcClient(origin, cookiePair);

  const user = await client.query("auth.me");
  if (!user || typeof user !== "object" || typeof user.id !== "string") {
    throw new Error("Authenticated auth.me did not return a session user");
  }
  const userId = user.id;

  const initialActivation = await client.query("activation.status");
  if (!initialActivation || typeof initialActivation.percent !== "number") {
    throw new Error("Protected activation route did not return account evidence");
  }
  console.log("PASS authenticated protected route");

  const updatedProfile = await client.mutation("user.updateProfile", {
    displayName: "Release Smoke Tester",
    username,
    bio: "Disposable SKYCOIN4444 hosted release smoke identity.",
    profileVisibility: "private",
  });
  if (
    updatedProfile?.id !== userId ||
    updatedProfile?.username !== username ||
    updatedProfile?.name !== "Release Smoke Tester"
  ) {
    throw new Error("Profile update did not return the persisted smoke profile");
  }

  await logout(origin, cookiePair);
  cookiePair = await login(origin, credentials);
  client = trpcClient(origin, cookiePair);

  const profileAfterRelogin = await client.query("user.profile");
  if (
    profileAfterRelogin?.id !== userId ||
    profileAfterRelogin?.username !== username ||
    profileAfterRelogin?.name !== "Release Smoke Tester"
  ) {
    throw new Error("Profile did not survive logout and re-authentication");
  }
  console.log("PASS profile persistence across re-authentication");

  const completed = await client.mutation("learningProgress.complete", {
    courseId,
    lessonId,
  });
  if (completed?.completed !== true) {
    throw new Error("SkySchool learning progress mutation did not complete");
  }

  const learningRows = await client.query("learningProgress.get", {
    courseId,
  });
  if (
    !Array.isArray(learningRows) ||
    !learningRows.some(row => row?.lessonId === lessonId)
  ) {
    throw new Error("SkySchool completion did not persist");
  }
  console.log("PASS SkySchool completion persistence");

  const post = await client.mutation("social.createPost", {
    content: postContent,
    media: null,
  });
  if (
    !post ||
    typeof post.id !== "string" ||
    post.userId !== userId ||
    post.content !== postContent
  ) {
    throw new Error("Social post did not persist for the smoke subject");
  }
  console.log("PASS social post persistence");

  const feedback = await client.mutation("betaFeedback.submit", {
    category: "other",
    severity: "low",
    route: "/release-smoke",
    summary: feedbackSummary,
    details:
      "Automated hosted release journey verifies durable engineering-beta feedback.",
    expected: "Feedback persists for the authenticated smoke subject.",
    actual: "Feedback persisted and returned received status.",
  });
  if (
    !feedback ||
    typeof feedback.id !== "string" ||
    feedback.status !== "received"
  ) {
    throw new Error("Beta feedback did not persist");
  }
  console.log("PASS beta feedback persistence");

  const activation = await client.query("activation.status");
  if (
    activation?.activated !== true ||
    activation?.percent !== 100 ||
    activation?.completedCount !== activation?.totalCount ||
    activation?.totalCount !== 5
  ) {
    throw new Error("Persisted activation evidence did not reach 100 percent");
  }

  await requirePage(origin, "/onboarding", "onboarding route");
  console.log("PASS onboarding activation: 100% from persisted records");

  const exported = await client.query("privacy.exportData");
  requireOwnedExport(exported, userId, {
    postId: post.id,
    courseId,
    lessonId,
    feedbackId: feedback.id,
  });
  console.log("PASS authenticated data export ownership and smoke records");

  const deletion = await client.mutation("privacy.requestDeletion", {
    confirmation: DELETE_CONFIRMATION,
    reason: "Disposable hosted release smoke identity cleanup request.",
  });
  if (
    !deletion ||
    deletion.status !== "requested" ||
    typeof deletion.id !== "string" ||
    !String(deletion.message ?? "").toLowerCase().includes("not mean") ||
    !String(deletion.message ?? "").toLowerCase().includes("erased")
  ) {
    throw new Error(
      "Deletion request did not preserve the request-only / no-erasure claim"
    );
  }

  const requests = await client.query("privacy.myRequests");
  if (
    !Array.isArray(requests) ||
    !requests.some(
      row => row?.id === deletion.id && row?.status === "requested"
    )
  ) {
    throw new Error("Deletion request was not persisted");
  }
  console.log("PASS deletion-request persistence and no-erasure boundary");

  await logout(origin, cookiePair);
  console.log("PASS hosted invitation-beta full persisted journey");
}

main().catch(error => {
  const message =
    error instanceof Error
      ? error.message
      : "unknown hosted journey verification error";
  console.error(`Hosted beta full journey failed: ${message}`);
  process.exitCode = 1;
});
