import { useEffect, useMemo, useState } from "react";
import {
  Ban,
  Check,
  RotateCcw,
  Search,
  ShieldOff,
  UserRound,
  X,
} from "lucide-react";
import { toast } from "sonner";
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
import { Separator } from "@/components/ui/separator";

const STORAGE_KEY = "skycoin.blocked-users-demo";
type BlockedUser = {
  id: string;
  name: string;
  handle: string;
  blockedOn: string;
};
const defaults: BlockedUser[] = [
  {
    id: "demo-1",
    name: "Example Contact",
    handle: "@example-contact",
    blockedOn: "Local example",
  },
  {
    id: "demo-2",
    name: "Sample Account",
    handle: "@sample-account",
    blockedOn: "Local example",
  },
];

function readUsers(): BlockedUser[] {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaults;
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return defaults;
    return parsed.filter(
      (value): value is BlockedUser =>
        Boolean(value) &&
        typeof value === "object" &&
        typeof (value as BlockedUser).id === "string" &&
        typeof (value as BlockedUser).name === "string" &&
        typeof (value as BlockedUser).handle === "string" &&
        typeof (value as BlockedUser).blockedOn === "string"
    );
  } catch {
    return defaults;
  }
}

export default function BlockedUsers() {
  const [users, setUsers] = useState<BlockedUser[]>(defaults);
  const [query, setQuery] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState(
    "Blocked-user preferences are saved."
  );

  useEffect(() => {
    setUsers(readUsers());
  }, []);

  const filteredUsers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return users;
    return users.filter(user =>
      `${user.name} ${user.handle}`.toLowerCase().includes(normalized)
    );
  }, [query, users]);

  const unblock = (id: string) => {
    const next = users.filter(user => user.id !== id);
    setUsers(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setPendingId(null);
    setStatusMessage("Local example account removed from the blocked list.");
    toast.success("Example account unblocked", {
      description: "This local demo change does not affect a real account.",
    });
  };

  const reset = () => {
    setUsers(defaults);
    window.localStorage.removeItem(STORAGE_KEY);
    setPendingId(null);
    setStatusMessage("Blocked-user examples reset.");
    toast.success("Blocked-user examples reset");
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="mx-auto max-w-4xl space-y-8 p-4 sm:p-6 lg:p-10">
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {statusMessage}
        </div>
        <header className="flex flex-col gap-5 border-b border-border/70 pb-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-4">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <Ban className="h-7 w-7" aria-hidden="true" />
            </div>
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-semibold tracking-tight">
                  Blocked users
                </h1>
                <Badge variant="secondary" className="gap-1.5 font-normal">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" /> Local
                  demo
                </Badge>
              </div>
              <p className="max-w-2xl text-muted-foreground">
                Review and manage example blocked entries while real account
                blocking is not connected.
              </p>
            </div>
          </div>
          <Button variant="ghost" onClick={reset} className="gap-2 self-start">
            <RotateCcw className="h-4 w-4" aria-hidden="true" /> Reset examples
          </Button>
        </header>

        <Card className="border-amber-500/30 bg-amber-500/10">
          <CardContent className="flex gap-3 p-4 text-sm">
            <ShieldOff
              className="mt-0.5 h-4 w-4 shrink-0 text-amber-500"
              aria-hidden="true"
            />
            <p className="leading-5 text-foreground/75">
              <strong className="font-medium text-foreground">
                Local-only preview.
              </strong>{" "}
              The entries below are sample records stored on this device.
              Removing one does not unblock a real user or change server-side
              account data.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <CardTitle>Blocked list</CardTitle>
                <CardDescription>
                  {users.length} local example{" "}
                  {users.length === 1 ? "entry" : "entries"} currently listed.
                </CardDescription>
              </div>
              <div className="relative w-full sm:max-w-xs">
                <Search
                  className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                  placeholder="Search examples"
                  aria-label="Search blocked examples"
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredUsers.length > 0 ? (
              <div className="divide-y divide-border/70">
                {filteredUsers.map(user => (
                  <div
                    key={user.id}
                    className="flex flex-col gap-4 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="rounded-full border border-border/70 bg-muted p-2.5 text-muted-foreground">
                        <UserRound className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{user.name}</p>
                        <p className="truncate text-sm text-muted-foreground">
                          {user.handle} · {user.blockedOn}
                        </p>
                      </div>
                    </div>
                    {pendingId === user.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          Remove example?
                        </span>
                        <Button size="sm" onClick={() => unblock(user.id)}>
                          Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setPendingId(null)}
                          aria-label="Cancel unblock"
                        >
                          <X className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setPendingId(user.id);
                          setStatusMessage(
                            `Confirm removal of ${user.name} from the local example list.`
                          );
                        }}
                        className="gap-2"
                      >
                        <ShieldOff className="h-4 w-4" aria-hidden="true" />{" "}
                        Unblock
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border p-8 text-center">
                <ShieldOff
                  className="mx-auto h-8 w-8 text-muted-foreground"
                  aria-hidden="true"
                />
                <h3 className="mt-3 font-medium">No matching examples</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try a different search or reset the local examples.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              What happens in a real integration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              When an account API is connected, blocking should be verified
              server-side, reflected across devices, and protected by
              authorization checks.
            </p>
            <Separator />
            <p>
              This preview intentionally does not invent user identities,
              timestamps, or successful backend mutations.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
