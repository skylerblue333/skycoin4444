export type Suit = "♠" | "♥" | "♦" | "♣";
export type Rank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K";
export type PlayingCard = Readonly<{ suit: Suit; rank: Rank }>;

const SUITS: readonly Suit[] = ["♠", "♥", "♦", "♣"];
const RANKS: readonly Rank[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const RED_ROULETTE = new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);
const CRYPTO_CHALLENGES = [
  {
    id: "recovery",
    prompt: "A support agent asks for your recovery phrase. What is the safest response?",
    choices: ["Send half of it", "Refuse and report the request", "Paste it into a support form"],
    correctIndex: 1,
    explanation: "Recovery phrases should never be shared with support, games, or other users.",
  },
  {
    id: "address",
    prompt: "Which value is normally safe to share when you want someone to send assets to you?",
    choices: ["Public wallet address", "Private key", "Seed phrase"],
    correctIndex: 0,
    explanation: "A public address is designed to be shared. Private keys and seed phrases are not.",
  },
  {
    id: "confirmations",
    prompt: "Why do block confirmations matter?",
    choices: ["They make a token legal tender", "They add confidence that a transaction is settled", "They guarantee price appreciation"],
    correctIndex: 1,
    explanation: "Additional confirmations can increase confidence that a transaction is durably included in the chain.",
  },
  {
    id: "signature",
    prompt: "What does a digital signature primarily prove in a blockchain transaction?",
    choices: ["Authorization by the matching private key", "Future market price", "Identity verification by the government"],
    correctIndex: 0,
    explanation: "A valid signature proves authorization by the holder of the corresponding key; it does not prove identity or price.",
  },
] as const;

function mix32(value: number): number {
  let x = value | 0;
  x ^= x << 13;
  x ^= x >>> 17;
  x ^= x << 5;
  return x >>> 0;
}

export function seededUnit(seed: number, stream = 0): number {
  const mixed = mix32((seed | 0) ^ Math.imul(stream + 1, 0x9e3779b1));
  return mixed / 0x100000000;
}

export function demoProof(seed: number, game: string): string {
  return game + "-" + seed.toString(36) + "-" + mix32(seed).toString(16).padStart(8, "0");
}

export function createDeck(seed: number): PlayingCard[] {
  const deck: PlayingCard[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) deck.push({ suit, rank });
  }
  for (let index = deck.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(seededUnit(seed, index) * (index + 1));
    [deck[index], deck[swapIndex]] = [deck[swapIndex], deck[index]];
  }
  return deck;
}

function cardNumericValue(rank: Rank): number {
  if (rank === "A") return 11;
  if (rank === "K" || rank === "Q" || rank === "J") return 10;
  return Number(rank);
}

export function handValue(cards: readonly PlayingCard[]): number {
  let total = cards.reduce((sum, card) => sum + cardNumericValue(card.rank), 0);
  let aces = cards.filter(card => card.rank === "A").length;
  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }
  return total;
}

export function isBlackjack(cards: readonly PlayingCard[]): boolean {
  return cards.length === 2 && handValue(cards) === 21;
}

export function rouletteColor(number: number): "green" | "red" | "black" {
  if (number === 0) return "green";
  return RED_ROULETTE.has(number) ? "red" : "black";
}

export function spinRoulette(seed: number): Readonly<{ number: number; color: "green" | "red" | "black"; proof: string }> {
  const number = Math.floor(seededUnit(seed, 17) * 37);
  return { number, color: rouletteColor(number), proof: demoProof(seed, "roulette") };
}

export type RouletteBet =
  | Readonly<{ kind: "red" | "black" | "even" | "odd" }>
  | Readonly<{ kind: "number"; number: number }>;

export function roulettePayoutMultiplier(result: number, bet: RouletteBet): number {
  if (bet.kind === "number") return result === bet.number ? 36 : 0;
  if (result === 0) return 0;
  if (bet.kind === "red" || bet.kind === "black") return rouletteColor(result) === bet.kind ? 2 : 0;
  if (bet.kind === "even") return result % 2 === 0 ? 2 : 0;
  return result % 2 === 1 ? 2 : 0;
}

export function simulatePlinko(seed: number, rows = 10): Readonly<{
  path: readonly ("L" | "R")[];
  bucket: number;
  multiplier: number;
  proof: string;
}> {
  if (!Number.isInteger(rows) || rows < 4 || rows > 16) throw new Error("rows must be an integer between 4 and 16");
  const path: Array<"L" | "R"> = [];
  let bucket = 0;
  for (let row = 0; row < rows; row += 1) {
    const right = seededUnit(seed, row + 31) >= 0.5;
    path.push(right ? "R" : "L");
    if (right) bucket += 1;
  }
  const center = rows / 2;
  const distance = Math.abs(bucket - center) / Math.max(1, center);
  const multiplier = Number((0.45 + Math.pow(distance, 2.15) * 7.55).toFixed(2));
  return { path, bucket, multiplier, proof: demoProof(seed, "plinko") };
}

export function nextCardRank(seed: number): number {
  return Math.floor(seededUnit(seed, 53) * 13) + 1;
}

export function resolveHighLow(
  current: number,
  next: number,
  guess: "higher" | "lower"
): "win" | "lose" | "push" {
  if (next === current) return "push";
  if (guess === "higher") return next > current ? "win" : "lose";
  return next < current ? "win" : "lose";
}

export function crashPoint(seed: number): number {
  const unit = Math.min(0.999999, Math.max(0.000001, seededUnit(seed, 91)));
  const raw = 1 + (-Math.log(1 - unit) * 1.35);
  return Number(Math.min(25, Math.max(1.01, raw)).toFixed(2));
}

export function cryptoChallenge(seed: number) {
  return CRYPTO_CHALLENGES[Math.floor(seededUnit(seed, 113) * CRYPTO_CHALLENGES.length)] ?? CRYPTO_CHALLENGES[0];
}

export function hashHuntRound(seed: number): Readonly<{
  target: string;
  candidates: readonly string[];
  answerIndex: number;
  proof: string;
}> {
  const alphabet = "abcdef0123456789";
  const answerIndex = Math.floor(seededUnit(seed, 211) * 4);
  const target = alphabet[Math.floor(seededUnit(seed, 212) * alphabet.length)] ?? "a";
  const candidates = Array.from({ length: 4 }, (_, index) => {
    const leading = index === answerIndex
      ? target
      : alphabet[(alphabet.indexOf(target) + index + 3) % alphabet.length];
    const body = Math.floor(seededUnit(seed, 220 + index) * 0xffffffff)
      .toString(16)
      .padStart(8, "0");
    return leading + body;
  });
  return { target, candidates, answerIndex, proof: demoProof(seed, "hash-hunt") };
}
