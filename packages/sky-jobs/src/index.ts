export type JobStatus = "draft" | "open" | "closed";
export interface JobPosting { id: string; title: string; organizationId: string; location?: string; skills: string[]; status: JobStatus; }
export interface CandidateProfile { id: string; skills: string[]; preferredLocation?: string; }

function required(value: string, field: string): string { const v = value.trim(); if (!v) throw new Error(`${field} is required`); return v; }
function normalizeSkills(skills: string[]): string[] { return [...new Set(skills.map((s) => s.trim().toLowerCase()).filter(Boolean))].sort(); }
export function validateJobPosting(job: JobPosting): JobPosting {
  return { ...job, id: required(job.id, "id"), title: required(job.title, "title"), organizationId: required(job.organizationId, "organizationId"), location: job.location?.trim() || undefined, skills: normalizeSkills(job.skills) };
}
export function matchCandidate(jobInput: JobPosting, candidate: CandidateProfile): { score: number; matchedSkills: string[] } {
  const job = validateJobPosting(jobInput);
  if (job.status !== "open") return { score: 0, matchedSkills: [] };
  const candidateSkills = new Set(normalizeSkills(candidate.skills));
  const matchedSkills = job.skills.filter((skill) => candidateSkills.has(skill));
  const skillScore = job.skills.length === 0 ? 1 : matchedSkills.length / job.skills.length;
  const locationBonus = job.location && candidate.preferredLocation && job.location.toLowerCase() === candidate.preferredLocation.trim().toLowerCase() ? 0.1 : 0;
  return { score: Math.min(1, Math.round((skillScore + locationBonus) * 100) / 100), matchedSkills };
}
export function canTransitionJob(from: JobStatus, to: JobStatus): boolean { return from === to || (from === "draft" && to === "open") || (from === "open" && to === "closed"); }
