import crypto from "node:crypto";
import express, { type Express, type Request } from "express";
import { sdk } from "./sdk";
import { storagePut } from "../storage";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 10;

const supportedContentTypes = {
  "image/gif": "gif",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

type SupportedContentType = keyof typeof supportedContentTypes;

type RateLimitState = {
  count: number;
  resetAt: number;
};

const uploadRateLimits = new Map<string, RateLimitState>();

function isSupportedContentType(
  value: string | undefined
): value is SupportedContentType {
  return Boolean(value && value in supportedContentTypes);
}

function hasExpectedImageSignature(
  contentType: SupportedContentType,
  data: Buffer
): boolean {
  if (contentType === "image/png") {
    return data
      .subarray(0, 8)
      .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  }
  if (contentType === "image/jpeg") {
    return (
      data.length >= 3 &&
      data[0] === 0xff &&
      data[1] === 0xd8 &&
      data[2] === 0xff
    );
  }
  if (contentType === "image/gif") {
    return (
      data.subarray(0, 6).equals(Buffer.from("GIF87a")) ||
      data.subarray(0, 6).equals(Buffer.from("GIF89a"))
    );
  }
  return (
    data.subarray(0, 4).equals(Buffer.from("RIFF")) &&
    data.subarray(8, 12).equals(Buffer.from("WEBP"))
  );
}

function canUpload(userId: string): boolean {
  const now = Date.now();
  const current = uploadRateLimits.get(userId);
  if (!current || now >= current.resetAt) {
    uploadRateLimits.set(userId, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return true;
  }
  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  current.count += 1;
  return true;
}

function contentTypeFromRequest(req: Request): string | undefined {
  const header = req.headers["content-type"];
  if (!header) return undefined;
  return header.split(";", 1)[0]?.trim().toLowerCase();
}

export function registerUploadRoutes(app: Express) {
  app.post(
    "/api/uploads/images",
    express.raw({
      type: Object.keys(supportedContentTypes),
      limit: MAX_UPLOAD_BYTES,
    }),
    async (req, res) => {
      const contentType = contentTypeFromRequest(req);
      if (!isSupportedContentType(contentType)) {
        res.status(415).json({
          error: "Only PNG, JPEG, GIF, and WebP images are supported.",
        });
        return;
      }

      const user = await sdk.authenticateRequest(req).catch(() => null);
      if (!user) {
        res
          .status(401)
          .json({ error: "Authentication is required to upload images." });
        return;
      }
      if (!canUpload(String(user.id))) {
        res.status(429).json({
          error: "Upload rate limit exceeded. Please try again shortly.",
        });
        return;
      }

      const body = req.body;
      if (!Buffer.isBuffer(body) || body.length === 0) {
        res.status(400).json({ error: "An image file is required." });
        return;
      }
      if (!hasExpectedImageSignature(contentType, body)) {
        res.status(400).json({
          error: "The uploaded file does not match its declared image type.",
        });
        return;
      }

      try {
        const extension = supportedContentTypes[contentType];
        const key = `uploads/${String(user.id)}/${crypto.randomUUID()}.${extension}`;
        const result = await storagePut(key, body, contentType);
        res.status(201).json(result);
      } catch (error) {
        console.error("Image upload failed", {
          userId: user.id,
          error: error instanceof Error ? error.message : "unknown",
        });
        res
          .status(503)
          .json({ error: "Image uploads are temporarily unavailable." });
      }
    }
  );
}
