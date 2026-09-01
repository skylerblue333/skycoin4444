export type Guess = 'higher' | 'lower';
export type TriviaQuestion = { id: string; correctIndex: number; choices: string[] };

export function resolveHighLow(current: number, next: number, guess: Guess) {
  if (!Number.isFinite(current) || !Number.isFinite(next)) throw new Error('cards must be numeric');
  if (current === next) return { outcome: 'push' as const, delta: 0 };
  const won = guess === 'higher' ? next > current : next < current;
  return { outcome: won ? 'win' as const : 'loss' as const, delta: won ? 1 : -1 };
}

export function createMemoryDeck(values: string[]) {
  if (values.length < 2) throw new Error('at least two symbols required');
  if (new Set(values).size !== values.length) throw new Error('symbols must be unique');
  return values.flatMap((value, pairId) => [
    { id: `${pairId}:a`, pairId, value },
    { id: `${pairId}:b`, pairId, value },
  ]);
}

export function isMemoryMatch(a: { pairId: number; id: string }, b: { pairId: number; id: string }) {
  return a.id !== b.id && a.pairId === b.pairId;
}

export function validateWordChain(words: string[]) {
  if (!words.length) return { valid: true, invalidIndex: -1 };
  const seen = new Set<string>();
  for (let i = 0; i < words.length; i++) {
    const normalized = words[i].trim().toLowerCase();
    if (!normalized || seen.has(normalized)) return { valid: false, invalidIndex: i };
    if (i > 0) {
      const previous = words[i - 1].trim().toLowerCase();
      if (previous.at(-1) !== normalized[0]) return { valid: false, invalidIndex: i };
    }
    seen.add(normalized);
  }
  return { valid: true, invalidIndex: -1 };
}

export function scoreTrivia(questions: TriviaQuestion[], answers: Record<string, number>) {
  let correct = 0;
  for (const q of questions) {
    if (!q.choices.length || q.correctIndex < 0 || q.correctIndex >= q.choices.length) throw new Error(`invalid question ${q.id}`);
    if (answers[q.id] === q.correctIndex) correct++;
  }
  return { correct, total: questions.length, percentage: questions.length ? Math.round((correct / questions.length) * 100) : 0 };
}

export function scoreTowerStack(overlaps: number[]) {
  if (overlaps.some((n) => !Number.isFinite(n) || n < 0 || n > 1)) throw new Error('overlap must be between 0 and 1');
  const placed = overlaps.findIndex((n) => n === 0);
  const count = placed === -1 ? overlaps.length : placed;
  const precision = count ? overlaps.slice(0, count).reduce((a, b) => a + b, 0) / count : 0;
  return { placed: count, score: Math.round(count * 100 + precision * 100) };
}

export function createMinesBoard(width: number, height: number, mines: number[]) {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 2 || height < 2) throw new Error('invalid board size');
  const size = width * height;
  const mineSet = new Set(mines);
  if (mineSet.size !== mines.length || mines.some((m) => !Number.isInteger(m) || m < 0 || m >= size)) throw new Error('invalid mine placement');
  return Array.from({ length: size }, (_, index) => {
    if (mineSet.has(index)) return -1;
    const x = index % width;
    const y = Math.floor(index / width);
    let adjacent = 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      if (!dx && !dy) continue;
      const nx = x + dx, ny = y + dy;
      if (nx >= 0 && nx < width && ny >= 0 && ny < height && mineSet.has(ny * width + nx)) adjacent++;
    }
    return adjacent;
  });
}

export function isLegalCheckersStep(from: number, to: number, player: 'red' | 'black', king = false) {
  if (![from, to].every((n) => Number.isInteger(n) && n >= 0 && n < 64)) return false;
  const fx = from % 8, fy = Math.floor(from / 8), tx = to % 8, ty = Math.floor(to / 8);
  if (Math.abs(tx - fx) !== 1) return false;
  const dy = ty - fy;
  return king ? Math.abs(dy) === 1 : player === 'red' ? dy === -1 : dy === 1;
}

export function isLegalChessGeometry(piece: 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn', from: number, to: number, color: 'white' | 'black') {
  if (![from, to].every((n) => Number.isInteger(n) && n >= 0 && n < 64) || from === to) return false;
  const fx = from % 8, fy = Math.floor(from / 8), tx = to % 8, ty = Math.floor(to / 8);
  const dx = Math.abs(tx - fx), dy = Math.abs(ty - fy);
  if (piece === 'king') return Math.max(dx, dy) === 1;
  if (piece === 'queen') return dx === dy || dx === 0 || dy === 0;
  if (piece === 'rook') return dx === 0 || dy === 0;
  if (piece === 'bishop') return dx === dy;
  if (piece === 'knight') return (dx === 1 && dy === 2) || (dx === 2 && dy === 1);
  const direction = color === 'white' ? -1 : 1;
  return dx === 0 && ty - fy === direction;
}

export function rollDice(seed: number, sides = 6) {
  if (!Number.isInteger(seed) || !Number.isInteger(sides) || sides < 2) throw new Error('invalid dice input');
  return ((seed * 9301 + 49297) % 233280) % sides + 1;
}

export function spinRoulette(seed: number) {
  if (!Number.isInteger(seed)) throw new Error('seed must be an integer');
  const value = Math.abs((seed * 1103515245 + 12345) % 37);
  const color = value === 0 ? 'green' : ([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(value) ? 'red' : 'black');
  return { value, color } as const;
}

export function moveSnake(head: { x: number; y: number }, direction: 'up' | 'down' | 'left' | 'right', width: number, height: number) {
  if (width < 2 || height < 2) throw new Error('invalid board');
  const delta = direction === 'up' ? [0,-1] : direction === 'down' ? [0,1] : direction === 'left' ? [-1,0] : [1,0];
  const x = head.x + delta[0], y = head.y + delta[1];
  return { x, y, collided: x < 0 || y < 0 || x >= width || y >= height };
}

export function ticTacToeWinner(cells: Array<'X' | 'O' | null>) {
  if (cells.length !== 9) throw new Error('board must have nine cells');
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for (const [a,b,c] of lines) if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) return cells[a];
  return cells.every(Boolean) ? 'draw' : null;
}

export function validateAssemblyOrder(order: string[], required: string[]) {
  if (new Set(order).size !== order.length || new Set(required).size !== required.length) throw new Error('parts must be unique');
  const correct = order.length === required.length && order.every((part, index) => part === required[index]);
  return { correct, placed: order.filter((part, index) => part === required[index]).length, total: required.length };
}

export const gapGameCapabilities = {
  chess: 'local move-geometry validator; check/checkmate, castling, en-passant and occupancy remain UI/integration work',
  highLow: 'deterministic round resolver',
  memoryMatch: 'pair deck and match validator',
  wordChain: 'sequence validator with duplicate prevention',
  cryptoTrivia: 'deterministic scored assessment engine',
  towerStack: 'precision/placement scoring core',
  mines: 'validated deterministic minefield adjacency generator',
  checkers: 'local diagonal step validator; captures/kings can be layered by UI state',
  dice: 'deterministic simulated die roller',
  roulette: 'deterministic simulated 0-36 wheel result',
  snake: 'bounded grid movement and collision detector',
  ticTacToe: 'local winner/draw detector',
  assemblyPuzzle: 'ordered-parts completion validator',
} as const;
