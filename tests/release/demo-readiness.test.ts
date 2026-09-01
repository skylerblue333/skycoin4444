import fs from 'node:fs';
import { describe, expect, it } from 'vitest';

const demo = fs.readFileSync('docs/DEMO_READINESS.md', 'utf8');
const courseCatalog = fs.readFileSync('client/src/pages/CourseCatalog.tsx', 'utf8');
const arcade = fs.readFileSync('client/src/pages/Arcade.tsx', 'utf8');
const dating = fs.readFileSync('client/src/pages/DatingProfileSetup.tsx', 'utf8');

describe('demo readiness contract', () => {
  it('documents the three verified demo flows and engineering-beta boundary', () => {
    expect(demo).toMatch(/engineering-beta demo candidate/i);
    expect(demo).toMatch(/Course Catalog/);
    expect(demo).toMatch(/Arcade Lab/);
    expect(demo).toMatch(/Dating Profile Setup/);
    expect(demo).toMatch(/does not certify every historical page/i);
  });

  it('keeps the selected demo surfaces implemented rather than generic placeholders', () => {
    expect(courseCatalog).toMatch(/Mark lesson complete/);
    expect(courseCatalog).not.toMatch(/No data available\. Start by creating a new item\./);
    expect(arcade).toMatch(/No real-money wagering/);
    expect(dating).toMatch(/browser-session save/);
    expect(dating).toMatch(/sessionStorage\.setItem/);
  });

  it('requires truthful demo limitations', () => {
    for (const phrase of [
      'production deployment',
      'durable database persistence',
      'live payment execution',
      'blockchain transaction settlement',
      'external identity/KYC verification',
    ]) {
      expect(demo).toContain(phrase);
    }
  });
});
