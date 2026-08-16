import { useAuth } from "@/_core/hooks/useAuth";
import UnavailableFeature from "@/components/UnavailableFeature";
import { Card } from "@/components/ui/card";

export default function AdminPage() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <main className="container mx-auto max-w-3xl p-6">
        <Card className="p-6">
          <p className="text-destructive">Admin access required.</p>
        </Card>
      </main>
    );
  }

  return (
    <main className="container mx-auto max-w-3xl p-6">
      <UnavailableFeature
        name="Administrative control center"
        reason="Verified user management, moderation, audit-log retrieval, and administrative analytics contracts are not connected to this production surface yet."
      />
    </main>
  );
}
