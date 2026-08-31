export type ExportFormat = "jsonl" | "csv";

export interface ExportRequest {
  subjectId: string;
  dataset: string;
  format: ExportFormat;
  fields: readonly string[];
}

export interface ExportManifest {
  subjectId: string;
  dataset: string;
  format: ExportFormat;
  fields: string[];
}

const TOKEN = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;

export function planExport(request: ExportRequest): ExportManifest {
  if (!TOKEN.test(request.subjectId)) throw new Error("invalid subjectId");
  if (!TOKEN.test(request.dataset)) throw new Error("invalid dataset");
  if (request.format !== "jsonl" && request.format !== "csv") {
    throw new Error("invalid format");
  }
  if (request.fields.length === 0) throw new Error("fields required");
  const fields = [...request.fields];
  const seen = new Set<string>();
  for (const field of fields) {
    if (!TOKEN.test(field)) throw new Error("invalid field");
    if (seen.has(field)) throw new Error("duplicate field");
    seen.add(field);
  }
  fields.sort();
  return {
    subjectId: request.subjectId,
    dataset: request.dataset,
    format: request.format,
    fields,
  };
}
