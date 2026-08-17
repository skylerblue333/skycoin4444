import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Database,
  Info,
  RotateCcw,
  Save,
  Server,
  Sparkles,
  Trash2,
  Zap,
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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

const STORAGE_KEY = "skycoin.cache-preferences";
type CachePreferences = { refreshHints: boolean; retainPreview: boolean };
const defaults: CachePreferences = { refreshHints: true, retainPreview: true };

function readPreferences(): CachePreferences {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaults;
    const parsed: unknown = JSON.parse(stored);
    if (!parsed || typeof parsed !== "object") return defaults;
    const value = parsed as Partial<CachePreferences>;
    return {
      refreshHints:
        typeof value.refreshHints === "boolean"
          ? value.refreshHints
          : defaults.refreshHints,
      retainPreview:
        typeof value.retainPreview === "boolean"
          ? value.retainPreview
          : defaults.retainPreview,
    };
  } catch {
    return defaults;
  }
}

export default function CacheManagement() {
  const [preferences, setPreferences] = useState<CachePreferences>(defaults);
  const [saved, setSaved] = useState(true);
  const [previewCleared, setPreviewCleared] = useState(false);
  const [statusMessage, setStatusMessage] = useState(
    "Cache preferences are saved."
  );
  useEffect(() => {
    setPreferences(readPreferences());
  }, []);
  const changed = useMemo(
    () => JSON.stringify(preferences) !== JSON.stringify(readPreferences()),
    [preferences]
  );
  const update = <K extends keyof CachePreferences>(
    key: K,
    value: CachePreferences[K]
  ) => {
    setPreferences(current => ({ ...current, [key]: value }));
    setSaved(false);
    setStatusMessage("Unsaved cache preference changes.");
  };
  const savePreferences = () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    setSaved(true);
    setStatusMessage("Cache preferences saved on this device.");
    toast.success("Cache preferences saved", {
      description: "No server or CDN cache was changed.",
    });
  };
  const resetPreferences = () => {
    setPreferences(defaults);
    window.localStorage.removeItem(STORAGE_KEY);
    setPreviewCleared(false);
    setSaved(true);
    setStatusMessage("Cache preferences reset to defaults.");
    toast.success("Cache preferences reset");
  };
  const clearPreview = () => {
    setPreviewCleared(true);
    setStatusMessage("Local preview state cleared.");
    toast.success("Local preview cleared", {
      description: "This did not purge server, CDN, or database caches.",
    });
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="mx-auto max-w-5xl space-y-8 p-4 sm:p-6 lg:p-10">
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {statusMessage}
        </div>
        <header className="flex flex-col gap-5 border-b border-border/70 pb-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-4">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <Zap className="h-7 w-7" aria-hidden="true" />
            </div>
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-semibold tracking-tight">
                  Cache management
                </h1>
                <Badge variant="secondary" className="gap-1.5 font-normal">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />{" "}
                  Diagnostics
                </Badge>
              </div>
              <p className="max-w-2xl text-muted-foreground">
                Understand what this device can refresh locally without
                mistaking it for server-side cache control.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start">
            <Button
              variant="ghost"
              onClick={resetPreferences}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" /> Reset
            </Button>
            <Button
              onClick={savePreferences}
              disabled={saved && !changed}
              className="gap-2"
            >
              <Save className="h-4 w-4" aria-hidden="true" />
              {saved ? "Saved" : "Save changes"}
            </Button>
          </div>
        </header>
        <Card className="border-sky-500/30 bg-sky-500/10">
          <CardContent className="flex gap-3 p-4 text-sm">
            <Info
              className="mt-0.5 h-4 w-4 shrink-0 text-sky-500"
              aria-hidden="true"
            />
            <p className="leading-5 text-foreground/75">
              <strong className="font-medium text-foreground">
                Scope is intentionally local.
              </strong>{" "}
              This screen cannot inspect or purge CDN, server, database, or API
              caches. It does not report fake cache size, hit rate, latency, or
              freshness metrics.
            </p>
          </CardContent>
        </Card>
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Database
                    className="h-5 w-5 text-primary"
                    aria-hidden="true"
                  />
                  What can be inspected
                </CardTitle>
                <CardDescription>
                  Only the local preview state is available in this screen.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  {
                    icon: Sparkles,
                    label: "Preview state",
                    value: previewCleared
                      ? "Cleared for this session"
                      : "Available in this session",
                  },
                  {
                    icon: Server,
                    label: "Application cache",
                    value: "Not connected",
                  },
                  {
                    icon: Database,
                    label: "Data freshness",
                    value: "Not measured",
                  },
                ].map(item => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between gap-4 rounded-lg border border-border/70 bg-muted/20 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon
                        className="h-4 w-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <span className="text-sm">{item.label}</span>
                    </div>
                    <Badge variant="outline">{item.value}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Zap className="h-5 w-5 text-primary" aria-hidden="true" />
                  Local controls
                </CardTitle>
                <CardDescription>
                  These choices affect only the behavior of this local preview.
                </CardDescription>
              </CardHeader>
              <CardContent className="divide-y divide-border/70">
                <div className="flex items-start justify-between gap-5 py-4">
                  <div>
                    <p className="text-sm font-medium">Refresh hints</p>
                    <p className="mt-1 max-w-xl text-sm leading-5 text-muted-foreground">
                      Show local guidance when content may need a manual
                      refresh.
                    </p>
                  </div>
                  <Switch
                    checked={preferences.refreshHints}
                    onCheckedChange={value => update("refreshHints", value)}
                    aria-label="Refresh hints"
                  />
                </div>
                <div className="flex items-start justify-between gap-5 py-4">
                  <div>
                    <p className="text-sm font-medium">Retain preview state</p>
                    <p className="mt-1 max-w-xl text-sm leading-5 text-muted-foreground">
                      Keep the local preview state available while this device
                      session is active.
                    </p>
                  </div>
                  <Switch
                    checked={preferences.retainPreview}
                    onCheckedChange={value => update("retainPreview", value)}
                    aria-label="Retain preview state"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          <aside className="space-y-6">
            <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="text-lg">
                  Clear only what you own
                </CardTitle>
                <CardDescription className="text-primary-foreground/75">
                  The action below clears this preview state, not infrastructure
                  caches.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="secondary"
                  onClick={clearPreview}
                  className="w-full gap-2"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" /> Clear local
                  preview
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Cache status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Local preview</span>
                  <span className="font-medium">
                    {previewCleared ? "Cleared" : "Available"}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Server cache</span>
                  <span className="font-medium">Not connected</span>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
