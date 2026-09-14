export type VirtualGameResult = { ok: true; balance: number } | { ok: false; reason: string; balance: number };

export function validateVirtualBet(balance: number, bet: number): VirtualGameResult {
  if (!Number.isFinite(bet) || bet <= 0) return { ok: false, reason: "Bet must be greater than zero.", balance };
  if (bet > balance) return { ok: false, reason: "Insufficient demo credits.", balance };
  return { ok: true, balance: Number((balance - bet).toFixed(2)) };
}

export function crashMultiplier(seed: number): number {
  const unit = Math.abs(Math.sin(seed * 12.9898 + 78.233) * 43758.5453) % 1;
  return Number(Math.max(1.01, (1 + unit * 8)).toFixed(2));
}

export function resolveCrash(balance: number, bet: number, cashout: number, seed: number): VirtualGameResult & { outcome?: "win" | "loss"; multiplier?: number } {
  const validated = validateVirtualBet(balance, bet);
  if (!validated.ok) return validated;
  const multiplier = crashMultiplier(seed);
  if (!Number.isFinite(cashout) || cashout < 1.01) return { ok: false, reason: "Cash-out must be at least 1.01x.", balance };
  if (cashout > multiplier) return { ok: true, balance: validated.balance, outcome: "loss", multiplier };
  return { ok: true, balance: Number((validated.balance + bet * cashout).toFixed(2)), outcome: "win", multiplier };
}

export function plinkoMultiplier(risk: "low" | "medium" | "high", rows: number, seed: number): number {
  const table = { low: [0.5, 0.8, 1, 1.2, 1.5], medium: [0.2, 0.5, 1, 2, 4], high: [0.1, 0.3, 1, 3, 8] }[risk];
  const index = Math.abs(Math.floor(Math.sin(seed * 19.17) * 10000)) % table.length;
  return Number((table[index] * Math.max(1, Math.min(16, rows)) / 8).toFixed(2));
}

export type Card = { rank: string; value: number };
export function blackjackValue(hand: Card[]): number {
  let total = hand.reduce((sum, card) => sum + card.value, 0);
  let aces = hand.filter(card => card.rank === "A").length;
  while (total > 21 && aces > 0) { total -= 10; aces -= 1; }
  return total;
}
export function blackjackOutcome(player: Card[], dealer: Card[]): "blackjack" | "win" | "loss" | "push" | "continue" {
  const playerValue = blackjackValue(player);
  const dealerValue = blackjackValue(dealer);
  if (playerValue > 21) return "loss";
  if (player.length === 2 && playerValue === 21) return dealer.length === 2 && dealerValue === 21 ? "push" : "blackjack";
  if (dealerValue > 21) return "win";
  if (player.length < 2 || dealer.length < 2) return "continue";
  if (playerValue > dealerValue) return "win";
  if (playerValue < dealerValue) return "loss";
  return "push";
}

export type RouletteBet = { kind: "straight" | "color" | "parity" | "range" | "dozen"; value: number | "red" | "black" | "odd" | "even" | "low" | "high" | "first" | "second" | "third" };
export function rouletteColor(value: number): "green" | "red" | "black" { if (value === 0) return "green"; return [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(value) ? "red" : "black"; }
export function roulettePayout(result: number, bet: RouletteBet): number {
  if (bet.kind === "straight") return result === bet.value ? 35 : 0;
  if (result === 0) return 0;
  if (bet.kind === "color") return rouletteColor(result) === bet.value ? 1 : 0;
  if (bet.kind === "parity") return ((result % 2 === 0 ? "even" : "odd") === bet.value) ? 1 : 0;
  if (bet.kind === "range") return ((result <= 18 ? "low" : "high") === bet.value) ? 1 : 0;
  const dozen = result <= 12 ? "first" : result <= 24 ? "second" : "third";
  return dozen === bet.value ? 2 : 0;
}
