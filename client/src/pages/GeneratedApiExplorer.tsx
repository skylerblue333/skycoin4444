import { Code2 } from "lucide-react";

import { UnavailableService } from "@/pages/mission-control/UnavailableService";

const requirements = [
  {
    title: "Authoritative API contract and route registry",
    detail:
      "A versioned registry derived from the actual server routers, schemas, authentication requirements, permissions, and deployment configuration is required before listing endpoints, methods, request bodies, counts, or documentation links.",
  },
  {
    title: "Authenticated, non-destructive execution path",
    detail:
      "A server-mediated execution layer with input validation, authorization, rate limits, CSRF and replay protections, safe test fixtures, audit logging, redaction, and explicit safeguards for write operations is required before an endpoint can be run from this interface.",
  },
  {
    title: "Real response, error, and latency evidence",
    detail:
      "Responses must come from the configured endpoint rather than generated fixtures, and must preserve real status codes, validation errors, request identifiers, timing semantics, redaction rules, and failure states. No successful response, record, timestamp, or latency is fabricated here.",
  },
  {
    title: "Verified API documentation and operations",
    detail:
      "OpenAPI or equivalent source documentation, schema tests, integration coverage, deployment health checks, ownership, versioning, and incident procedures are required before claiming a complete API reference or operational availability.",
  },
];

export default function GeneratedApiExplorer() {
  return (
    <main className="min-h-screen bg-background p-4 text-foreground sm:p-8">
      <div className="mx-auto max-w-5xl">
        <UnavailableService
          title="API Explorer"
          icon={Code2}
          summary="The API route registry, schemas, authenticated execution service, response evidence, and complete documentation source are not configured for this deployment. No endpoint count, request, response, status code, latency, record, transaction, or API documentation state is represented as current, verified, available, or successful."
          requirements={requirements}
        />
      </div>
    </main>
  );
}
