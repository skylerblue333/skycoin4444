import { useState } from "react";
import { AlertTriangle, BellRing } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog as AlertDialogRoot,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function AlertDialog() {
  const [acknowledged, setAcknowledged] = useState(false);

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <header>
          <Badge variant="outline">Alert interaction lab</Badge>
          <h1 className="mt-3 text-3xl font-bold">Alert dialog</h1>
          <p className="mt-2 text-muted-foreground">
            Exercise a blocking acknowledgement pattern without connecting it
            to a destructive action.
          </p>
        </header>

        <Card>
          <CardHeader>
            <BellRing className="h-5 w-5 text-primary" />
            <CardTitle className="mt-2">Demo alert</CardTitle>
            <CardDescription>
              The alert changes only local React state.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <AlertDialogRoot>
              <AlertDialogTrigger asChild>
                <Button>Open alert</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertTriangle className="h-6 w-6 text-amber-600" />
                  <AlertDialogTitle>Review the beta boundary</AlertDialogTitle>
                  <AlertDialogDescription>
                    This is a UI alert rehearsal. Acknowledging it does not
                    submit data or trigger a backend operation.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction onClick={() => setAcknowledged(true)}>
                    Acknowledge locally
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogRoot>

            {acknowledged && (
              <p className="rounded-xl border border-emerald-500/30 p-4 text-sm">
                Alert acknowledged in local component state.
              </p>
            )}
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground">
          No notification service, account mutation, purchase, deletion,
          payment, or irreversible action is connected.
        </p>
      </div>
    </main>
  );
}
