import { useEffect, useMemo, useState } from "react";
import { Clipboard, RotateCcw, Type } from "lucide-react";
import { countText, transformText, type TextTransform } from "@/lib/betaFormUtilities";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const STORAGE_KEY = "skycoin4444-beta-text-tools-v1";

const transforms: Array<{ mode: TextTransform; label: string }> = [
  { mode: "uppercase", label: "UPPERCASE" },
  { mode: "lowercase", label: "lowercase" },
  { mode: "title-case", label: "Title Case" },
  { mode: "trim-lines", label: "Trim lines" },
  { mode: "sort-lines", label: "Sort lines" },
  { mode: "dedupe-lines", label: "Dedupe lines" },
];

export default function TextTools() {
  const [value, setValue] = useState(() => localStorage.getItem(STORAGE_KEY) ?? "");
  const counts = useMemo(() => countText(value), [value]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, value);
  }, [value]);

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <header>
          <Badge variant="outline">Browser-local text utility</Badge>
          <h1 className="mt-3 text-3xl font-bold">Text tools</h1>
          <p className="mt-2 text-muted-foreground">
            Count and transform plain text without uploading it to a server.
          </p>
        </header>

        <Card>
          <CardHeader>
            <Type className="h-5 w-5 text-primary" />
            <CardTitle className="mt-2">Editor</CardTitle>
            <CardDescription>
              {counts.characters} characters · {counts.charactersNoSpaces} non-space · {counts.words} words · {counts.lines} lines
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={value}
              onChange={event => setValue(event.target.value)}
              className="min-h-[360px]"
              placeholder="Paste or write text…"
            />
            <div className="flex flex-wrap gap-2">
              {transforms.map(item => (
                <Button
                  key={item.mode}
                  type="button"
                  variant="outline"
                  onClick={() => setValue(current => transformText(current, item.mode))}
                >
                  {item.label}
                </Button>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => navigator.clipboard.writeText(value)}
                disabled={!value}
              >
                <Clipboard className="mr-2 h-4 w-4" />
                Copy
              </Button>
              <Button type="button" variant="ghost" onClick={() => setValue("")}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground">
          Text is saved only to this browser&apos;s localStorage. No AI rewriting, translation provider, cloud sync, or server processing is performed.
        </p>
      </div>
    </main>
  );
}
