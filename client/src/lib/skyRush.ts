export type RushLane = 0 | 1 | 2;

export type RushFrame = Readonly<{
  obstacleLane: RushLane;
  sparkLane: RushLane;
  bonusLane: RushLane | null;
  speedTier: 1 | 2 | 3 | 4 | 5;
}>;

export type RushScore = Readonly<{
  distance: number;
  sparks: number;
  combo: number;
  bestCombo: number;
  score: number;
}>;

function lcg(value: number) {
  return (Math.imul(value, 1664525) + 1013904223) >>> 0;
}

export function rushFrame(seed: number, tick: number): RushFrame {
  let value = (seed >>> 0) ^ Math.imul(tick + 1, 2654435761);
  value = lcg(value);
  const obstacleLane = (value % 3) as RushLane;
  value = lcg(value);
  let sparkLane = (value % 3) as RushLane;
  if (sparkLane === obstacleLane) {
    sparkLane = ((sparkLane + 1) % 3) as RushLane;
  }
  value = lcg(value);
  const bonusLane =
    value % 5 === 0
      ? (((sparkLane + 1) % 3) as RushLane)
      : null;

  return Object.freeze({
    obstacleLane,
    sparkLane,
    bonusLane,
    speedTier: Math.min(5, 1 + Math.floor(tick / 12)) as 1 | 2 | 3 | 4 | 5,
  });
}

export function resolveRushTick(input: {
  lane: RushLane;
  frame: RushFrame;
  previous: RushScore;
}): Readonly<{
  crashed: boolean;
  collectedSpark: boolean;
  collectedBonus: boolean;
  next: RushScore;
}> {
  const crashed = input.lane === input.frame.obstacleLane;
  const collectedSpark = !crashed && input.lane === input.frame.sparkLane;
  const collectedBonus =
    !crashed &&
    input.frame.bonusLane !== null &&
    input.lane === input.frame.bonusLane;

  const combo = crashed
    ? 0
    : collectedSpark || collectedBonus
      ? input.previous.combo + 1
      : Math.max(0, input.previous.combo - 1);

  const sparks =
    input.previous.sparks +
    (collectedSpark ? 1 : 0) +
    (collectedBonus ? 3 : 0);
  const distance = input.previous.distance + (crashed ? 0 : input.frame.speedTier);
  const score =
    input.previous.score +
    (crashed
      ? 0
      : input.frame.speedTier * 10 +
        (collectedSpark ? 25 + combo * 2 : 0) +
        (collectedBonus ? 75 + combo * 3 : 0));

  return Object.freeze({
    crashed,
    collectedSpark,
    collectedBonus,
    next: Object.freeze({
      distance,
      sparks,
      combo,
      bestCombo: Math.max(input.previous.bestCombo, combo),
      score,
    }),
  });
}

export function emptyRushScore(): RushScore {
  return Object.freeze({
    distance: 0,
    sparks: 0,
    combo: 0,
    bestCombo: 0,
    score: 0,
  });
}

export function rushRank(score: number) {
  if (score >= 3500) return "Nova";
  if (score >= 2200) return "Comet";
  if (score >= 1200) return "Pulse";
  if (score >= 500) return "Spark";
  return "Rookie";
}
