import { useEffect, useMemo, useState } from "react";
import { Check, Eye, Palette, RotateCcw, Save, Users } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const STORAGE_KEY = "skycoin.channel-customization-demo";
type ChannelPreferences = {
  name: string;
  description: string;
  color: "blue" | "violet" | "emerald";
  visible: boolean;
};
const defaults: ChannelPreferences = {
  name: "Skycoin community",
  description: "A welcoming space for shared learning and ideas.",
  color: "blue",
  visible: true,
};
const colorOptions: Array<{
  value: ChannelPreferences["color"];
  label: string;
  className: string;
}> = [
  { value: "blue", label: "Sky", className: "bg-blue-500" },
  { value: "violet", label: "Orbit", className: "bg-violet-500" },
  { value: "emerald", label: "Signal", className: "bg-emerald-500" },
];
function readPreferences(): ChannelPreferences {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaults;
    const parsed: unknown = JSON.parse(stored);
    if (!parsed || typeof parsed !== "object") return defaults;
    const value = parsed as Partial<ChannelPreferences>;
    return {
      name: typeof value.name === "string" ? value.name : defaults.name,
      description:
        typeof value.description === "string"
          ? value.description
          : defaults.description,
      color:
        value.color === "blue" ||
        value.color === "violet" ||
        value.color === "emerald"
          ? value.color
          : defaults.color,
      visible:
        typeof value.visible === "boolean" ? value.visible : defaults.visible,
    };
  } catch {
    return defaults;
  }
}

export default function ChannelCustomization() {
  const [preferences, setPreferences] = useState<ChannelPreferences>(defaults);
  const [saved, setSaved] = useState(true);
  const [statusMessage, setStatusMessage] = useState(
    "Channel preview preferences are saved."
  );
  useEffect(() => {
    setPreferences(readPreferences());
  }, []);
  const changed = useMemo(
    () => JSON.stringify(preferences) !== JSON.stringify(readPreferences()),
    [preferences]
  );
  const update = <K extends keyof ChannelPreferences>(
    key: K,
    value: ChannelPreferences[K]
  ) => {
    setPreferences(current => ({ ...current, [key]: value }));
    setSaved(false);
    setStatusMessage("Unsaved channel preview changes.");
  };
  const save = () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    setSaved(true);
    setStatusMessage("Channel preview preferences saved on this device.");
    toast.success("Preview saved", {
      description: "No live channel was changed.",
    });
  };
  const reset = () => {
    setPreferences(defaults);
    window.localStorage.removeItem(STORAGE_KEY);
    setSaved(true);
    setStatusMessage("Channel preview reset to defaults.");
    toast.success("Channel preview reset");
  };
  const colorClass =
    preferences.color === "violet"
      ? "from-violet-600 to-fuchsia-600"
      : preferences.color === "emerald"
        ? "from-emerald-600 to-teal-500"
        : "from-blue-600 to-cyan-500";

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="mx-auto max-w-5xl space-y-8 p-4 sm:p-6 lg:p-10">
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {statusMessage}
        </div>
        <header className="flex flex-col gap-5 border-b border-border/70 pb-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-4">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <Palette className="h-7 w-7" aria-hidden="true" />
            </div>
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-semibold tracking-tight">
                  Channel customization
                </h1>
                <Badge variant="secondary" className="gap-1.5 font-normal">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" /> Local
                  preview
                </Badge>
              </div>
              <p className="max-w-2xl text-muted-foreground">
                Shape a sample channel presentation without implying that a live
                community channel is being edited.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start">
            <Button variant="ghost" onClick={reset} className="gap-2">
              <RotateCcw className="h-4 w-4" aria-hidden="true" /> Reset
            </Button>
            <Button
              onClick={save}
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
            <Eye
              className="mt-0.5 h-4 w-4 shrink-0 text-sky-500"
              aria-hidden="true"
            />
            <p className="leading-5 text-foreground/75">
              <strong className="font-medium text-foreground">
                Preview only.
              </strong>{" "}
              Changes are stored on this device and affect the sample card
              below. No live channel, member list, or notification setting is
              changed.
            </p>
          </CardContent>
        </Card>
        <div className="grid gap-6 lg:grid-cols-[1fr_330px]">
          <Card>
            <CardHeader>
              <CardTitle>Presentation details</CardTitle>
              <CardDescription>
                Use the fields below to explore a local channel configuration.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="channel-name">Channel name</Label>
                <Input
                  id="channel-name"
                  value={preferences.name}
                  onChange={event => update("name", event.target.value)}
                  maxLength={48}
                />
                <p className="text-xs text-muted-foreground">
                  {preferences.name.length}/48 characters
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="channel-description">Description</Label>
                <Textarea
                  id="channel-description"
                  value={preferences.description}
                  onChange={event => update("description", event.target.value)}
                  maxLength={140}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  {preferences.description.length}/140 characters
                </p>
              </div>
              <div className="space-y-3">
                <Label>Accent preset</Label>
                <div className="grid gap-3 sm:grid-cols-3">
                  {colorOptions.map(option => (
                    <button
                      type="button"
                      key={option.value}
                      onClick={() => update("color", option.value)}
                      className={`flex items-center gap-2 rounded-lg border p-3 text-left text-sm transition-colors ${preferences.color === option.value ? "border-primary bg-primary/5" : "border-border hover:bg-muted"}`}
                      aria-pressed={preferences.color === option.value}
                    >
                      <span
                        className={`h-4 w-4 rounded-full ${option.className}`}
                        aria-hidden="true"
                      />
                      {option.label}
                      {preferences.color === option.value && (
                        <Check
                          className="ml-auto h-4 w-4 text-primary"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <Separator />
              <div className="flex items-start justify-between gap-5">
                <div>
                  <Label htmlFor="channel-visible">
                    Show in preview discovery
                  </Label>
                  <p className="mt-1 text-sm leading-5 text-muted-foreground">
                    Control whether the sample card appears discoverable in this
                    local preview.
                  </p>
                </div>
                <Switch
                  id="channel-visible"
                  checked={preferences.visible}
                  onCheckedChange={value => update("visible", value)}
                  aria-label="Show in preview discovery"
                />
              </div>
            </CardContent>
          </Card>
          <aside className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Eye className="h-4 w-4 text-primary" aria-hidden="true" />
                  Live preview
                </CardTitle>
                <CardDescription>Scoped to this sample screen.</CardDescription>
              </CardHeader>
              <CardContent>
                {preferences.visible ? (
                  <div
                    className={`overflow-hidden rounded-xl bg-gradient-to-br ${colorClass} p-5 text-white`}
                  >
                    <div className="mb-10 flex items-center justify-between">
                      <div className="rounded-lg bg-white/15 p-2">
                        <Users className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <Badge className="border-white/20 bg-white/15 text-white">
                        Preview
                      </Badge>
                    </div>
                    <h2 className="text-xl font-semibold">
                      {preferences.name || "Untitled channel"}
                    </h2>
                    <p className="mt-2 text-sm leading-5 text-white/80">
                      {preferences.description ||
                        "Add a description to preview it here."}
                    </p>
                    <p className="mt-5 text-xs text-white/70">
                      Local sample · No members connected
                    </p>
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-border p-6 text-center">
                    <Eye
                      className="mx-auto h-7 w-7 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <p className="mt-3 text-sm font-medium">
                      Hidden in preview
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Turn on discovery to view the sample card.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">When connected</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Real channel editing should verify permissions, persist
                  server-side, and report failed updates without optimistic
                  false success.
                </p>
                <Separator />
                <p>This screen intentionally keeps all edits local.</p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
