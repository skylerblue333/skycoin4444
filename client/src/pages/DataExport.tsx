import { useState } from "react";
import { Download, FileJson, ShieldCheck } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DataExport() {
  const { isAuthenticated, loading } = useAuth();
  const [message, setMessage] = useState("");
  const exportQuery = trpc.privacy.exportData.useQuery(undefined, {
    enabled: false,
    retry: false,
  });

  const exportData = async () => {
    setMessage("");
    const result = await exportQuery.refetch();
    if (!result.data) return;

    const blob = new Blob([JSON.stringify(result.data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `skycoin4444-beta-data-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    setMessage(
      "Export created locally from your authenticated beta records. Review the scope statement inside the JSON file."
    );
  };

  if (loading) {
    return <main className="min-h-screen p-8">Loading account state…</main>;
  }

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Beta data export</CardTitle>
            <CardDescription>
              Sign in with an invited account to export account-owned beta data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => startLogin()}>
              Sign in
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <header>
          <Badge variant="outline">Authenticated self-export</Badge>
          <h1 className="mt-3 text-3xl font-bold">Export your beta data</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Create a JSON snapshot of the account-owned records currently
            integrated into the SKYCOIN4444 engineering beta.
          </p>
        </header>

        <Card>
          <CardHeader>
            <FileJson className="h-6 w-6 text-primary" />
            <CardTitle className="mt-2">Included beta categories</CardTitle>
            <CardDescription>
              Profile, social activity, SkySchool progress, beta feedback,
              discovery records, creator drafts, notifications/preferences, and
              privacy requests.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="rounded-xl border bg-muted/30 p-4 text-sm leading-6 text-muted-foreground">
              This export is intentionally scoped to integrated beta tables. It
              is not a claim that unintegrated legacy screens, external
              providers, or unavailable systems hold no other data.
            </div>

            <Button
              type="button"
              onClick={exportData}
              disabled={exportQuery.isFetching}
            >
              <Download className="mr-2 h-4 w-4" />
              {exportQuery.isFetching ? "Preparing export…" : "Create JSON export"}
            </Button>

            {exportQuery.error && (
              <p className="text-sm text-destructive">
                Export unavailable: {exportQuery.error.message}
              </p>
            )}
            {message && <p className="text-sm text-emerald-600">{message}</p>}
          </CardContent>
        </Card>

        <section className="rounded-xl border p-4 text-sm leading-6 text-muted-foreground">
          <ShieldCheck className="mr-2 inline h-4 w-4 text-primary" />
          Exporting data does not delete or modify your account and does not
          expose another tester's records.
        </section>
      </div>
    </main>
  );
}
