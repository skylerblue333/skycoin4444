export interface MultipleChoiceQuestion {
  id: string;
  prompt: string;
  choices: readonly string[];
  correctIndex: number;
  tags: readonly string[];
}

export interface AnswerResult {
  questionId: string;
  correct: boolean;
  selectedIndex: number;
}

const ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
const TAG = /^[a-z0-9][a-z0-9-]{0,31}$/;

export function validateQuestion(question: MultipleChoiceQuestion): MultipleChoiceQuestion {
  if (!ID.test(question.id)) throw new Error("invalid question id");
  if (question.prompt.trim().length < 3 || question.prompt.length > 1000) throw new Error("invalid prompt");
  if (question.choices.length < 2 || question.choices.length > 8) throw new Error("invalid choices");
  if (question.choices.some((choice) => choice.trim().length === 0 || choice.length > 500)) throw new Error("invalid choice");
  if (!Number.isInteger(question.correctIndex) || question.correctIndex < 0 || question.correctIndex >= question.choices.length) {
    throw new Error("invalid correctIndex");
  }
  if (question.tags.length > 16 || question.tags.some((tag) => !TAG.test(tag))) throw new Error("invalid tags");
  return { ...question, choices: [...question.choices], tags: [...question.tags] };
}

export function gradeAnswer(question: MultipleChoiceQuestion, selectedIndex: number): AnswerResult {
  const checked = validateQuestion(question);
  if (!Number.isInteger(selectedIndex) || selectedIndex < 0 || selectedIndex >= checked.choices.length) {
    throw new Error("invalid selectedIndex");
  }
  return { questionId: checked.id, correct: selectedIndex === checked.correctIndex, selectedIndex };
}

export function filterQuestionsByTag(
  questions: readonly MultipleChoiceQuestion[],
  tag: string,
): MultipleChoiceQuestion[] {
  if (!TAG.test(tag)) throw new Error("invalid tag");
  return questions.map(validateQuestion).filter((question) => question.tags.includes(tag));
}
