import { adapter } from "../definition";
import type { EnterpriseAdapterDefinition } from "../types";

export const ADAPTERS: readonly EnterpriseAdapterDefinition[] = Object.freeze([
  adapter("salesforce", "Salesforce", "crm", ["crm.contacts", "crm.deals", "analytics.events", "webhooks.inbound", "webhooks.outbound"], ["oauth2"], ["SALESFORCE_INSTANCE_URL", "SALESFORCE_CLIENT_ID", "SALESFORCE_CLIENT_SECRET"], ["SALESFORCE_REFRESH_TOKEN"], ["SALESFORCE_CLIENT_SECRET", "SALESFORCE_REFRESH_TOKEN"], "sensitive"),
  adapter("hubspot", "HubSpot", "crm", ["crm.contacts", "crm.deals", "marketing.automation", "webhooks.inbound", "webhooks.outbound"], ["oauth2", "api-key"], ["HUBSPOT_ACCESS_TOKEN"], [], ["HUBSPOT_ACCESS_TOKEN"], "sensitive"),
  adapter("dynamics-365", "Microsoft Dynamics 365", "crm", ["crm.contacts", "crm.deals", "accounting.ledger", "webhooks.inbound"], ["oauth2"], ["DYNAMICS_BASE_URL", "DYNAMICS_TENANT_ID", "DYNAMICS_CLIENT_ID", "DYNAMICS_CLIENT_SECRET"], [], ["DYNAMICS_CLIENT_SECRET"], "sensitive"),
  adapter("mailchimp", "Mailchimp", "crm", ["crm.contacts", "marketing.automation", "analytics.events", "webhooks.inbound"], ["api-key", "oauth2"], ["MAILCHIMP_SERVER_PREFIX", "MAILCHIMP_API_KEY"], [], ["MAILCHIMP_API_KEY"], "sensitive"),
  adapter("servicenow", "ServiceNow", "support", ["support.tickets", "directory.users", "webhooks.inbound", "webhooks.outbound"], ["oauth2", "basic"], ["SERVICENOW_INSTANCE_URL", "SERVICENOW_USERNAME", "SERVICENOW_PASSWORD"], ["SERVICENOW_CLIENT_ID", "SERVICENOW_CLIENT_SECRET"], ["SERVICENOW_PASSWORD", "SERVICENOW_CLIENT_SECRET"], "sensitive"),
  adapter("jira-service-management", "Jira Service Management", "support", ["support.tickets", "webhooks.inbound", "webhooks.outbound"], ["api-key", "oauth2"], ["JIRA_BASE_URL", "JIRA_EMAIL", "JIRA_API_TOKEN"], [], ["JIRA_API_TOKEN"], "sensitive"),
  adapter("zendesk", "Zendesk", "support", ["support.tickets", "crm.contacts", "webhooks.inbound", "webhooks.outbound"], ["api-key", "oauth2"], ["ZENDESK_SUBDOMAIN", "ZENDESK_EMAIL", "ZENDESK_API_TOKEN"], [], ["ZENDESK_API_TOKEN"], "sensitive"),
  adapter("freshdesk", "Freshdesk", "support", ["support.tickets", "crm.contacts", "webhooks.inbound"], ["api-key"], ["FRESHDESK_DOMAIN", "FRESHDESK_API_KEY"], [], ["FRESHDESK_API_KEY"], "sensitive"),
  adapter("slack", "Slack", "collaboration", ["collaboration.chat", "webhooks.inbound", "webhooks.outbound"], ["oauth2", "bearer"], ["SLACK_BOT_TOKEN", "SLACK_SIGNING_SECRET"], ["SLACK_APP_TOKEN"], ["SLACK_BOT_TOKEN", "SLACK_SIGNING_SECRET", "SLACK_APP_TOKEN"], "sensitive"),
  adapter("microsoft-teams", "Microsoft Teams", "collaboration", ["collaboration.chat", "collaboration.meetings", "webhooks.inbound", "webhooks.outbound"], ["oauth2"], ["TEAMS_TENANT_ID", "TEAMS_CLIENT_ID", "TEAMS_CLIENT_SECRET"], [], ["TEAMS_CLIENT_SECRET"], "sensitive"),
  adapter("discord", "Discord", "collaboration", ["collaboration.chat", "webhooks.inbound", "webhooks.outbound"], ["bearer"], ["DISCORD_BOT_TOKEN"], ["DISCORD_PUBLIC_KEY"], ["DISCORD_BOT_TOKEN"], "sensitive"),
  adapter("zoom", "Zoom", "collaboration", ["collaboration.meetings", "webhooks.inbound"], ["oauth2"], ["ZOOM_ACCOUNT_ID", "ZOOM_CLIENT_ID", "ZOOM_CLIENT_SECRET"], ["ZOOM_WEBHOOK_SECRET"], ["ZOOM_CLIENT_SECRET", "ZOOM_WEBHOOK_SECRET"], "sensitive"),
  adapter("twilio-sms", "Twilio SMS", "messaging", ["notification.sms", "webhooks.inbound", "webhooks.outbound"], ["basic"], ["TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_NUMBER"], [], ["TWILIO_AUTH_TOKEN"], "sensitive"),
  adapter("sendgrid", "Twilio SendGrid", "messaging", ["notification.email", "webhooks.inbound", "webhooks.outbound"], ["api-key"], ["SENDGRID_API_KEY", "SENDGRID_FROM_EMAIL"], [], ["SENDGRID_API_KEY"], "sensitive"),
  adapter("mailgun", "Mailgun", "messaging", ["notification.email", "webhooks.inbound", "webhooks.outbound"], ["api-key"], ["MAILGUN_DOMAIN", "MAILGUN_API_KEY"], [], ["MAILGUN_API_KEY"], "sensitive"),
  adapter("postmark", "Postmark", "messaging", ["notification.email", "webhooks.inbound", "webhooks.outbound"], ["api-key"], ["POSTMARK_SERVER_TOKEN", "POSTMARK_FROM_EMAIL"], [], ["POSTMARK_SERVER_TOKEN"], "sensitive"),
]);
