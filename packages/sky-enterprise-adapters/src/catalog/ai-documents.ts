import { adapter } from "../definition";
import type { EnterpriseAdapterDefinition } from "../types";

export const ADAPTERS: readonly EnterpriseAdapterDefinition[] = Object.freeze([
  adapter("openai", "OpenAI", "ai", ["ai.inference"], ["api-key"], ["OPENAI_API_KEY"], ["OPENAI_BASE_URL", "OPENAI_PROJECT"], ["OPENAI_API_KEY"], "sensitive"),
  adapter("anthropic", "Anthropic", "ai", ["ai.inference"], ["api-key"], ["ANTHROPIC_API_KEY"], ["ANTHROPIC_BASE_URL"], ["ANTHROPIC_API_KEY"], "sensitive"),
  adapter("azure-openai", "Azure OpenAI", "ai", ["ai.inference"], ["api-key", "oauth2"], ["AZURE_OPENAI_ENDPOINT", "AZURE_OPENAI_DEPLOYMENT", "AZURE_OPENAI_API_KEY"], ["AZURE_OPENAI_API_VERSION"], ["AZURE_OPENAI_API_KEY"], "sensitive"),
  adapter("amazon-bedrock", "Amazon Bedrock", "ai", ["ai.inference"], ["service-account"], ["AWS_REGION"], ["AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY"], ["AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY"], "sensitive"),
  adapter("google-vertex-ai", "Google Vertex AI", "ai", ["ai.inference"], ["service-account"], ["GCP_PROJECT_ID", "GCP_SERVICE_ACCOUNT_JSON", "VERTEX_LOCATION"], [], ["GCP_SERVICE_ACCOUNT_JSON"], "sensitive"),
  adapter("google-drive", "Google Drive", "documents", ["documents.files", "webhooks.inbound"], ["oauth2", "service-account"], ["GOOGLE_DRIVE_CLIENT_ID", "GOOGLE_DRIVE_CLIENT_SECRET"], ["GOOGLE_DRIVE_REFRESH_TOKEN", "GCP_SERVICE_ACCOUNT_JSON"], ["GOOGLE_DRIVE_CLIENT_SECRET", "GOOGLE_DRIVE_REFRESH_TOKEN", "GCP_SERVICE_ACCOUNT_JSON"], "sensitive"),
  adapter("microsoft-sharepoint", "Microsoft SharePoint", "documents", ["documents.files", "webhooks.inbound"], ["oauth2"], ["SHAREPOINT_TENANT_ID", "SHAREPOINT_CLIENT_ID", "SHAREPOINT_CLIENT_SECRET"], ["SHAREPOINT_SITE_ID"], ["SHAREPOINT_CLIENT_SECRET"], "sensitive"),
  adapter("dropbox", "Dropbox", "documents", ["documents.files", "webhooks.inbound"], ["oauth2"], ["DROPBOX_APP_KEY", "DROPBOX_APP_SECRET"], ["DROPBOX_REFRESH_TOKEN"], ["DROPBOX_APP_SECRET", "DROPBOX_REFRESH_TOKEN"], "sensitive"),
  adapter("box", "Box", "documents", ["documents.files", "webhooks.inbound"], ["oauth2"], ["BOX_CLIENT_ID", "BOX_CLIENT_SECRET"], ["BOX_ENTERPRISE_ID", "BOX_REFRESH_TOKEN"], ["BOX_CLIENT_SECRET", "BOX_REFRESH_TOKEN"], "sensitive"),
]);
