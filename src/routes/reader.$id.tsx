import { createFileRoute, Link, notFound, useParams } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Info,
  Minus,
  Plus,
  Search,
  Send,
  StickyNote,
  X,
} from "lucide-react";
import { noteStamp, renderMarkdown, formatMinutes } from "@/lib/format";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export const Route = createFileRoute("/reader/$id")({
  head: () => ({
    meta: [
      { title: "Reader — DocNest" },
      {
        name: "description",
        content:
          "Distraction-free reading with resume, highlights, bookmarks and a floating notes bubble that captures the page you're on.",
      },
      { property: "og:title", content: "Reader — DocNest" },
      {
        property: "og:description",
        content: "Read, highlight and note without leaving the page.",
      },
    ],
  }),
  component: ReaderPage,
});

type ReadTheme = "light" | "dark" | "sepia";

const READ_THEMES: Record<ReadTheme, { bg: string; fg: string }> = {
  light: { bg: "oklch(0.99 0.002 90)", fg: "oklch(0.25 0.02 275)" },
  sepia: { bg: "oklch(0.93 0.03 85)", fg: "oklch(0.3 0.04 60)" },
  dark: { bg: "oklch(0.14 0.02 285)", fg: "oklch(0.88 0.01 260)" },
};

function ReaderPage() {
  const { id } = useParams({ from: "/reader/$id" });
  const store = useStore();
  const doc = store.docs.find((d) => d.id === id);
  const [page, setPage] = useState(doc?.lastPage ?? 1);
  const [notesOpen, setNotesOpen] = useState(false);
  const [metaOpen, setMetaOpen] = useState(false);
  const [readTheme, setReadTheme] = useState<ReadTheme>("dark");
  const [fontSize, setFontSize] = useState(18);
  const [draft, setDraft] = useState("");
  const seconds = useRef(0);

  useEffect(() => {
    if (!doc) return;
    const t = setInterval(() => {
      seconds.current += 10;
    }, 10000);
    return () => {
      clearInterval(t);
      if (seconds.current) store.addReadSeconds(doc.id, seconds.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc?.id]);

  useEffect(() => {
    if (doc) store.setLastPage(doc.id, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  if (!doc) {
    throw notFound();
  }

  const notes = store.notes
    .filter((n) => n.documentId === doc.id)
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  const bookmarked = store.bookmarks.some((b) => b.documentId === doc.id && b.page === page);
  const t = READ_THEMES[readTheme];

  const submit = () => {
    if (!draft.trim()) return;
    store.addNote(doc.id, page, draft.trim());
    setDraft("");
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: t.bg, color: t.fg }}>
      <header className="sticky top-0 z-20 border-b border-border/40 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-3">
          <Link
            to="/"
            className="grid size-9 place-items-center rounded-xl transition-colors hover:bg-foreground/10"
            aria-label="Back"
          >
            <ArrowLeft className="size-4.5" />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{doc.title}</p>
            <p className="truncate text-[11px] opacity-60">
              {doc.author} · {doc.totalPages} pages
            </p>
          </div>
          <button
            onClick={() => store.toggleBookmark(doc.id, page)}
            className="grid size-9 place-items-center rounded-xl transition-colors hover:bg-foreground/10"
            aria-label="Bookmark page"
          >
            <Bookmark className={cn("size-4.5", bookmarked && "fill-current")} />
          </button>
          <button
            className="grid size-9 place-items-center rounded-xl transition-colors hover:bg-foreground/10"
            aria-label="Search in document"
          >
            <Search className="size-4.5" />
          </button>
          <button
            onClick={() => setMetaOpen(true)}
            className="grid size-9 place-items-center rounded-xl transition-colors hover:bg-foreground/10"
            aria-label="Document info"
          >
            <Info className="size-4.5" />
          </button>
        </div>

        <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-2 px-4 pb-3 text-xs">
          {(Object.keys(READ_THEMES) as ReadTheme[]).map((k) => (
            <button
              key={k}
              onClick={() => setReadTheme(k)}
              className={cn(
                "rounded-full border border-border/50 px-3 py-1 capitalize",
                readTheme === k && "border-transparent bg-brand text-primary-foreground",
              )}
            >
              {k}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-1">
            <button
              onClick={() => setFontSize((f) => Math.max(14, f - 1))}
              className="grid size-7 place-items-center rounded-full border border-border/50"
              aria-label="Decrease font size"
            >
              <Minus className="size-3" />
            </button>
            <span className="w-8 text-center tabular-nums">{fontSize}</span>
            <button
              onClick={() => setFontSize((f) => Math.min(26, f + 1))}
              className="grid size-7 place-items-center rounded-full border border-border/50"
              aria-label="Increase font size"
            >
              <Plus className="size-3" />
            </button>
          </div>
        </div>
      </header>

      <article
        className="mx-auto max-w-3xl px-6 py-10"
        style={{ fontSize, lineHeight: 1.75 }}
      >
        <h1 className="mb-6 font-display text-2xl font-semibold">
          Page {page} · {doc.title}
        </h1>
        {doc.excerpt.map((p, i) => (
          <p key={i} className="mb-5">
            {p}
          </p>
        ))}
        <p className="mb-5 opacity-80">
          This is a demo reader surface. In the shipped app this area renders the real PDF, EPUB or
          rich-text content, with selection-based highlighting in yellow, green, pink and blue.
        </p>
      </article>

      <div className="sticky bottom-0 z-20 border-t border-border/40 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="grid size-9 place-items-center rounded-xl hover:bg-foreground/10"
            aria-label="Previous page"
          >
            <ChevronLeft className="size-4.5" />
          </button>
          <div className="flex-1">
            <div className="h-1.5 overflow-hidden rounded-full bg-foreground/10">
              <div
                className="h-full rounded-full bg-brand"
                style={{ width: `${(page / doc.totalPages) * 100}%` }}
              />
            </div>
          </div>
          <span className="text-xs tabular-nums opacity-70">
            {page} / {doc.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(doc.totalPages, p + 1))}
            className="grid size-9 place-items-center rounded-xl hover:bg-foreground/10"
            aria-label="Next page"
          >
            <ChevronRight className="size-4.5" />
          </button>
        </div>
      </div>

      {/* Notes bubble */}
      <button
        onClick={() => setNotesOpen(true)}
        className="animate-bubble fixed bottom-20 right-5 z-30 grid size-14 place-items-center rounded-full bg-brand text-primary-foreground shadow-glow transition-transform hover:scale-105"
        aria-label="Open notes"
      >
        <StickyNote className="size-6" />
        {notes.length > 0 && (
          <span className="absolute -right-1 -top-1 grid size-6 place-items-center rounded-full bg-background text-[11px] font-semibold text-foreground">
            {notes.length}
          </span>
        )}
      </button>

      <Sheet open={notesOpen} onOpenChange={setNotesOpen}>
        <SheetContent
          side="bottom"
          className="h-[75vh] rounded-t-3xl border-border bg-background p-0 text-foreground"
        >
          <SheetHeader className="flex-row items-center justify-between border-b border-border px-5 py-4">
            <SheetTitle className="font-display text-lg">Notes · {doc.title}</SheetTitle>
            <Link
              to="/notes/$id"
              params={{ id: doc.id }}
              className="text-xs text-primary hover:underline"
            >
              Open full notes
            </Link>
          </SheetHeader>

          <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
            {notes.length === 0 && (
              <p className="py-10 text-center text-sm text-muted-foreground">
                No notes yet. Jot the first thought below.
              </p>
            )}
            {notes.map((n) => (
              <div key={n.id} className="group flex gap-3 rounded-2xl bg-surface p-3.5">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium text-muted-foreground">
                    {noteStamp(n.createdAt)} · pg. {n.page}
                  </p>
                  <p
                    className="mt-1 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(n.text) }}
                  />
                </div>
                <button
                  onClick={() => store.deleteNote(n.id)}
                  className="opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label="Delete note"
                >
                  <X className="size-4 text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>

          <div className="border-t border-border p-4">
            <div className="flex items-center gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                placeholder={`Note on page ${page}… supports **bold** and *italic*`}
                className="h-11 flex-1 rounded-xl border border-border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
              />
              <button
                onClick={submit}
                className="grid size-11 place-items-center rounded-xl bg-brand text-primary-foreground shadow-soft"
                aria-label="Add note"
              >
                <Send className="size-4.5" />
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={metaOpen} onOpenChange={setMetaOpen}>
        <SheetContent side="right" className="bg-background text-foreground">
          <SheetHeader>
            <SheetTitle className="font-display">Document details</SheetTitle>
          </SheetHeader>
          <dl className="space-y-3 px-4 text-sm">
            {[
              ["Title", doc.title],
              ["Author", doc.author],
              ["Format", doc.type.toUpperCase()],
              ["Size", `${doc.sizeMb} MB`],
              ["Pages", `${doc.lastPage} / ${doc.totalPages}`],
              ["Added", new Date(doc.dateAdded).toLocaleDateString()],
              ["Study time", formatMinutes(doc.readSeconds)],
              ["Notes", String(notes.length)],
              [
                "Bookmarks",
                String(store.bookmarks.filter((b) => b.documentId === doc.id).length),
              ],
              [
                "Highlights",
                String(store.highlights.filter((h) => h.documentId === doc.id).length),
              ],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 border-b border-border pb-2">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="text-right font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </SheetContent>
      </Sheet>
    </div>
  );
}
