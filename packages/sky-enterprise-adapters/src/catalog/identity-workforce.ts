import { adapter } from "../definition";
import type { EnterpriseAdapterDefinition } from "../types";

export const ADAPTERS: readonly EnterpriseAdapterDefinition[] = Object.freeze([
  adapter("okta", "Okta", "identity", ["sso.oidc", "sso.saml", "directory.scim", "directory.users", "webhooks.inbound"], ["oauth2", "api-key"], ["OKTA_DOMAIN", "OKTA_API_TOKEN"], ["OKTA_CLIENT_ID", "OKTA_CLIENT_SECRET", "OKTA_SCIM_TOKEN"], ["OKTA_API_TOKEN", "OKTA_CLIENT_SECRET", "OKTA_SCIM_TOKEN"], "identity"),
  adapter("microsoft-entra-id", "Microsoft Entra ID", "identity", ["sso.oidc", "sso.saml", "directory.scim", "directory.users", "webhooks.inbound"], ["oauth2"], ["ENTRA_TENANT_ID", "ENTRA_CLIENT_ID", "ENTRA_CLIENT_SECRET"], ["ENTRA_SCIM_TOKEN"], ["ENTRA_CLIENT_SECRET", "ENTRA_SCIM_TOKEN"], "identity"),
  adapter("auth0", "Auth0", "identity", ["sso.oidc", "directory.users", "webhooks.inbound"], ["oauth2"], ["AUTH0_DOMAIN", "AUTH0_CLIENT_ID", "AUTH0_CLIENT_SECRET"], [], ["AUTH0_CLIENT_SECRET"], "identity"),
  adapter("workos", "WorkOS", "identity", ["sso.oidc", "sso.saml", "directory.scim", "directory.users", "webhooks.inbound"], ["api-key"], ["WORKOS_API_KEY", "WORKOS_CLIENT_ID"], [], ["WORKOS_API_KEY"], "identity"),
  adapter("keycloak", "Keycloak", "identity", ["sso.oidc", "sso.saml", "directory.users"], ["oauth2"], ["KEYCLOAK_BASE_URL", "KEYCLOAK_REALM", "KEYCLOAK_CLIENT_ID", "KEYCLOAK_CLIENT_SECRET"], [], ["KEYCLOAK_CLIENT_SECRET"], "identity"),
  adapter("ping-identity", "Ping Identity", "identity", ["sso.oidc", "sso.saml", "directory.scim", "directory.users"], ["oauth2"], ["PING_BASE_URL", "PING_CLIENT_ID", "PING_CLIENT_SECRET"], [], ["PING_CLIENT_SECRET"], "identity"),
  adapter("workday", "Workday", "hr", ["hr.people", "hr.payroll", "directory.users", "webhooks.inbound"], ["oauth2"], ["WORKDAY_TENANT", "WORKDAY_CLIENT_ID", "WORKDAY_CLIENT_SECRET"], ["WORKDAY_REFRESH_TOKEN"], ["WORKDAY_CLIENT_SECRET", "WORKDAY_REFRESH_TOKEN"], "sensitive"),
  adapter("bamboohr", "BambooHR", "hr", ["hr.people", "directory.users"], ["api-key"], ["BAMBOOHR_SUBDOMAIN", "BAMBOOHR_API_KEY"], [], ["BAMBOOHR_API_KEY"], "sensitive"),
  adapter("rippling", "Rippling", "hr", ["hr.people", "directory.users", "directory.scim"], ["oauth2"], ["RIPPLING_CLIENT_ID", "RIPPLING_CLIENT_SECRET"], [], ["RIPPLING_CLIENT_SECRET"], "sensitive"),
  adapter("gusto", "Gusto", "hr", ["hr.people", "hr.payroll"], ["oauth2"], ["GUSTO_CLIENT_ID", "GUSTO_CLIENT_SECRET"], ["GUSTO_REFRESH_TOKEN"], ["GUSTO_CLIENT_SECRET", "GUSTO_REFRESH_TOKEN"], "sensitive"),
]);
