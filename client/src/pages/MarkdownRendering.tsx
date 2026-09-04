import { useEffect, useMemo, useState } from "react";
import { Code2, FileText } from "lucide-react";
import { parseMarkdownBlocks } from "@/lib/betaProductivity";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const STORAGE_KEY = "skycoin4444-beta-markdown-v1";
const DEFAULT_MARKDOWN = `# Markdown preview

Write **plain markdown source** on the left.

- Headings
- Lists
- Quotes

> The beta preview does not execute embedded HTML or scripts.

\`\`\`ts
const safe = true;
\`\`\`
`;

export default function MarkdownRendering() {
  const [source, setSource] = useState(
    () => localStorage.getItem(STORAGE_KEY) ?? DEFAULT_MARKDOWN
  );
  const blocks = useMemo(() => parseMarkdownBlocks(source), [source]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, source);
  }, [source]);

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header>
          <Badge variant="outline">Safe local preview</Badge>
          <h1 className="mt-3 text-3xl font-bold">Markdown rendering</h1>
          <p className="mt-2 text-muted-foreground">
            Preview a bounded markdown subset without injecting raw HTML.
          </p>
        </header>

        <div className="grid gap-5 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle className="mt-2">Source</CardTitle>
              <CardDescription>
                Saved only in this browser.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={source}
                onChange={event => setSource(event.target.value)}
                className="min-h-[480px] font-mono"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Code2 className="h-5 w-5 text-primary" />
              <CardTitle className="mt-2">Preview</CardTitle>
              <CardDescription>
                Headings, lists, quotes, code fences, and paragraphs.
              </CardDescription>
            </CardHeader>
            <CardContent className="min-h-[480px] space-y-3">
              {blocks.map((block, index) => {
                if (block.type === "heading") {
                  const className =
                    block.level === 1
                      ? "text-3xl font-bold"
                      : block.level === 2
                        ? "text-2xl font-semibold"
                        : "text-xl font-semibold";
                  return (
                    <div key={index} className={className}>
                      {block.text}
                    </div>
                  );
                }
                if (block.type === "list") {
                  return (
                    <div key={index} className="flex gap-2">
                      <span>•</span>
                      <span>{block.text}</span>
                    </div>
                  );
                }
                if (block.type === "quote") {
                  return (
                    <blockquote
                      key={index}
                      className="border-l-4 pl-4 italic text-muted-foreground"
                    >
                      {block.text}
                    </blockquote>
                  );
                }
                if (block.type === "code") {
                  return (
                    <pre
                      key={index}
                      className="overflow-x-auto rounded-xl bg-muted p-4 text-sm"
                    >
                      <code>{block.text}</code>
                    </pre>
                  );
                }
                return <p key={index}>{block.text}</p>;
              })}
            </CardContent>
          </Card>
        </div>

        <p className="text-xs text-muted-foreground">
          Inline formatting syntax is preserved as text in this bounded preview;
          raw HTML and JavaScript are never executed.
        </p>
      </div>
    </main>
  );
}
