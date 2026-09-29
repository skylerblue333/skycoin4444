import { describe, expect, it } from "vitest";
import { quizBank } from "../client/src/data/quizBank";
import {
  buildQuizReviewPlan,
  filterQuizQuestions,
  quizCategories,
  scoreQuiz,
  validateQuizBank,
  type QuizQuestion,
} from "../client/src/lib/quizEngine";

describe("quizEngine", () => {
  it("keeps the authored bank valid and uniquely identified", () => {
    expect(validateQuizBank(quizBank)).toEqual([]);
    expect(new Set(quizBank.map(question => question.id)).size).toBe(quizBank.length);
    expect(quizBank.length).toBeGreaterThanOrEqual(20);
  });

  it("covers all required difficulty levels", () => {
    expect(filterQuizQuestions(quizBank, "beginner", "all").length).toBeGreaterThan(0);
    expect(filterQuizQuestions(quizBank, "intermediate", "all").length).toBeGreaterThan(0);
    expect(filterQuizQuestions(quizBank, "advanced", "all").length).toBeGreaterThan(0);
  });

  it("filters by difficulty and category together", () => {
    const questions = filterQuizQuestions(quizBank, "advanced", "Smart Contracts");
    expect(questions.length).toBeGreaterThan(0);
    expect(questions.every(question => question.difficulty === "advanced")).toBe(true);
    expect(questions.every(question => question.category === "Smart Contracts")).toBe(true);
  });

  it("returns sorted unique categories", () => {
    const categories = quizCategories(quizBank);
    expect(categories).toEqual([...categories].sort((a, b) => a.localeCompare(b)));
    expect(new Set(categories).size).toBe(categories.length);
    expect(categories).toContain("Blockchain");
    expect(categories).toContain("Wallet Security");
  });

  it("uses weighted points when scoring", () => {
    const questions = quizBank.slice(0, 2);
    const answers = {
      [questions[0].id]: questions[0].correctIndex,
      [questions[1].id]: (questions[1].correctIndex + 1) % questions[1].choices.length,
    };
    const result = scoreQuiz(questions, answers, 50);
    expect(result.answeredCount).toBe(2);
    expect(result.correctCount).toBe(1);
    expect(result.earnedPoints).toBe(questions[0].points);
    expect(result.totalPoints).toBe(questions[0].points + questions[1].points);
    expect(result.passed).toBe(true);
  });

  it("does not count unanswered questions as correct", () => {
    const result = scoreQuiz(quizBank.slice(0, 3), {});
    expect(result.answeredCount).toBe(0);
    expect(result.correctCount).toBe(0);
    expect(result.earnedPoints).toBe(0);
    expect(result.percentage).toBe(0);
    expect(result.passed).toBe(false);
  });

  it("builds a deterministic targeted review plan from missed and unanswered questions", () => {
    const questions = quizBank.slice(0, 6);
    const answers = {
      [questions[0].id]: questions[0].correctIndex,
      [questions[1].id]: (questions[1].correctIndex + 1) % questions[1].choices.length,
      [questions[2].id]: questions[2].correctIndex,
    };
    const plan = buildQuizReviewPlan(questions, answers);

    expect(plan.completionPercentage).toBe(50);
    expect(plan.missedQuestionIds).toEqual([questions[1].id]);
    expect(plan.unansweredQuestionIds).toEqual(questions.slice(3).map(question => question.id));
    expect(plan.categories.length).toBeGreaterThan(0);
    expect(plan.weakestCategories.length).toBeGreaterThan(0);
    expect(plan.recommendation).toMatch(/Finish 3 unanswered questions/i);
  });

  it("recognizes strong complete coverage without inventing a credential", () => {
    const questions = quizBank.slice(0, 4);
    const answers = Object.fromEntries(
      questions.map(question => [question.id, question.correctIndex]),
    );
    const plan = buildQuizReviewPlan(questions, answers);

    expect(plan.completionPercentage).toBe(100);
    expect(plan.missedQuestionIds).toHaveLength(0);
    expect(plan.unansweredQuestionIds).toHaveLength(0);
    expect(plan.weakestCategories).toHaveLength(0);
    expect(plan.recommendation).toMatch(/Continue to the next lesson|harder question set/i);
  });

  it("reports invalid authored questions", () => {
    const invalid: QuizQuestion = {
      id: "",
      category: "",
      difficulty: "beginner",
      prompt: "",
      choices: ["only one"],
      correctIndex: 2,
      explanation: "",
      points: 0,
    };
    expect(validateQuizBank([invalid]).length).toBeGreaterThanOrEqual(6);
  });
});
