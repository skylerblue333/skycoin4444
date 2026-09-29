import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const matches = readFileSync("client/src/pages/DatingMatches.tsx", "utf8");

describe("dating messaging send lock", () => {
  it("locks conversation selection and draft editing during an in-flight send", () => {
    expect(matches).toContain("disabled={sendMessage.isPending}");
    expect(matches).toContain("conversation selection is");
    expect(matches).toContain("locked while a send is in flight");
  });

  it("uses the authenticated mutation as the send source of truth", () => {
    expect(matches).toContain("trpc.dating.sendMessage");
    expect(matches).toContain("Message accepted by the server.");
    expect(matches).not.toContain('fetch("/api/dating/messages"');
    expect(matches).not.toContain("tempMessage");
  });
});
