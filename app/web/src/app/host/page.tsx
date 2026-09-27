import Link from "next/link";
import { redirect } from "next/navigation";
import { Activity, allActivity } from "@/lib/activity";
import { actRunway, characters, messages } from "@/lib/content";
import { pendingFor } from "@/lib/delivery";
import { ChimeButton } from "@/lib/mailwatch";
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

/** "just now", "12 min ago", "3 h ago", "2 d ago": the host scans, not reads. */
function ago(at: number, now: number): string {
  const minutes = Math.floor((now - at) / 60_000);
  if (minutes < 2) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 48) return `${hours} h ago`;
  return `${Math.floor(hours / 24)} d ago`;
}

type Standing = "never" | "unread" | "read";

function standingOf(activity: Activity | undefined): Standing {
  if (!activity?.firstLogin) return "never";
  return activity.briefingOpened ? "read" : "unread";
}

/** One line under a name: where this player stands before the party. */
function activityLine(activity: Activity | undefined, now: number): string {
  const standing = standingOf(activity);
  if (standing === "never") return "Never signed in";
  const seen = activity?.lastSeen ? `, seen ${ago(activity.lastSeen, now)}` : "";
  return standing === "unread" ? `Briefing not opened${seen}` : `Read briefing${seen}`;
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

  const activity = await allActivity();
  const out = new Set(state.disabled);
  const inPlay = characters.filter((c) => !out.has(c.id));
  const queuedBy = new Map(
    inPlay.map((c) => [c.id, pendingFor(c.id, state, now).length] as const),
  );
  const totalQueued = [...queuedBy.values()].reduce((a, b) => a + b, 0);
  const tally = { read: 0, unread: 0, never: 0 };
  for (const c of inPlay) tally[standingOf(activity[c.id])] += 1;

  return (
    <main className="mx-auto min-h-dvh w-full max-w-2xl bg-surface px-4 py-5 text-strong">
      <header className="flex items-baseline justify-between gap-3">
        <h1 className="text-[20px] font-semibold tracking-tight">Host</h1>
        <span className="text-[13px] tabular-nums text-muted">
          {totalQueued} queued across {inPlay.length} inboxes
        </span>
      </header>

      <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-line px-4 py-3">
        <p className="text-[14px] leading-snug text-muted">
          The sound players hear when mail arrives. Play it at the briefing.
        </p>
        <ChimeButton />
      </div>

      <section className="mt-4 space-y-3">
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
                running ? "border-line-strong bg-raised" : "border-line bg-surface"
              }`}
            >
              <span className={`absolute inset-y-0 left-0 w-1 ${rail}`} aria-hidden />

              <div className={running ? "py-4 pl-5 pr-4" : "py-3 pl-5 pr-4"}>
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-2">
                      <h2 className="text-[15px] font-semibold tracking-tight">Act {act}</h2>
                      <span
                        className={`text-[11px] font-semibold uppercase tracking-[0.12em] ${
                          over ? "text-warn" : running ? "text-ok" : "text-muted"
                        }`}
                      >
                        {running
                          ? over
                            ? "Running · over"
                            : "Running"
                          : started
                            ? "Paused"
                            : "Not started"}
                      </span>
                    </div>

                    <div className="mt-0.5 flex items-baseline gap-1.5">
                      <span
                        className={`tabular-nums leading-none ${
                          running ? "text-[2rem] font-semibold" : "text-[20px] font-medium text-body"
                        } ${over ? "text-warn" : ""}`}
                      >
                        {clockText(elapsed)}
                      </span>
                      <span className="text-[13px] tabular-nums text-muted">
                        / {clockText(runway)}
                      </span>
                    </div>
                  </div>

                  <form action="/api/clock" method="post" className="flex shrink-0 items-center gap-2">
                    <input type="hidden" name="act" value={act} />
                    <button
                      name="action"
                      value={running ? "pause" : "start"}
                      className="h-11 rounded-lg bg-brand px-4 text-[15px] font-semibold text-brand-fg active:opacity-80"
                    >
                      {running ? "Pause" : started ? "Resume" : "Start"}
                    </button>
                    <button
                      name="action"
                      value="reset"
                      className="h-11 rounded-lg border border-line px-3 text-[13px] text-muted active:bg-sunken"
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
                    <div className="mt-1.5 text-[12px] tabular-nums text-muted">
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

      <section className="mt-8">
        <h2 className="text-[13px] font-semibold text-muted">Inboxes</h2>
        <p className="mt-1 text-[14px] leading-snug text-body">
          <span className="font-semibold tabular-nums">{tally.read}</span> of {inPlay.length} have
          read their briefing.
          {tally.unread + tally.never > 0 ? (
            <span className="text-warn">
              {" "}
              Follow up with {tally.unread + tally.never}: {tally.never} never signed in,{" "}
              {tally.unread} signed in without opening it.
            </span>
          ) : null}
        </p>
        <ul className="mt-1 divide-y divide-line">
          {characters.map((character) => {
            const playing = !out.has(character.id);
            const queued = queuedBy.get(character.id) ?? 0;
            return (
              <li key={character.id} className="flex items-center gap-3">
                <Link
                  href={`/host/inbox/${character.id}`}
                  className="flex min-h-12 min-w-0 flex-1 items-center justify-between gap-3 py-1.5"
                >
                  <span className="flex min-w-0 items-baseline gap-2.5">
                    <span className="w-9 shrink-0 text-[12px] tabular-nums text-faint">
                      {character.id}
                    </span>
                    <span className="flex min-w-0 flex-col">
                      <span
                        className={`truncate text-[15px] ${
                          playing ? "text-body" : "text-faint line-through"
                        }`}
                      >
                        {character.name}
                      </span>
                      {playing ? (
                        <span
                          className={`truncate text-[12px] leading-snug ${
                            standingOf(activity[character.id]) === "read"
                              ? "text-faint"
                              : "text-warn"
                          }`}
                        >
                          {activityLine(activity[character.id], now)}
                        </span>
                      ) : null}
                    </span>
                  </span>
                  <span
                    className={`shrink-0 tabular-nums ${
                      playing && queued > 0
                        ? "rounded-md bg-sunken px-2 py-0.5 text-[13px] font-medium text-body"
                        : "text-[13px] text-faint"
                    }`}
                  >
                    {playing && queued > 0 ? queued : "—"}
                  </span>
                </Link>
                <form action="/api/cast" method="post" className="shrink-0">
                  <input type="hidden" name="id" value={character.id} />
                  <input type="hidden" name="inPlay" value={playing ? "false" : "true"} />
                  <button
                    type="submit"
                    aria-label={`${character.name} is ${playing ? "in play" : "out of play"}. Switch.`}
                    className={`h-8 w-[4.5rem] rounded-md border text-[12px] font-semibold ${
                      playing
                        ? "border-line-strong bg-raised text-body"
                        : "border-line bg-sunken text-faint"
                    } active:opacity-70`}
                  >
                    {playing ? "In play" : "Out"}
                  </button>
                </form>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
