export type IncidentState = "open" | "mitigating" | "resolved" | "closed";

export interface Incident {
  id: string;
  state: IncidentState;
  severity: 1 | 2 | 3 | 4;
}

const ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;

const transitions: Record<IncidentState, readonly IncidentState[]> = {
  open: ["mitigating", "resolved"],
  mitigating: ["resolved"],
  resolved: ["open", "closed"],
  closed: [],
};

export function transitionIncident(
  incident: Incident,
  nextState: IncidentState
): Incident {
  if (!ID.test(incident.id)) throw new Error("invalid incident id");
  if (![1, 2, 3, 4].includes(incident.severity)) throw new Error("invalid severity");
  if (!transitions[incident.state].includes(nextState)) {
    throw new Error(`invalid transition ${incident.state}->${nextState}`);
  }
  return { ...incident, state: nextState };
}
