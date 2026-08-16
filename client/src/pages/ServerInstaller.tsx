import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function ServerInstaller() {
  return (
    <FeatureUnavailable
      title="Self-hosted deployment is not enabled yet"
      description="Infrastructure provisioning, Docker or cloud deployment, secret generation, database migration, TLS, reverse proxy, health checks, backups, and rollback require an approved environment, secret manager, least-privilege credentials, network controls, and independently captured evidence. The current release does not generate, display, download, or execute deployment credentials or claim that a server is configured."
      capability="Infrastructure deployment, environment generation, migration, TLS, and operations"
      nextStep="Review the production evidence requirements"
    />
  );
}
