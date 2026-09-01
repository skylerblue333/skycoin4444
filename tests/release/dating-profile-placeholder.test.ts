import fs from 'node:fs';
import { describe, expect, it } from 'vitest';

const pageSource = fs.readFileSync('client/src/pages/DatingProfileSetup.tsx', 'utf8');

describe('dating profile placeholder replacement', () => {
  it('contains deterministic validation rules', () => {
    expect(pageSource).toMatch(/Display name must be at least 2 characters/);
    expect(pageSource).toMatch(/Age must be between 18 and 120/);
    expect(pageSource).toMatch(/Bio must be at least 10 characters/);
    expect(pageSource).toMatch(/Choose at least one interest/);
  });

  it('contains a truthful browser-session save instead of the old backend stub', () => {
    expect(pageSource).not.toMatch(/Send to backend/i);
    expect(pageSource).toMatch(/sessionStorage\.setItem/);
    expect(pageSource).toMatch(/No server persistence or identity verification is claimed/);
    expect(pageSource).toMatch(/do not perform email, phone, or government-ID verification/);
  });
});
