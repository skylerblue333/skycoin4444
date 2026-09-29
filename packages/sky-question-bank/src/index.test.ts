import { describe, expect, it } from "vitest";
import {
  buildQuizSession,
  buildReviewQueue,
  filterQuestionsByTag,
  gradeAnswer,
  gradeQuizSession,
  validateQuestion,
} from "./index";

const question = {
  id: "q:1",
  prompt: "Which value is even?",
  choices: ["3", "4", "5"],
  correctIndex: 1,
  tags: ["math", "basics"],
};

const pool = [
  question,
  {
    id: "q:2",
    prompt: "Which number is prime?",
    choices: ["4", "5", "6"],
    correctIndex: 1,
    tags: ["math"],
  },
  {
    id: "q:3",
    prompt: "Which practice protects an account best?",
    choices: ["Reuse passwords", "Use MFA", "Share codes"],
    correctIndex: 1,
    tags: ["security"],
  },
];

describe("SkyQuestionBank", () => {
  it("grades multiple-choice answers deterministically", () => {
    expect(gradeAnswer(question, 1)).toEqual({
      questionId: "q:1",
      correct: true,
      selectedIndex: 1,
    });
    expect(gradeAnswer(question, 0).correct).toBe(false);
  });

  it("filters validated questions by tag", () => {
    expect(filterQuestionsByTag([question], "math")).toEqual([question]);
    expect(filterQuestionsByTag([question], "science")).toEqual([]);
  });

  it("rejects malformed question definitions", () => {
    expect(() => validateQuestion({ ...question, correctIndex: 4 })).toThrow(
      "invalid correctIndex",
    );
    expect(() => validateQuestion({ ...question, choices: ["only"] })).toThrow(
      "invalid choices",
    );
  });

  it("rejects out-of-range submitted answers", () => {
    expect(() => gradeAnswer(question, -1)).toThrow("invalid selectedIndex");
  });

  it("builds deterministic bounded quiz sessions without exposing answer keys", () => {
    const first = buildQuizSession(pool, {
      id: "session:1",
      tag: "math",
      limit: 2,
      seed: "lesson:alpha",
    });
    const second = buildQuizSession(pool, {
      id: "session:1",
      tag: "math",
      limit: 2,
      seed: "lesson:alpha",
    });

    expect(first).toEqual(second);
    expect(first.questions).toHaveLength(2);
    expect(first.answerKeysExposed).toBe(false);
    expect(first.questions.every(item => !("correctIndex" in item))).toBe(true);
  });

  it("grades a session and returns a deterministic review queue", () => {
    const session = buildQuizSession(pool, {
      id: "session:review",
      tag: "math",
      limit: 2,
      seed: "review-seed",
    });

    const definitions = new Map(pool.map(item => [item.id, item]));
    const submissions = session.questions.map((item, index) => {
      const definition = definitions.get(item.id)!;
      return {
        questionId: item.id,
        selectedIndex: index === 0 ? definition.correctIndex : 0,
      };
    });

    const result = gradeQuizSession(pool, session, submissions);
    expect(result.answered).toBe(2);
    expect(result.correct).toBeGreaterThanOrEqual(1);
    expect(result.credentialIssued).toBe(false);
    expect(result.persistencePerformed).toBe(false);
    expect(buildReviewQueue(pool, result).map(item => item.id)).toEqual(
      [...result.reviewQuestionIds].sort(),
    );
  });

  it("rejects duplicate submissions and questions outside the session", () => {
    const session = buildQuizSession(pool, {
      id: "session:2",
      tag: "security",
      limit: 1,
    });
    const questionId = session.questions[0]!.id;

    expect(() =>
      gradeQuizSession(pool, session, [
        { questionId, selectedIndex: 1 },
        { questionId, selectedIndex: 1 },
      ]),
    ).toThrow("duplicate submission");

    expect(() =>
      gradeQuizSession(pool, session, [
        { questionId: "q:1", selectedIndex: 1 },
      ]),
    ).toThrow("submission question is not in session");
  });
});
