export interface WorkflowTransition {
  from: string;
  event: string;
  to: string;
}

export interface WorkflowDefinition {
  name: string;
  initial: string;
  states: readonly string[];
  transitions: readonly WorkflowTransition[];
}

export interface WorkflowInstance {
  definition: string;
  state: string;
  revision: number;
}

const TOKEN_RE = /^[A-Za-z][A-Za-z0-9_-]{0,63}$/;

function token(value: string, field: string): string {
  const normalized = value.trim();
  if (!TOKEN_RE.test(normalized)) throw new Error(`${field} is invalid`);
  return normalized;
}

export function validateWorkflow(definition: WorkflowDefinition): WorkflowDefinition {
  const name = token(definition.name, "name");
  const states = [...new Set(definition.states.map((state) => token(state, "state")))];
  if (states.length === 0) throw new Error("workflow must define at least one state");
  const initial = token(definition.initial, "initial");
  if (!states.includes(initial)) throw new Error("initial state must be declared");

  const seen = new Set<string>();
  const transitions = definition.transitions.map((transition) => {
    const from = token(transition.from, "transition.from");
    const event = token(transition.event, "transition.event");
    const to = token(transition.to, "transition.to");
    if (!states.includes(from) || !states.includes(to)) throw new Error("transition states must be declared");
    const key = `${from}\u0000${event}`;
    if (seen.has(key)) throw new Error(`ambiguous transition for ${from}/${event}`);
    seen.add(key);
    return { from, event, to };
  });

  return { name, initial, states, transitions };
}

export function startWorkflow(definition: WorkflowDefinition): WorkflowInstance {
  const validated = validateWorkflow(definition);
  return { definition: validated.name, state: validated.initial, revision: 0 };
}

export function applyWorkflowEvent(
  definition: WorkflowDefinition,
  instance: WorkflowInstance,
  eventInput: string,
): WorkflowInstance {
  const validated = validateWorkflow(definition);
  if (instance.definition !== validated.name) throw new Error("instance belongs to another workflow");
  if (!validated.states.includes(instance.state)) throw new Error("instance state is not declared");
  const event = token(eventInput, "event");
  const transition = validated.transitions.find((candidate) => candidate.from === instance.state && candidate.event === event);
  if (!transition) throw new Error(`event ${event} is not allowed from ${instance.state}`);
  return { ...instance, state: transition.to, revision: instance.revision + 1 };
}
