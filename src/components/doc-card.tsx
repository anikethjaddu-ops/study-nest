import { Link } from "@tanstack/react-router";
import { FileText, MoreVertical, Pin, PinOff, StickyNote, Trash2 } from "lucide-react";
import type { Doc } from "@/lib/demo-data";
import { TAGS } from "@/lib/demo-data";
import { formatMinutes, relativeTime } from "@/lib/format";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function TypeBadge({ type }: { type: Doc["type"] }) {
  return (
    <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-secondary-foreground">
      {type}
    </span>
  );
}

export function TagDot({ name }: { name: string }) {
  const tag = TAGS.find((t) => t.name === name);
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[11px] text-secondary-foreground">
      <span className="size-1.5 rounded-full" style={{ backgroundColor: tag?.color }} />
      {name}
    </span>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <div className="h-full rounded-full bg-brand" style={{ width: `${value}%` }} />
    </div>
  );
}

function DocMenu({ doc }: { doc: Doc }) {
  const { togglePin, removeDoc } = useStore();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        onClick={(e) => e.preventDefault()}
        className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <MoreVertical className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => togglePin(doc.id)}>
          {doc.pinned ? <PinOff className="size-4" /> : <Pin className="size-4" />}
          {doc.pinned ? "Unpin" : "Pin to home"}
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/notes/$id" params={{ id: doc.id }}>
            <StickyNote className="size-4" /> View notes
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onSelect={() => removeDoc(doc.id)}>
          <Trash2 className="size-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function DocCard({ doc, compact = false }: { doc: Doc; compact?: boolean }) {
  const { notes } = useStore();
  const progress = Math.round((doc.lastPage / doc.totalPages) * 100);
  const noteCount = notes.filter((n) => n.documentId === doc.id).length;

  return (
    <Link
      to="/reader/$id"
      params={{ id: doc.id }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-soft",
        compact ? "w-56 shrink-0" : "",
      )}
    >
      <div
        className="relative flex h-32 items-end p-3"
        style={{ backgroundImage: doc.cover }}
      >
        <FileText className="absolute right-3 top-3 size-5 text-primary-foreground/60" />
        {doc.pinned && (
          <Pin className="absolute left-3 top-3 size-4 fill-current text-primary-foreground/90" />
        )}
        <span className="rounded-md bg-background/85 px-2 py-0.5 text-[11px] font-medium">
          {progress}% read
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate font-display text-base font-semibold leading-tight">
              {doc.title}
            </h3>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{doc.author}</p>
          </div>
          <DocMenu doc={doc} />
        </div>

        <ProgressBar value={progress} />

        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
          <TypeBadge type={doc.type} />
          <span>pg. {doc.lastPage}</span>
          <span>·</span>
          <span>{relativeTime(doc.lastOpenedAt)}</span>
          {noteCount > 0 && (
            <span className="ml-auto inline-flex items-center gap-1">
              <StickyNote className="size-3" />
              {noteCount}
            </span>
          )}
        </div>

        {!compact && doc.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {doc.tags.map((t) => (
              <TagDot key={t} name={t} />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

export function DocRow({ doc }: { doc: Doc }) {
  const { notes } = useStore();
  const progress = Math.round((doc.lastPage / doc.totalPages) * 100);
  const noteCount = notes.filter((n) => n.documentId === doc.id).length;

  return (
    <Link
      to="/reader/$id"
      params={{ id: doc.id }}
      className="flex items-center gap-4 rounded-2xl border border-border bg-card p-3 transition-colors hover:bg-surface"
    >
      <div
        className="grid size-14 shrink-0 place-items-center rounded-xl"
        style={{ backgroundImage: doc.cover }}
      >
        <FileText className="size-5 text-primary-foreground/80" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate font-medium">{doc.title}</h3>
          {doc.pinned && <Pin className="size-3.5 shrink-0 fill-current text-primary" />}
        </div>
        <p className="truncate text-xs text-muted-foreground">
          {doc.author} · {doc.totalPages} pages · {formatMinutes(doc.readSeconds)} read
          {noteCount > 0 ? ` · ${noteCount} notes` : ""}
        </p>
        <div className="mt-2 max-w-xs">
          <ProgressBar value={progress} />
        </div>
      </div>
      <div className="hidden shrink-0 items-center gap-3 sm:flex">
        <TypeBadge type={doc.type} />
        <span className="w-20 text-right text-xs text-muted-foreground">
          {relativeTime(doc.lastOpenedAt)}
        </span>
      </div>
      <DocMenu doc={doc} />
    </Link>
  );
}
