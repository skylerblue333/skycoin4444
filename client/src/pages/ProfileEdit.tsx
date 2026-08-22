import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";

export default function ProfileEdit() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <main className="p-8 text-white">Loading account…</main>;
  }

  if (!isAuthenticated || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black p-8 text-white">
        <Card className="w-full max-w-md border-white/10 bg-white/[0.03]">
          <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-white/60">Sign in to view your verified account identity.</p>
            <Button onClick={() => startLogin()} className="w-full">Sign in</Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  const displayName = user.name ?? user.username ?? "Unnamed account";

  return (
    <main className="min-h-screen bg-black p-8 text-white">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">Profile</h1>
            <Badge variant="outline" className="border-emerald-400/50 text-emerald-200">Verified session</Badge>
          </div>
          <p className="text-sm text-white/50">This view displays only fields returned by the authenticated account service.</p>
        </header>

        <Card className="border-white/10 bg-white/[0.03]">
          <CardHeader><CardTitle>Account identity</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field label="Display name" value={displayName} />
            <Field label="Username" value={user.username ?? "Not configured"} />
            <Field label="Email" value={user.email ?? "Not provided"} />
            <Field label="Role" value={user.role ?? "Not assigned"} />
            <Field label="Account ID" value={user.id} />
            <Field label="Verification" value={user.verified ? "Verified" : "Not verified"} />
          </CardContent>
        </Card>

        <Card className="border-amber-400/30 bg-amber-400/[0.05]">
          <CardContent className="p-5">
            <h2 className="font-semibold text-amber-100">Profile editing unavailable</h2>
            <p className="mt-2 text-sm leading-6 text-white/60">
              Profile update and image-upload endpoints are not currently exposed by the backend contract. No local-only edits are presented as saved, and no unsupported mutation is attempted.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/20 p-3">
      <div className="text-xs uppercase tracking-wide text-white/40">{label}</div>
      <div className="mt-1 break-words text-sm text-white/90">{value}</div>
    </div>
  );
}
