import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { Gamepad2, ShieldCheck } from "lucide-react";
import {
  createMemoryDeck,
  createMinesBoard,
  isLegalCheckersStep,
  isLegalChessGeometry,
  isMemoryMatch,
  resolveHighLow,
  scoreTowerStack,
  scoreTrivia,
  validateWordChain,
} from "@/lib/gapGames";

const trivia = [
  { id: "wallet", prompt: "Which secret should never be shared?", choices: ["Public address", "Recovery phrase", "Block height"], correctIndex: 1 },
  { id: "hash", prompt: "What does a cryptographic hash help verify?", choices: ["Data integrity", "Market price", "Identity automatically"], correctIndex: 0 },
];

export default function Arcade() {
  const [currentCard, setCurrentCard] = useState(7);
  const [highLowResult, setHighLowResult] = useState("Choose higher or lower.");
  const memoryDeck = useMemo(() => createMemoryDeck(["SKY", "AI", "WEB3", "CODE"]), []);
  const [memoryOpen, setMemoryOpen] = useState<number[]>([]);
  const [memoryMatched, setMemoryMatched] = useState<number[]>([]);
  const [wordInput, setWordInput] = useState("");
  const [words, setWords] = useState<string[]>(["block"]);
  const [triviaAnswers, setTriviaAnswers] = useState<Record<string, number>>({});
  const [towerOverlaps, setTowerOverlaps] = useState<number[]>([]);
  const mines = useMemo(() => createMinesBoard(4, 4, [2, 7, 12]), []);
  const [revealedMines, setRevealedMines] = useState<number[]>([]);
  const [boardInput, setBoardInput] = useState({ from: "57", to: "42" });
  const [chessMessage, setChessMessage] = useState("Knight example: 57 → 42");
  const [checkersMessage, setCheckersMessage] = useState("Red example: 49 → 40");

  const playHighLow = (guess: "higher" | "lower") => {
    const next = ((currentCard * 7 + 3) % 13) + 1;
    const result = resolveHighLow(currentCard, next, guess);
    setHighLowResult(`${currentCard} → ${next}: ${result.outcome.toUpperCase()}`);
    setCurrentCard(next);
  };

  const flipMemory = (index: number) => {
    if (memoryMatched.includes(index) || memoryOpen.includes(index) || memoryOpen.length >= 2) return;
    const next = [...memoryOpen, index];
    setMemoryOpen(next);
    if (next.length === 2) {
      if (isMemoryMatch(memoryDeck[next[0]], memoryDeck[next[1]])) {
        setMemoryMatched((current) => [...current, ...next]);
        setMemoryOpen([]);
      } else {
        window.setTimeout(() => setMemoryOpen([]), 650);
      }
    }
  };

  const addWord = () => {
    const candidate = [...words, wordInput];
    const result = validateWordChain(candidate);
    if (result.valid) {
      setWords(candidate);
      setWordInput("");
    }
  };

  const triviaScore = scoreTrivia(trivia, triviaAnswers);
  const towerScore = scoreTowerStack(towerOverlaps);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <Badge variant="outline" className="mb-3">Engineering beta · simulated play only</Badge>
          <h1 className="flex items-center gap-2 text-3xl font-bold"><Gamepad2 className="h-7 w-7" /> SKY4444 Arcade Lab</h1>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            Eight local game experiences backed by tested deterministic domain logic. No real-money wagering, custody, blockchain settlement, token payouts, or production multiplayer services are performed here.
          </p>
        </div>

        <div className="mb-8 grid gap-3 sm:grid-cols-3">
          <Link href="/game/crash"><Card className="p-4 hover:border-primary"><strong>Crash</strong><p className="text-sm text-muted-foreground">Existing routed surface</p></Card></Link>
          <Link href="/game/slots"><Card className="p-4 hover:border-primary"><strong>Slots</strong><p className="text-sm text-muted-foreground">Existing routed surface</p></Card></Link>
          <Link href="/game/blackjack"><Card className="p-4 hover:border-primary"><strong>Blackjack</strong><p className="text-sm text-muted-foreground">Existing routed surface</p></Card></Link>
        </div>

        <Tabs defaultValue="high-low">
          <TabsList className="mb-6 flex h-auto flex-wrap justify-start">
            {[
              ["high-low", "High-Low"], ["memory", "Memory"], ["word", "Word Chain"], ["trivia", "Trivia"],
              ["tower", "Tower"], ["mines", "Mines"], ["chess", "Chess"], ["checkers", "Checkers"],
            ].map(([value, label]) => <TabsTrigger key={value} value={value}>{label}</TabsTrigger>)}
          </TabsList>

          <TabsContent value="high-low">
            <GameCard title="High-Low" description="Predict whether the deterministic next card is higher or lower.">
              <div className="text-5xl font-bold">{currentCard}</div>
              <div className="flex gap-2"><Button onClick={() => playHighLow("higher")}>Higher</Button><Button variant="outline" onClick={() => playHighLow("lower")}>Lower</Button></div>
              <p className="text-sm text-muted-foreground">{highLowResult}</p>
            </GameCard>
          </TabsContent>

          <TabsContent value="memory">
            <GameCard title="Memory Match" description="Match all four symbol pairs.">
              <div className="grid grid-cols-4 gap-2">
                {memoryDeck.map((card, index) => {
                  const visible = memoryOpen.includes(index) || memoryMatched.includes(index);
                  return <Button key={card.id} variant={visible ? "default" : "outline"} className="h-20" onClick={() => flipMemory(index)}>{visible ? card.value : "?"}</Button>;
                })}
              </div>
              <p className="text-sm text-muted-foreground">Matched {memoryMatched.length / 2}/4 pairs</p>
            </GameCard>
          </TabsContent>

          <TabsContent value="word">
            <GameCard title="Word Chain" description="Each new word must start with the previous word’s final letter, and repeats are rejected.">
              <div className="flex flex-wrap gap-2">{words.map((word) => <Badge key={word}>{word}</Badge>)}</div>
              <div className="flex gap-2"><Input value={wordInput} onChange={(event) => setWordInput(event.target.value)} placeholder="Try key, yield, data..." /><Button onClick={addWord}>Add</Button></div>
              <p className="text-sm text-muted-foreground">Current chain: {validateWordChain(words).valid ? "valid" : "invalid"}</p>
            </GameCard>
          </TabsContent>

          <TabsContent value="trivia">
            <GameCard title="Crypto Trivia" description="Answer the deterministic local question set.">
              {trivia.map((question) => <div key={question.id} className="space-y-2 rounded-lg border p-4"><p className="font-medium">{question.prompt}</p><div className="flex flex-wrap gap-2">{question.choices.map((choice, index) => <Button key={choice} variant={triviaAnswers[question.id] === index ? "default" : "outline"} onClick={() => setTriviaAnswers((current) => ({ ...current, [question.id]: index }))}>{choice}</Button>)}</div></div>)}
              <p className="font-medium">Score: {triviaScore.correct}/{triviaScore.total} ({triviaScore.percentage}%)</p>
            </GameCard>
          </TabsContent>

          <TabsContent value="tower">
            <GameCard title="Tower Stack" description="Place blocks; precision falls as overlap decreases. A miss ends the run.">
              <div className="flex gap-2"><Button onClick={() => setTowerOverlaps((current) => [...current, 1])}>Perfect</Button><Button variant="outline" onClick={() => setTowerOverlaps((current) => [...current, 0.75])}>Good</Button><Button variant="destructive" onClick={() => setTowerOverlaps((current) => [...current, 0])}>Miss</Button><Button variant="ghost" onClick={() => setTowerOverlaps([])}>Reset</Button></div>
              <p>Placed: {towerScore.placed} · Score: {towerScore.score}</p>
            </GameCard>
          </TabsContent>

          <TabsContent value="mines">
            <GameCard title="Mines" description="Reveal a deterministic 4×4 minefield generated by the tested adjacency engine.">
              <div className="grid w-fit grid-cols-4 gap-1">{mines.map((value, index) => <Button key={index} variant="outline" className="h-12 w-12 p-0" onClick={() => setRevealedMines((current) => current.includes(index) ? current : [...current, index])}>{revealedMines.includes(index) ? (value === -1 ? "✹" : value) : "?"}</Button>)}</div>
              <p className="text-sm text-muted-foreground">Simulation only; no wager or payout.</p>
            </GameCard>
          </TabsContent>

          <TabsContent value="chess">
            <GameCard title="Web3 Chess Move Lab" description="Validate local chess-piece movement geometry. Occupancy, check/checkmate, castling and en-passant are not yet modeled.">
              <BoardInputs value={boardInput} onChange={setBoardInput} />
              <div className="flex flex-wrap gap-2">{(["king", "queen", "rook", "bishop", "knight", "pawn"] as const).map((piece) => <Button key={piece} variant="outline" onClick={() => setChessMessage(`${piece}: ${isLegalChessGeometry(piece, Number(boardInput.from), Number(boardInput.to), "white") ? "legal geometry" : "illegal geometry"}`)}>{piece}</Button>)}</div>
              <p>{chessMessage}</p>
            </GameCard>
          </TabsContent>

          <TabsContent value="checkers">
            <GameCard title="Checkers Move Lab" description="Validate bounded diagonal red/black steps; captures and full board-state rules remain separate work.">
              <BoardInputs value={boardInput} onChange={setBoardInput} />
              <div className="flex gap-2"><Button onClick={() => setCheckersMessage(`red: ${isLegalCheckersStep(Number(boardInput.from), Number(boardInput.to), "red") ? "legal" : "illegal"}`)}>Red</Button><Button variant="outline" onClick={() => setCheckersMessage(`black: ${isLegalCheckersStep(Number(boardInput.from), Number(boardInput.to), "black") ? "legal" : "illegal"}`)}>Black</Button></div>
              <p>{checkersMessage}</p>
            </GameCard>
          </TabsContent>
        </Tabs>

        <Card className="mt-8 border-primary/30">
          <CardContent className="flex gap-3 p-5 text-sm text-muted-foreground"><ShieldCheck className="h-5 w-5 shrink-0 text-primary" /> These games intentionally remain local engineering-beta experiences. Multiplayer matchmaking, durable rankings, real rewards, payments, custody and blockchain execution require separately verified integrations.</CardContent>
        </Card>
      </div>
    </div>
  );
}

function GameCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return <Card><CardHeader><CardTitle>{title}</CardTitle><CardDescription>{description}</CardDescription></CardHeader><CardContent className="space-y-5">{children}</CardContent></Card>;
}

function BoardInputs({ value, onChange }: { value: { from: string; to: string }; onChange: (value: { from: string; to: string }) => void }) {
  return <div className="grid max-w-sm grid-cols-2 gap-2"><Input aria-label="From square" value={value.from} onChange={(event) => onChange({ ...value, from: event.target.value })} placeholder="from 0-63" /><Input aria-label="To square" value={value.to} onChange={(event) => onChange({ ...value, to: event.target.value })} placeholder="to 0-63" /></div>;
}
