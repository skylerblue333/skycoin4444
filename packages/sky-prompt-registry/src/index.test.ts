import { describe, expect, it } from 'vitest';
import { activatePrompt, createPrompt, renderPrompt, retirePrompt, revisePrompt } from './index';

describe('SkyPromptRegistry', () => {
  it('creates deterministic drafts and normalizes variables', () => {
    const prompt = createPrompt({ id: ' p1 ', name: ' Greeting ', template: 'Hello {{name}}', variables: ['name'] });
    expect(prompt).toMatchObject({ id: 'p1', name: 'Greeting', version: 1, status: 'draft', variables: ['name'] });
  });

  it('activates and renders only with the declared variable set', () => {
    const prompt = activatePrompt(createPrompt({ id: 'p1', name: 'Greeting', template: 'Hello {{ name }}', variables: ['name'] }));
    expect(renderPrompt(prompt, { name: 'Sky' })).toBe('Hello Sky');
    expect(() => renderPrompt(prompt, {})).toThrow('missing variable: name');
    expect(() => renderPrompt(prompt, { name: 'Sky', extra: 'x' })).toThrow('unexpected variable: extra');
  });

  it('revisions increment versions and return to draft', () => {
    const active = activatePrompt(createPrompt({ id: 'p1', name: 'Greeting', template: 'Hello {{name}}', variables: ['name'] }));
    const revised = revisePrompt(active, 'Hi {{name}}');
    expect(revised.version).toBe(3);
    expect(revised.status).toBe('draft');
  });

  it('retirement is terminal and idempotent', () => {
    const retired = retirePrompt(createPrompt({ id: 'p1', name: 'Greeting', template: 'Hello', variables: [] }));
    expect(retirePrompt(retired)).toBe(retired);
    expect(() => activatePrompt(retired)).toThrow('retired prompts cannot be activated');
    expect(() => revisePrompt(retired, 'new')).toThrow('retired prompts cannot be revised');
  });

  it('rejects invalid or duplicate variable definitions', () => {
    expect(() => createPrompt({ id: 'p1', name: 'x', template: 'x', variables: ['bad-key'] })).toThrow('invalid variable');
    expect(() => createPrompt({ id: 'p1', name: 'x', template: 'x', variables: ['name', 'name'] })).toThrow('duplicate variable');
  });
});
