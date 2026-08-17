import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Circle,
  Eye,
  Moon,
  Palette,
  RotateCcw,
  Save,
  Sparkles,
  Sun,
  type LucideIcon,
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
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

const STORAGE_KEY = "skycoin.theme-preferences";
type ThemePreferences = {
  preset: "skycoin" | "midnight" | "soft";
  reducedGlare: boolean;
  compactPreview: boolean;
};
const defaults: ThemePreferences = {
  preset: "skycoin",
  reducedGlare: false,
  compactPreview: false,
};

function readPreferences(): ThemePreferences {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaults;
    const parsed: unknown = JSON.parse(stored);
    if (!parsed || typeof parsed !== "object") return defaults;
    const value = parsed as Partial<ThemePreferences>;
    return {
      preset:
        value.preset === "midnight" || value.preset === "soft"
          ? value.preset
          : defaults.preset,
      reducedGlare:
        typeof value.reducedGlare === "boolean"
          ? value.reducedGlare
          : defaults.reducedGlare,
      compactPreview:
        typeof value.compactPreview === "boolean"
          ? value.compactPreview
          : defaults.compactPreview,
    };
  } catch {
    return defaults;
  }
}

const presets: Array<{
  value: ThemePreferences["preset"];
  label: string;
  description: string;
  icon: LucideIcon;
  classes: string;
}> = [
  {
    value: "skycoin",
    label: "SKYCOIN",
    description: "Deep contrast with electric blue accents.",
    icon: Sparkles,
    classes: "from-slate-950 via-slate-900 to-blue-950",
  },
  {
    value: "midnight",
    label: "Midnight",
    description: "A quieter dark surface for focused work.",
    icon: Moon,
    classes: "from-black via-slate-950 to-indigo-950",
  },
  {
    value: "soft",
    label: "Soft contrast",
    description: "Gentler surfaces with less visual intensity.",
    icon: Sun,
    classes: "from-slate-800 via-slate-700 to-slate-600",
  },
];

function PresetCard({
  preset,
  selected,
  onSelect,
}: {
  preset: (typeof presets)[number];
  selected: boolean;
  onSelect: () => void;
}) {
  const Icon = preset.icon;
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`group relative overflow-hidden rounded-xl border text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${selected ? "border-primary ring-2 ring-primary/20" : "border-border/70 hover:border-primary/50"}`}
    >
      <div className={`h-24 bg-gradient-to-br ${preset.classes} p-4`}>
        <div className="flex items-start justify-between">
          <Icon className="h-5 w-5 text-white/90" aria-hidden="true" />
          {selected && (
            <span className="rounded-full bg-white/15 p-1 text-white">
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
          )}
        </div>
      </div>
      <div className="space-y-1 bg-card p-4">
        <p className="font-medium">{preset.label}</p>
        <p className="text-sm leading-5 text-muted-foreground">
          {preset.description}
        </p>
      </div>
    </button>
  );
}

export default function ThemeSettings() {
  const [preferences, setPreferences] = useState<ThemePreferences>(defaults);
  const [saved, setSaved] = useState(true);
  const [statusMessage, setStatusMessage] = useState(
    "Theme preferences are saved."
  );
  useEffect(() => {
    setPreferences(readPreferences());
  }, []);
  const changed = useMemo(
    () => JSON.stringify(preferences) !== JSON.stringify(readPreferences()),
    [preferences]
  );
  const update = <K extends keyof ThemePreferences>(
    key: K,
    value: ThemePreferences[K]
  ) => {
    setPreferences(current => ({ ...current, [key]: value }));
    setSaved(false);
    setStatusMessage("Unsaved theme preference changes.");
  };
  const savePreferences = () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    setSaved(true);
    setStatusMessage("Theme preferences saved on this device.");
    toast.success("Theme preferences saved", {
      description: "The selected preset is stored locally on this device.",
    });
  };
  const resetPreferences = () => {
    setPreferences(defaults);
    window.localStorage.removeItem(STORAGE_KEY);
    setSaved(true);
    setStatusMessage("Theme preferences reset to defaults.");
    toast.success("Theme preferences reset");
  };
  const activePreset =
    presets.find(preset => preset.value === preferences.preset) ?? presets[0];
  const previewPadding = preferences.compactPreview ? "p-3" : "p-5";
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
                  Theme settings
                </h1>
                <Badge variant="secondary" className="gap-1.5 font-normal">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />{" "}
                  Preferences
                </Badge>
              </div>
              <p className="max-w-2xl text-muted-foreground">
                Choose an appearance direction that makes SKYCOIN4444 easier and
                more comfortable to use.
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
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Palette
                    className="h-5 w-5 text-primary"
                    aria-hidden="true"
                  />
                  Appearance presets
                </CardTitle>
                <CardDescription>
                  Select a visual direction. The preview below is scoped to this
                  screen until a global theme integration is connected.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-3">
                {presets.map(preset => (
                  <PresetCard
                    key={preset.value}
                    preset={preset}
                    selected={preferences.preset === preset.value}
                    onSelect={() => update("preset", preset.value)}
                  />
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Eye className="h-5 w-5 text-primary" aria-hidden="true" />
                  Comfort controls
                </CardTitle>
                <CardDescription>
                  Make the preview calmer or more information-dense.
                </CardDescription>
              </CardHeader>
              <CardContent className="divide-y divide-border/70">
                <div className="flex items-start justify-between gap-5 py-4">
                  <div className="flex min-w-0 gap-3">
                    <div className="mt-0.5 rounded-lg border border-border/70 bg-muted/40 p-2 text-muted-foreground">
                      <Moon className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">
                        Reduce glare
                      </Label>
                      <p className="max-w-xl text-sm leading-5 text-muted-foreground">
                        Tone down bright accents in the preview for longer
                        focused sessions.
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.reducedGlare}
                    onCheckedChange={value => update("reducedGlare", value)}
                    aria-label="Reduce glare"
                  />
                </div>
                <div className="flex items-start justify-between gap-5 py-4">
                  <div className="flex min-w-0 gap-3">
                    <div className="mt-0.5 rounded-lg border border-border/70 bg-muted/40 p-2 text-muted-foreground">
                      <Circle className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">
                        Compact preview
                      </Label>
                      <p className="max-w-xl text-sm leading-5 text-muted-foreground">
                        Reduce spacing inside the preview card to compare denser
                        layouts.
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.compactPreview}
                    onCheckedChange={value => update("compactPreview", value)}
                    aria-label="Compact preview"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          <aside className="space-y-6">
            <Card
              className={`overflow-hidden bg-gradient-to-br ${activePreset.classes} text-white`}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="h-5 w-5" aria-hidden="true" />
                  Live preview
                </CardTitle>
                <CardDescription className="text-white/75">
                  {activePreset.label} ·{" "}
                  {preferences.reducedGlare
                    ? "Reduced glare"
                    : "Standard contrast"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`rounded-xl bg-black/25 ${previewPadding} transition-all`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Your workspace</p>
                      <p className="text-xs text-white/65">Preview only</p>
                    </div>
                    <div className="rounded-full bg-white/15 p-2">
                      <Check className="h-4 w-4" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="mt-4 h-2 rounded-full bg-white/20">
                    <div
                      className={`h-2 rounded-full ${preferences.reducedGlare ? "bg-white/65" : "bg-white"}`}
                      style={{ width: "68%" }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Current appearance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Preset</span>
                  <span className="font-medium">{activePreset.label}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Glare</span>
                  <span className="font-medium">
                    {preferences.reducedGlare ? "Reduced" : "Standard"}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Spacing</span>
                  <span className="font-medium">
                    {preferences.compactPreview ? "Compact" : "Comfortable"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
