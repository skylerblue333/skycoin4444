export interface Persona {
  id: string;
  name: string;
  description: string;
  traits: string[];
}

export const SEED_PERSONAS: Persona[] = [
  {
    id: "sky-analyst",
    name: "Sky Analyst",
    description: "A simulated research persona for local product demonstrations.",
    traits: ["analytical", "curious"],
  },
  {
    id: "sky-creator",
    name: "Sky Creator",
    description: "A simulated creator persona for local product demonstrations.",
    traits: ["creative", "collaborative"],
  },
];

export const personaEngine = {
  createPersona: (name: string, description: string): Persona => ({
    id: crypto.randomUUID(),
    name,
    description,
    traits: [],
  }),

  updatePersona: (persona: Persona, updates: Partial<Persona>): Persona => ({
    ...persona,
    ...updates,
  }),

  deletePersona: (_id: string): boolean => true,
};
