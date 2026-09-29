import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  defaultAccessibilityPreview,
  type AccessibilityPreview,
} from "@/lib/betaUtilities";
import {
  loadAccessibilityPreferences,
  resetAccessibilityPreferences,
  saveAccessibilityPreferences,
} from "@/lib/accessibilityPreferences";
import { Accessibility, RotateCcw } from "lucide-react";

export default function AccessibilitySettings() {
  const [settings, setSettings] = useState<AccessibilityPreview>(
    defaultAccessibilityPreview
  );

  useEffect(() => {
    try {
      setSettings(loadAccessibilityPreferences());
    } catch {
      setSettings(defaultAccessibilityPreview);
    }
  }, []);

  const update = (next: AccessibilityPreview) => {
    setSettings(saveAccessibilityPreferences(next));
  };

  const reset = () => {
    setSettings(resetAccessibilityPreferences());
  };

  const previewStyle = {
    fontSize: `${settings.textScale}%`,
    transition: settings.reducedMotion ? "none" : "all 180ms ease",
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-10">
        <header className="mb-8">
          <Badge variant="outline" className="mb-3">
            Engineering beta · browser-local app preference
          </Badge>
          <h1 className="flex items-center gap-3 text-4xl font-black">
            <Accessibility className="h-8 w-8 text-primary" />
            Accessibility Settings Lab
          </h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            Apply text scaling, stronger design-token contrast, reduced motion,
            and underlined links across the routed beta on this browser. These
            controls do not certify WCAG conformance across the full historical
            screen inventory.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>
                Stored only in this browser and applied across the routed beta.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <p className="mb-2 text-sm font-medium">Text scale</p>
                <div className="grid grid-cols-4 gap-2">
                  {[100, 110, 125, 150].map(value => (
                    <Button
                      key={value}
                      type="button"
                      size="sm"
                      variant={settings.textScale === value ? "default" : "outline"}
                      onClick={() =>
                        update({
                          ...settings,
                          textScale: value as AccessibilityPreview["textScale"],
                        })
                      }
                    >
                      {value}%
                    </Button>
                  ))}
                </div>
              </div>

              {[
                ["highContrast", "Higher contrast"],
                ["reducedMotion", "Reduced motion"],
                ["underlineLinks", "Underline links"],
              ].map(([key, label]) => {
                const typedKey = key as keyof Pick<
                  AccessibilityPreview,
                  "highContrast" | "reducedMotion" | "underlineLinks"
                >;
                return (
                  <label
                    key={key}
                    className="flex items-center justify-between gap-4 rounded-xl border p-3"
                  >
                    <span className="text-sm font-medium">{label}</span>
                    <input
                      type="checkbox"
                      checked={settings[typedKey]}
                      onChange={event =>
                        update({ ...settings, [typedKey]: event.target.checked })
                      }
                      className="h-5 w-5"
                    />
                  </label>
                );
              })}

              <Button type="button" variant="ghost" onClick={reset}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset preferences
              </Button>
            </CardContent>
          </Card>

          <Card
            className={
              settings.highContrast
                ? "border-white bg-black text-white"
                : undefined
            }
          >
            <CardHeader style={previewStyle}>
              <CardTitle>Preview surface</CardTitle>
              <CardDescription
                className={settings.highContrast ? "text-white/80" : undefined}
              >
                This sample reflects the same browser-local preferences now
                applied by the shared app runtime.
              </CardDescription>
            </CardHeader>
            <CardContent style={previewStyle} className="space-y-5">
              <p>
                SKYCOIN4444 is being promoted route by route. Accessibility
                settings need evidence just like any other beta capability.
              </p>
              <a
                href="#preview-detail"
                className={
                  "font-semibold text-primary " +
                  (settings.underlineLinks ? "underline" : "")
                }
              >
                Example focusable link
              </a>
              <div
                id="preview-detail"
                className="rounded-xl border p-4"
                style={{
                  transform: settings.reducedMotion ? "none" : "translateY(0)",
                  transition: settings.reducedMotion
                    ? "none"
                    : "transform 180ms ease",
                }}
              >
                <strong>Browser-local, app-wide preference</strong>
                <p
                  className={
                    "mt-2 text-sm " +
                    (settings.highContrast
                      ? "text-white/80"
                      : "text-muted-foreground")
                  }
                >
                  These preferences are applied across the routed beta in this
                  browser. They remain convenience settings, not an accessibility
                  certification or a cross-device account preference.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
