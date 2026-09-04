import { useMemo, useState } from "react";
import { Braces, Clipboard, WandSparkles } from "lucide-react";
import { formatCode } from "@/lib/betaFormUtilities";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type Mode = "json-pretty" | "json-minify" | "normalize-whitespace";
const SAMPLE = '{"beta":true,"routes":43,"boundary":"local formatter"}';

export default function CodeFormatter() {
  const [source, setSource] = useState(SAMPLE);
  const [mode, setMode] = useState<Mode>("json-pretty");
  const [result, setResult] = useState(() => formatCode(SAMPLE, "json-pretty"));
  const [error, setError] = useState("");

  const description = useMemo(
    () =>
      mode === "normalize-whitespace"
        ? "Trims trailing whitespace and collapses repeated blank lines."
        : "Parses valid JSON before formatting, so malformed input is rejected.",
    [mode]
  );

  const apply = () => {
    try {
      setResult(formatCode(source, mode));
      setError("");
    } catch (cause) {
      setResult("");
      setError(cause instanceof Error ? cause.message : "Formatting failed");
    }
  };

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header>
          <Badge variant="outline">Browser-local developer utility</Badge>
          <h1 className="mt-3 text-3xl font-bold">Code formatter</h1>
          <p className="mt-2 text-muted-foreground">
            Pretty-print or minify valid JSON, or normalize plain-text whitespace.
          </p>
        </header>

        <div className="grid gap-5 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <Braces className="h-5 w-5 text-primary" />
              <CardTitle className="mt-2">Input</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <select
                value={mode}
                onChange={event => setMode(event.target.value as Mode)}
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              >
                <option value="json-pretty">JSON pretty</option>
                <option value="json-minify">JSON minify</option>
                <option value="normalize-whitespace">Normalize whitespace</option>
              </select>
              <Textarea
                value={source}
                onChange={event => setSource(event.target.value)}
                className="min-h-[360px] font-mono"
              />
              <Button type="button" onClick={apply}>
                <WandSparkles className="mr-2 h-4 w-4" />
                Format
              </Button>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Output</CardTitle>
              <CardDescription>No code is executed by this formatter.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={result}
                readOnly
                className="min-h-[360px] font-mono"
                aria-label="Formatted output"
              />
              <Button
                type="button"
                variant="outline"
                disabled={!result}
                onClick={() => navigator.clipboard.writeText(result)}
              >
                <Clipboard className="mr-2 h-4 w-4" />
                Copy output
              </Button>
            </CardContent>
          </Card>
        </div>

        <p className="text-xs text-muted-foreground">
          This is not a JavaScript/TypeScript compiler, linter, sandbox, or Prettier replacement. It does not upload code to a server.
        </p>
      </div>
    </main>
  );
}
