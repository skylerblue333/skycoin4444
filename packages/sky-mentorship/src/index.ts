export type MentorshipStatus = 'requested' | 'accepted' | 'active' | 'completed' | 'declined';

export interface MentorshipRequest {
  id: string;
  mentorId: string;
  menteeId: string;
  topic: string;
  goals: string[];
  createdAt: string;
  status: MentorshipStatus;
}

export interface MentorshipEvent {
  type: 'sky.mentorship.changed.v1';
  request: MentorshipRequest;
}

const ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,63}$/;
const utc = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value)) throw new Error('timestamp must be canonical UTC');
  const parsed = new Date(value);
  if (!Number.isFinite(parsed.getTime()) || parsed.toISOString() !== (value.includes('.') ? value : value.replace('Z', '.000Z'))) throw new Error('invalid timestamp');
  return value;
};

const clean = (value: string, max: number, field: string) => {
  const result = value.trim().replace(/\s+/g, ' ');
  if (!result || result.length > max) throw new Error(`${field} invalid`);
  return result;
};

export function createMentorshipRequest(input: Omit<MentorshipRequest, 'status'>): MentorshipRequest {
  if (!ID.test(input.id) || !ID.test(input.mentorId) || !ID.test(input.menteeId)) throw new Error('invalid identifier');
  if (input.mentorId === input.menteeId) throw new Error('mentor and mentee must differ');
  if (input.goals.length < 1 || input.goals.length > 8) throw new Error('goals invalid');
  return Object.freeze({
    id: input.id,
    mentorId: input.mentorId,
    menteeId: input.menteeId,
    topic: clean(input.topic, 120, 'topic'),
    goals: Object.freeze(input.goals.map((goal) => clean(goal, 240, 'goal'))) as unknown as string[],
    createdAt: utc(input.createdAt),
    status: 'requested' as const,
  });
}

const transitions: Record<MentorshipStatus, readonly MentorshipStatus[]> = {
  requested: ['accepted', 'declined'],
  accepted: ['active', 'declined'],
  active: ['completed'],
  completed: [],
  declined: [],
};

export function transitionMentorship(request: MentorshipRequest, status: MentorshipStatus): MentorshipRequest {
  if (!transitions[request.status].includes(status)) throw new Error(`invalid transition ${request.status}->${status}`);
  return Object.freeze({ ...request, status });
}

export function toMentorshipEvent(request: MentorshipRequest): MentorshipEvent {
  return { type: 'sky.mentorship.changed.v1', request };
}
