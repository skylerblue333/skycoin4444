export type QuizDifficulty = "beginner" | "intermediate" | "advanced";

export type QuizQuestion = {
  id: string;
  category: string;
  difficulty: QuizDifficulty;
  prompt: string;
  choices: readonly string[];
  correctIndex: number;
  explanation: string;
  points: number;
};

export type QuizAnswers = Record<string, number>;

export type QuizScore = {
  answeredCount: number;
  correctCount: number;
  earnedPoints: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
};

export function validateQuizQuestion(question: QuizQuestion): string[] {
  const errors: string[] = [];
  if (!question.id.trim()) errors.push("Question id is required.");
  if (!question.category.trim()) errors.push("Question category is required.");
  if (!question.prompt.trim()) errors.push("Question prompt is required.");
  if (question.choices.length < 2) errors.push("Question must have at least two choices.");
  if (!Number.isInteger(question.correctIndex) || question.correctIndex < 0 || question.correctIndex >= question.choices.length) {
    errors.push("Correct answer index is out of range.");
  }
  if (!question.explanation.trim()) errors.push("Question explanation is required.");
  if (!Number.isFinite(question.points) || question.points <= 0) errors.push("Question points must be greater than zero.");
  return errors;
}

export function validateQuizBank(questions: readonly QuizQuestion[]): string[] {
  const ids = new Set<string>();
  const errors: string[] = [];

  questions.forEach((question, index) => {
    validateQuizQuestion(question).forEach(error => errors.push(`Question ${index + 1}: ${error}`));
    if (ids.has(question.id)) errors.push(`Duplicate question id: ${question.id}`);
    ids.add(question.id);
  });

  return errors;
}

export function scoreQuiz(
  questions: readonly QuizQuestion[],
  answers: QuizAnswers,
  passPercentage = 70,
): QuizScore {
  const totalPoints = questions.reduce((sum, question) => sum + question.points, 0);
  let answeredCount = 0;
  let correctCount = 0;
  let earnedPoints = 0;

  for (const question of questions) {
    const answer = answers[question.id];
    if (answer === undefined) continue;
    answeredCount += 1;
    if (answer === question.correctIndex) {
      correctCount += 1;
      earnedPoints += question.points;
    }
  }

  const percentage = totalPoints === 0 ? 0 : Math.round((earnedPoints / totalPoints) * 100);
  return {
    answeredCount,
    correctCount,
    earnedPoints,
    totalPoints,
    percentage,
    passed: percentage >= passPercentage,
  };
}

export function filterQuizQuestions(
  questions: readonly QuizQuestion[],
  difficulty: QuizDifficulty | "all",
  category: string | "all",
): QuizQuestion[] {
  return questions.filter(question =>
    (difficulty === "all" || question.difficulty === difficulty) &&
    (category === "all" || question.category === category),
  );
}

export function quizCategories(questions: readonly QuizQuestion[]): string[] {
  return Array.from(new Set(questions.map(question => question.category))).sort((a, b) => a.localeCompare(b));
}
