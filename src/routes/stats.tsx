import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Flame, Pause, Play, RotateCcw, Timer } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { ACTIVITY } from "@/lib/demo-data";
import { formatMinutes } from "@/lib/format";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/stats")({
  head: () => ({
    meta: [
      { title: "Study stats — DocNest" },
      {
        name: "description",
        content:
          "Reading time, a 12-week activity heatmap, per-document sessions, reading speed and a built-in Pomodoro timer.",
      },
      { property: "og:title", content: "Study stats — DocNest" },
      {
        property: "og:description",
        content: "See how much you actually read, week by week.",
      },
    ],
  }),
  component: StatsPage,
});

function Heatmap() {
  const weeks = 12;
  const cells = ACTIVITY.slice(0, weeks * 7);
  return (
    <div className="flex gap-1 overflow-x-auto pb-1">
      {Array.from({ length: weeks }).map((_, w) => (
        <div key={w} className="flex flex-col gap-1">
          {Array.from({ length: 7 }).map((__, d) => {
            const v = cells[(weeks - 1 - w) * 7 + d] ?? 0;
            const level = v === 0 ? 0 : v < 25 ? 1 : v < 50 ? 2 : v < 75 ? 3 : 4;
            return (
              <div
                key={d}
                title={`${v} min`}
                className="size-3.5 rounded-[4px]"
                style={{
                  backgroundColor:
                    level === 0
                      ? "var(--muted)"
                      : `color-mix(in oklab, var(--primary) ${level * 25}%, var(--muted))`,
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

function Pomodoro() {
  const [minutes, setMinutes] = useState(25);
  const [running, setRunning] = useState(false);

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <Timer className="size-4.5 text-primary" />
        <h3 className="font-display text-lg font-semibold">Pomodoro</h3>
      </div>
      <p className="font-display text-5xl font-semibold tabular-nums">
        {String(minutes).padStart(2, "0")}:00
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {[25, 50].map((m) => (
          <button
            key={m}
            onClick={() => setMinutes(m)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium",
              minutes === m
                ? "bg-brand text-primary-foreground"
                : "bg-secondary text-secondary-foreground",
            )}
          >
            {m} min
          </button>
        ))}
        <button
          onClick={() => setRunning((r) => !r)}
          className="ml-auto inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-soft"
        >
          {running ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
          {running ? "Pause" : "Start session"}
        </button>
        <button
          onClick={() => setRunning(false)}
          className="grid size-9 place-items-center rounded-full bg-secondary text-muted-foreground"
          aria-label="Reset"
        >
          <RotateCcw className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

function StatsPage() {
  const { docs, notes } = useStore();
  const weekTotal = ACTIVITY.slice(0, 7).reduce((a, b) => a + b, 0);
  const top = [...docs].sort((a, b) => b.readSeconds - a.readSeconds).slice(0, 5);
  const max = top[0]?.readSeconds || 1;

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">
        <PageHeader title="Stats & activity" subtitle="Your reading habits over the last 12 weeks" />

        <div className="mb-6 grid gap-4 sm:grid-cols-4">
          {[
            { label: "Today", value: `${ACTIVITY[0] ?? 0} min` },
            { label: "This week", value: formatMinutes(weekTotal * 60) },
            { label: "Streak", value: "17 days" },
            { label: "Avg. speed", value: "38 pg/h" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="mt-1 font-display text-2xl font-semibold">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="mb-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center gap-2">
              <Flame className="size-4.5 text-primary" />
              <h3 className="font-display text-lg font-semibold">Activity heatmap</h3>
            </div>
            <Heatmap />
            <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
              Less
              {[0, 1, 2, 3, 4].map((l) => (
                <span
                  key={l}
                  className="size-3 rounded-[3px]"
                  style={{
                    backgroundColor:
                      l === 0
                        ? "var(--muted)"
                        : `color-mix(in oklab, var(--primary) ${l * 25}%, var(--muted))`,
                  }}
                />
              ))}
              More
            </div>
          </div>
          <Pomodoro />
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="mb-4 font-display text-lg font-semibold">Top documents</h3>
          <div className="flex flex-col gap-3">
            {top.map((d) => (
              <div key={d.id}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="truncate pr-3">{d.title}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatMinutes(d.readSeconds)} ·{" "}
                    {notes.filter((n) => n.documentId === d.id).length} notes
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-brand"
                    style={{ width: `${(d.readSeconds / max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
