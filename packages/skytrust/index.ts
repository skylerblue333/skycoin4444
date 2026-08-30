export type TrustSignal = {
  subjectId: string;
  source: string;
  score: number;
  observedAt: string;
};

export type TrustAssessment = {
  subjectId: string;
  score: number;
  confidence: number;
  signalCount: number;
  assessedAt: string;
};

export const SKY_TRUST_CONTRACT = "sky.trust.assessed.v1" as const;

function assertText(value: string, field: string): string {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${field} is required`);
  return normalized;
}

function assertIsoInstant(value: string, field: string): string {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(value)) {
    throw new Error(`${field} must be an ISO-8601 UTC instant`);
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.valueOf())) throw new Error(`${field} is invalid`);
  const normalizedInput = value.includes(".") ? value.replace(/\.(\d{1,3})Z$/, (_, fraction: string) => `.${fraction.padEnd(3, "0")}Z`) : value.replace(/Z$/, ".000Z");
  if (parsed.toISOString() !== normalizedInput) throw new Error(`${field} is invalid`);
  return value;
}

export function assessTrust(signals: TrustSignal[], assessedAt: string): TrustAssessment {
  if (signals.length === 0) throw new Error("at least one trust signal is required");
  const normalizedTime = assertIsoInstant(assessedAt, "assessedAt");
  const assessmentMillis = new Date(normalizedTime).valueOf();
  const subjectId = assertText(signals[0].subjectId, "subjectId");
  const sources = new Set<string>();
  let total = 0;

  for (const signal of signals) {
    if (assertText(signal.subjectId, "subjectId") !== subjectId) {
      throw new Error("all trust signals must target the same subject");
    }
    sources.add(assertText(signal.source, "source"));
    if (!Number.isFinite(signal.score) || signal.score < 0 || signal.score > 100) {
      throw new Error("score must be between 0 and 100");
    }
    const observedAt = assertIsoInstant(signal.observedAt, "observedAt");
    if (new Date(observedAt).valueOf() > assessmentMillis) {
      throw new Error("observedAt cannot be after assessedAt");
    }
    total += signal.score;
  }

  const score = Math.round((total / signals.length) * 100) / 100;
  const confidence = Math.round(Math.min(1, sources.size / 3) * 100) / 100;
  return { subjectId, score, confidence, signalCount: signals.length, assessedAt: normalizedTime };
}
