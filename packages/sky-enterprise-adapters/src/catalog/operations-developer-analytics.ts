import { adapter } from "../definition";
import type { EnterpriseAdapterDefinition } from "../types";

export const ADAPTERS: readonly EnterpriseAdapterDefinition[] = Object.freeze([
  adapter("datadog", "Datadog", "observability", ["observability.metrics", "observability.traces", "observability.logs", "security.alerts"], ["api-key"], ["DATADOG_API_KEY", "DATADOG_SITE"], ["DATADOG_APP_KEY"], ["DATADOG_API_KEY", "DATADOG_APP_KEY"], "sensitive"),
  adapter("new-relic", "New Relic", "observability", ["observability.metrics", "observability.traces", "observability.logs"], ["api-key"], ["NEW_RELIC_LICENSE_KEY"], ["NEW_RELIC_ACCOUNT_ID"], ["NEW_RELIC_LICENSE_KEY"], "sensitive"),
  adapter("sentry", "Sentry", "observability", ["observability.traces", "observability.logs", "security.alerts"], ["bearer"], ["SENTRY_DSN"], ["SENTRY_AUTH_TOKEN", "SENTRY_ORG", "SENTRY_PROJECT"], ["SENTRY_DSN", "SENTRY_AUTH_TOKEN"], "sensitive"),
  adapter("grafana-cloud", "Grafana Cloud", "observability", ["observability.metrics", "observability.traces", "observability.logs"], ["basic", "api-key"], ["GRAFANA_CLOUD_URL", "GRAFANA_CLOUD_TOKEN"], [], ["GRAFANA_CLOUD_TOKEN"], "sensitive"),
  adapter("opentelemetry-collector", "OpenTelemetry Collector", "observability", ["observability.metrics", "observability.traces", "observability.logs"], ["bearer", "api-key"], ["OTEL_EXPORTER_OTLP_ENDPOINT"], ["OTEL_EXPORTER_OTLP_HEADERS"], ["OTEL_EXPORTER_OTLP_HEADERS"], "standard"),
  adapter("splunk", "Splunk", "observability", ["observability.metrics", "observability.logs", "security.alerts"], ["bearer"], ["SPLUNK_HEC_URL", "SPLUNK_HEC_TOKEN"], [], ["SPLUNK_HEC_TOKEN"], "sensitive"),
  adapter("hashicorp-vault", "HashiCorp Vault", "security", ["security.secrets", "security.alerts"], ["bearer"], ["VAULT_ADDR", "VAULT_TOKEN"], ["VAULT_NAMESPACE"], ["VAULT_TOKEN"], "sensitive"),
  adapter("aws-secrets-manager", "AWS Secrets Manager", "security", ["security.secrets"], ["service-account"], ["AWS_REGION"], ["AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY"], ["AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY"], "sensitive"),
  adapter("azure-key-vault", "Azure Key Vault", "security", ["security.secrets"], ["oauth2"], ["AZURE_KEY_VAULT_URL", "AZURE_TENANT_ID", "AZURE_CLIENT_ID", "AZURE_CLIENT_SECRET"], [], ["AZURE_CLIENT_SECRET"], "sensitive"),
  adapter("cloudflare-zero-trust", "Cloudflare Zero Trust", "security", ["security.alerts"], ["api-key"], ["CLOUDFLARE_ACCOUNT_ID", "CLOUDFLARE_API_TOKEN"], [], ["CLOUDFLARE_API_TOKEN"], "sensitive"),
  adapter("github", "GitHub", "developer", ["developer.source", "developer.ci", "webhooks.inbound", "webhooks.outbound"], ["bearer", "oauth2"], ["GITHUB_TOKEN"], ["GITHUB_APP_ID", "GITHUB_PRIVATE_KEY"], ["GITHUB_TOKEN", "GITHUB_PRIVATE_KEY"], "sensitive"),
  adapter("gitlab", "GitLab", "developer", ["developer.source", "developer.ci", "webhooks.inbound", "webhooks.outbound"], ["bearer", "oauth2"], ["GITLAB_BASE_URL", "GITLAB_TOKEN"], [], ["GITLAB_TOKEN"], "sensitive"),
  adapter("bitbucket", "Bitbucket", "developer", ["developer.source", "developer.ci", "webhooks.inbound"], ["oauth2"], ["BITBUCKET_CLIENT_ID", "BITBUCKET_CLIENT_SECRET"], [], ["BITBUCKET_CLIENT_SECRET"], "sensitive"),
  adapter("circleci", "CircleCI", "developer", ["developer.ci", "webhooks.inbound"], ["api-key"], ["CIRCLECI_TOKEN"], [], ["CIRCLECI_TOKEN"], "sensitive"),
  adapter("segment", "Twilio Segment", "analytics", ["analytics.events", "webhooks.outbound"], ["api-key"], ["SEGMENT_WRITE_KEY"], [], ["SEGMENT_WRITE_KEY"], "sensitive"),
  adapter("amplitude", "Amplitude", "analytics", ["analytics.events"], ["api-key"], ["AMPLITUDE_API_KEY"], ["AMPLITUDE_SECRET_KEY"], ["AMPLITUDE_API_KEY", "AMPLITUDE_SECRET_KEY"], "sensitive"),
  adapter("mixpanel", "Mixpanel", "analytics", ["analytics.events"], ["api-key"], ["MIXPANEL_PROJECT_TOKEN"], ["MIXPANEL_SERVICE_ACCOUNT_SECRET"], ["MIXPANEL_PROJECT_TOKEN", "MIXPANEL_SERVICE_ACCOUNT_SECRET"], "sensitive"),
]);
