export type PromptRecord = Readonly<{
  id: string;
  name: string;
  version: number;
  template: string;
  variables: readonly string[];
  status: 'draft' | 'active' | 'retired';
}>;

function clean(value: string, field: string): string {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${field} is required`);
  return normalized;
}

function uniqueVariables(values: readonly string[]): string[] {
  const normalized = values.map((value) => clean(value, 'variable'));
  const seen = new Set<string>();
  for (const value of normalized) {
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(value)) throw new Error(`invalid variable: ${value}`);
    if (seen.has(value)) throw new Error(`duplicate variable: ${value}`);
    seen.add(value);
  }
  return [...seen].sort();
}

export function createPrompt(input: Omit<PromptRecord, 'version' | 'status'>): PromptRecord {
  return Object.freeze({
    id: clean(input.id, 'id'),
    name: clean(input.name, 'name'),
    version: 1,
    template: clean(input.template, 'template'),
    variables: Object.freeze(uniqueVariables(input.variables)),
    status: 'draft',
  });
}

export function activatePrompt(prompt: PromptRecord): PromptRecord {
  if (prompt.status === 'retired') throw new Error('retired prompts cannot be activated');
  return Object.freeze({ ...prompt, version: prompt.version + 1, status: 'active' });
}

export function revisePrompt(prompt: PromptRecord, template: string, variables = prompt.variables): PromptRecord {
  if (prompt.status === 'retired') throw new Error('retired prompts cannot be revised');
  return Object.freeze({
    ...prompt,
    version: prompt.version + 1,
    template: clean(template, 'template'),
    variables: Object.freeze(uniqueVariables(variables)),
    status: 'draft',
  });
}

export function retirePrompt(prompt: PromptRecord): PromptRecord {
  if (prompt.status === 'retired') return prompt;
  return Object.freeze({ ...prompt, version: prompt.version + 1, status: 'retired' });
}

export function renderPrompt(prompt: PromptRecord, values: Readonly<Record<string, string>>): string {
  if (prompt.status !== 'active') throw new Error('only active prompts can be rendered');
  const expected = new Set(prompt.variables);
  for (const variable of expected) {
    if (!(variable in values)) throw new Error(`missing variable: ${variable}`);
  }
  for (const key of Object.keys(values)) {
    if (!expected.has(key)) throw new Error(`unexpected variable: ${key}`);
  }
  return prompt.template.replace(/\{\{\s*([A-Za-z_][A-Za-z0-9_]*)\s*\}\}/g, (_match, key: string) => {
    if (!expected.has(key)) throw new Error(`undeclared template variable: ${key}`);
    return values[key] ?? '';
  });
}

export const PROMPT_REGISTRY_EVENT = 'sky.prompt.registry.changed.v1' as const;
