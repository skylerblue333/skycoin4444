import { describe, expect, it } from "vitest";
import { extractDocument, isSupportedDocumentType } from "./index";

describe("SkyDocumentAI extraction core", () => {
  it("extracts deterministic text metrics", () => {
    const result = extractDocument({ id: "doc:1", mediaType: "text/plain", content: "hello world\nsecond line" });
    expect(result.bytes).toBe(23);
    expect(result.lines).toBe(2);
    expect(result.words).toBe(4);
    expect(result.sha256).toHaveLength(64);
  });

  it("normalizes JSON deterministically", () => {
    const result = extractDocument({ id: "doc-json", mediaType: "application/json", content: '{"b":2,"a":1}' });
    expect(result.text).toContain('"b": 2');
    expect(result.lines).toBeGreaterThan(1);
  });

  it("rejects malformed JSON and invalid ids", () => {
    expect(() => extractDocument({ id: "bad id", mediaType: "text/plain", content: "x" })).toThrow();
    expect(() => extractDocument({ id: "ok", mediaType: "application/json", content: "{" })).toThrow();
  });

  it("reports only explicitly supported local media types", () => {
    expect(isSupportedDocumentType("text/markdown")).toBe(true);
    expect(isSupportedDocumentType("application/pdf")).toBe(false);
  });
});
