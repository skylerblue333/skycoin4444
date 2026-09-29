/**
 * Image generation helper using internal ImageService
 *
 * This module intentionally treats the external provider as untrusted input:
 * requests are time-bounded, provider error bodies are not surfaced, and
 * successful JSON payloads are validated before bytes reach storage.
 */
import { storagePut } from "server/storage";
import { ENV } from "./env";

const DEFAULT_IMAGE_MODEL = "MODEL_GPT_IMAGE_2";
const DEFAULT_IMAGE_QUALITY = "medium";
const IMAGE_GENERATION_TIMEOUT_MS = 120_000;
const IMAGE_MODELS_TIMEOUT_MS = 15_000;
const MAX_GENERATED_IMAGE_BYTES = 32 * 1024 * 1024;
const ALLOWED_IMAGE_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/avif",
]);

export type GenerateImageOptions = {
  prompt: string;
  originalImages?: Array<{
    url?: string;
    b64Json?: string;
    mimeType?: string;
  }>;
  model?: string;
  quality?: string;
};

export type GenerateImageResponse = {
  url?: string;
};

type GeneratedImagePayload = {
  image: {
    b64Json: string;
    mimeType: string;
  };
};

async function fetchJsonWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number,
  operation: string,
): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
    });

    if (!response.ok) {
      try {
        await response.body?.cancel();
      } catch {
        // The request is already failing; cancellation is best-effort cleanup.
      }
      throw new Error(
        `${operation} failed (${response.status} ${response.statusText})`,
      );
    }

    try {
      return await response.json();
    } catch (error) {
      if (controller.signal.aborted) {
        throw new Error(`${operation} timed out after ${timeoutMs}ms`);
      }
      throw new Error(`${operation} returned invalid JSON`);
    }
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error(`${operation} timed out after ${timeoutMs}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

function requireForgeConfig() {
  if (!ENV.forgeApiUrl) {
    throw new Error("BUILT_IN_FORGE_API_URL is not configured");
  }
  if (!ENV.forgeApiKey) {
    throw new Error("BUILT_IN_FORGE_API_KEY is not configured");
  }

  const baseUrl = ENV.forgeApiUrl.endsWith("/")
    ? ENV.forgeApiUrl
    : `${ENV.forgeApiUrl}/`;

  let parsed: URL;
  try {
    parsed = new URL(baseUrl);
  } catch {
    throw new Error("BUILT_IN_FORGE_API_URL is invalid");
  }

  if (
    parsed.protocol !== "https:" &&
    !(process.env.NODE_ENV !== "production" &&
      parsed.protocol === "http:" &&
      (parsed.hostname === "localhost" ||
        parsed.hostname === "127.0.0.1" ||
        parsed.hostname === "::1"))
  ) {
    throw new Error("BUILT_IN_FORGE_API_URL must use HTTPS");
  }

  return { baseUrl: parsed.toString(), apiKey: ENV.forgeApiKey };
}

function parseGeneratedImagePayload(value: unknown): GeneratedImagePayload {
  if (!value || typeof value !== "object") {
    throw new Error("Image provider returned an invalid response payload");
  }

  const image = (value as { image?: unknown }).image;
  if (!image || typeof image !== "object") {
    throw new Error("Image provider returned an invalid response payload");
  }

  const { b64Json, mimeType } = image as {
    b64Json?: unknown;
    mimeType?: unknown;
  };

  if (typeof b64Json !== "string" || b64Json.trim().length === 0) {
    throw new Error("Image provider returned missing image bytes");
  }
  if (
    typeof mimeType !== "string" ||
    !ALLOWED_IMAGE_MIME_TYPES.has(mimeType.toLowerCase())
  ) {
    throw new Error("Image provider returned an unsupported image MIME type");
  }

  return {
    image: {
      b64Json,
      mimeType: mimeType.toLowerCase(),
    },
  };
}

function decodeGeneratedImage(base64Data: string): Buffer {
  const normalized = base64Data.replace(/\s+/g, "");
  if (
    normalized.length === 0 ||
    normalized.length % 4 === 1 ||
    !/^[A-Za-z0-9+/]*={0,2}$/.test(normalized)
  ) {
    throw new Error("Image provider returned invalid base64 image bytes");
  }

  const buffer = Buffer.from(normalized, "base64");
  if (buffer.length === 0) {
    throw new Error("Image provider returned empty image bytes");
  }
  if (buffer.length > MAX_GENERATED_IMAGE_BYTES) {
    throw new Error("Image provider returned an image larger than the allowed limit");
  }

  return buffer;
}

export async function generateImage(
  options: GenerateImageOptions,
): Promise<GenerateImageResponse> {
  const { baseUrl, apiKey } = requireForgeConfig();
  const fullUrl = new URL(
    "images.v1.ImageService/GenerateImage",
    baseUrl,
  ).toString();

  const model = options.model ?? DEFAULT_IMAGE_MODEL;
  const quality =
    options.quality ??
    (model === DEFAULT_IMAGE_MODEL ? DEFAULT_IMAGE_QUALITY : undefined);

  const raw = await fetchJsonWithTimeout(
    fullUrl,
    {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "connect-protocol-version": "1",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt: options.prompt,
        original_images: options.originalImages || [],
        model,
        ...(quality ? { quality } : {}),
      }),
    },
    IMAGE_GENERATION_TIMEOUT_MS,
    "Image generation request",
  );

  const result = parseGeneratedImagePayload(raw);
  const buffer = decodeGeneratedImage(result.image.b64Json);

  const { url } = await storagePut(
    `generated/${Date.now()}.png`,
    buffer,
    result.image.mimeType,
  );

  return { url };
}

export type ImageModelInfo = {
  model?: string;
  id?: string;
};

export type ListImageModelsResponse = {
  models: ImageModelInfo[];
};

function parseImageModelsPayload(value: unknown): ListImageModelsResponse {
  if (!value || typeof value !== "object") {
    throw new Error("Image model provider returned an invalid response payload");
  }

  const models = (value as { models?: unknown }).models;
  if (!Array.isArray(models)) {
    throw new Error("Image model provider returned an invalid models list");
  }

  const normalized = models.map((model, index) => {
    if (!model || typeof model !== "object") {
      throw new Error(`Image model provider returned an invalid model at index ${index}`);
    }

    const { id, model: modelName } = model as {
      id?: unknown;
      model?: unknown;
    };

    if (id !== undefined && typeof id !== "string") {
      throw new Error(`Image model provider returned an invalid id at index ${index}`);
    }
    if (modelName !== undefined && typeof modelName !== "string") {
      throw new Error(`Image model provider returned an invalid model name at index ${index}`);
    }

    return {
      ...(id !== undefined ? { id } : {}),
      ...(modelName !== undefined ? { model: modelName } : {}),
    };
  });

  return { models: normalized };
}

export async function listImageModels(): Promise<ListImageModelsResponse> {
  const { baseUrl, apiKey } = requireForgeConfig();
  const fullUrl = new URL(
    "images.v1.ImageService/ListModels",
    baseUrl,
  ).toString();

  const raw = await fetchJsonWithTimeout(
    fullUrl,
    {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "connect-protocol-version": "1",
        authorization: `Bearer ${apiKey}`,
      },
      body: "{}",
    },
    IMAGE_MODELS_TIMEOUT_MS,
    "List image models request",
  );

  return parseImageModelsPayload(raw);
}
