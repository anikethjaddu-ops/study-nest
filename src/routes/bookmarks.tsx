import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark, Highlighter } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { relativeTime } from "@/lib/format";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/bookmarks")({
  head: () => ({
    meta: [
      { title: "Bookmarks & highlights — DocNest" },
      {
        name: "description",
        content:
          "Every bookmark and highlight across your library in one place. Jump straight back to the page that mattered.",
      },
      { property: "og:title", content: "Bookmarks & highlights — DocNest" },
      {
        property: "og:description",
        content: "All your saved pages and highlighted passages, collected.",
      },
    ],
  }),
  component: BookmarksPage,
});

const HL_COLORS: Record<string, string> = {
  yellow: "oklch(0.85 0.15 95)",
  green: "oklch(0.8 0.15 150)",
  pink: "oklch(0.8 0.15 350)",
  blue: "oklch(0.8 0.12 240)",
};

function BookmarksPage() {
  const { bookmarks, highlights, docs } = useStore();
  const titleOf = (id: string) => docs.find((d) => d.id === id)?.title ?? "Removed document";

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-8">
        <PageHeader
          title="Bookmarks"
          subtitle={`${bookmarks.length} saved pages · ${highlights.length} highlights`}
        />

        <div className="mb-10 flex flex-col gap-2.5">
          {bookmarks.map((b) => (
            <Link
              key={b.id}
              to="/reader/$id"
              params={{ id: b.documentId }}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-surface"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary">
                <Bookmark className="size-4.5 fill-current text-primary" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{b.label}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {titleOf(b.documentId)} · page {b.page}
                </p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">
                {relativeTime(b.createdAt)}
              </span>
            </Link>
          ))}
          {bookmarks.length === 0 && (
            <p className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              No bookmarks yet — tap the bookmark icon while reading.
            </p>
          )}
        </div>

        <h2 className="mb-3 font-display text-xl font-semibold">Highlights</h2>
        <div className="flex flex-col gap-2.5">
          {highlights.map((h) => (
            <div key={h.id} className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Highlighter className="size-3.5" style={{ color: HL_COLORS[h.color] }} />
                {titleOf(h.documentId)} · pg. {h.page}
              </div>
              <p className="mt-2 text-sm leading-relaxed">
                <span
                  className="rounded px-1 py-0.5 text-background"
                  style={{ backgroundColor: HL_COLORS[h.color] }}
                >
                  {h.text}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
