import { adapter } from "../definition";
import type { EnterpriseAdapterDefinition } from "../types";

export const ADAPTERS: readonly EnterpriseAdapterDefinition[] = Object.freeze([
  adapter("aws-s3", "Amazon S3", "storage", ["storage.objects"], ["service-account"], ["AWS_REGION", "AWS_S3_BUCKET"], ["AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY", "AWS_ENDPOINT_URL"], ["AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY"], "sensitive"),
  adapter("google-cloud-storage", "Google Cloud Storage", "storage", ["storage.objects"], ["service-account"], ["GCS_BUCKET", "GCP_PROJECT_ID", "GCP_SERVICE_ACCOUNT_JSON"], [], ["GCP_SERVICE_ACCOUNT_JSON"], "sensitive"),
  adapter("azure-blob-storage", "Azure Blob Storage", "storage", ["storage.objects"], ["connection-string"], ["AZURE_STORAGE_ACCOUNT", "AZURE_STORAGE_CONTAINER", "AZURE_STORAGE_CONNECTION_STRING"], [], ["AZURE_STORAGE_CONNECTION_STRING"], "sensitive"),
  adapter("snowflake", "Snowflake", "data", ["warehouse.sql", "analytics.events"], ["basic", "oauth2"], ["SNOWFLAKE_ACCOUNT", "SNOWFLAKE_USER", "SNOWFLAKE_PASSWORD", "SNOWFLAKE_WAREHOUSE"], ["SNOWFLAKE_DATABASE", "SNOWFLAKE_SCHEMA"], ["SNOWFLAKE_PASSWORD"], "sensitive"),
  adapter("bigquery", "Google BigQuery", "data", ["warehouse.sql", "analytics.events"], ["service-account"], ["BIGQUERY_PROJECT_ID", "GCP_SERVICE_ACCOUNT_JSON"], ["BIGQUERY_DATASET"], ["GCP_SERVICE_ACCOUNT_JSON"], "sensitive"),
  adapter("databricks", "Databricks", "data", ["warehouse.sql", "analytics.events"], ["bearer"], ["DATABRICKS_HOST", "DATABRICKS_TOKEN"], ["DATABRICKS_HTTP_PATH"], ["DATABRICKS_TOKEN"], "sensitive"),
  adapter("confluent-kafka", "Confluent Kafka", "events", ["events.stream", "events.queue"], ["basic", "api-key"], ["KAFKA_BOOTSTRAP_SERVERS", "KAFKA_API_KEY", "KAFKA_API_SECRET"], ["KAFKA_SCHEMA_REGISTRY_URL"], ["KAFKA_API_KEY", "KAFKA_API_SECRET"], "sensitive"),
  adapter("aws-sqs", "Amazon SQS", "events", ["events.queue"], ["service-account"], ["AWS_REGION", "SQS_QUEUE_URL"], ["AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY"], ["AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY"], "sensitive"),
  adapter("aws-sns", "Amazon SNS", "events", ["events.queue", "webhooks.outbound"], ["service-account"], ["AWS_REGION", "SNS_TOPIC_ARN"], ["AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY"], ["AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY"], "sensitive"),
  adapter("google-pubsub", "Google Cloud Pub/Sub", "events", ["events.queue", "events.stream"], ["service-account"], ["GCP_PROJECT_ID", "GCP_SERVICE_ACCOUNT_JSON", "PUBSUB_TOPIC"], ["PUBSUB_SUBSCRIPTION"], ["GCP_SERVICE_ACCOUNT_JSON"], "sensitive"),
  adapter("rabbitmq", "RabbitMQ", "events", ["events.queue", "events.stream"], ["connection-string"], ["RABBITMQ_URL"], ["RABBITMQ_EXCHANGE"], ["RABBITMQ_URL"], "sensitive"),
  adapter("nats", "NATS", "events", ["events.queue", "events.stream"], ["connection-string"], ["NATS_URL"], ["NATS_TOKEN", "NATS_CREDS"], ["NATS_URL", "NATS_TOKEN", "NATS_CREDS"], "sensitive"),
]);
