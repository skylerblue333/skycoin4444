import { describe, expect, it } from "vitest";
import {
  buildHopeProviderHistory,
  createHopeWorkspaceMessage,
  createHopeWorkspaceThread,
  exportHopeWorkspaceThread,
  normalizeHopeWorkspaceThreads,
  pinHopeWorkspaceArtifact,
  titleHopeWorkspaceThread,
} from "../../client/src/lib/hopeAIWorkspace";

describe("HopeAI workspace model", () => {
  it("creates bounded conversation titles", () => {
    expect(titleHopeWorkspaceThread("   ship   a real beta   ")).toBe(
      "ship a real beta"
    );
    expect(titleHopeWorkspaceThread("x".repeat(90))).toHaveLength(48);
  });

  it("builds provider history with attachment context and a hard history cap", () => {
    const messages = Array.from({ length: 14 }, (_, index) =>
      createHopeWorkspaceMessage({
        role: index % 2 === 0 ? "user" : "assistant",
        content: "message " + index,
        now: 1_000 + index,
        attachments:
          index === 13
            ? [
                {
                  id: "a1",
                  name: "notes.md",
                  size: 12,
                  text: "bounded context",
                },
              ]
            : [],
      })
    );

    const history = buildHopeProviderHistory(messages, 99);
    expect(history).toHaveLength(12);
    expect(history[0].content).toBe("message 2");
    expect(history.at(-1)?.content).toContain("FILE: notes.md");
    expect(history.at(-1)?.content).toContain("bounded context");
  });

  it("pins only assistant outputs and avoids duplicate artifacts", () => {
    const thread = createHopeWorkspaceThread(1);
    const user = createHopeWorkspaceMessage({
      role: "user",
      content: "hello",
      now: 2,
    });
    const assistant = createHopeWorkspaceMessage({
      role: "assistant",
      content: "Useful output\nwith detail",
      now: 3,
    });

    expect(pinHopeWorkspaceArtifact(thread, user, 4).artifacts).toHaveLength(0);
    const once = pinHopeWorkspaceArtifact(thread, assistant, 5);
    const twice = pinHopeWorkspaceArtifact(once, assistant, 6);
    expect(once.artifacts).toHaveLength(1);
    expect(twice.artifacts).toHaveLength(1);
    expect(once.artifacts[0].title).toBe("Useful output");
  });

  it("normalizes browser-local state and exports human-readable markdown", () => {
    const normalized = normalizeHopeWorkspaceThreads([
      {
        id: "thread-1",
        title: "Saved thread",
        createdAt: 1,
        updatedAt: 2,
        messages: [
          {
            id: "message-1",
            role: "user",
            content: "hello",
            createdAt: 1,
          },
        ],
        artifacts: [],
      },
      { broken: true },
    ]);

    expect(normalized).toHaveLength(1);
    expect(normalized[0].title).toBe("Saved thread");
    expect(exportHopeWorkspaceThread(normalized[0])).toContain("## You\nhello");
  });
});
