/**
 * Ported from skylerblue333/Sky-SkyEnterprise at
 * d64edb7f7787393229de99cd9393e4542fecc490 (MIT).
 */
export type ProjectStatus = "planned" | "active" | "paused" | "completed";

export interface ProjectInput {
  id: string;
  organizationId: string;
  name: string;
  ownerId: string;
  status?: ProjectStatus;
}

export interface ProjectSnapshot extends Required<ProjectInput> {
  persistencePerformed: false;
}

export interface OrganizationMembershipLookup {
  readonly id: string;
  roleOf(userId: string): "owner" | "admin" | "member" | undefined;
}

const ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,95}$/;
const STATUSES = new Set<ProjectStatus>(["planned", "active", "paused", "completed"]);
const MAX_PROJECTS = 1_000;

function assertId(value: unknown, field: string): asserts value is string {
  if (typeof value !== "string" || !ID.test(value)) {
    throw new TypeError(`${field} must be a bounded identifier`);
  }
}

export function normalizeProject(input: ProjectInput): ProjectSnapshot {
  if (!input || typeof input !== "object") {
    throw new TypeError("project is required");
  }
  assertId(input.id, "project.id");
  assertId(input.organizationId, "project.organizationId");
  assertId(input.ownerId, "project.ownerId");
  if (
    typeof input.name !== "string" ||
    input.name.trim().length < 2 ||
    input.name.trim().length > 120
  ) {
    throw new TypeError("project.name must contain 2-120 characters");
  }
  const status = input.status ?? "planned";
  if (!STATUSES.has(status)) throw new TypeError("project.status is invalid");
  return {
    id: input.id,
    organizationId: input.organizationId,
    name: input.name.trim(),
    ownerId: input.ownerId,
    status,
    persistencePerformed: false,
  };
}

export class ProjectRegistry {
  readonly #projects = new Map<string, ProjectSnapshot>();

  create(input: ProjectInput): ProjectSnapshot {
    if (this.#projects.size >= MAX_PROJECTS) {
      throw new RangeError(`registry capacity ${MAX_PROJECTS} reached`);
    }
    const project = normalizeProject(input);
    if (this.#projects.has(project.id)) {
      throw new Error(`duplicate project id: ${project.id}`);
    }
    this.#projects.set(project.id, project);
    return structuredClone(project);
  }

  transition(
    projectId: string,
    actorId: string,
    status: ProjectStatus,
  ): ProjectSnapshot {
    assertId(projectId, "projectId");
    assertId(actorId, "actorId");
    if (!STATUSES.has(status)) throw new TypeError("project.status is invalid");
    const current = this.#projects.get(projectId);
    if (!current) throw new Error("project not found");
    if (current.ownerId !== actorId) throw new Error("project owner required");
    if (current.status === "completed" && status !== "completed") {
      throw new Error("completed project is terminal");
    }
    const next = { ...current, status };
    this.#projects.set(projectId, next);
    return structuredClone(next);
  }

  listForOrganization(organizationId: string): ProjectSnapshot[] {
    assertId(organizationId, "organizationId");
    return [...this.#projects.values()]
      .filter((project) => project.organizationId === organizationId)
      .sort((left, right) => left.id.localeCompare(right.id))
      .map((project) => structuredClone(project));
  }
}

export function createProjectForOrganization(
  organization: OrganizationMembershipLookup,
  registry: ProjectRegistry,
  input: ProjectInput,
): ProjectSnapshot {
  if (organization.id !== input.organizationId) {
    throw new Error("project organization does not match organization context");
  }
  if (!organization.roleOf(input.ownerId)) {
    throw new Error("project owner must be an organization member");
  }
  return registry.create(input);
}
