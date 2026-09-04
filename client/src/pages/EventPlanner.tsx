import { useCallback, useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Move,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  Users,
} from "lucide-react";
import {
  nextFloorTablePosition,
  normalizeFloorTables,
  type FloorTable,
} from "@/lib/betaUtilities";

const STORAGE_KEY = "sky4444.eventplanner-layout";
const COLORS = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-purple-500",
  "bg-cyan-500",
] as const;

const initialTables: FloorTable[] = [
  {
    id: "t1",
    x: 100,
    y: 90,
    label: "Table 1",
    seats: 8,
    color: "bg-blue-500",
  },
  {
    id: "t2",
    x: 280,
    y: 90,
    label: "Table 2",
    seats: 6,
    color: "bg-emerald-500",
  },
  {
    id: "t3",
    x: 190,
    y: 220,
    label: "VIP Table",
    seats: 10,
    color: "bg-amber-500",
  },
];

export default function EventPlanner() {
  const [tables, setTables] = useState<FloorTable[]>(initialTables);
  const [dragging, setDragging] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [saved, setSaved] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const restored = normalizeFloorTables(
        JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]")
      );
      if (restored.length > 0) setTables(restored);
    } catch {
      setTables(initialTables);
    }
  }, []);

  const addTable = () => {
    setTables(current => {
      if (current.length >= 40) return current;
      const position = nextFloorTablePosition(current.length);
      return [
        ...current,
        {
          id: `table-${current.length + 1}`,
          ...position,
          label: `Table ${current.length + 1}`,
          seats: 6,
          color: COLORS[current.length % COLORS.length],
        },
      ];
    });
  };

  const onMouseDown = (event: React.MouseEvent, id: string) => {
    event.preventDefault();
    const table = tables.find(item => item.id === id);
    const bounds = canvasRef.current?.getBoundingClientRect();
    if (!table || !bounds) return;
    setDragging(id);
    setOffset({
      x: event.clientX - bounds.left - table.x,
      y: event.clientY - bounds.top - table.y,
    });
  };

  const onMouseMove = useCallback(
    (event: React.MouseEvent) => {
      if (!dragging || !canvasRef.current) return;
      const bounds = canvasRef.current.getBoundingClientRect();
      const x = Math.max(
        0,
        Math.min(bounds.width - 110, event.clientX - bounds.left - offset.x)
      );
      const y = Math.max(
        65,
        Math.min(bounds.height - 80, event.clientY - bounds.top - offset.y)
      );
      setTables(current =>
        current.map(table =>
          table.id === dragging
            ? { ...table, x: Math.round(x), y: Math.round(y) }
            : table
        )
      );
    },
    [dragging, offset]
  );

  const saveLayout = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tables));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1200);
  };

  const resetLayout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setTables(initialTables);
    setSaved(false);
  };

  const totalSeats = tables.reduce((sum, table) => sum + table.seats, 0);

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <header className="mb-8 flex flex-col gap-5 border-b border-slate-800 pb-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge
              variant="outline"
              className="mb-3 border-violet-400/30 text-violet-200"
            >
              Launchable beta · browser-local layout
            </Badge>
            <h1 className="flex items-center gap-3 text-4xl font-black">
              <Calendar className="h-8 w-8 text-violet-300" />
              Event Floor Planner
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
              Drag tables, change capacity, add or remove seating, and save the
              layout locally. There is no real-time sync, venue booking, guest
              invitation, or external map service.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={resetLayout}
              className="border-slate-700 bg-transparent text-slate-200"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button onClick={addTable} className="bg-violet-600 hover:bg-violet-500">
              <Plus className="mr-2 h-4 w-4" />
              Add table
            </Button>
            <Button onClick={saveLayout} className="bg-slate-700 hover:bg-slate-600">
              <Save className="mr-2 h-4 w-4" />
              {saved ? "Saved locally" : "Save layout"}
            </Button>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
          <aside className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
                <Move className="h-4 w-4 text-violet-300" />
                <div className="mt-2 text-2xl font-black">{tables.length}</div>
                <div className="text-xs text-slate-500">Tables</div>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
                <Users className="h-4 w-4 text-sky-300" />
                <div className="mt-2 text-2xl font-black">{totalSeats}</div>
                <div className="text-xs text-slate-500">Seats</div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
              <h2 className="text-sm font-bold">Table controls</h2>
              <div className="mt-3 space-y-3">
                {tables.map(table => (
                  <div
                    key={table.id}
                    className="rounded-xl border border-slate-800 bg-black/20 p-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${table.color}`} />
                      <input
                        aria-label={`${table.label} name`}
                        value={table.label}
                        maxLength={40}
                        onChange={event =>
                          setTables(current =>
                            current.map(item =>
                              item.id === table.id
                                ? { ...item, label: event.target.value }
                                : item
                            )
                          )
                        }
                        className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none"
                      />
                      <button
                        type="button"
                        aria-label={`Delete ${table.label}`}
                        onClick={() =>
                          setTables(current =>
                            current.filter(item => item.id !== table.id)
                          )
                        }
                        className="text-slate-600 hover:text-rose-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <label className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-400">
                      Seats
                      <input
                        type="number"
                        min={1}
                        max={20}
                        value={table.seats}
                        onChange={event => {
                          const seats = Math.max(
                            1,
                            Math.min(20, Number(event.target.value) || 1)
                          );
                          setTables(current =>
                            current.map(item =>
                              item.id === table.id ? { ...item, seats } : item
                            )
                          );
                        }}
                        className="w-16 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-right text-slate-200"
                      />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <section>
            <div
              ref={canvasRef}
              onMouseMove={onMouseMove}
              onMouseUp={() => setDragging(null)}
              onMouseLeave={() => setDragging(null)}
              className="relative min-h-[540px] overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/45 select-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(100,116,139,.45) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            >
              <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-xl border border-slate-700 bg-slate-800/80 px-16 py-3 text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
                Stage
              </div>

              {tables.map(table => (
                <button
                  type="button"
                  key={table.id}
                  onMouseDown={event => onMouseDown(event, table.id)}
                  className={
                    "absolute min-w-[104px] cursor-grab rounded-2xl border border-white/10 bg-slate-950/90 p-3 text-center shadow-xl active:cursor-grabbing " +
                    (dragging === table.id ? "ring-2 ring-violet-400" : "")
                  }
                  style={{ left: table.x, top: table.y }}
                >
                  <span
                    className={`mx-auto mb-2 block h-2.5 w-2.5 rounded-full ${table.color}`}
                  />
                  <strong className="block max-w-[120px] truncate text-xs">
                    {table.label || "Untitled"}
                  </strong>
                  <span className="mt-1 block text-[11px] text-slate-500">
                    {table.seats} seats
                  </span>
                </button>
              ))}

              {tables.length === 0 && (
                <div className="absolute inset-0 grid place-items-center text-sm text-slate-500">
                  Add a table to start planning.
                </div>
              )}

              <div className="absolute bottom-3 right-4 text-[11px] text-slate-600">
                Local browser workspace · drag tables to arrange
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
