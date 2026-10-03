import { describe, expect, it } from "vitest";
import {
  getLearningTrack,
  gradeSkillCheck,
  learningTracks,
} from "./learningAssessment";

describe("learning assessment", () => {
  it("ships four authored tracks with twenty deterministic questions", () => {
    expect(learningTracks).toHaveLength(4);
    expect(
      learningTracks.reduce((total, track) => total + track.questions.length, 0),
    ).toBe(20);
    expect(new Set(learningTracks.map(track => track.id)).size).toBe(4);
  });

  it("scores a perfect AI literacy check deterministically", () => {
    const track = getLearningTrack("ai-literacy");
    const answers = Object.fromEntries(
      track.questions.map(item => [item.id, item.correctIndex]),
    );
    const result = gradeSkillCheck("ai-literacy", answers);

    expect(result.correctCount).toBe(track.questions.length);
    expect(result.scorePercent).toBe(100);
    expect(result.band).toBe("strong");
    expect(result.missedQuestionIds).toEqual([]);
    expect(result.recommendedRoute).toBe("/hope-a-i");
  });

  it("counts unanswered and invalid choices as missed instead of inflating scores", () => {
    const result = gradeSkillCheck("digital-safety", {
      "ds-1": 9,
      "ds-2": 2,
    });

    expect(result.answeredCount).toBe(1);
    expect(result.correctCount).toBe(1);
    expect(result.scorePercent).toBe(20);
    expect(result.band).toBe("needs-practice");
    expect(result.missedQuestionIds).toContain("ds-1");
    expect(result.missedQuestionIds).toContain("ds-3");
  });
});
