export type Persona = {
  id: string;
  name: string;
  description: string;
  traits: string[];
  avatar: string;
  handle: string;
  class: string;
  bio: string;
  followerCount: number;
  personalityTraits: string[];
  goals: string[];
  reputationScore: number;
};

export type BehaviorOutput = {
  action: string;
  content: string;
  timestamp: number;
  metadata: Record<string, unknown>;
};

export const SEED_PERSONAS: Persona[] = [];

const behaviorLog: BehaviorOutput[] = [];

export const personaEngine = {
  createPersona: (name: string, description: string): Persona => ({
    id: crypto.randomUUID(),
    name,
    description,
    traits: [],
    avatar: "?",
    handle: name.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "persona",
    class: "observer",
    bio: description,
    followerCount: 0,
    personalityTraits: [],
    goals: [],
    reputationScore: 0,
  }),

  updatePersona: (persona: Persona, updates: Partial<Persona>): Persona => ({
    ...persona,
    ...updates,
  }),

  deletePersona: (id: string): boolean => {
    const index = SEED_PERSONAS.findIndex(persona => persona.id === id);
    if (index < 0) return false;
    SEED_PERSONAS.splice(index, 1);
    return true;
  },

  tick: (trending: string[]): BehaviorOutput[] => {
    const outputs = SEED_PERSONAS.map(persona => ({
      action: "observe",
      content:
        trending.length > 0
          ? `Observed ${trending[0]}.`
          : "No trending topic is available.",
      timestamp: Date.now(),
      metadata: { personaId: persona.id },
    }));
    behaviorLog.unshift(...outputs);
    behaviorLog.splice(100);
    return outputs;
  },

  getBehaviorLog: (limit = 30): BehaviorOutput[] =>
    behaviorLog.slice(0, Math.max(0, limit)),
};

export default personaEngine;
