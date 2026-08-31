export interface ExperimentVariant {
  key: string;
  weight: number;
}

const KEY = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;

function hash(value: string): number {
  let state = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    state ^= value.charCodeAt(index);
    state = Math.imul(state, 16777619);
  }
  return state >>> 0;
}

export function assignVariant(
  experimentKey: string,
  subjectId: string,
  variants: readonly ExperimentVariant[]
): string {
  if (!KEY.test(experimentKey)) throw new Error("invalid experimentKey");
  if (!KEY.test(subjectId)) throw new Error("invalid subjectId");
  if (variants.length === 0) throw new Error("variants required");
  let total = 0;
  for (const variant of variants) {
    if (!KEY.test(variant.key)) throw new Error("invalid variant key");
    if (!Number.isSafeInteger(variant.weight) || variant.weight < 1) {
      throw new Error("invalid variant weight");
    }
    total += variant.weight;
    if (!Number.isSafeInteger(total)) throw new Error("variant weight overflow");
  }
  const bucket = hash(`${experimentKey}:${subjectId}`) % total;
  let cursor = 0;
  for (const variant of variants) {
    cursor += variant.weight;
    if (bucket < cursor) return variant.key;
  }
  throw new Error("unreachable assignment");
}
