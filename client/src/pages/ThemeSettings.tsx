import { useState } from "react";
import { Moon, Palette, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ThemeSettings() {
  const { theme, toggleTheme, switchable } = useTheme();
  const [density, setDensity] = useState<"comfortable" | "compact">(
    () =>
      (localStorage.getItem("skycoin4444-beta-density") as
        | "comfortable"
        | "compact") ?? "comfortable"
  );

  const setNextDensity = (value: "comfortable" | "compact") => {
    setDensity(value);
    localStorage.setItem("skycoin4444-beta-density", value);
  };

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <header>
          <Badge variant="outline">Local appearance settings</Badge>
          <h1 className="mt-3 text-3xl font-bold">Theme settings</h1>
          <p className="mt-2 text-muted-foreground">
            Switch the application light/dark theme and preview a local density
            preference.
          </p>
        </header>

        <Card>
          <CardHeader>
            <Palette className="h-5 w-5 text-primary" />
            <CardTitle className="mt-2">Color mode</CardTitle>
            <CardDescription>
              The application ThemeProvider persists this choice to localStorage.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {theme === "dark" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
              <div>
                <p className="font-medium capitalize">{theme} mode</p>
                <p className="text-xs text-muted-foreground">
                  {switchable ? "Theme switching enabled" : "Theme locked"}
                </p>
              </div>
            </div>
            <Button
              type="button"
              onClick={() => toggleTheme?.()}
              disabled={!switchable || !toggleTheme}
            >
              Switch theme
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Density preview</CardTitle>
            <CardDescription>
              Density is a page-local beta preference and does not yet restyle
              every historical screen.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              {(["comfortable", "compact"] as const).map(value => (
                <Button
                  key={value}
                  type="button"
                  variant={density === value ? "default" : "outline"}
                  onClick={() => setNextDensity(value)}
                >
                  {value}
                </Button>
              ))}
            </div>
            <div
              className={
                "rounded-2xl border " +
                (density === "compact" ? "space-y-2 p-3" : "space-y-4 p-6")
              }
            >
              <div className="rounded-lg border bg-card p-3">
                <p className="font-medium">Preview item</p>
                <p className="text-sm text-muted-foreground">
                  Current density: {density}
                </p>
              </div>
              <div className="rounded-lg border bg-card p-3">
                <p className="font-medium">Second item</p>
                <p className="text-sm text-muted-foreground">
                  Stored only in this browser.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground">
          No account-level theme sync or cross-device preference service is
          claimed.
        </p>
      </div>
    </main>
  );
}
