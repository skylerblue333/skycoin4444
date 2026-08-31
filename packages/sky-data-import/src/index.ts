export type ImportFormat = "jsonl" | "csv";

export interface ImportRequest {
  sourceId: string;
  dataset: string;
  format: ImportFormat;
  recordCount: number;
  checksum: string;
}

export interface ImportPlan extends ImportRequest {
  requiresReview: boolean;
}

const TOKEN = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
const CHECKSUM = /^[a-f0-9]{64}$/;

export function planImport(request: ImportRequest): ImportPlan {
  if (!TOKEN.test(request.sourceId)) throw new Error("invalid sourceId");
  if (!TOKEN.test(request.dataset)) throw new Error("invalid dataset");
  if (request.format !== "jsonl" && request.format !== "csv") {
    throw new Error("invalid format");
  }
  if (!Number.isSafeInteger(request.recordCount) || request.recordCount < 0) {
    throw new Error("invalid recordCount");
  }
  if (!CHECKSUM.test(request.checksum)) throw new Error("invalid checksum");
  return { ...request, requiresReview: request.recordCount > 10_000 };
}
