export interface Persona {
  id: string;
  name: string;
  description: string;
  traits: string[];
}

export const personaEngine = {
  createPersona: (name: string, description: string): Persona => ({
    id: Math.random().toString(36).substr(2, 9),
    name,
    description,
    traits: [],
  }),
  
  updatePersona: (persona: Persona, updates: Partial<Persona>): Persona => ({
    ...persona,
    ...updates,
  }),
  
  deletePersona: (id: string): boolean => true,
};
