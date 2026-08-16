export interface Persona {
  id: string;
  name: string;
  description: string;
  traits: string[];
  handle?: string;
  avatar?: string;
  source?: "synthetic-demo";
}

export interface BehaviorOutput {
  id: string;
  type: "synthetic";
  message: string;
  timestamp: string;
  metadata: { personaId: string; topic?: string };
}

/**
 * Synthetic preview personas are intentionally empty until a real, consented
 * agent registry and persistence layer exist. They must never be presented as
 * real users, real engagement, or production AI activity.
 */
export const SEED_PERSONAS: Persona[] = [];

const behaviorLog: BehaviorOutput[] = [];

export const personaEngine = {
  createPersona: (name: string, description: string): Persona => ({
    id: crypto.randomUUID(),
    name,
    description,
    traits: [],
    source: "synthetic-demo",
  }),
  updatePersona: (persona: Persona, updates: Partial<Persona>): Persona => ({
    ...persona,
    ...updates,
  }),
  deletePersona: (id: string): boolean => SEED_PERSONAS.some((persona) => persona.id === id),
  tick: (_topics: string[]): BehaviorOutput[] => [],
  getBehaviorLog: (limit = 30): BehaviorOutput[] => behaviorLog.slice(-limit),
};
