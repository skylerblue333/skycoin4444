import fs from 'node:fs';
import { describe, expect, it } from 'vitest';
import { validateDatingProfile } from '../../client/src/pages/DatingProfileSetup';

const pageSource = fs.readFileSync('client/src/pages/DatingProfileSetup.tsx', 'utf8');

describe('dating profile placeholder replacement', () => {
  it('validates required profile fields and adult age', () => {
    const valid = {
      displayName: 'Sky',
      bio: 'I enjoy software, chess, and hiking.',
      age: 26,
      location: 'Arkansas',
      interests: ['Technology'],
      photos: [],
      verificationStatus: 'unverified' as const,
      lookingFor: 'relationship' as const,
      height: '',
      bodyType: '',
    };
    expect(validateDatingProfile(valid)).toEqual([]);
    expect(validateDatingProfile({ ...valid, age: 17 })).toContain('Age must be between 18 and 120.');
    expect(validateDatingProfile({ ...valid, bio: 'short' })).toContain('Bio must be at least 10 characters.');
  });

  it('contains a truthful browser-session save instead of the backend TODO', () => {
    expect(pageSource).not.toMatch(/TODO:\s*Send to backend/i);
    expect(pageSource).toMatch(/sessionStorage\.setItem/);
    expect(pageSource).toMatch(/No server persistence or identity verification is claimed/);
    expect(pageSource).toMatch(/do not perform email, phone, or government-ID verification/);
  });
});
