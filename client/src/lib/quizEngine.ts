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

export type QuizCategoryReview = {
  category: string;
  questionCount: number;
  answeredCount: number;
  correctCount: number;
  earnedPoints: number;
  totalPoints: number;
  percentage: number;
};

export type QuizReviewPlan = {
  completionPercentage: number;
  categories: QuizCategoryReview[];
  weakestCategories: string[];
  missedQuestionIds: string[];
  unansweredQuestionIds: string[];
  recommendation: string;
};

export function buildQuizReviewPlan(
  questions: readonly QuizQuestion[],
  answers: QuizAnswers,
): QuizReviewPlan {
  const buckets = new Map<string, Omit<QuizCategoryReview, "percentage">>();
  const missedQuestionIds: string[] = [];
  const unansweredQuestionIds: string[] = [];

  for (const question of questions) {
    const current = buckets.get(question.category) ?? {
      category: question.category,
      questionCount: 0,
      answeredCount: 0,
      correctCount: 0,
      earnedPoints: 0,
      totalPoints: 0,
    };
    current.questionCount += 1;
    current.totalPoints += question.points;

    const answer = answers[question.id];
    if (answer === undefined) {
      unansweredQuestionIds.push(question.id);
    } else {
      current.answeredCount += 1;
      if (answer === question.correctIndex) {
        current.correctCount += 1;
        current.earnedPoints += question.points;
      } else {
        missedQuestionIds.push(question.id);
      }
    }
    buckets.set(question.category, current);
  }

  const categories = [...buckets.values()]
    .map(category => ({
      ...category,
      percentage:
        category.totalPoints === 0
          ? 0
          : Math.round((category.earnedPoints / category.totalPoints) * 100),
    }))
    .sort(
      (a, b) =>
        a.percentage - b.percentage ||
        a.correctCount - b.correctCount ||
        a.category.localeCompare(b.category),
    );

  const weakestCategories = categories
    .filter(category => category.percentage < 85 || category.answeredCount < category.questionCount)
    .slice(0, 3)
    .map(category => category.category);

  const answeredCount = questions.length - unansweredQuestionIds.length;
  const completionPercentage =
    questions.length === 0 ? 0 : Math.round((answeredCount / questions.length) * 100);

  const recommendation =
    questions.length === 0
      ? "Choose a quiz set to build a review plan."
      : unansweredQuestionIds.length > 0
        ? `Finish ${unansweredQuestionIds.length} unanswered question${unansweredQuestionIds.length === 1 ? "" : "s"}, then review ${weakestCategories.join(", ") || "the completed topics"}.`
        : weakestCategories.length > 0
          ? `Review ${weakestCategories.join(", ")} before the next attempt.`
          : "Strong coverage across this quiz set. Continue to the next lesson or harder question set.";

  return {
    completionPercentage,
    categories,
    weakestCategories,
    missedQuestionIds,
    unansweredQuestionIds,
    recommendation,
  };
}
