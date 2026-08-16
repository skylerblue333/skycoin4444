import UnavailableFeature from "@/components/UnavailableFeature";

export default function AuditLogs() {
  return (
    <UnavailableFeature
      name="Audit logs"
      reason="Audit log retrieval is not exposed as a verified production read path yet."
    />
  );
}
