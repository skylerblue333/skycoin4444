import { describe, expect, it } from "vitest";
import { filterQuestionsByTag, gradeAnswer, validateQuestion } from "./index";

const question = {
  id: "q:1",
  prompt: "Which value is even?",
  choices: ["3", "4", "5"],
  correctIndex: 1,
  tags: ["math", "basics"],
};

describe("SkyQuestionBank", () => {
  it("grades multiple-choice answers deterministically", () => {
    expect(gradeAnswer(question, 1)).toEqual({ questionId: "q:1", correct: true, selectedIndex: 1 });
    expect(gradeAnswer(question, 0).correct).toBe(false);
  });

  it("filters validated questions by tag", () => {
    expect(filterQuestionsByTag([question], "math")).toEqual([question]);
    expect(filterQuestionsByTag([question], "science")).toEqual([]);
  });

  it("rejects malformed question definitions", () => {
    expect(() => validateQuestion({ ...question, correctIndex: 4 })).toThrow("invalid correctIndex");
    expect(() => validateQuestion({ ...question, choices: ["only"] })).toThrow("invalid choices");
  });

  it("rejects out-of-range submitted answers", () => {
    expect(() => gradeAnswer(question, -1)).toThrow("invalid selectedIndex");
  });
});
