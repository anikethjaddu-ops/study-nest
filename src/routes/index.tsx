import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, Flame, Target, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { DocCard, DocRow } from "@/components/doc-card";
import { ACTIVITY, DAILY_GOAL_MINUTES } from "@/lib/demo-data";
import { greeting } from "@/lib/format";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DocNest — Your reading home" },
      {
        name: "description",
        content:
          "Pick up exactly where you left off. Pinned documents, recent reads, study streaks and daily reading goals in one calm home screen.",
      },
      { property: "og:title", content: "DocNest — Your reading home" },
      {
        property: "og:description",
        content: "Resume reading, track your streak and hit your daily study goal.",
      },
    ],
  }),
  component: HomePage,
});

function StatChip({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3">
      <span className="grid size-9 place-items-center rounded-xl bg-secondary">
        <Icon className="size-4.5 text-primary" />
      </span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-display text-lg font-semibold leading-tight">{value}</p>
      </div>
    </div>
  );
}

function GoalRing({ minutes }: { minutes: number }) {
  const pct = Math.min(100, Math.round((minutes / DAILY_GOAL_MINUTES) * 100));
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative grid size-24 place-items-center">
      <svg viewBox="0 0 80 80" className="size-24 -rotate-90">
        <circle cx="40" cy="40" r={r} fill="none" stroke="var(--muted)" strokeWidth="7" />
        <circle
          cx="40"
          cy="40"
          r={r}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * pct) / 100}
        />
      </svg>
      <div className="absolute text-center">
        <p className="font-display text-xl font-semibold leading-none">{pct}%</p>
        <p className="text-[10px] text-muted-foreground">of goal</p>
      </div>
    </div>
  );
}

function HomePage() {
  const { docs } = useStore();
  const g = greeting();
  const pinned = docs.filter((d) => d.pinned);
  const recent = [...docs].sort(
    (a, b) => +new Date(b.lastOpenedAt) - +new Date(a.lastOpenedAt),
  );
  const todayMinutes = ACTIVITY[0];

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        <section className="mb-8 overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-soft md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <h1 className="mt-1 font-display text-3xl font-semibold md:text-4xl">
                {g.text}, Aniketh <span className="text-gradient">{g.icon}</span>
              </h1>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                You're {DAILY_GOAL_MINUTES - todayMinutes > 0
                  ? `${DAILY_GOAL_MINUTES - todayMinutes} minutes away from`
                  : "past"}{" "}
                today's reading goal. Two documents are waiting for you.
              </p>
            </div>
            <div className="flex items-center gap-5">
              <GoalRing minutes={todayMinutes} />
              <div className="flex items-center gap-2 rounded-2xl bg-brand px-4 py-3 text-primary-foreground shadow-glow">
                <Flame className="size-5" />
                <div>
                  <p className="font-display text-xl font-semibold leading-none">17</p>
                  <p className="text-[11px] opacity-90">day streak</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <StatChip icon={Clock} label="Read today" value={`${todayMinutes} min`} />
            <StatChip icon={TrendingUp} label="Docs opened today" value="3" />
            <StatChip icon={Target} label="Weekly goal" value="4 / 7 days" />
          </div>
        </section>

        {pinned.length > 0 && (
          <section className="mb-10">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">Pinned</h2>
              <Link to="/library" className="text-sm text-primary hover:underline">
                View all
              </Link>
            </div>
            <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
              {pinned.map((d) => (
                <DocCard key={d.id} doc={d} compact />
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">Recently opened</h2>
            <Link to="/library" className="text-sm text-primary hover:underline">
              All documents
            </Link>
          </div>
          <div className="flex flex-col gap-2.5">
            {recent.map((d) => (
              <DocRow key={d.id} doc={d} />
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
