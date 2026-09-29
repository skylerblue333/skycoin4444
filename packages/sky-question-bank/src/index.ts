export interface MultipleChoiceQuestion {
  id: string;
  prompt: string;
  choices: readonly string[];
  correctIndex: number;
  tags: readonly string[];
}

export interface PublicQuizQuestion {
  id: string;
  prompt: string;
  choices: readonly string[];
  tags: readonly string[];
}

export interface AnswerResult {
  questionId: string;
  correct: boolean;
  selectedIndex: number;
}

export interface QuizSessionInput {
  id: string;
  tag?: string;
  limit?: number;
  seed?: string;
}

export interface QuizSession {
  id: string;
  tag: string | null;
  seed: string;
  questions: readonly PublicQuizQuestion[];
  answerKeysExposed: false;
  persistencePerformed: false;
}

export interface QuizSubmission {
  questionId: string;
  selectedIndex: number;
}

export interface QuizSessionResult {
  sessionId: string;
  answered: number;
  correct: number;
  scorePercent: number;
  reviewQuestionIds: readonly string[];
  credentialIssued: false;
  persistencePerformed: false;
}

const ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
const TAG = /^[a-z0-9][a-z0-9-]{0,31}$/;
const MAX_SESSION_QUESTIONS = 50;

function validateId(value: string, field: string): string {
  if (typeof value !== "string" || !ID.test(value)) {
    throw new Error(`invalid ${field}`);
  }
  return value;
}

export function validateQuestion(
  question: MultipleChoiceQuestion,
): MultipleChoiceQuestion {
  if (!ID.test(question.id)) throw new Error("invalid question id");
  if (question.prompt.trim().length < 3 || question.prompt.length > 1000) {
    throw new Error("invalid prompt");
  }
  if (question.choices.length < 2 || question.choices.length > 8) {
    throw new Error("invalid choices");
  }
  if (
    question.choices.some(
      choice => choice.trim().length === 0 || choice.length > 500,
    )
  ) {
    throw new Error("invalid choice");
  }
  if (
    !Number.isInteger(question.correctIndex) ||
    question.correctIndex < 0 ||
    question.correctIndex >= question.choices.length
  ) {
    throw new Error("invalid correctIndex");
  }
  if (question.tags.length > 16 || question.tags.some(tag => !TAG.test(tag))) {
    throw new Error("invalid tags");
  }
  return {
    ...question,
    choices: [...question.choices],
    tags: [...question.tags],
  };
}

export function gradeAnswer(
  question: MultipleChoiceQuestion,
  selectedIndex: number,
): AnswerResult {
  const checked = validateQuestion(question);
  if (
    !Number.isInteger(selectedIndex) ||
    selectedIndex < 0 ||
    selectedIndex >= checked.choices.length
  ) {
    throw new Error("invalid selectedIndex");
  }
  return {
    questionId: checked.id,
    correct: selectedIndex === checked.correctIndex,
    selectedIndex,
  };
}

export function filterQuestionsByTag(
  questions: readonly MultipleChoiceQuestion[],
  tag: string,
): MultipleChoiceQuestion[] {
  if (!TAG.test(tag)) throw new Error("invalid tag");
  return questions
    .map(validateQuestion)
    .filter(question => question.tags.includes(tag));
}

function publicQuestion(question: MultipleChoiceQuestion): PublicQuizQuestion {
  return {
    id: question.id,
    prompt: question.prompt,
    choices: [...question.choices],
    tags: [...question.tags],
  };
}

function stableRank(seed: string, id: string): number {
  let hash = 2166136261;
  for (const char of `${seed}:${id}`) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function buildQuizSession(
  questions: readonly MultipleChoiceQuestion[],
  input: QuizSessionInput,
): QuizSession {
  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error("questions are required");
  }
  if (!input || typeof input !== "object") {
    throw new Error("session input is required");
  }

  const id = validateId(input.id, "session id");
  const seed = validateId(input.seed ?? id, "session seed");
  const tag = input.tag ?? null;
  if (tag !== null && !TAG.test(tag)) throw new Error("invalid tag");

  const limit = input.limit ?? 10;
  if (
    !Number.isSafeInteger(limit) ||
    limit < 1 ||
    limit > MAX_SESSION_QUESTIONS
  ) {
    throw new Error(
      `limit must be an integer from 1 to ${MAX_SESSION_QUESTIONS}`,
    );
  }

  const validated = questions.map(validateQuestion);
  const ids = new Set<string>();
  for (const question of validated) {
    if (ids.has(question.id)) throw new Error(`duplicate question id: ${question.id}`);
    ids.add(question.id);
  }

  const pool =
    tag === null
      ? validated
      : validated.filter(question => question.tags.includes(tag));
  if (pool.length === 0) throw new Error("question pool is empty");

  const selected = [...pool]
    .sort(
      (left, right) =>
        stableRank(seed, left.id) - stableRank(seed, right.id) ||
        left.id.localeCompare(right.id),
    )
    .slice(0, Math.min(limit, pool.length))
    .map(publicQuestion);

  return {
    id,
    tag,
    seed,
    questions: selected,
    answerKeysExposed: false,
    persistencePerformed: false,
  };
}

export function gradeQuizSession(
  questions: readonly MultipleChoiceQuestion[],
  session: QuizSession,
  submissions: readonly QuizSubmission[],
): QuizSessionResult {
  if (!session || typeof session !== "object") {
    throw new Error("session is required");
  }
  validateId(session.id, "session id");
  if (!Array.isArray(submissions)) throw new Error("submissions must be an array");

  const answerable = new Map(
    questions.map(question => {
      const checked = validateQuestion(question);
      return [checked.id, checked] as const;
    }),
  );
  const sessionIds = new Set(session.questions.map(question => question.id));
  if (sessionIds.size !== session.questions.length) {
    throw new Error("session contains duplicate question ids");
  }

  const submitted = new Set<string>();
  let correct = 0;
  const reviewQuestionIds: string[] = [];

  for (const submission of submissions) {
    if (!submission || typeof submission !== "object") {
      throw new Error("invalid submission");
    }
    if (!sessionIds.has(submission.questionId)) {
      throw new Error("submission question is not in session");
    }
    if (submitted.has(submission.questionId)) {
      throw new Error("duplicate submission");
    }
    submitted.add(submission.questionId);

    const question = answerable.get(submission.questionId);
    if (!question) throw new Error("question definition is missing");
    const result = gradeAnswer(question, submission.selectedIndex);
    if (result.correct) correct += 1;
    else reviewQuestionIds.push(result.questionId);
  }

  const answered = submissions.length;
  const scorePercent =
    answered === 0 ? 0 : Math.round((correct / answered) * 10_000) / 100;

  return {
    sessionId: session.id,
    answered,
    correct,
    scorePercent,
    reviewQuestionIds: reviewQuestionIds.sort(),
    credentialIssued: false,
    persistencePerformed: false,
  };
}

export function buildReviewQueue(
  questions: readonly MultipleChoiceQuestion[],
  result: QuizSessionResult,
): PublicQuizQuestion[] {
  const wanted = new Set(result.reviewQuestionIds);
  return questions
    .map(validateQuestion)
    .filter(question => wanted.has(question.id))
    .sort((left, right) => left.id.localeCompare(right.id))
    .map(publicQuestion);
}
