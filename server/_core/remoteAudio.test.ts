import { describe, expect, it, vi } from "vitest";
import {
  RemoteAudioFetchError,
  allowedAudioHostsFromEnv,
  downloadAllowedAudio,
  validateAudioSourceUrl,
} from "./remoteAudio";

const env = {
  NODE_ENV: "production",
  VOICE_TRANSCRIPTION_ALLOWED_HOSTS: "media.example.com,cdn.example.com",
} as NodeJS.ProcessEnv;

describe("remote audio source policy", () => {
  it("normalizes the configured allowlist", () => {
    expect(
      [...allowedAudioHostsFromEnv({
        VOICE_TRANSCRIPTION_ALLOWED_HOSTS:
          " Media.Example.com.,cdn.example.com ",
      } as NodeJS.ProcessEnv)]
    ).toEqual(["media.example.com", "cdn.example.com"]);
  });

  it("requires an explicit allowlist", () => {
    expect(() =>
      validateAudioSourceUrl(
        "https://media.example.com/audio.webm",
        {} as NodeJS.ProcessEnv
      )
    ).toThrow(/allowlist is not configured/);
  });

  it("rejects non-HTTPS, credentialed, and unapproved sources", () => {
    expect(() =>
      validateAudioSourceUrl("http://media.example.com/audio.webm", env)
    ).toThrow(/must use HTTPS/);

    expect(() =>
      validateAudioSourceUrl(
        "https://user:pass@media.example.com/audio.webm",
        env
      )
    ).toThrow(/must not contain credentials/);

    expect(() =>
      validateAudioSourceUrl("https://evil.example.com/audio.webm", env)
    ).toThrow(/host is not allowed/);
  });

  it("rejects local and private literal addresses even if configured", () => {
    const unsafeEnv = {
      VOICE_TRANSCRIPTION_ALLOWED_HOSTS: "127.0.0.1,10.0.0.2",
    } as NodeJS.ProcessEnv;

    expect(() =>
      validateAudioSourceUrl("https://127.0.0.1/audio.webm", unsafeEnv)
    ).toThrow(/host is not allowed/);

    expect(() =>
      validateAudioSourceUrl("https://10.0.0.2/audio.webm", unsafeEnv)
    ).toThrow(/host is not allowed/);
  });
});

describe("bounded remote audio download", () => {
  it("downloads an allowlisted audio response without following redirects", async () => {
    const fetchImpl = vi.fn(
      async (_url: string | URL | Request, init?: RequestInit) => {
        expect(init).toEqual(
          expect.objectContaining({
            method: "GET",
            redirect: "error",
          })
        );
        return new Response(new Uint8Array([1, 2, 3]), {
          status: 200,
          headers: {
            "content-type": "audio/webm; codecs=opus",
            "content-length": "3",
          },
        });
      }
    ) as typeof fetch;

    const result = await downloadAllowedAudio(
      "https://media.example.com/audio.webm?signature=ok",
      {
        env,
        fetchImpl,
        maxBytes: 8,
        timeoutMs: 1_000,
      }
    );

    expect(result.mimeType).toBe("audio/webm");
    expect([...result.buffer]).toEqual([1, 2, 3]);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("rejects a declared body that exceeds the hard byte cap", async () => {
    const fetchImpl = vi.fn(async () =>
      new Response(new Uint8Array([1]), {
        status: 200,
        headers: {
          "content-type": "audio/mpeg",
          "content-length": "9",
        },
      })
    ) as typeof fetch;

    await expect(
      downloadAllowedAudio("https://media.example.com/audio.mp3", {
        env,
        fetchImpl,
        maxBytes: 8,
        timeoutMs: 1_000,
      })
    ).rejects.toMatchObject({
      code: "FILE_TOO_LARGE",
    } satisfies Partial<RemoteAudioFetchError>);
  });

  it("stops streaming when the actual body exceeds the hard byte cap", async () => {
    const fetchImpl = vi.fn(async () =>
      new Response(new Uint8Array([1, 2, 3, 4, 5]), {
        status: 200,
        headers: {
          "content-type": "audio/ogg",
        },
      })
    ) as typeof fetch;

    await expect(
      downloadAllowedAudio("https://media.example.com/audio.ogg", {
        env,
        fetchImpl,
        maxBytes: 4,
        timeoutMs: 1_000,
      })
    ).rejects.toMatchObject({
      code: "FILE_TOO_LARGE",
    } satisfies Partial<RemoteAudioFetchError>);
  });

  it("rejects non-audio content before returning bytes", async () => {
    const fetchImpl = vi.fn(async () =>
      new Response("not audio", {
        status: 200,
        headers: {
          "content-type": "text/plain",
        },
      })
    ) as typeof fetch;

    await expect(
      downloadAllowedAudio("https://media.example.com/audio.txt", {
        env,
        fetchImpl,
        maxBytes: 64,
        timeoutMs: 1_000,
      })
    ).rejects.toMatchObject({
      code: "INVALID_FORMAT",
    } satisfies Partial<RemoteAudioFetchError>);
  });

  it("cancels rejected response bodies before returning an error", async () => {
    const cancel = vi.fn();
    const body = new ReadableStream<Uint8Array>({
      pull(controller) {
        controller.enqueue(new Uint8Array([1, 2, 3]));
      },
      cancel,
    });
    const fetchImpl = vi.fn(async () =>
      new Response(body, {
        status: 200,
        headers: {
          "content-type": "text/html",
        },
      })
    ) as typeof fetch;

    await expect(
      downloadAllowedAudio("https://media.example.com/not-audio", {
        env,
        fetchImpl,
        maxBytes: 64,
        timeoutMs: 1_000,
      })
    ).rejects.toMatchObject({
      code: "INVALID_FORMAT",
    } satisfies Partial<RemoteAudioFetchError>);

    expect(cancel).toHaveBeenCalledTimes(1);
  });
});
