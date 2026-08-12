import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { LayoutGrid, List, Search } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { DocCard, DocRow } from "@/components/doc-card";
import { TAGS } from "@/lib/demo-data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Library — DocNest" },
      {
        name: "description",
        content:
          "Every PDF, DOCX, TXT and EPUB in one library. Filter by type or tag, sort by progress, and switch between grid and list views.",
      },
      { property: "og:title", content: "Library — DocNest" },
      {
        property: "og:description",
        content: "Filter, sort and search your full document library.",
      },
    ],
  }),
  component: LibraryPage,
});

const TYPES = ["All", "pdf", "docx", "txt", "epub"] as const;
const SORTS = ["Last opened", "Name", "Date added", "Progress", "Size"] as const;

function LibraryPage() {
  const { docs } = useStore();
  const [type, setType] = useState<(typeof TYPES)[number]>("All");
  const [sort, setSort] = useState<(typeof SORTS)[number]>("Last opened");
  const [tag, setTag] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [grid, setGrid] = useState(true);

  const visible = useMemo(() => {
    let list = docs.filter(
      (d) =>
        (type === "All" || d.type === type) &&
        (!tag || d.tags.includes(tag)) &&
        (d.title + d.author).toLowerCase().includes(query.toLowerCase()),
    );
    const by: Record<string, (a: (typeof list)[number], b: (typeof list)[number]) => number> = {
      "Last opened": (a, b) => +new Date(b.lastOpenedAt) - +new Date(a.lastOpenedAt),
      Name: (a, b) => a.title.localeCompare(b.title),
      "Date added": (a, b) => +new Date(b.dateAdded) - +new Date(a.dateAdded),
      Progress: (a, b) => b.lastPage / b.totalPages - a.lastPage / a.totalPages,
      Size: (a, b) => b.sizeMb - a.sizeMb,
    };
    list = [...list].sort(by[sort]);
    return list;
  }, [docs, type, tag, query, sort]);

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        <PageHeader
          title="All documents"
          subtitle={`${visible.length} of ${docs.length} documents`}
          action={
            <div className="flex rounded-xl border border-border bg-card p-1">
              <button
                onClick={() => setGrid(true)}
                className={cn(
                  "grid size-8 place-items-center rounded-lg",
                  grid ? "bg-secondary text-foreground" : "text-muted-foreground",
                )}
                aria-label="Grid view"
              >
                <LayoutGrid className="size-4" />
              </button>
              <button
                onClick={() => setGrid(false)}
                className={cn(
                  "grid size-8 place-items-center rounded-lg",
                  !grid ? "bg-secondary text-foreground" : "text-muted-foreground",
                )}
                aria-label="List view"
              >
                <List className="size-4" />
              </button>
            </div>
          }
        />

        <div className="mb-5 flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search titles and authors…"
              className="h-11 w-full rounded-xl border border-border bg-card pl-9 pr-3 text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring/40"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                  type === t
                    ? "bg-brand text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-muted",
                )}
              >
                {t === "All" ? "All" : t.toUpperCase()}
              </button>
            ))}
            <span className="mx-1 h-5 w-px bg-border" />
            {TAGS.map((t) => (
              <button
                key={t.name}
                onClick={() => setTag(tag === t.name ? null : t.name)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                  tag === t.name
                    ? "bg-foreground text-background"
                    : "bg-secondary text-secondary-foreground hover:bg-muted",
                )}
              >
                <span className="size-1.5 rounded-full" style={{ backgroundColor: t.color }} />
                {t.name}
              </button>
            ))}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as (typeof SORTS)[number])}
              className="ml-auto h-9 rounded-xl border border-border bg-card px-3 text-xs outline-none"
            >
              {SORTS.map((s) => (
                <option key={s} value={s}>
                  Sort: {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {visible.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            No documents match those filters.
          </p>
        ) : grid ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((d) => (
              <DocCard key={d.id} doc={d} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {visible.map((d) => (
              <DocRow key={d.id} doc={d} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
