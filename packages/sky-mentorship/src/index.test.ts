import { describe, expect, it } from 'vitest';
import { createMentorshipRequest, toMentorshipEvent, transitionMentorship } from './index.js';

const base = {
  id: 'mentorship-1',
  mentorId: 'mentor-1',
  menteeId: 'mentee-1',
  topic: ' TypeScript architecture ',
  goals: [' Review module boundaries ', ' Improve testing discipline '],
  createdAt: '2026-08-30T21:15:00Z',
};

describe('SkyMentorship', () => {
  it('normalizes bounded requests and advances valid lifecycle transitions', () => {
    const requested = createMentorshipRequest(base);
    expect(requested.topic).toBe('TypeScript architecture');
    expect(requested.goals).toEqual(['Review module boundaries', 'Improve testing discipline']);
    const accepted = transitionMentorship(requested, 'accepted');
    const active = transitionMentorship(accepted, 'active');
    const completed = transitionMentorship(active, 'completed');
    expect(completed.status).toBe('completed');
    expect(toMentorshipEvent(completed).type).toBe('sky.mentorship.changed.v1');
  });

  it('rejects self-mentorship and invalid transitions', () => {
    expect(() => createMentorshipRequest({ ...base, menteeId: base.mentorId })).toThrow('mentor and mentee must differ');
    const requested = createMentorshipRequest(base);
    expect(() => transitionMentorship(requested, 'completed')).toThrow('invalid transition');
  });

  it('rejects impossible or non-canonical timestamps', () => {
    expect(() => createMentorshipRequest({ ...base, createdAt: '2026-02-30T12:00:00Z' })).toThrow('invalid timestamp');
    expect(() => createMentorshipRequest({ ...base, createdAt: '2026-08-30T16:15:00-05:00' })).toThrow('timestamp must be canonical UTC');
  });
});
