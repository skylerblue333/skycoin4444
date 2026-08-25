export type PrivacyAction = "export" | "delete";
export type PrivacyStatus = "requested" | "approved" | "rejected" | "completed";

export interface PrivacyRequest {
  id: string;
  subjectId: string;
  action: PrivacyAction;
  status: PrivacyStatus;
  requestedAt: string;
  reason?: string;
}

export interface ExportManifest {
  subjectId: string;
  categories: string[];
  requestedAt: string;
  format: "json";
}

const ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9:_-]{2,127}$/;
const CATEGORY_PATTERN = /^[a-z][a-z0-9_-]{1,63}$/;

function assertId(value: string, field: string): void {
  if (!ID_PATTERN.test(value)) throw new Error(`${field} is invalid`);
}

export function createExportManifest(subjectId: string, categories: string[], requestedAt: string): ExportManifest {
  assertId(subjectId, "subjectId");
  if (!Number.isFinite(Date.parse(requestedAt))) throw new Error("requestedAt must be ISO-compatible");
  const normalized = [...new Set(categories.map((item) => item.trim().toLowerCase()))].sort();
  if (normalized.length === 0 || normalized.length > 32 || normalized.some((item) => !CATEGORY_PATTERN.test(item))) {
    throw new Error("categories are invalid");
  }
  return { subjectId, categories: normalized, requestedAt: new Date(requestedAt).toISOString(), format: "json" };
}

export function createPrivacyRequest(input: Omit<PrivacyRequest, "status">): PrivacyRequest {
  assertId(input.id, "id");
  assertId(input.subjectId, "subjectId");
  if (!Number.isFinite(Date.parse(input.requestedAt))) throw new Error("requestedAt must be ISO-compatible");
  if (input.reason && input.reason.trim().length > 500) throw new Error("reason is too long");
  return { ...input, reason: input.reason?.trim() || undefined, requestedAt: new Date(input.requestedAt).toISOString(), status: "requested" };
}

export function transitionPrivacyRequest(request: PrivacyRequest, next: PrivacyStatus): PrivacyRequest {
  const allowed: Record<PrivacyStatus, PrivacyStatus[]> = {
    requested: ["approved", "rejected"],
    approved: ["completed"],
    rejected: [],
    completed: [],
  };
  if (!allowed[request.status].includes(next)) throw new Error(`invalid privacy transition: ${request.status} -> ${next}`);
  return { ...request, status: next };
}

export interface PrivacyIntegrationEvent {
  type: "privacy.requested" | "privacy.status_changed";
  subjectId: string;
  requestId: string;
  status: PrivacyStatus;
}

export function toPrivacyIntegrationEvent(request: PrivacyRequest, changed = false): PrivacyIntegrationEvent {
  return {
    type: changed ? "privacy.status_changed" : "privacy.requested",
    subjectId: request.subjectId,
    requestId: request.id,
    status: request.status,
  };
}
