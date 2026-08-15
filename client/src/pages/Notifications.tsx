import {
  AlertTriangle,
  Bell,
  Check,
  Loader2,
  RefreshCw,
  UserRound,
} from "lucide-react";
import { Link } from "wouter";

import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";

export default function Notifications() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const utils = trpc.useUtils();
  const notificationsQuery = trpc.notifications.list.useQuery(
    { limit: 50, offset: 0 },
    { enabled: isAuthenticated }
  );
  const markRead = trpc.notifications.markRead.useMutation({
    onSuccess: () => void utils.notifications.list.invalidate(),
  });
  const notifications = notificationsQuery.data ?? [];

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <Loader2
          className="h-6 w-6 animate-spin"
          aria-label="Loading notifications"
        />
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-center text-slate-100">
        <Card className="max-w-md border-slate-700 bg-slate-900">
          <CardContent className="p-8">
            <UserRound className="mx-auto h-10 w-10 text-sky-300" />
            <h1 className="mt-4 text-xl font-semibold">
              Sign in to view notifications
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Notifications are private records scoped to the authenticated
              account.
            </p>
            <Link href="/">
              <Button className="mt-6">Return home</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-4xl">
        <header className="flex flex-col gap-4 border-b border-slate-700 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-200">
              <Bell className="h-3.5 w-3.5" /> Persisted records enabled
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Notifications
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Stored account notifications can be read and marked read. External
              email, push, SMS, webhook, and delivery reporting are not
              configured.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => void notificationsQuery.refetch()}
            disabled={notificationsQuery.isFetching}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${notificationsQuery.isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </header>

        {notificationsQuery.isLoading ? (
          <div className="flex min-h-48 items-center justify-center">
            <Loader2
              className="h-6 w-6 animate-spin text-sky-300"
              aria-label="Loading notification records"
            />
          </div>
        ) : notificationsQuery.isError ? (
          <Card className="mt-8 border-amber-900/60 bg-amber-950/30">
            <CardContent className="flex items-start gap-3 p-5">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
              <div>
                <h2 className="font-semibold text-amber-100">
                  Notifications unavailable
                </h2>
                <p className="mt-1 text-sm text-amber-200">
                  {notificationsQuery.error.message}
                </p>
                <Button
                  className="mt-4"
                  variant="outline"
                  onClick={() => void notificationsQuery.refetch()}
                >
                  Try again
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : notifications.length === 0 ? (
          <Card className="mt-8 border-slate-700 bg-slate-900">
            <CardContent className="flex min-h-48 flex-col items-center justify-center p-6 text-center">
              <Bell className="h-10 w-10 text-slate-600" />
              <p className="mt-3 text-sm text-slate-300">
                No stored notifications yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <section className="mt-8 space-y-3" aria-label="Stored notifications">
            {notifications.map(notification => (
              <Card
                key={notification.id}
                className={`border-slate-700 bg-slate-900 ${notification.read ? "opacity-70" : ""}`}
              >
                <CardContent className="flex items-start gap-4 p-5">
                  <Bell
                    className={`mt-0.5 h-5 w-5 shrink-0 ${notification.read ? "text-slate-500" : "text-sky-300"}`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-white">
                        {notification.type ?? "Notification"}
                      </span>
                      {notification.createdAt ? (
                        <span className="text-xs text-slate-500">
                          {new Date(notification.createdAt).toLocaleString()}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {notification.content ?? "No notification content."}
                    </p>
                  </div>
                  {!notification.read ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label="Mark notification as read"
                      onClick={() =>
                        markRead.mutate({ notificationId: notification.id })
                      }
                      disabled={markRead.isPending}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </section>
        )}

        <section className="mt-10 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                Delivery boundary
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page reads stored records only. It does not claim that an
                email, push, SMS, webhook, or other external notification was
                delivered.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
