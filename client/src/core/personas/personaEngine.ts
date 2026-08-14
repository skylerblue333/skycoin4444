export interface Persona {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  class: string;
  bio: string;
  personalityTraits: string[];
  goals: string[];
  followerCount: number;
  reputationScore: number;
}

export type BehaviorOutput = {
  action:
    | "post"
    | "reply"
    | "debate"
    | "collaborate"
    | "react"
    | "tip"
    | "promote"
    | "challenge";
  content: string;
  timestamp: number;
  metadata: {
    personaId: string;
    source: "local-demo-simulation";
  };
};

/**
 * Static data used only by the on-device Persona System demonstration. These
 * entries are not user accounts, model outputs, platform analytics, or live AI
 * agents; the corresponding page labels the feature as a demo simulation.
 */
export const SEED_PERSONAS: Persona[] = [
  {
    id: "demo-architect",
    name: "Avery Cole",
    handle: "@avery_demo",
    avatar: "A",
    class: "Demo Architect",
    bio: "A fictional local-simulation persona for interface demonstrations.",
    personalityTraits: ["curious", "methodical", "collaborative"],
    goals: ["share_ideas", "connect_demo_personas"],
    followerCount: 0,
    reputationScore: 0,
  },
  {
    id: "demo-artist",
    name: "Morgan Lee",
    handle: "@morgan_demo",
    avatar: "M",
    class: "Demo Creator",
    bio: "A fictional local-simulation persona for interface demonstrations.",
    personalityTraits: ["creative", "reflective", "supportive"],
    goals: ["explore_topics", "collaborate"],
    followerCount: 0,
    reputationScore: 0,
  },
  {
    id: "demo-builder",
    name: "Jordan Kim",
    handle: "@jordan_demo",
    avatar: "J",
    class: "Demo Builder",
    bio: "A fictional local-simulation persona for interface demonstrations.",
    personalityTraits: ["pragmatic", "focused", "helpful"],
    goals: ["prototype_features", "share_feedback"],
    followerCount: 0,
    reputationScore: 0,
  },
];

const actions: BehaviorOutput["action"][] = [
  "post",
  "reply",
  "debate",
  "collaborate",
  "react",
];
let actionIndex = 0;
let personaIndex = 0;
const behaviorLog: BehaviorOutput[] = [];

function demoMessage(
  persona: Persona,
  topic: string,
  action: BehaviorOutput["action"]
): string {
  return `${persona.name} simulated a ${action} event about ${topic}. This is local demo content, not a live AI response.`;
}

export const personaEngine = {
  createPersona: (name: string, description: string): Persona => ({
    id: `local-${crypto.randomUUID()}`,
    name,
    handle: "@local_demo",
    avatar: name.trim().slice(0, 1).toUpperCase() || "?",
    class: "Local Demo Persona",
    bio: description,
    personalityTraits: [],
    goals: [],
    followerCount: 0,
    reputationScore: 0,
  }),
  updatePersona: (persona: Persona, updates: Partial<Persona>): Persona => ({
    ...persona,
    ...updates,
  }),
  deletePersona: (_id: string): boolean => false,
  tick: (topics: string[]): BehaviorOutput[] => {
    const persona = SEED_PERSONAS[personaIndex % SEED_PERSONAS.length];
    const action = actions[actionIndex % actions.length];
    const topic =
      topics.length > 0
        ? topics[actionIndex % topics.length]
        : "the demo system";
    const output: BehaviorOutput = {
      action,
      content: demoMessage(persona, topic, action),
      timestamp: Date.now(),
      metadata: { personaId: persona.id, source: "local-demo-simulation" },
    };
    personaIndex += 1;
    actionIndex += 1;
    behaviorLog.unshift(output);
    behaviorLog.splice(100);
    return [output];
  },
  getBehaviorLog: (limit: number): BehaviorOutput[] =>
    behaviorLog.slice(0, Math.max(0, limit)),
};
