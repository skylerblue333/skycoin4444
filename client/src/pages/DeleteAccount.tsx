import { useState } from "react";
import { AlertTriangle, ShieldCheck, Trash2 } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const CONFIRMATION = "DELETE MY BETA ACCOUNT";

export default function DeleteAccount() {
  const { isAuthenticated, loading } = useAuth();
  const utils = trpc.useUtils();
  const requests = trpc.privacy.myRequests.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const requestDeletion = trpc.privacy.requestDeletion.useMutation({
    onSuccess: async () => {
      setConfirmation("");
      setReason("");
      await utils.privacy.myRequests.invalidate();
    },
  });
  const [confirmation, setConfirmation] = useState("");
  const [reason, setReason] = useState("");

  if (loading) {
    return <main className="min-h-screen p-8">Loading account state…</main>;
  }

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Account deletion request</CardTitle>
            <CardDescription>
              Sign in with the account whose data you want beta operations to
              review for deletion.
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

  const active = requests.data?.find(request =>
    request.status === "requested" || request.status === "approved"
  );

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <header>
          <Badge variant="outline" className="border-destructive/40">
            Privacy request
          </Badge>
          <h1 className="mt-3 text-3xl font-bold">Request account deletion</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Record a durable request for beta operations to review. Submitting
            this form does not immediately erase your records.
          </p>
        </header>

        <Card className="border-amber-500/30">
          <CardHeader>
            <AlertTriangle className="h-6 w-6 text-amber-600" />
            <CardTitle className="mt-2">Truthful deletion boundary</CardTitle>
            <CardDescription>
              The current beta can intake and review deletion requests, but an
              automated verified purge is not implemented yet. The API cannot
              mark a request completed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {active ? (
              <div className="rounded-xl border bg-muted/30 p-4">
                <p className="font-medium">Active request: {active.status}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Request ID: {active.id}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Submitted {new Date(active.requestedAt).toLocaleString()}
                </p>
                {active.operatorNote && (
                  <p className="mt-3 text-sm">{active.operatorNote}</p>
                )}
              </div>
            ) : (
              <>
                <label className="block space-y-2 text-sm font-medium">
                  Optional reason
                  <Textarea
                    value={reason}
                    maxLength={500}
                    onChange={event => setReason(event.target.value)}
                    placeholder="What should beta operations know about this request?"
                  />
                </label>

                <label className="block space-y-2 text-sm font-medium">
                  Type the confirmation phrase
                  <Input
                    value={confirmation}
                    onChange={event => setConfirmation(event.target.value)}
                    placeholder={CONFIRMATION}
                  />
                </label>

                <Button
                  type="button"
                  variant="destructive"
                  disabled={
                    confirmation !== CONFIRMATION ||
                    requestDeletion.isPending
                  }
                  onClick={() =>
                    requestDeletion.mutate({
                      confirmation: CONFIRMATION,
                      reason: reason.trim() || undefined,
                    })
                  }
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {requestDeletion.isPending
                    ? "Recording request…"
                    : "Record deletion request"}
                </Button>
              </>
            )}

            {requestDeletion.data && (
              <p className="text-sm text-emerald-600">
                {requestDeletion.data.message}
              </p>
            )}
            {requestDeletion.error && (
              <p className="text-sm text-destructive">
                {requestDeletion.error.message}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <ShieldCheck className="h-5 w-5 text-primary" />
            <CardTitle className="mt-2">Request history</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {requests.isLoading ? (
              <p className="text-sm text-muted-foreground">Loading requests…</p>
            ) : (requests.data?.length ?? 0) === 0 ? (
              <p className="text-sm text-muted-foreground">
                No deletion requests have been recorded for this account.
              </p>
            ) : (
              requests.data?.map(request => (
                <div key={request.id} className="rounded-xl border p-4 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium">{request.action}</span>
                    <Badge variant="outline">{request.status}</Badge>
                  </div>
                  <p className="mt-2 text-muted-foreground">
                    {new Date(request.requestedAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
