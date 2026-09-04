import { useEffect, useMemo, useState } from "react";
import { Check, Copy, Palette, Plus, Trash2 } from "lucide-react";
import { hexToRgb, normalizeHexColor } from "@/lib/betaProductivity";
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

const STORAGE_KEY = "skycoin4444-beta-color-palette-v1";

function loadPalette(): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed)
      ? parsed.filter(value => normalizeHexColor(String(value)))
      : [];
  } catch {
    return [];
  }
}

export default function ColorPickerDialog() {
  const [color, setColor] = useState("#7C3AED");
  const [hexInput, setHexInput] = useState("#7C3AED");
  const [palette, setPalette] = useState<string[]>(loadPalette);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(palette));
  }, [palette]);

  const rgb = useMemo(() => hexToRgb(color), [color]);
  const normalizedInput = normalizeHexColor(hexInput);

  const applyHex = () => {
    if (!normalizedInput) return;
    setColor(normalizedInput);
    setHexInput(normalizedInput);
  };

  const saveColor = () => {
    setPalette(current =>
      current.includes(color) ? current : [color, ...current].slice(0, 24)
    );
  };

  const copyColor = async () => {
    await navigator.clipboard.writeText(color);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <header>
          <Badge variant="outline">Browser-local beta utility</Badge>
          <h1 className="mt-3 text-3xl font-bold">Color picker</h1>
          <p className="mt-2 text-muted-foreground">
            Normalize hex colors, inspect RGB values, and save a local palette.
          </p>
        </header>

        <Card>
          <CardHeader>
            <Palette className="h-6 w-6 text-primary" />
            <CardTitle className="mt-2">Choose a color</CardTitle>
            <CardDescription>
              Three- and six-digit hex values are validated deterministically.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div
              className="h-36 rounded-2xl border"
              style={{ backgroundColor: color }}
              aria-label={"Color preview " + color}
            />
            <div className="grid gap-3 sm:grid-cols-[80px_1fr_auto]">
              <input
                type="color"
                value={color}
                onChange={event => {
                  const next = event.target.value.toUpperCase();
                  setColor(next);
                  setHexInput(next);
                }}
                className="h-10 w-full rounded border"
                aria-label="Native color picker"
              />
              <Input
                value={hexInput}
                onChange={event => setHexInput(event.target.value)}
                onBlur={applyHex}
                aria-label="Hex color"
              />
              <Button type="button" onClick={applyHex} disabled={!normalizedInput}>
                Apply
              </Button>
            </div>
            {!normalizedInput && (
              <p className="text-sm text-destructive">
                Enter a valid 3- or 6-digit hex color.
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary">{color}</Badge>
              <Badge variant="secondary">
                RGB {rgb?.r}, {rgb?.g}, {rgb?.b}
              </Badge>
              <Button type="button" variant="outline" onClick={copyColor}>
                {copied ? (
                  <Check className="mr-2 h-4 w-4" />
                ) : (
                  <Copy className="mr-2 h-4 w-4" />
                )}
                {copied ? "Copied" : "Copy hex"}
              </Button>
              <Button type="button" variant="outline" onClick={saveColor}>
                <Plus className="mr-2 h-4 w-4" />
                Save to palette
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Saved palette</CardTitle>
            <CardDescription>Up to 24 colors in localStorage.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {palette.length === 0 ? (
              <p className="col-span-full py-8 text-center text-sm text-muted-foreground">
                No saved colors yet.
              </p>
            ) : (
              palette.map(saved => (
                <button
                  key={saved}
                  type="button"
                  onClick={() => {
                    setColor(saved);
                    setHexInput(saved);
                  }}
                  className="rounded-xl border p-2 text-left"
                >
                  <div
                    className="h-14 rounded-lg border"
                    style={{ backgroundColor: saved }}
                  />
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="text-xs font-medium">{saved}</span>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={event => {
                        event.stopPropagation();
                        setPalette(current =>
                          current.filter(value => value !== saved)
                        );
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </button>
              ))
            )}
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground">
          No cloud palette sync, design-system publishing, or external color API
          is used.
        </p>
      </div>
    </main>
  );
}
