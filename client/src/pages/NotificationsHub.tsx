import { Bell, CheckCheck, CircleAlert, RefreshCw } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/EmptyState";
import { PageSkeleton } from "@/components/PageSkeleton";

export default function NotificationsHub() {
  const feed = trpc.notifIntelligence.getIntelligentFeed.useQuery({
    limit: 50,
  });
  const markRead = trpc.notifIntelligence.markRead.useMutation({
    onSuccess: () => feed.refetch(),
  });

  if (feed.isLoading) {
    return <PageSkeleton />;
  }

  if (feed.isError) {
    return (
      <main className="container mx-auto max-w-4xl space-y-6 p-6">
        <EmptyState
          icon={<CircleAlert className="h-8 w-8" />}
          title="Notifications could not be loaded"
          description="The notification service returned an error. No notification state was changed."
          action={
            <Button type="button" onClick={() => feed.refetch()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          }
        />
      </main>
    );
  }

  const notifications = feed.data?.notifications ?? [];

  return (
    <main className="container mx-auto max-w-4xl space-y-6 p-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <Bell className="h-7 w-7 text-primary" aria-hidden="true" />
            <h1 className="text-3xl font-bold">Notifications</h1>
            <Badge variant="secondary">
              {feed.data?.unreadCount ?? 0} unread
            </Badge>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Verified platform notifications. Trading, marketplace, and social
            alerts appear only when delivered by their connected services.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          disabled={markRead.isPending || (feed.data?.unreadCount ?? 0) === 0}
          onClick={() => markRead.mutate({ all: true })}
        >
          <CheckCheck className="mr-2 h-4 w-4" />
          Mark all read
        </Button>
      </header>

      {notifications.length === 0 ? (
        <EmptyState
          icon={<Bell className="h-8 w-8" />}
          title="No notifications"
          description="New verified account and platform activity will appear here."
        />
      ) : (
        <section className="space-y-3" aria-label="Notifications">
          {notifications.map(notification => (
            <Card key={notification.id} className="p-4">
              <div className="flex items-start gap-4">
                <Bell
                  className="mt-1 h-5 w-5 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold">{notification.title}</h2>
                    {!notification.read ? <Badge>Unread</Badge> : null}
                    {notification.priority ? (
                      <Badge variant="outline">{notification.priority}</Badge>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {notification.message || notification.body}
                  </p>
                  <time
                    className="mt-2 block text-xs text-muted-foreground"
                    dateTime={notification.createdAt}
                  >
                    {new Date(notification.createdAt).toLocaleString()}
                  </time>
                </div>
                {!notification.read ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={markRead.isPending}
                    onClick={() => markRead.mutate({ id: notification.id })}
                  >
                    Mark read
                  </Button>
                ) : null}
              </div>
            </Card>
          ))}
        </section>
      )}
    </main>
  );
}
