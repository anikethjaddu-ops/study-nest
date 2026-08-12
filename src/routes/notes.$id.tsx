import { createFileRoute, Link, notFound, useParams } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Download, Search, Share2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { dayLabel, noteStamp, renderMarkdown } from "@/lib/format";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/notes/$id")({
  head: () => ({
    meta: [
      { title: "Document notes — DocNest" },
      {
        name: "description",
        content:
          "Every note you wrote for this document, grouped by reading session and rendered as clean markdown.",
      },
      { property: "og:title", content: "Document notes — DocNest" },
      {
        property: "og:description",
        content: "Session-grouped markdown notes for the document you're reading.",
      },
    ],
  }),
  component: NotesPage,
});

function NotesPage() {
  const { id } = useParams({ from: "/notes/$id" });
  const { docs, notes } = useStore();
  const doc = docs.find((d) => d.id === id);
  const [query, setQuery] = useState("");

  const sessions = useMemo(() => {
    const list = notes
      .filter((n) => n.documentId === id)
      .filter((n) => n.text.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    const groups = new Map<string, typeof list>();
    for (const n of list) {
      const key = dayLabel(n.createdAt);
      groups.set(key, [...(groups.get(key) ?? []), n]);
    }
    return [...groups.entries()];
  }, [notes, id, query]);

  if (!doc) throw notFound();

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-4 py-8 md:px-8">
        <Link
          to="/reader/$id"
          params={{ id: doc.id }}
          className="mb-5 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back to reader
        </Link>

        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Notes file</p>
            <h1 className="font-display text-3xl font-semibold">{doc.title}</h1>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              notes/{doc.id}_notes.md
            </p>
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium hover:bg-surface">
              <Download className="size-3.5" /> Export .md
            </button>
            <button className="inline-flex items-center gap-2 rounded-xl bg-brand px-3 py-2 text-xs font-medium text-primary-foreground shadow-soft">
              <Share2 className="size-3.5" /> Share
            </button>
          </div>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search within notes…"
            className="h-11 w-full rounded-xl border border-border bg-card pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
          />
        </div>

        {sessions.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            No notes here yet.
          </p>
        ) : (
          <div className="space-y-6">
            {sessions.map(([day, items]) => (
              <section key={day} className="rounded-2xl border border-border bg-card p-5">
                <h2 className="mb-4 font-display text-lg font-semibold">Session: {day}</h2>
                <ul className="space-y-3">
                  {items.map((n) => (
                    <li key={n.id} className="flex gap-3">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                      <div>
                        <span className="mr-2 rounded-md bg-secondary px-1.5 py-0.5 text-[11px] font-semibold text-secondary-foreground">
                          {noteStamp(n.createdAt)} · pg. {n.page}
                        </span>
                        <span
                          className="text-sm leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: renderMarkdown(n.text) }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
