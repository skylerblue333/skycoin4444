import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Palette,
  Pipette,
  RotateCcw,
  Save,
  Sparkles,
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
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const STORAGE_KEY = "skycoin.color-picker-preview";
const defaults = { color: "#2563EB", label: "Sky blue" };
const presets = [
  { color: "#2563EB", label: "Sky blue" },
  { color: "#7C3AED", label: "Orbit violet" },
  { color: "#059669", label: "Signal green" },
  { color: "#EA580C", label: "Solar orange" },
];
function readColor() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaults;
    const parsed: unknown = JSON.parse(stored);
    if (!parsed || typeof parsed !== "object") return defaults;
    const value = parsed as Partial<typeof defaults>;
    return typeof value.color === "string" &&
      /^#[0-9A-Fa-f]{6}$/.test(value.color) &&
      typeof value.label === "string"
      ? { color: value.color, label: value.label }
      : defaults;
  } catch {
    return defaults;
  }
}

export default function ColorPickerDialog() {
  const [selection, setSelection] = useState(defaults);
  const [saved, setSaved] = useState(true);
  const [statusMessage, setStatusMessage] = useState(
    "Palette preview is saved."
  );
  useEffect(() => {
    setSelection(readColor());
  }, []);
  const changed = useMemo(
    () => JSON.stringify(selection) !== JSON.stringify(readColor()),
    [selection]
  );
  const update = (color: string, label: string) => {
    setSelection({ color, label });
    setSaved(false);
    setStatusMessage("Unsaved palette preview changes.");
  };
  const save = () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selection));
    setSaved(true);
    setStatusMessage("Palette preview saved on this device.");
    toast.success("Palette preview saved", {
      description: "No global theme was changed.",
    });
  };
  const reset = () => {
    setSelection(defaults);
    window.localStorage.removeItem(STORAGE_KEY);
    setSaved(true);
    setStatusMessage("Palette preview reset to defaults.");
    toast.success("Palette preview reset");
  };
  const hexValue = selection.color.toUpperCase();

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="mx-auto max-w-4xl space-y-8 p-4 sm:p-6 lg:p-10">
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
                  Color picker
                </h1>
                <Badge variant="secondary" className="gap-1.5 font-normal">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" /> Local
                  preview
                </Badge>
              </div>
              <p className="max-w-2xl text-muted-foreground">
                Try a palette accent in a scoped preview without changing the
                global SKYCOIN4444 theme.
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
            <Pipette
              className="mt-0.5 h-4 w-4 shrink-0 text-sky-500"
              aria-hidden="true"
            />
            <p className="leading-5 text-foreground/75">
              <strong className="font-medium text-foreground">
                Scoped preview only.
              </strong>{" "}
              The selected color is stored locally and affects the sample card
              below. No app-wide theme, user content, or production branding is
              changed.
            </p>
          </CardContent>
        </Card>
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <Card>
            <CardHeader>
              <CardTitle>Choose an accent</CardTitle>
              <CardDescription>
                Use a preset or enter a six-digit hex value.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-3 sm:grid-cols-2">
                {presets.map(preset => (
                  <button
                    type="button"
                    key={preset.color}
                    onClick={() => update(preset.color, preset.label)}
                    className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-colors ${selection.color.toLowerCase() === preset.color.toLowerCase() ? "border-primary bg-primary/5" : "border-border hover:bg-muted"}`}
                    aria-pressed={
                      selection.color.toLowerCase() ===
                      preset.color.toLowerCase()
                    }
                  >
                    <span
                      className="h-7 w-7 rounded-full border border-white/30 shadow-sm"
                      style={{ backgroundColor: preset.color }}
                      aria-hidden="true"
                    />
                    <span className="text-sm font-medium">{preset.label}</span>
                    {selection.color.toLowerCase() ===
                      preset.color.toLowerCase() && (
                      <Check
                        className="ml-auto h-4 w-4 text-primary"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                ))}
              </div>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-[auto_1fr]">
                <div className="space-y-2">
                  <Label htmlFor="color-input">Custom color</Label>
                  <input
                    id="color-input"
                    type="color"
                    value={selection.color}
                    onChange={event =>
                      update(event.target.value, "Custom accent")
                    }
                    className="block h-10 w-16 cursor-pointer rounded-md border border-input bg-background p-1"
                    aria-label="Choose custom accent color"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hex-input">Hex value</Label>
                  <Input
                    id="hex-input"
                    value={hexValue}
                    onChange={event => {
                      const value = event.target.value.trim().toUpperCase();
                      if (/^#[0-9A-F]{6}$/.test(value))
                        update(value, "Custom accent");
                    }}
                    aria-describedby="hex-help"
                  />
                  <p id="hex-help" className="text-xs text-muted-foreground">
                    Example: #2563EB
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <aside className="space-y-6">
            <Card className="overflow-hidden">
              <div
                className="p-6 text-white"
                style={{ backgroundColor: selection.color }}
              >
                <div className="flex items-start justify-between">
                  <div className="rounded-xl bg-white/15 p-3">
                    <Sparkles className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <Badge className="border-white/20 bg-white/15 text-white">
                    Preview
                  </Badge>
                </div>
                <p className="mt-12 text-sm text-white/75">{selection.label}</p>
                <h2 className="mt-1 text-2xl font-semibold">SKYCOIN4444</h2>
                <p className="mt-2 text-sm leading-5 text-white/80">
                  A local palette preview with accessible contrast intent.
                </p>
              </div>
              <CardContent className="space-y-3 p-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Selected hex</span>
                  <code className="rounded bg-muted px-2 py-1 font-mono text-xs">
                    {hexValue}
                  </code>
                </div>
                <div
                  className="h-2 rounded-full"
                  style={{ backgroundColor: selection.color }}
                  aria-label={`Selected color ${hexValue}`}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  When global theming is connected
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Global theme changes should disclose scope, persist through a
                  verified preference service, and preserve readable contrast.
                </p>
                <Separator />
                <p>This preview intentionally changes only this screen.</p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
