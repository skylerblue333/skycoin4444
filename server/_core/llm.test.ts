import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ENV } from "./env";
import { invokeLLM, listLLMModels } from "./llm";

const originalApiUrl = ENV.forgeApiUrl;
const originalApiKey = ENV.forgeApiKey;

beforeEach(() => {
  ENV.forgeApiUrl = "https://provider.example.test";
  ENV.forgeApiKey = "test-provider-key";
});

afterEach(() => {
  ENV.forgeApiUrl = originalApiUrl;
  ENV.forgeApiKey = originalApiKey;
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("LLM tool-call message normalization", () => {
  it("normalizes provider-style null assistant content when tool calls are present", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          id: "chatcmpl-test",
          created: 1,
          model: "test-model",
          choices: [
            {
              index: 0,
              message: { role: "assistant", content: "done" },
              finish_reason: "stop",
            },
          ],
        }),
        {
          status: 200,
          headers: { "content-type": "application/json" },
        },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    await invokeLLM({
      messages: [
        { role: "user", content: "calculate" },
        {
          role: "assistant",
          content: null,
          tool_calls: [
            {
              id: "call-1",
              type: "function",
              function: {
                name: "math_operation",
                arguments: "{\"operation\":\"add\",\"a\":2,\"b\":3}",
              },
            },
          ],
        },
        {
          role: "tool",
          tool_call_id: "call-1",
          content: "{\"value\":5}",
        },
      ],
    });

    const init = fetchMock.mock.calls[0]?.[1] as RequestInit | undefined;
    const body = JSON.parse(String(init?.body ?? "{}")) as {
      messages?: Array<Record<string, unknown>>;
    };
    expect(body.messages?.[1]).toMatchObject({
      role: "assistant",
      content: "",
      tool_calls: [
        {
          id: "call-1",
          type: "function",
          function: {
            name: "math_operation",
          },
        },
      ],
    });
  });

  it("rejects null content when no assistant tool call justifies it", async () => {
    await expect(
      invokeLLM({
        messages: [{ role: "user", content: null }],
      }),
    ).rejects.toThrow(/Null message content is only valid/);
  });
});

describe("LLM provider failure boundaries", () => {
  it("does not retry deterministic 4xx failures or leak provider bodies", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response("client_secret=provider-secret", {
        status: 400,
        statusText: "Bad Request",
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    let thrown: unknown;
    try {
      await invokeLLM({
        messages: [{ role: "user", content: "hello" }],
      });
    } catch (error) {
      thrown = error;
    }

    expect(String(thrown)).toContain("400 Bad Request");
    expect(String(thrown)).not.toContain("provider-secret");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });


  it("keeps the per-attempt timeout active through response-body parsing", async () => {
    vi.useFakeTimers();

    const fetchMock = vi.fn(
      async (_input: URL | RequestInfo, init?: RequestInit) => {
        const signal = init?.signal;
        return {
          ok: true,
          status: 200,
          statusText: "OK",
          headers: new Headers({ "content-type": "application/json" }),
          body: null,
          json: () =>
            new Promise<never>((_resolve, reject) => {
              signal?.addEventListener(
                "abort",
                () => reject(new DOMException("Aborted", "AbortError")),
                { once: true },
              );
            }),
        } as Response;
      },
    );
    vi.stubGlobal("fetch", fetchMock);

    const request = invokeLLM({
      messages: [{ role: "user", content: "hello" }],
    });
    const rejection = expect(request).rejects.toThrow(
      /timed out after 60000ms/,
    );

    await vi.runAllTimersAsync();
    await rejection;

    expect(fetchMock).toHaveBeenCalledTimes(5);
  });

  it("cancels deterministic non-success bodies before failing", async () => {
    const cancel = vi.fn();
    const body = new ReadableStream({
      cancel() {
        cancel();
      },
    });
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(body, {
        status: 400,
        statusText: "Bad Request",
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      invokeLLM({
        messages: [{ role: "user", content: "hello" }],
      }),
    ).rejects.toThrow(/400 Bad Request/);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(cancel).toHaveBeenCalledTimes(1);
  });

  it("fails closed on malformed successful chat payloads", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ id: "missing-choices" }), {
          status: 200,
          headers: { "content-type": "application/json" },
        }),
      ),
    );

    await expect(
      invokeLLM({
        messages: [{ role: "user", content: "hello" }],
      }),
    ).rejects.toThrow(/invalid response payload/);
  });

  it("fails closed on malformed model records", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            object: "list",
            data: [{ id: "model-1", object: "model", created: "wrong", owned_by: "provider" }],
          }),
          {
            status: 200,
            headers: { "content-type": "application/json" },
          },
        ),
      ),
    );

    await expect(listLLMModels()).rejects.toThrow(/invalid model record/);
  });
});
