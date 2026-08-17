import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Check,
  Copy,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  WalletCards,
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

const STORAGE_KEY = "skycoin.address-book-demo";
type AddressEntry = {
  id: string;
  label: string;
  network: "Demo network";
  value: string;
};
const defaults: AddressEntry[] = [
  {
    id: "demo-recipient-1",
    label: "Example recipient",
    network: "Demo network",
    value: "demo://recipient/sky-001",
  },
  {
    id: "demo-recipient-2",
    label: "Savings example",
    network: "Demo network",
    value: "demo://recipient/sky-002",
  },
];

function readEntries(): AddressEntry[] {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaults;
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return defaults;
    return parsed.filter(
      (value): value is AddressEntry =>
        Boolean(value) &&
        typeof value === "object" &&
        typeof (value as AddressEntry).id === "string" &&
        typeof (value as AddressEntry).label === "string" &&
        typeof (value as AddressEntry).network === "string" &&
        typeof (value as AddressEntry).value === "string"
    );
  } catch {
    return defaults;
  }
}

export default function AddressBook() {
  const [entries, setEntries] = useState<AddressEntry[]>(defaults);
  const [query, setQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState(
    "Address-book examples are saved."
  );

  useEffect(() => {
    setEntries(readEntries());
  }, []);
  const filteredEntries = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return normalized
      ? entries.filter(entry =>
          `${entry.label} ${entry.value} ${entry.network}`
            .toLowerCase()
            .includes(normalized)
        )
      : entries;
  }, [entries, query]);

  const copyValue = async (entry: AddressEntry) => {
    try {
      await navigator.clipboard.writeText(entry.value);
    } catch {
      /* Clipboard may be unavailable in preview environments. */
    }
    setCopiedId(entry.id);
    setStatusMessage(`Copied the demo string for ${entry.label}.`);
    toast.success("Demo string copied", {
      description: "This is not a real wallet address.",
    });
    window.setTimeout(() => setCopiedId(null), 1600);
  };
  const removeEntry = (id: string) => {
    const next = entries.filter(entry => entry.id !== id);
    setEntries(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setPendingId(null);
    setStatusMessage("Demo recipient removed from the local address book.");
    toast.success("Demo recipient removed");
  };
  const reset = () => {
    setEntries(defaults);
    window.localStorage.removeItem(STORAGE_KEY);
    setPendingId(null);
    setStatusMessage("Address-book examples reset.");
    toast.success("Address-book examples reset");
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
              <WalletCards className="h-7 w-7" aria-hidden="true" />
            </div>
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-semibold tracking-tight">
                  Address book
                </h1>
                <Badge variant="secondary" className="gap-1.5 font-normal">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" /> Local
                  demo
                </Badge>
              </div>
              <p className="max-w-2xl text-muted-foreground">
                Keep recipient labels organized without exposing or inventing
                real wallet data.
              </p>
            </div>
          </div>
          <Button variant="ghost" onClick={reset} className="gap-2 self-start">
            <RotateCcw className="h-4 w-4" aria-hidden="true" /> Reset examples
          </Button>
        </header>
        <Card className="border-amber-500/30 bg-amber-500/10">
          <CardContent className="flex gap-3 p-4 text-sm">
            <AlertTriangle
              className="mt-0.5 h-4 w-4 shrink-0 text-amber-500"
              aria-hidden="true"
            />
            <p className="leading-5 text-foreground/75">
              <strong className="font-medium text-foreground">
                Safety boundary.
              </strong>{" "}
              These are clearly marked demo strings, not wallet addresses. This
              screen cannot validate addresses, sign transactions, or send
              funds.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <CardTitle>Saved recipients</CardTitle>
                <CardDescription>
                  {entries.length} local example{" "}
                  {entries.length === 1 ? "entry" : "entries"} currently listed.
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
                  aria-label="Search address-book examples"
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredEntries.length > 0 ? (
              <div className="divide-y divide-border/70">
                {filteredEntries.map(entry => (
                  <div
                    key={entry.id}
                    className="flex flex-col gap-4 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="rounded-xl border border-border/70 bg-muted p-2.5 text-muted-foreground">
                        <WalletCards className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium">{entry.label}</p>
                          <Badge variant="outline" className="text-xs">
                            {entry.network}
                          </Badge>
                        </div>
                        <p className="truncate font-mono text-sm text-muted-foreground">
                          {entry.value}
                        </p>
                      </div>
                    </div>
                    {pendingId === entry.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          Remove example?
                        </span>
                        <Button size="sm" onClick={() => removeEntry(entry.id)}>
                          Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setPendingId(null)}
                          aria-label="Cancel removal"
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyValue(entry)}
                          className="gap-2"
                        >
                          {copiedId === entry.id ? (
                            <Check className="h-4 w-4" aria-hidden="true" />
                          ) : (
                            <Copy className="h-4 w-4" aria-hidden="true" />
                          )}
                          {copiedId === entry.id ? "Copied" : "Copy"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setPendingId(entry.id);
                            setStatusMessage(
                              `Confirm removal of ${entry.label} from the local example list.`
                            );
                          }}
                          aria-label={`Remove ${entry.label}`}
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border p-8 text-center">
                <WalletCards
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
              When real wallet integration is available
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Recipient entries should be validated for the selected network,
              protected against unauthorized changes, and shown with transaction
              confirmation safeguards.
            </p>
            <Separator />
            <p>
              This preview intentionally contains no real address, balance,
              transaction, or blockchain-status data.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
