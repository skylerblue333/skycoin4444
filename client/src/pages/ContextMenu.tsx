import { MousePointer2, Pin, RotateCcw } from "lucide-react";
import { useState } from "react";
import { clampMenuPosition } from "@/lib/betaFormUtilities";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Position = { x: number; y: number };

export default function ContextMenu() {
  const [menu, setMenu] = useState<Position | null>(null);
  const [pinned, setPinned] = useState(false);
  const [message, setMessage] = useState("Right-click the demo area.");

  return (
    <main
      className="min-h-screen bg-background p-4 md:p-8"
      onClick={() => setMenu(null)}
    >
      <div className="mx-auto max-w-3xl space-y-6">
        <header>
          <Badge variant="outline">Interaction component lab</Badge>
          <h1 className="mt-3 text-3xl font-bold">Context menu</h1>
          <p className="mt-2 text-muted-foreground">
            Test pointer positioning, dismissal, and keyboard-friendly equivalent actions.
          </p>
        </header>

        <Card>
          <CardHeader>
            <MousePointer2 className="h-5 w-5 text-primary" />
            <CardTitle className="mt-2">Demo target</CardTitle>
            <CardDescription>{message}</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={
                "grid min-h-[280px] place-items-center rounded-2xl border border-dashed p-6 text-center " +
                (pinned ? "bg-primary/5" : "bg-muted/20")
              }
              onContextMenu={event => {
                event.preventDefault();
                event.stopPropagation();
                setMenu(
                  clampMenuPosition(
                    event.clientX,
                    event.clientY,
                    window.innerWidth,
                    window.innerHeight
                  )
                );
              }}
            >
              <div>
                <p className="font-medium">Right-click inside this box</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  The custom menu is clamped to the viewport.
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={event => {
                  event.stopPropagation();
                  setPinned(value => !value);
                }}
              >
                <Pin className="mr-2 h-4 w-4" />
                {pinned ? "Unpin demo" : "Pin demo"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={event => {
                  event.stopPropagation();
                  setPinned(false);
                  setMessage("Demo reset.");
                }}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {menu && (
          <div
            role="menu"
            className="fixed z-50 w-[220px] rounded-xl border bg-popover p-2 text-popover-foreground shadow-xl"
            style={{ left: menu.x, top: menu.y }}
            onClick={event => event.stopPropagation()}
          >
            <Button
              role="menuitem"
              type="button"
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                setPinned(value => !value);
                setMessage("Context action applied.");
                setMenu(null);
              }}
            >
              {pinned ? "Unpin demo" : "Pin demo"}
            </Button>
            <Button
              role="menuitem"
              type="button"
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                setMessage("Local context action selected.");
                setMenu(null);
              }}
            >
              Select local action
            </Button>
            <Button
              role="menuitem"
              type="button"
              variant="ghost"
              className="w-full justify-start"
              onClick={() => setMenu(null)}
            >
              Dismiss
            </Button>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          This demo changes only local component state. It does not modify files, browser settings, account data, or operating-system context menus.
        </p>
      </div>
    </main>
  );
}
