export type ImpactAllocation = {
  needs: number;
  evidence: number;
  delivery: number;
  safeguards: number;
};

export const IMPACT_PLAY_RECOMMENDED: ImpactAllocation = {
  needs: 30,
  evidence: 25,
  delivery: 25,
  safeguards: 20,
};

export const IMPACT_PLAY_BOUNDARY = {
  mode: "deterministic-practice",
  cashValue: false,
  tokenValue: false,
  triggersDonation: false,
  predictsRealWorldImpact: false,
} as const;

function validateAllocation(allocation: ImpactAllocation): void {
  for (const [name, value] of Object.entries(allocation)) {
    if (!Number.isInteger(value) || value < 0 || value > 100) {
      throw new RangeError(`${name} must be a whole number from 0 to 100`);
    }
  }

  const total = Object.values(allocation).reduce((sum, value) => sum + value, 0);
  if (total !== 100) {
    throw new RangeError("impact practice allocation must total exactly 100 points");
  }
}

export function evaluateImpactAllocation(allocation: ImpactAllocation) {
  validateAllocation(allocation);

  const distance =
    Math.abs(allocation.needs - IMPACT_PLAY_RECOMMENDED.needs) +
    Math.abs(allocation.evidence - IMPACT_PLAY_RECOMMENDED.evidence) +
    Math.abs(allocation.delivery - IMPACT_PLAY_RECOMMENDED.delivery) +
    Math.abs(allocation.safeguards - IMPACT_PLAY_RECOMMENDED.safeguards);

  const practiceScore = Math.max(0, 100 - Math.round(distance * 1.25));
  const strengths = [
    allocation.needs >= 20 ? "needs discovery" : null,
    allocation.evidence >= 20 ? "evidence planning" : null,
    allocation.delivery >= 20 ? "delivery planning" : null,
    allocation.safeguards >= 15 ? "safeguards" : null,
  ].filter((value): value is string => Boolean(value));

  const missing = [
    allocation.needs < 20 ? "needs discovery" : null,
    allocation.evidence < 20 ? "evidence planning" : null,
    allocation.delivery < 20 ? "delivery planning" : null,
    allocation.safeguards < 15 ? "safeguards" : null,
  ].filter((value): value is string => Boolean(value));

  return {
    practiceScore,
    strengths,
    missing,
    message:
      missing.length === 0
        ? "Balanced practice plan. Next, test every assumption with real evidence."
        : `Rebalance practice points toward: ${missing.join(", ")}.`,
    boundary: IMPACT_PLAY_BOUNDARY,
  } as const;
}
