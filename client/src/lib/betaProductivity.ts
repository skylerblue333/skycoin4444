export type MarkdownBlock =
  | { type: "heading"; text: string; level: 1 | 2 | 3 }
  | { type: "list"; text: string }
  | { type: "quote"; text: string }
  | { type: "code"; text: string }
  | { type: "paragraph"; text: string };

export function normalizeHexColor(input: string): string | null {
  const raw = input.trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{3}$/.test(raw)) {
    return (
      "#" +
      raw
        .split("")
        .map(character => character + character)
        .join("")
        .toUpperCase()
    );
  }
  if (/^[0-9a-fA-F]{6}$/.test(raw)) return "#" + raw.toUpperCase();
  return null;
}

export function hexToRgb(input: string) {
  const normalized = normalizeHexColor(input);
  if (!normalized) return null;
  const value = normalized.slice(1);
  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16),
  };
}

export function searchText(query: string, values: Array<string | null | undefined>) {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return values.some(value => (value ?? "").toLowerCase().includes(needle));
}

export function parseMarkdownBlocks(source: string): MarkdownBlock[] {
  const blocks: MarkdownBlock[] = [];
  let inCode = false;
  let codeLines: string[] = [];

  const flushCode = () => {
    if (!codeLines.length) return;
    blocks.push({ type: "code", text: codeLines.join("\n") });
    codeLines = [];
  };

  for (const rawLine of source.replace(/\r\n/g, "\n").split("\n")) {
    const line = rawLine.replace(/\s+$/, "");
    if (line.trim().startsWith("```")) {
      if (inCode) flushCode();
      inCode = !inCode;
      continue;
    }
    if (inCode) {
      codeLines.push(rawLine);
      continue;
    }
    if (!line.trim()) continue;

    const heading = /^(#{1,3})\s+(.+)$/.exec(line);
    if (heading) {
      blocks.push({
        type: "heading",
        text: heading[2].trim(),
        level: heading[1].length as 1 | 2 | 3,
      });
      continue;
    }

    const list = /^[-*]\s+(.+)$/.exec(line);
    if (list) {
      blocks.push({ type: "list", text: list[1].trim() });
      continue;
    }

    const quote = /^>\s?(.+)$/.exec(line);
    if (quote) {
      blocks.push({ type: "quote", text: quote[1].trim() });
      continue;
    }

    blocks.push({ type: "paragraph", text: line.trim() });
  }

  if (inCode) flushCode();
  return blocks;
}

export type QuizQuestion = {
  prompt: string;
  options: string[];
  correctIndex: number;
};

export function validateQuizQuestion(question: QuizQuestion): string | null {
  if (question.prompt.trim().length < 3) return "Question prompt is too short";
  if (question.options.length < 2 || question.options.length > 6) {
    return "Question needs between 2 and 6 options";
  }
  if (question.options.some(option => option.trim().length === 0)) {
    return "Every option needs text";
  }
  if (
    !Number.isInteger(question.correctIndex) ||
    question.correctIndex < 0 ||
    question.correctIndex >= question.options.length
  ) {
    return "Correct answer is outside the option range";
  }
  return null;
}

export function scoreQuiz(
  questions: QuizQuestion[],
  answers: Record<number, number>
) {
  const correct = questions.reduce(
    (total, question, index) =>
      total + (answers[index] === question.correctIndex ? 1 : 0),
    0
  );
  return {
    correct,
    total: questions.length,
    percent: questions.length
      ? Math.round((correct / questions.length) * 100)
      : 0,
  };
}
