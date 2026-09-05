import type { Express, Request, Response } from "express";
import * as db from "../db";
import { evaluateBetaAdmission } from "./betaAdmission";
import {
  betaAccessKeyIssue,
  betaAccessOpenId,
  betaAuthMode,
  normalizeBetaEmail,
  verifyBetaAccessKey,
} from "./betaAccessAuth";
import {
  getSessionCookieName,
  getSessionCookieNamesToClear,
  getSessionCookieOptions,
} from "./cookies";
import { sdk } from "./sdk";
import { sessionLifetimePolicyFromEnv } from "./sessionPolicy";

const NO_STORE = "no-store";

function accessAuthConfigured() {
  return betaAuthMode() === "access_key" && !betaAccessKeyIssue();
}

function clearSessionCookies(req: Request, res: Response) {
  const cookieOptions = getSessionCookieOptions(req);
  for (const cookieName of getSessionCookieNamesToClear()) {
    res.clearCookie(cookieName, {
      ...cookieOptions,
      maxAge: -1,
    });
  }
}

export function registerBetaAccessAuthRoutes(app: Express) {
  app.get("/api/beta/auth", (_req, res) => {
    res.set("Cache-Control", NO_STORE);
    const mode = betaAuthMode();
    res.json({
      mode,
      configured:
        mode === "access_key"
          ? accessAuthConfigured()
          : Boolean(
              process.env.VITE_APP_ID?.trim() &&
                process.env.OAUTH_SERVER_URL?.trim() &&
                process.env.VITE_OAUTH_PORTAL_URL?.trim()
            ),
      identityVerification: false,
      invitationRequired: true,
    });
  });

  app.post("/api/beta/access-login", async (req, res) => {
    res.set("Cache-Control", NO_STORE);

    if (betaAuthMode() !== "access_key" || !accessAuthConfigured()) {
      res.status(404).json({ error: "beta access-key authentication is disabled" });
      return;
    }

    const email = normalizeBetaEmail(req.body?.email);
    const accessKey =
      typeof req.body?.accessKey === "string" ? req.body.accessKey : "";

    if (!email || !accessKey) {
      res.status(400).json({ error: "email and access key are required" });
      return;
    }

    const openId = betaAccessOpenId(email);
    const admission = evaluateBetaAdmission({ openId, email });
    const keyValid = verifyBetaAccessKey(accessKey);

    // Deliberately use one generic failure for both checks to avoid exposing
    // whether a submitted address is on the invitation allowlist.
    if (!admission.allowed || !keyValid) {
      res.status(403).json({ error: "invalid invitation credentials" });
      return;
    }

    const user = await db.upsertUser({
      openId,
      email,
      name: "Invited Beta Tester",
    });
    if (!user) {
      res.status(500).json({ error: "unable to create beta session" });
      return;
    }

    const sessionTtlMs = sessionLifetimePolicyFromEnv().ttlMs;
    const sessionToken = await sdk.createSessionToken(openId, {
      name: user.name || "Invited Beta Tester",
      expiresInMs: sessionTtlMs,
    });

    const cookieOptions = getSessionCookieOptions(req);
    const sessionCookieName = getSessionCookieName();
    for (const cookieName of getSessionCookieNamesToClear()) {
      if (cookieName === sessionCookieName) continue;
      res.clearCookie(cookieName, {
        ...cookieOptions,
        maxAge: -1,
      });
    }
    res.cookie(sessionCookieName, sessionToken, {
      ...cookieOptions,
      maxAge: sessionTtlMs,
    });

    res.json({
      ok: true,
      redirect: "/",
      identityVerification: false,
      admission: "invite_allowlist_plus_access_key",
    });
  });

  app.post("/api/beta/access-logout", (req, res) => {
    res.set("Cache-Control", NO_STORE);
    clearSessionCookies(req, res);
    res.json({ ok: true });
  });
}
