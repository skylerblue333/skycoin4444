import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { Brain, Gamepad2, ShieldCheck, Timer } from "lucide-react";
import {
  createMemoryDeck,
  createMinesBoard,
  dropPlinko,
  isLegalCheckersStep,
  isLegalChessGeometry,
  isMemoryMatch,
  moveSnake,
  resolveHighLow,
  rollDice,
  scoreTowerStack,
  scoreTrivia,
  spinRoulette,
  ticTacToeWinner,
  validateAssemblyOrder,
  validateWordChain,
} from "@/lib/gapGames";

const trivia = [
  { id: "wallet", prompt: "Which secret should never be shared?", choices: ["Public address", "Recovery phrase", "Block height"], correctIndex: 1 },
  { id: "hash", prompt: "What does a cryptographic hash help verify?", choices: ["Data integrity", "Market price", "Identity automatically"], correctIndex: 0 },
];
const assemblyTarget = ["frame", "engine", "wheels"];
const SKILL_PROGRESS_KEY = "skycoin4444.arcade.skill-progress.v1";
function skillSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
const skillLibrary = [
  ["Signal Sort", "Classify a message by signal before reacting.", ["Check source and context", "Forward instantly", "Assume intent"], 0],
  ["Privacy Triage", "Choose the safest first response to a data request.", ["Grant all access", "Ask what is needed", "Hide the purpose"], 1],
  ["Threat Model", "Identify the highest-risk security boundary.", ["A decorative icon", "A signing key", "A page color"], 1],
  ["Budget Builder", "Pick the first step in a responsible budget.", ["List income and fixed costs", "Buy first", "Ignore recurring costs"], 0],
  ["Source Check", "Select the strongest evidence for a product claim.", ["A rumor", "A dated primary record", "A slogan"], 1],
  ["Consent Compass", "Choose the correct behavior before sharing someone else's media.", ["Ask permission", "Assume public means consent", "Remove context"], 0],
  ["Debug Ladder", "Choose the first move when a bug is reported.", ["Reproduce and capture steps", "Rewrite everything", "Close the report"], 0],
  ["API Contract", "Select the safest response to an unknown API field.", ["Validate and handle absence", "Trust the cast", "Render raw input"], 0],
  ["Inbox Zero", "Pick a useful first pass for a crowded queue.", ["Group by urgency", "Delete randomly", "Answer the newest only"], 0],
  ["Meeting Maker", "Choose the artifact that makes a meeting useful.", ["An agenda and decision owner", "More attendees", "No notes"], 0],
  ["Feedback Loop", "Identify feedback that is easiest to act on.", ["It is bad", "The save button fails after these steps", "Everyone hates it"], 1],
  ["Risk Register", "Select the most useful risk entry.", ["Risk, trigger, owner, mitigation", "A vague fear", "A hidden concern"], 0],
  ["Test Case", "Choose a strong boundary test.", ["Only the happy path", "Empty, invalid, and retry states", "A screenshot once"], 1],
  ["Data Minimizer", "Choose the privacy-preserving data collection rule.", ["Collect everything", "Collect only what the task needs", "Keep data forever"], 1],
  ["Source of Truth", "Choose where a catalog price should come from.", ["A verified inventory service", "A placeholder constant", "A random fixture"], 0],
  ["Queue Logic", "Choose how to avoid duplicate job processing.", ["Idempotency key", "Retry forever", "Ignore status"], 0],
  ["Cache Sense", "Choose what requires freshness over speed.", ["A security permission", "A logo", "A static heading"], 0],
  ["Release Gate", "Choose evidence required before promoting a risky change.", ["Passing checks and reviewed behavior", "A confident message", "More placeholders"], 0],
  ["UX Focus", "Choose the clearest empty state.", ["Nothing", "What is absent plus the next action", "A disabled wall"], 1],
  ["Error Copy", "Choose useful error language.", ["Something failed", "What happened and what to try next", "Hide the error"], 1],
  ["Search Craft", "Choose a safe search behavior for user input.", ["Render as HTML", "Escape and bound the query", "Execute the query as code"], 1],
  ["Auth Boundary", "Choose where authorization must be enforced.", ["Only in the button", "On the server and in the UI", "In a comment"], 1],
  ["Wallet Sense", "Choose what must never be requested by support.", ["Recovery phrase", "Public address", "Network name"], 0],
  ["Marketplace Trust", "Choose the strongest seller signal.", ["Verified record and clear returns", "Urgency banner", "Unreviewed claim"], 0],
  ["Live Safety", "Choose the honest streaming claim.", ["Small-room peer beta", "Guaranteed global scale", "Automatic moderation"], 0],
  ["Learning Design", "Choose a strong lesson assessment.", ["Recall plus explanation", "A decorative badge", "No feedback"], 0],
  ["Match Quality", "Choose a responsible dating filter.", ["Consent and intent", "Guaranteed compatibility", "Hidden ranking"], 0],
  ["Team Handoff", "Choose what another engineer needs.", ["Context, acceptance criteria, and evidence", "A title only", "A private assumption"], 0],
  ["Incident First Aid", "Choose the first response to suspected compromise.", ["Preserve evidence and isolate safely", "Continue signing", "Delete logs"], 0],
  ["Decision Matrix", "Choose a useful comparison dimension.", ["Criteria and tradeoffs", "The loudest opinion", "A hidden score"], 0],
  ["Accessibility Check", "Choose an inclusive interaction requirement.", ["Keyboard and screen-reader path", "Color alone", "Hover only"], 0],
  ["Sustainable Pace", "Choose a reliable delivery habit.", ["Small verifiable slices", "Rush without checks", "Hide unfinished work"], 0],
  ["Product Truth", "Choose the right label for an unconnected integration.", ["Available", "Controlled beta / unavailable", "Live at scale"], 1],
  ["Recovery Route", "Choose what every important surface should offer.", ["A safe retry or route-health path", "A dead end", "A hidden reset"], 0],
] as const;

export default function Arcade() {
  const requestedHash = typeof window === "undefined" ? "" : window.location.hash.slice(1);
  const [activeTab, setActiveTab] = useState(() => {
    if (!requestedHash) return "high-low";
    return requestedHash.startsWith("skills-") ? "skills" : requestedHash;
  });
  const [focusedSkillSlug, setFocusedSkillSlug] = useState(
    requestedHash.startsWith("skills-") ? requestedHash.slice("skills-".length) : ""
  );
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
  const [seed, setSeed] = useState(1);
  const [snakeHead, setSnakeHead] = useState({ x: 1, y: 1 });
  const [snakeMessage, setSnakeMessage] = useState("Start in the center of a 3×3 board.");
  const [ticCells, setTicCells] = useState<Array<"X" | "O" | null>>(Array(9).fill(null));
  const [ticTurn, setTicTurn] = useState<"X" | "O">("X");
  const [assembly, setAssembly] = useState<string[]>([]);
  const [reactionState, setReactionState] = useState<"ready" | "waiting" | "go">("ready");
  const [reactionStarted, setReactionStarted] = useState(0);
  const [reactionScore, setReactionScore] = useState<number | null>(null);
  const [sequenceInput, setSequenceInput] = useState("");
  const [sequenceMessage, setSequenceMessage] = useState("");
  const sequence = "2468";
  const [colorChoice, setColorChoice] = useState("");
  const [colorMessage, setColorMessage] = useState("Pick the color named by the prompt.");
  const [mathInput, setMathInput] = useState("");
  const [mathMessage, setMathMessage] = useState("Solve 7 × 6.");
  const [skillAnswers, setSkillAnswers] = useState<Record<number, number>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const parsed: unknown = JSON.parse(localStorage.getItem(SKILL_PROGRESS_KEY) ?? "{}");
      if (!parsed || typeof parsed !== "object") return {};
      return Object.fromEntries(
        Object.entries(parsed).filter(([, value]) => typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 2)
      );
    } catch {
      return {};
    }
  });
  const [plinkoSeed, setPlinkoSeed] = useState(44);
  const plinkoDrop = useMemo(() => dropPlinko(plinkoSeed), [plinkoSeed]);
  useEffect(() => {
    try {
      localStorage.setItem(SKILL_PROGRESS_KEY, JSON.stringify(skillAnswers));
    } catch {
      // Private browsing and quota limits must not interrupt gameplay.
    }
  }, [skillAnswers]);

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
    if (validateWordChain(candidate).valid) {
      setWords(candidate);
      setWordInput("");
    }
  };

  const moveSnakeUi = (direction: "up" | "down" | "left" | "right") => {
    const next = moveSnake(snakeHead, direction, 3, 3);
    if (next.collided) {
      setSnakeMessage("Wall collision — reset to center.");
      setSnakeHead({ x: 1, y: 1 });
    } else {
      setSnakeHead({ x: next.x, y: next.y });
      setSnakeMessage(`Head at ${next.x},${next.y}`);
    }
  };

  const playTic = (index: number) => {
    if (ticCells[index] || ticTacToeWinner(ticCells)) return;
    const next = [...ticCells];
    next[index] = ticTurn;
    setTicCells(next);
    setTicTurn(ticTurn === "X" ? "O" : "X");
  };

  const triviaScore = scoreTrivia(trivia, triviaAnswers);
  const towerScore = scoreTowerStack(towerOverlaps);
  const ticWinner = ticTacToeWinner(ticCells);
  const assemblyResult = validateAssemblyOrder(assembly, assemblyTarget);

  const startReaction = () => {
    setReactionScore(null);
    setReactionState("waiting");
    window.setTimeout(() => {
      setReactionStarted(performance.now());
      setReactionState("go");
    }, 700 + (seed % 5) * 180);
  };

  const hitReaction = () => {
    if (reactionState === "waiting") {
      setReactionState("ready");
      setReactionMessage("Too early — wait for the signal.");
      return;
    }
    if (reactionState === "go") {
      setReactionScore(Math.max(1, Math.round(performance.now() - reactionStarted)));
      setReactionState("ready");
    }
  };

  const setReactionMessage = (message: string) => {
    setReactionScore(null);
    setSequenceMessage(message);
  };

  const submitSequence = () => {
    setSequenceMessage(sequenceInput === sequence ? "Correct — sequence recalled." : "Not quite. Try again.");
  };

  const chooseColor = (choice: string) => {
    setColorChoice(choice);
    setColorMessage(choice === "blue" ? "Correct — fast recognition." : "Try again: the prompt asks for blue.");
  };

  const checkMath = () => setMathMessage(mathInput === "42" ? "Correct — mental math complete." : "Not quite. Try 7 × 6.");

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <Badge variant="outline" className="mb-3">Engineering beta · simulated play only</Badge>
          <h1 className="flex items-center gap-2 text-3xl font-bold"><Gamepad2 className="h-7 w-7" /> SKY4444 Arcade Lab</h1>
          <p className="mt-2 max-w-3xl text-muted-foreground">Eighteen local game experiences backed by tested deterministic domain logic. No real-money wagering, custody, blockchain settlement, token payouts, or production multiplayer services are performed here.</p>
        </div>

        <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/game-crash"><Card className="p-4 hover:border-primary"><strong>Crash</strong><p className="text-sm text-muted-foreground">Reflex lab · virtual-credit engine</p></Card></Link>
          <Link href="/game-slots"><Card className="p-4 hover:border-primary"><strong>Slots</strong><p className="text-sm text-muted-foreground">Existing routed surface</p></Card></Link>
          <Link href="/game-blackjack"><Card className="p-4 hover:border-primary"><strong>Blackjack</strong><p className="text-sm text-muted-foreground">Existing routed surface</p></Card></Link>
          <Card className="p-4 border-primary/30"><strong>Plinko</strong><p className="text-sm text-muted-foreground">New tested local lab below</p></Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 flex h-auto flex-wrap justify-start">
            {[["plinko","Plinko"],["high-low","High-Low"],["memory","Memory"],["word","Word Chain"],["trivia","Trivia"],["tower","Tower"],["mines","Mines"],["chess","Chess"],["checkers","Checkers"],["reaction","Reaction"],["sequence","Sequence"],["color","Color Match"],["math","Math Sprint"],["legacy","5 More"],["skills","33 Skill Labs"]].map(([value,label]) => <TabsTrigger key={value} value={value}>{label}</TabsTrigger>)}
          </TabsList>

          <TabsContent value="plinko"><GameCard title="Plinko Lab" description="Drop a deterministic practice chip through six peg rows. Multipliers are labels for game feel only—there is no wager, token, payout, or cash value."><div className="space-y-2 rounded-2xl border bg-muted/30 p-5"><div className="flex justify-center gap-2 font-mono text-lg">{plinkoDrop.path.map((direction, index) => <span key={`${plinkoSeed}-${index}`} className="grid h-9 w-9 place-items-center rounded-full border bg-background">{direction === "left" ? "↙" : "↘"}</span>)}</div><div className="grid grid-cols-7 gap-1 text-center text-xs">{["3×","1.5×","1×","0.5×","1×","1.5×","3×"].map((label, index) => <span key={`${label}-${index}`} className={`rounded-lg border px-1 py-2 ${Math.round((plinkoDrop.bucket / plinkoDrop.rows) * 6) === index ? "border-primary bg-primary/15 font-bold" : "text-muted-foreground"}`}>{label}</span>)}</div></div><p className="font-medium">Bucket {plinkoDrop.bucket + 1}/{plinkoDrop.rows + 1} · practice score {plinkoDrop.score} · label {plinkoDrop.multiplierLabel}</p><Button onClick={() => setPlinkoSeed(value => value + 1)}>Drop again</Button></GameCard></TabsContent>

          <TabsContent value="high-low"><GameCard title="High-Low" description="Predict whether the deterministic next card is higher or lower."><div className="text-5xl font-bold">{currentCard}</div><div className="flex gap-2"><Button onClick={() => playHighLow("higher")}>Higher</Button><Button variant="outline" onClick={() => playHighLow("lower")}>Lower</Button></div><p className="text-sm text-muted-foreground">{highLowResult}</p></GameCard></TabsContent>

          <TabsContent value="memory"><GameCard title="Memory Match" description="Match all four symbol pairs."><div className="grid grid-cols-4 gap-2">{memoryDeck.map((card,index) => { const visible = memoryOpen.includes(index) || memoryMatched.includes(index); return <Button key={card.id} variant={visible ? "default" : "outline"} className="h-20" onClick={() => flipMemory(index)}>{visible ? card.value : "?"}</Button>; })}</div><p className="text-sm text-muted-foreground">Matched {memoryMatched.length / 2}/4 pairs</p></GameCard></TabsContent>

          <TabsContent value="word"><GameCard title="Word Chain" description="Each new word must start with the previous word’s final letter, and repeats are rejected."><div className="flex flex-wrap gap-2">{words.map((word) => <Badge key={word}>{word}</Badge>)}</div><div className="flex gap-2"><Input value={wordInput} onChange={(event) => setWordInput(event.target.value)} placeholder="Try key, yield, data..." /><Button onClick={addWord}>Add</Button></div><p className="text-sm text-muted-foreground">Current chain: {validateWordChain(words).valid ? "valid" : "invalid"}</p></GameCard></TabsContent>

          <TabsContent value="trivia"><GameCard title="Crypto Trivia" description="Answer the deterministic local question set.">{trivia.map((question) => <div key={question.id} className="space-y-2 rounded-lg border p-4"><p className="font-medium">{question.prompt}</p><div className="flex flex-wrap gap-2">{question.choices.map((choice,index) => <Button key={choice} variant={triviaAnswers[question.id] === index ? "default" : "outline"} onClick={() => setTriviaAnswers((current) => ({ ...current, [question.id]: index }))}>{choice}</Button>)}</div></div>)}<p className="font-medium">Score: {triviaScore.correct}/{triviaScore.total} ({triviaScore.percentage}%)</p></GameCard></TabsContent>

          <TabsContent value="tower"><GameCard title="Tower Stack" description="Place blocks; precision falls as overlap decreases. A miss ends the run."><div className="flex gap-2"><Button onClick={() => setTowerOverlaps((current) => [...current,1])}>Perfect</Button><Button variant="outline" onClick={() => setTowerOverlaps((current) => [...current,0.75])}>Good</Button><Button variant="destructive" onClick={() => setTowerOverlaps((current) => [...current,0])}>Miss</Button><Button variant="ghost" onClick={() => setTowerOverlaps([])}>Reset</Button></div><p>Placed: {towerScore.placed} · Score: {towerScore.score}</p></GameCard></TabsContent>

          <TabsContent value="mines"><GameCard title="Mines" description="Reveal a deterministic 4×4 minefield generated by the tested adjacency engine."><div className="grid w-fit grid-cols-4 gap-1">{mines.map((value,index) => <Button key={index} variant="outline" className="h-12 w-12 p-0" onClick={() => setRevealedMines((current) => current.includes(index) ? current : [...current,index])}>{revealedMines.includes(index) ? (value === -1 ? "✹" : value) : "?"}</Button>)}</div><p className="text-sm text-muted-foreground">Simulation only; no wager or payout.</p></GameCard></TabsContent>

          <TabsContent value="chess"><GameCard title="Web3 Chess Move Lab" description="Validate local chess-piece movement geometry. Occupancy, check/checkmate, castling and en-passant are not yet modeled."><BoardInputs value={boardInput} onChange={setBoardInput} /><div className="flex flex-wrap gap-2">{(["king","queen","rook","bishop","knight","pawn"] as const).map((piece) => <Button key={piece} variant="outline" onClick={() => setChessMessage(`${piece}: ${isLegalChessGeometry(piece,Number(boardInput.from),Number(boardInput.to),"white") ? "legal geometry" : "illegal geometry"}`)}>{piece}</Button>)}</div><p>{chessMessage}</p></GameCard></TabsContent>

          <TabsContent value="checkers"><GameCard title="Checkers Move Lab" description="Validate bounded diagonal red/black steps; captures and full board-state rules remain separate work."><BoardInputs value={boardInput} onChange={setBoardInput} /><div className="flex gap-2"><Button onClick={() => setCheckersMessage(`red: ${isLegalCheckersStep(Number(boardInput.from),Number(boardInput.to),"red") ? "legal" : "illegal"}`)}>Red</Button><Button variant="outline" onClick={() => setCheckersMessage(`black: ${isLegalCheckersStep(Number(boardInput.from),Number(boardInput.to),"black") ? "legal" : "illegal"}`)}>Black</Button></div><p>{checkersMessage}</p></GameCard></TabsContent>

          <TabsContent value="reaction"><GameCard title="Reaction Sprint" description="Wait for the signal, then tap as quickly as you can. Early taps reset the round."><div className="rounded-2xl border bg-muted/30 p-8 text-center"><Timer className="mx-auto mb-3 h-8 w-8" /><p className="text-2xl font-bold">{reactionState === "waiting" ? "Wait…" : reactionState === "go" ? "TAP NOW" : reactionScore ? `${reactionScore} ms` : "Ready?"}</p><Button className="mt-4" onClick={reactionState === "ready" ? startReaction : hitReaction}>{reactionState === "ready" ? "Start round" : "Tap"}</Button></div><p className="text-sm text-muted-foreground">{sequenceMessage || "Timing practice only. No wager, payout, or device-performance claim."}</p></GameCard></TabsContent>

          <TabsContent value="sequence"><GameCard title="Sequence Recall" description="Memorize the sequence, then enter it without spaces."><div className="rounded-2xl border bg-muted/30 p-6 text-center"><Brain className="mx-auto mb-3 h-7 w-7" /><p className="text-4xl font-black tracking-[0.35em]">{sequence}</p><p className="mt-2 text-sm text-muted-foreground">Memorize this four-digit sequence.</p></div><div className="flex gap-2"><Input value={sequenceInput} onChange={(event) => setSequenceInput(event.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="Enter sequence" inputMode="numeric" /><Button onClick={submitSequence}>Check</Button></div><p className="text-sm text-muted-foreground">{sequenceMessage}</p></GameCard></TabsContent>

          <TabsContent value="color"><GameCard title="Color Match" description="Choose the color named by the prompt as quickly as you can."><p className="text-2xl font-bold">Prompt: blue</p><div className="flex flex-wrap gap-2">{["red", "blue", "green", "yellow"].map(color => <Button key={color} variant={colorChoice === color ? "default" : "outline"} onClick={() => chooseColor(color)}>{color}</Button>)}</div><p className="text-sm text-muted-foreground">{colorMessage}</p></GameCard></TabsContent>

          <TabsContent value="math"><GameCard title="Math Sprint" description="Solve a bounded mental-math challenge and build accuracy."><p className="text-3xl font-black">7 × 6 = ?</p><div className="flex gap-2"><Input value={mathInput} onChange={(event) => setMathInput(event.target.value.replace(/\D/g, "").slice(0, 3))} placeholder="Answer" inputMode="numeric" /><Button onClick={checkMath}>Check</Button></div><p className="text-sm text-muted-foreground">{mathMessage}</p></GameCard></TabsContent>

          <TabsContent value="skills"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-muted-foreground">{focusedSkillSlug ? "Focused challenge · one decision at a time" : "Choose from 33 practical decision labs."} · {Object.keys(skillAnswers).length}/33 answered</p><div className="flex gap-2">{Object.keys(skillAnswers).length > 0 ? <Button variant="ghost" onClick={() => setSkillAnswers({})}>Reset progress</Button> : null}{focusedSkillSlug ? <Button variant="outline" onClick={() => setFocusedSkillSlug("")}>Show all skill labs</Button> : null}</div></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{skillLibrary.map(([title, description, choices, correctIndex], index) => ({ title, description, choices, correctIndex, index })).filter(skill => !focusedSkillSlug || skillSlug(skill.title) === focusedSkillSlug).map(({ title, description, choices, correctIndex, index }) => { const answer = skillAnswers[index]; const answered = typeof answer === "number"; return <GameCard key={title} title={title} description={description}><div className="grid gap-2">{choices.map((choice, choiceIndex) => <Button key={choice} variant={answered && answer === choiceIndex ? (answer === correctIndex ? "default" : "destructive") : "outline"} onClick={() => setSkillAnswers(current => ({ ...current, [index]: choiceIndex }))}>{choice}</Button>)}</div><p className="text-sm text-muted-foreground">{answered ? (answer === correctIndex ? "Correct — useful decision recorded." : `Not quite. Best answer: ${choices[correctIndex]}`) : "Choose the strongest answer to start this mode."}</p></GameCard>; })}</div></TabsContent>

          <TabsContent value="legacy">
            <div className="grid gap-4 lg:grid-cols-2">
              <GameCard title="Dice" description="Deterministic six-sided simulation."><p className="text-4xl font-bold">{rollDice(seed)}</p><Button onClick={() => setSeed((value) => value + 1)}>Roll</Button></GameCard>
              <GameCard title="Roulette" description="Deterministic 0–36 wheel simulation."><p className="text-2xl font-bold">{spinRoulette(seed).value} · {spinRoulette(seed).color}</p><Button onClick={() => setSeed((value) => value + 1)}>Spin</Button></GameCard>
              <GameCard title="Snake" description="3×3 grid movement with wall collision detection."><p className="font-mono">{snakeMessage}</p><div className="flex flex-wrap gap-2"><Button onClick={() => moveSnakeUi("up")}>Up</Button><Button onClick={() => moveSnakeUi("left")}>Left</Button><Button onClick={() => moveSnakeUi("down")}>Down</Button><Button onClick={() => moveSnakeUi("right")}>Right</Button></div></GameCard>
              <GameCard title="Tic-Tac-Toe" description="Local two-player winner/draw detection."><div className="grid w-fit grid-cols-3 gap-1">{ticCells.map((cell,index) => <Button key={index} variant="outline" className="h-14 w-14 p-0 text-xl" onClick={() => playTic(index)}>{cell ?? ""}</Button>)}</div><p>{ticWinner ? `Result: ${ticWinner}` : `Turn: ${ticTurn}`}</p><Button variant="ghost" onClick={() => { setTicCells(Array(9).fill(null)); setTicTurn("X"); }}>Reset</Button></GameCard>
              <GameCard title="Assembly Puzzle" description="Place frame, engine, and wheels in the correct order."><div className="flex gap-2">{assemblyTarget.map((part) => <Button key={part} variant="outline" disabled={assembly.includes(part)} onClick={() => setAssembly((current) => [...current,part])}>{part}</Button>)}</div><p>Correct positions: {assemblyResult.placed}/{assemblyResult.total} · {assemblyResult.correct ? "Complete" : "In progress"}</p><Button variant="ghost" onClick={() => setAssembly([])}>Reset</Button></GameCard>
            </div>
          </TabsContent>
        </Tabs>

        <Card className="mt-8 border-primary/30"><CardContent className="flex gap-3 p-5 text-sm text-muted-foreground"><ShieldCheck className="h-5 w-5 shrink-0 text-primary" /> These games intentionally remain local engineering-beta experiences. Multiplayer matchmaking, durable rankings, real rewards, payments, custody and blockchain execution require separately verified integrations.</CardContent></Card>
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
