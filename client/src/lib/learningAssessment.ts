export type LearningTrackId =
  | "ai-literacy"
  | "software-engineering"
  | "digital-safety"
  | "crypto-basics";

export type LearningQuestion = Readonly<{
  id: string;
  trackId: LearningTrackId;
  prompt: string;
  choices: readonly [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
}>;

export type LearningTrack = Readonly<{
  id: LearningTrackId;
  title: string;
  description: string;
  recommendedRoute: string;
  questions: readonly LearningQuestion[];
}>;

export type AssessmentBand = "needs-practice" | "building" | "strong";

export type AssessmentResult = Readonly<{
  trackId: LearningTrackId;
  answeredCount: number;
  questionCount: number;
  correctCount: number;
  scorePercent: number;
  band: AssessmentBand;
  missedQuestionIds: readonly string[];
  recommendedRoute: string;
}>;

function question(
  id: string,
  trackId: LearningTrackId,
  prompt: string,
  choices: readonly [string, string, string, string],
  correctIndex: 0 | 1 | 2 | 3,
  explanation: string,
): LearningQuestion {
  return Object.freeze({
    id,
    trackId,
    prompt,
    choices,
    correctIndex,
    explanation,
  });
}

export const learningTracks: readonly LearningTrack[] = Object.freeze([
  {
    id: "ai-literacy",
    title: "AI Literacy",
    description:
      "Reason about model limits, evidence, privacy, and responsible assistant use.",
    recommendedRoute: "/hope-a-i",
    questions: Object.freeze([
      question(
        "ai-1",
        "ai-literacy",
        "What is the safest way to treat a confident AI answer?",
        [
          "Assume confidence means correctness",
          "Verify important claims against reliable evidence",
          "Share private data so the model can be more certain",
          "Treat every answer as a professional decision",
        ],
        1,
        "Confidence is not proof. Important claims should be checked against reliable evidence.",
      ),
      question(
        "ai-2",
        "ai-literacy",
        "Which task should require especially careful human review?",
        [
          "Brainstorming a nickname",
          "Reformatting a grocery list",
          "A high-stakes medical or legal decision",
          "Generating placeholder copy",
        ],
        2,
        "High-stakes decisions need qualified human review and source verification.",
      ),
      question(
        "ai-3",
        "ai-literacy",
        "What should an assistant do when it cannot actually access an external account?",
        [
          "Pretend the action succeeded",
          "Invent a confirmation number",
          "State the limitation and avoid claiming execution",
          "Guess from prior messages",
        ],
        2,
        "Truthful boundaries are more important than simulated success.",
      ),
      question(
        "ai-4",
        "ai-literacy",
        "Which input is generally safest to avoid pasting into an AI tool?",
        [
          "A public product description",
          "A made-up example",
          "A password or private authentication secret",
          "A short brainstorming prompt",
        ],
        2,
        "Authentication secrets should not be shared with an assistant.",
      ),
      question(
        "ai-5",
        "ai-literacy",
        "What is a useful way to reduce hallucination risk?",
        [
          "Ask for evidence and verify it",
          "Make the prompt longer without checking sources",
          "Repeat the same question until the answer changes",
          "Assume recent facts are always current",
        ],
        0,
        "Evidence, source checks, and current verification reduce unsupported claims.",
      ),
    ]),
  },
  {
    id: "software-engineering",
    title: "Software Engineering",
    description:
      "Check fundamentals around testing, interfaces, failures, and maintainable changes.",
    recommendedRoute: "/a-i-code-studio",
    questions: Object.freeze([
      question(
        "se-1",
        "software-engineering",
        "What does a good regression test primarily protect?",
        [
          "A bug fix or behavior contract from silently breaking later",
          "The number of files in a repository",
          "A preferred editor theme",
          "Commit-message formatting only",
        ],
        0,
        "Regression tests lock important behavior so later changes cannot quietly reintroduce the defect.",
      ),
      question(
        "se-2",
        "software-engineering",
        "When should a service fail closed?",
        [
          "When a security-sensitive prerequisite cannot be verified",
          "Whenever a button changes color",
          "Only after production deployment",
          "Never; success is always better",
        ],
        0,
        "Security-sensitive operations should not proceed when authorization or prerequisites are uncertain.",
      ),
      question(
        "se-3",
        "software-engineering",
        "What makes an API contract easier to maintain?",
        [
          "Implicit shapes that change silently",
          "Validated request and response types",
          "Skipping error states",
          "Returning unrelated fields",
        ],
        1,
        "Explicit validated contracts make integration behavior easier to reason about and test.",
      ),
      question(
        "se-4",
        "software-engineering",
        "What is the best first reaction to a failing CI gate caused by your change?",
        [
          "Bypass the gate",
          "Merge first and investigate later",
          "Diagnose and fix the cause before merge",
          "Delete the failing test",
        ],
        2,
        "A failing required gate is evidence the change is not ready to merge.",
      ),
      question(
        "se-5",
        "software-engineering",
        "Why keep domain logic separate from UI rendering?",
        [
          "So behavior can be tested and reused independently",
          "To guarantee zero bugs",
          "To avoid writing types",
          "Because UI code cannot call functions",
        ],
        0,
        "Pure or isolated domain logic is easier to test, reason about, and reuse.",
      ),
    ]),
  },
  {
    id: "digital-safety",
    title: "Digital Safety",
    description:
      "Practice account security, privacy, suspicious-link handling, and recovery habits.",
    recommendedRoute: "/trust-safety-dashboard",
    questions: Object.freeze([
      question(
        "ds-1",
        "digital-safety",
        "What is the strongest default for important account passwords?",
        [
          "Reuse one memorable password everywhere",
          "Use unique strong passwords with a password manager",
          "Use your birthday with symbols",
          "Share passwords with trusted friends",
        ],
        1,
        "Unique credentials limit damage when one service is breached.",
      ),
      question(
        "ds-2",
        "digital-safety",
        "A message urgently asks you to sign in through a link. What should you do first?",
        [
          "Open the link immediately",
          "Reply with your password",
          "Navigate to the service independently and verify the request",
          "Forward the link to everyone",
        ],
        2,
        "Independent navigation reduces phishing risk.",
      ),
      question(
        "ds-3",
        "digital-safety",
        "What does multi-factor authentication add?",
        [
          "A second verification factor beyond the password",
          "A public backup password",
          "Automatic recovery from every attack",
          "A guarantee the service cannot be breached",
        ],
        0,
        "MFA adds another factor but does not eliminate every risk.",
      ),
      question(
        "ds-4",
        "digital-safety",
        "What is a safer backup practice?",
        [
          "Keep the only copy on one device",
          "Maintain tested backups separated from the primary device",
          "Never verify restores",
          "Store backup secrets in public notes",
        ],
        1,
        "A backup is only useful when it is separate and restoreable.",
      ),
      question(
        "ds-5",
        "digital-safety",
        "If an app requests more permissions than it needs, what is a good response?",
        [
          "Approve everything automatically",
          "Review and deny unnecessary access",
          "Publish your account token",
          "Disable every security control",
        ],
        1,
        "Least privilege reduces unnecessary exposure.",
      ),
    ]),
  },
  {
    id: "crypto-basics",
    title: "Crypto Basics",
    description:
      "Separate wallets, signatures, custody, settlement, and market concepts from hype.",
    recommendedRoute: "/beta-web3",
    questions: Object.freeze([
      question(
        "cb-1",
        "crypto-basics",
        "What does signing a blockchain transaction generally do?",
        [
          "Authorizes data with a private key-controlled signature",
          "Guarantees profit",
          "Makes the transaction reversible",
          "Publishes your private key",
        ],
        0,
        "A signature authorizes a transaction without intentionally revealing the private key.",
      ),
      question(
        "cb-2",
        "crypto-basics",
        "What is custody?",
        [
          "Who controls the keys or assets",
          "The token's logo",
          "A price chart color",
          "A guaranteed investment return",
        ],
        0,
        "Custody concerns control over keys/assets, not branding or price performance.",
      ),
      question(
        "cb-3",
        "crypto-basics",
        "What is a reasonable assumption about crypto price forecasts?",
        [
          "They are guaranteed",
          "They are uncertain and can be wrong",
          "A meme makes them accurate",
          "Past gains force future gains",
        ],
        1,
        "Markets are uncertain; forecasts are not guarantees.",
      ),
      question(
        "cb-4",
        "crypto-basics",
        "What should a beta wallet UI avoid claiming without evidence?",
        [
          "That a button exists",
          "That a live transfer settled when no provider or chain executed it",
          "That a field accepts text",
          "That the page has a title",
        ],
        1,
        "Interfaces must not claim settlement or custody without actual execution evidence.",
      ),
      question(
        "cb-5",
        "crypto-basics",
        "Why verify a destination address before sending value?",
        [
          "Blockchain transfers may be difficult or impossible to reverse",
          "It changes the token symbol",
          "It guarantees market gains",
          "It removes network fees",
        ],
        0,
        "Irreversibility makes destination verification especially important.",
      ),
    ]),
  },
]);

export function getLearningTrack(trackId: LearningTrackId): LearningTrack {
  const track = learningTracks.find(candidate => candidate.id === trackId);
  if (!track) {
    throw new Error("Unknown learning track");
  }
  return track;
}

function validAnswerIndex(value: unknown): value is 0 | 1 | 2 | 3 {
  return Number.isInteger(value) && Number(value) >= 0 && Number(value) <= 3;
}

export function gradeSkillCheck(
  trackId: LearningTrackId,
  answers: Readonly<Record<string, number | undefined>>,
): AssessmentResult {
  const track = getLearningTrack(trackId);
  let answeredCount = 0;
  let correctCount = 0;
  const missedQuestionIds: string[] = [];

  for (const item of track.questions) {
    const answer = answers[item.id];
    if (validAnswerIndex(answer)) {
      answeredCount += 1;
      if (answer === item.correctIndex) {
        correctCount += 1;
      } else {
        missedQuestionIds.push(item.id);
      }
    } else {
      missedQuestionIds.push(item.id);
    }
  }

  const scorePercent = Math.round(
    (correctCount / Math.max(1, track.questions.length)) * 100,
  );
  const band: AssessmentBand =
    scorePercent >= 80
      ? "strong"
      : scorePercent >= 50
        ? "building"
        : "needs-practice";

  return Object.freeze({
    trackId,
    answeredCount,
    questionCount: track.questions.length,
    correctCount,
    scorePercent,
    band,
    missedQuestionIds: Object.freeze(missedQuestionIds),
    recommendedRoute: track.recommendedRoute,
  });
}
