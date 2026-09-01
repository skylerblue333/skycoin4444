import fs from 'node:fs';
import { describe, expect, it } from 'vitest';

const globalCss = fs.readFileSync('client/src/index.css', 'utf8');
const card = fs.readFileSync('client/src/components/ui/card.tsx', 'utf8');
const button = fs.readFileSync('client/src/components/ui/button.tsx', 'utf8');
const input = fs.readFileSync('client/src/components/ui/input.tsx', 'utf8');
const workflow = fs.readFileSync('.github/workflows/ci.yml', 'utf8');

describe('shared UX modernization foundation', () => {
  it('defines reusable modern page and surface utilities', () => {
    expect(globalCss).toContain('.surface-panel');
    expect(globalCss).toContain('.page-shell');
    expect(globalCss).toContain('.page-heading');
    expect(globalCss).toContain('.page-subheading');
    expect(globalCss).toMatch(/background-image:/);
  });

  it('uses contemporary responsive shared primitives', () => {
    expect(card).toMatch(/rounded-2xl/);
    expect(card).toMatch(/backdrop-blur-xl/);
    expect(card).toMatch(/sm:px-6/);
    expect(button).toMatch(/rounded-xl/);
    expect(button).toMatch(/active:scale/);
    expect(input).toMatch(/rounded-xl/);
    expect(input).toMatch(/focus-visible:ring-primary/);
  });

  it('checks out the exact PR head for canonical CI', () => {
    expect(workflow).toContain("github.event.pull_request.head.sha");
    expect(workflow).toContain('Checkout exact source revision');
  });
});
