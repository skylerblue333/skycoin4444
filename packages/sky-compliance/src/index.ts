export type ControlStatus = "pass" | "fail" | "not-applicable";

export interface ComplianceControl {
  controlId: string;
  status: ControlStatus;
  evidenceRefs: readonly string[];
}

export interface ComplianceSummary {
  total: number;
  passing: number;
  failing: number;
  notApplicable: number;
}

const ID = /^[A-Za-z0-9][A-Za-z0-9._:/-]{0,127}$/;

export function summarizeControls(
  controls: readonly ComplianceControl[]
): ComplianceSummary {
  const seen = new Set<string>();
  let passing = 0;
  let failing = 0;
  let notApplicable = 0;
  for (const control of controls) {
    if (!ID.test(control.controlId)) throw new Error("invalid controlId");
    if (seen.has(control.controlId)) throw new Error("duplicate controlId");
    seen.add(control.controlId);
    if (!control.evidenceRefs.every(ref => ID.test(ref))) {
      throw new Error("invalid evidenceRef");
    }
    if (control.status === "pass") passing += 1;
    else if (control.status === "fail") failing += 1;
    else if (control.status === "not-applicable") notApplicable += 1;
    else throw new Error("invalid status");
  }
  return { total: controls.length, passing, failing, notApplicable };
}
