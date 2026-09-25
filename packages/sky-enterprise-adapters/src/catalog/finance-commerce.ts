import { adapter } from "../definition";
import type { EnterpriseAdapterDefinition } from "../types";

export const ADAPTERS: readonly EnterpriseAdapterDefinition[] = Object.freeze([
  adapter("stripe", "Stripe", "payments", ["payments.checkout", "payments.billing", "webhooks.inbound"], ["api-key"], ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"], ["STRIPE_PUBLISHABLE_KEY"], ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"], "financial"),
  adapter("paypal", "PayPal", "payments", ["payments.checkout", "payments.billing", "webhooks.inbound"], ["oauth2"], ["PAYPAL_CLIENT_ID", "PAYPAL_CLIENT_SECRET"], ["PAYPAL_WEBHOOK_ID"], ["PAYPAL_CLIENT_SECRET"], "financial"),
  adapter("adyen", "Adyen", "payments", ["payments.checkout", "payments.billing", "webhooks.inbound"], ["api-key"], ["ADYEN_MERCHANT_ACCOUNT", "ADYEN_API_KEY", "ADYEN_HMAC_KEY"], [], ["ADYEN_API_KEY", "ADYEN_HMAC_KEY"], "financial"),
  adapter("square", "Square", "payments", ["payments.checkout", "payments.billing", "webhooks.inbound"], ["bearer"], ["SQUARE_ACCESS_TOKEN", "SQUARE_LOCATION_ID"], ["SQUARE_WEBHOOK_SIGNATURE_KEY"], ["SQUARE_ACCESS_TOKEN", "SQUARE_WEBHOOK_SIGNATURE_KEY"], "financial"),
  adapter("plaid", "Plaid", "finance", ["banking.accounts", "webhooks.inbound"], ["api-key"], ["PLAID_CLIENT_ID", "PLAID_SECRET", "PLAID_ENV"], [], ["PLAID_SECRET"], "financial"),
  adapter("quickbooks", "QuickBooks Online", "finance", ["accounting.ledger", "crm.contacts", "webhooks.inbound"], ["oauth2"], ["QBO_CLIENT_ID", "QBO_CLIENT_SECRET", "QBO_REALM_ID"], ["QBO_REFRESH_TOKEN"], ["QBO_CLIENT_SECRET", "QBO_REFRESH_TOKEN"], "financial"),
  adapter("xero", "Xero", "finance", ["accounting.ledger", "crm.contacts", "webhooks.inbound"], ["oauth2"], ["XERO_CLIENT_ID", "XERO_CLIENT_SECRET", "XERO_TENANT_ID"], ["XERO_REFRESH_TOKEN"], ["XERO_CLIENT_SECRET", "XERO_REFRESH_TOKEN"], "financial"),
  adapter("netsuite", "Oracle NetSuite", "finance", ["accounting.ledger", "crm.contacts", "commerce.orders"], ["oauth2"], ["NETSUITE_ACCOUNT_ID", "NETSUITE_CLIENT_ID", "NETSUITE_CLIENT_SECRET"], ["NETSUITE_TOKEN_ID", "NETSUITE_TOKEN_SECRET"], ["NETSUITE_CLIENT_SECRET", "NETSUITE_TOKEN_SECRET"], "financial"),
  adapter("shopify", "Shopify", "commerce", ["commerce.catalog", "commerce.orders", "crm.contacts", "webhooks.inbound", "webhooks.outbound"], ["oauth2", "api-key"], ["SHOPIFY_STORE_DOMAIN", "SHOPIFY_ACCESS_TOKEN"], ["SHOPIFY_WEBHOOK_SECRET"], ["SHOPIFY_ACCESS_TOKEN", "SHOPIFY_WEBHOOK_SECRET"], "sensitive"),
  adapter("woocommerce", "WooCommerce", "commerce", ["commerce.catalog", "commerce.orders", "crm.contacts", "webhooks.inbound"], ["basic"], ["WOOCOMMERCE_BASE_URL", "WOOCOMMERCE_CONSUMER_KEY", "WOOCOMMERCE_CONSUMER_SECRET"], [], ["WOOCOMMERCE_CONSUMER_KEY", "WOOCOMMERCE_CONSUMER_SECRET"], "sensitive"),
]);
