import Link from "next/link";
import { redirect } from "next/navigation";
import { actRunway, characters, messages } from "@/lib/content";
import { pendingFor } from "@/lib/delivery";
import { isHost } from "@/lib/session";
import { ACTS, elapsedMinutes, getStore, hasStarted, isRunning } from "@/lib/state";

export const dynamic = "force-dynamic";
export const metadata = { title: "Host" };

/** mm:ss from a float count of minutes. The host reads this mid-sentence. */
function clockText(minutes: number): string {
  const total = Math.max(0, Math.round(minutes * 60));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

/** The next scheduled drop in an act, and how much mail is still to come. */
function upcoming(section: number, elapsed: number) {
  const later = messages
    .filter((m) => m.section === section && m.offset !== null && m.offset > elapsed)
    .sort((a, b) => (a.offset ?? 0) - (b.offset ?? 0));
  return { next: later[0]?.offset ?? null, remaining: later.length };
}

export default async function HostPage() {
  if (!(await isHost())) redirect("/login");

  const state = await getStore().read();

  // This is a `force-dynamic` Server Component: it renders once per request and
  // never re-renders on the client, so the instability the purity rule guards
  // against cannot occur. Reading the wall clock is the page's whole purpose,
  // and one shared timestamp keeps every act card on the same instant.
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();

  const queuedBy = new Map(
    characters.map((c) => [c.id, pendingFor(c.id, state, now).length] as const),
  );
  const totalQueued = [...queuedBy.values()].reduce((a, b) => a + b, 0);

  return (
    <main className="min-h-dvh bg-surface px-4 py-5 text-strong">
      <header className="flex items-baseline justify-between">
        <h1 className="text-base font-medium tracking-tight">Host</h1>
        <span className="text-xs tabular-nums text-muted">
          {totalQueued} queued across {characters.length} inboxes
        </span>
      </header>

      <section className="mt-4 space-y-2.5">
        {ACTS.map((act) => {
          const clock = state.acts[act];
          const elapsed = elapsedMinutes(clock, now);
          const runway = actRunway(Number(act));
          const running = isRunning(clock);
          const started = hasStarted(clock);
          const over = elapsed > runway;
          const pct = runway > 0 ? Math.min(100, (elapsed / runway) * 100) : 0;
          const { next, remaining } = upcoming(Number(act), elapsed);

          const rail = over ? "bg-warn" : running ? "bg-ok" : "bg-line-strong";

          return (
            <div
              key={act}
              className={`relative overflow-hidden rounded-xl border ${
                running
                  ? "border-line-strong bg-raised"
                  : "border-line bg-surface"
              }`}
            >
              <span className={`absolute inset-y-0 left-0 w-1 ${rail}`} aria-hidden />

              <div className={running ? "py-3.5 pl-5 pr-3.5" : "py-2.5 pl-5 pr-3.5"}>
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-2">
                      <h2 className="text-sm font-semibold tracking-tight">Act {act}</h2>
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-[0.12em] ${
                          over ? "text-warn" : running ? "text-ok" : "text-muted"
                        }`}
                      >
                        {running ? (over ? "Running · over" : "Running") : started ? "Paused" : "Not started"}
                      </span>
                    </div>

                    <div className="mt-0.5 flex items-baseline gap-1.5">
                      <span
                        className={`tabular-nums leading-none ${
                          running ? "text-[2rem] font-semibold" : "text-lg font-medium text-body"
                        } ${over ? "text-warn" : ""}`}
                      >
                        {clockText(elapsed)}
                      </span>
                      <span className="text-xs tabular-nums text-muted">
                        / {clockText(runway)}
                      </span>
                    </div>
                  </div>

                  <form action="/api/clock" method="post" className="flex shrink-0 items-center gap-2">
                    <input type="hidden" name="act" value={act} />
                    <button
                      name="action"
                      value={running ? "pause" : "start"}
                      className={`rounded-lg px-4 text-sm font-semibold ${
                        running
                          ? "h-11 bg-invert-bg text-invert-fg"
                          : started
                            ? "h-10 bg-invert-bg text-invert-fg"
                            : "h-10 bg-invert-bg text-invert-fg"
                      }`}
                    >
                      {running ? "Pause" : started ? "Resume" : "Start"}
                    </button>
                    <button
                      name="action"
                      value="reset"
                      className="h-10 rounded-lg border border-line px-2.5 text-[11px] text-muted"
                    >
                      Reset
                    </button>
                  </form>
                </div>

                {(running || started) && (
                  <div className="mt-3 mr-1">
                    <div className="h-1 overflow-hidden rounded-full bg-sunken">
                      <div className={`h-full ${rail}`} style={{ width: `${pct}%` }} />
                    </div>
                    <div className="mt-1.5 text-[11px] tabular-nums text-muted">
                      {next === null
                        ? `All Act ${act} mail delivered`
                        : `Next drop at ${clockText(next)} — in ${clockText(next - elapsed)} · ${remaining} left`}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </section>

      <section className="mt-7">
        <h2 className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
          Inboxes
        </h2>
        <ul className="mt-1 divide-y divide-line text-sm">
          {characters.map((character) => {
            const queued = queuedBy.get(character.id) ?? 0;
            return (
              <li key={character.id}>
                <Link
                  href={`/host/inbox/${character.id}`}
                  className="flex min-h-11 items-center justify-between gap-3 py-1.5"
                >
                  <span className="flex min-w-0 items-baseline gap-2">
                    <span className="w-8 shrink-0 text-xs tabular-nums text-faint">
                      {character.id}
                    </span>
                    <span className="truncate">{character.name}</span>
                  </span>
                  <span
                    className={`shrink-0 tabular-nums ${
                      queued > 0
                        ? "rounded-md bg-sunken px-2 py-0.5 text-xs font-medium text-body"
                        : "text-xs text-faint"
                    }`}
                  >
                    {queued > 0 ? queued : "—"}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
