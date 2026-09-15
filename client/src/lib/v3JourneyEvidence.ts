import {
  getJourneyById,
  normalizeJourneyRoute,
  type V3JourneyId,
} from "./v3Journeys";

export type V3JourneyEvidenceSource = "tester-confirmed";

export type V3JourneyEvidenceReceipt = {
  id: string;
  journeyId: V3JourneyId;
  stageId: string;
  route: string;
  note: string;
  recordedAt: string;
  source: V3JourneyEvidenceSource;
};

export type V3JourneyEvidenceJournal = Partial<
  Record<V3JourneyId, V3JourneyEvidenceReceipt[]>
>;

export const V3_JOURNEY_EVIDENCE_KEY = "sky4444.v3-journey-evidence.v1";

function isValidJourneyId(value: string): value is V3JourneyId {
  return ["social", "gaming", "live", "commerce", "learning", "ai", "web3"].includes(
    value
  );
}

function normalizeReceipt(
  value: unknown,
  expectedJourneyId: V3JourneyId
): V3JourneyEvidenceReceipt | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const candidate = value as Record<string, unknown>;
  if (
    typeof candidate.id !== "string" ||
    !candidate.id.trim() ||
    candidate.id.length > 128 ||
    candidate.journeyId !== expectedJourneyId ||
    typeof candidate.stageId !== "string" ||
    typeof candidate.route !== "string" ||
    typeof candidate.note !== "string" ||
    typeof candidate.recordedAt !== "string" ||
    candidate.source !== "tester-confirmed"
  ) {
    return null;
  }

  const journey = getJourneyById(expectedJourneyId);
  const stage = journey.stages.find(item => item.id === candidate.stageId);
  if (!stage) return null;

  const note = candidate.note.trim();
  if (note.length < 8 || note.length > 500) return null;
  if (!Number.isFinite(Date.parse(candidate.recordedAt))) return null;

  return {
    id: candidate.id.trim(),
    journeyId: expectedJourneyId,
    stageId: stage.id,
    route: normalizeJourneyRoute(stage.route),
    note,
    recordedAt: candidate.recordedAt,
    source: "tester-confirmed",
  };
}

export function normalizeV3JourneyEvidenceJournal(
  value: unknown
): V3JourneyEvidenceJournal {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const candidate = value as Record<string, unknown>;
  const normalized: V3JourneyEvidenceJournal = {};

  for (const [journeyId, rawReceipts] of Object.entries(candidate)) {
    if (!isValidJourneyId(journeyId) || !Array.isArray(rawReceipts)) continue;
    const latestByStage = new Map<string, V3JourneyEvidenceReceipt>();

    for (const rawReceipt of rawReceipts) {
      const receipt = normalizeReceipt(rawReceipt, journeyId);
      if (!receipt) continue;
      const current = latestByStage.get(receipt.stageId);
      if (
        !current ||
        Date.parse(receipt.recordedAt) >= Date.parse(current.recordedAt)
      ) {
        latestByStage.set(receipt.stageId, receipt);
      }
    }

    if (latestByStage.size) {
      normalized[journeyId] = Array.from(latestByStage.values()).sort(
        (left, right) =>
          Date.parse(left.recordedAt) - Date.parse(right.recordedAt)
      );
    }
  }

  return normalized;
}

export function createV3JourneyEvidenceReceipt(input: {
  id: string;
  journeyId: V3JourneyId;
  stageId: string;
  note: string;
  recordedAt: string;
}): V3JourneyEvidenceReceipt {
  const journey = getJourneyById(input.journeyId);
  const stage = journey.stages.find(item => item.id === input.stageId);
  if (!stage) throw new Error("Unknown journey stage");

  const id = input.id.trim();
  if (!id || id.length > 128) throw new Error("Evidence receipt id is invalid");

  const note = input.note.trim();
  if (note.length < 8) throw new Error("Evidence note must be at least 8 characters");
  if (note.length > 500) throw new Error("Evidence note must be 500 characters or fewer");
  if (!Number.isFinite(Date.parse(input.recordedAt))) {
    throw new Error("Evidence timestamp is invalid");
  }

  return {
    id,
    journeyId: input.journeyId,
    stageId: stage.id,
    route: normalizeJourneyRoute(stage.route),
    note,
    recordedAt: input.recordedAt,
    source: "tester-confirmed",
  };
}

export function upsertV3JourneyEvidenceReceipt(
  journal: V3JourneyEvidenceJournal,
  receipt: V3JourneyEvidenceReceipt
): V3JourneyEvidenceJournal {
  const existing = journal[receipt.journeyId] ?? [];
  return {
    ...journal,
    [receipt.journeyId]: [
      ...existing.filter(item => item.stageId !== receipt.stageId),
      receipt,
    ].sort(
      (left, right) => Date.parse(left.recordedAt) - Date.parse(right.recordedAt)
    ),
  };
}

export function removeV3JourneyEvidenceReceipt(
  journal: V3JourneyEvidenceJournal,
  journeyId: V3JourneyId,
  stageId: string
): V3JourneyEvidenceJournal {
  return {
    ...journal,
    [journeyId]: (journal[journeyId] ?? []).filter(
      receipt => receipt.stageId !== stageId
    ),
  };
}

export function getV3JourneyStageReceipt(
  journal: V3JourneyEvidenceJournal,
  journeyId: V3JourneyId,
  stageId: string
) {
  return (journal[journeyId] ?? []).find(receipt => receipt.stageId === stageId);
}

export function getV3JourneyEvidenceCoveragePercent(
  journal: V3JourneyEvidenceJournal,
  journeyId: V3JourneyId
) {
  const journey = getJourneyById(journeyId);
  const validStageIds = new Set(journey.stages.map(stage => stage.id));
  const covered = new Set(
    (journal[journeyId] ?? [])
      .map(receipt => receipt.stageId)
      .filter(stageId => validStageIds.has(stageId))
  ).size;
  return Math.round((covered / journey.stages.length) * 100);
}
