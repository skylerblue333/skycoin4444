export type EnterpriseAdapterCategory =
  | "identity"
  | "hr"
  | "crm"
  | "support"
  | "collaboration"
  | "messaging"
  | "payments"
  | "finance"
  | "commerce"
  | "storage"
  | "data"
  | "events"
  | "observability"
  | "security"
  | "developer"
  | "analytics"
  | "ai"
  | "documents";

export type EnterpriseCapability =
  | "sso.oidc"
  | "sso.saml"
  | "directory.scim"
  | "directory.users"
  | "hr.people"
  | "hr.payroll"
  | "crm.contacts"
  | "crm.deals"
  | "support.tickets"
  | "collaboration.chat"
  | "collaboration.meetings"
  | "notification.email"
  | "notification.sms"
  | "payments.checkout"
  | "payments.billing"
  | "banking.accounts"
  | "accounting.ledger"
  | "commerce.catalog"
  | "commerce.orders"
  | "storage.objects"
  | "warehouse.sql"
  | "events.queue"
  | "events.stream"
  | "observability.metrics"
  | "observability.traces"
  | "observability.logs"
  | "security.secrets"
  | "security.alerts"
  | "developer.source"
  | "developer.ci"
  | "analytics.events"
  | "marketing.automation"
  | "ai.inference"
  | "documents.files"
  | "webhooks.inbound"
  | "webhooks.outbound";

export type EnterpriseAuthKind =
  | "api-key"
  | "bearer"
  | "oauth2"
  | "basic"
  | "service-account"
  | "connection-string"
  | "oidc"
  | "saml-metadata";

export type EnterpriseRiskClass = "standard" | "sensitive" | "identity" | "financial";

export type EnterpriseAdapterDefinition = Readonly<{
  id: string;
  vendor: string;
  category: EnterpriseAdapterCategory;
  capabilities: readonly EnterpriseCapability[];
  auth: readonly EnterpriseAuthKind[];
  requiredConfig: readonly string[];
  optionalConfig: readonly string[];
  secretConfig: readonly string[];
  risk: EnterpriseRiskClass;
  externalExecutionRequired: true;
}>;

export type AdapterConfig = Readonly<Record<string, string | undefined>>;

export type AdapterReadiness = Readonly<{
  adapterId: string;
  status: "ready-for-external-execution" | "unconfigured";
  missing: readonly string[];
  configured: readonly string[];
  secretsPresent: readonly string[];
  externalConnectivityVerified: false;
  networkCallPerformed: false;
}>;

export type AdapterCommand = Readonly<{
  contract: "sky.enterprise-adapter.command.v1";
  commandId: string;
  adapterId: string;
  capability: EnterpriseCapability;
  requestId: string;
  subject?: string;
  payload: Readonly<Record<string, unknown>>;
  requiresExternalExecution: true;
  networkCallPerformed: false;
}>;

export type IntegrationRequirement = Readonly<{
  capability: EnterpriseCapability;
  criticality: "required" | "optional";
}>;

export type IntegrationCoverage = Readonly<{
  capability: EnterpriseCapability;
  criticality: "required" | "optional";
  status: "configured" | "catalog-only" | "missing";
  configuredAdapters: readonly string[];
  catalogAdapters: readonly string[];
}>;
