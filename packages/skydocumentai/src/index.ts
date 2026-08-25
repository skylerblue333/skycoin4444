import { createHash } from "node:crypto";

export type SupportedDocumentType =
  | "text/plain"
  | "text/markdown"
  | "application/json";

export interface DocumentInput {
  id: string;
  mediaType: SupportedDocumentType;
  content: string;
}

export interface DocumentExtraction {
  id: string;
  mediaType: SupportedDocumentType;
  sha256: string;
  bytes: number;
  text: string;
  lines: number;
  words: number;
}

const ID_RE = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
const MAX_BYTES = 1_000_000;

function validateId(id: string): string {
  const value = id.trim();
  if (!ID_RE.test(value)) throw new Error("document id is invalid");
  return value;
}

function ensureSize(content: string): number {
  const bytes = Buffer.byteLength(content, "utf8");
  if (bytes > MAX_BYTES) {
    throw new Error(`document exceeds ${MAX_BYTES} byte limit`);
  }
  return bytes;
}

export function extractDocument(input: DocumentInput): DocumentExtraction {
  const id = validateId(input.id);
  const bytes = ensureSize(input.content);
  let text = input.content;

  if (input.mediaType === "application/json") {
    const parsed: unknown = JSON.parse(input.content);
    text = JSON.stringify(parsed, null, 2);
  }

  const trimmed = text.trim();
  const lines = trimmed === "" ? 0 : trimmed.split(/\r?\n/).length;
  const words = trimmed === "" ? 0 : trimmed.split(/\s+/u).length;

  return {
    id,
    mediaType: input.mediaType,
    sha256: createHash("sha256")
      .update(input.content, "utf8")
      .digest("hex"),
    bytes,
    text,
    lines,
    words,
  };
}

export function isSupportedDocumentType(
  value: string
): value is SupportedDocumentType {
  return (
    value === "text/plain" ||
    value === "text/markdown" ||
    value === "application/json"
  );
}
