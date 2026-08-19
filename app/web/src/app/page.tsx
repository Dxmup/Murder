import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCharacter } from "@/lib/content";
import { DeliveredMessage, Thread, threadContaining, threadsFor } from "@/lib/delivery";
import { requireCharacter } from "@/lib/session";
import { getStore } from "@/lib/state";

export const dynamic = "force-dynamic";
export const metadata = { title: "Inbox" };

/**
 * Which messages this handset has already opened. Read state is per-device and
 * disposable — it is a scanning aid for a player standing in a dark room, not
 * game state — so it lives in a plain cookie rather than the shared store.
 */
const READ_COOKIE = "rmurder_read";
const READ_MAX = 200;

function parseRead(value: string | undefined): Set<string> {
  if (!value) return new Set();
  return new Set(value.split(",").filter(Boolean));
}

/**
 * Opening a message is a write (it sets the read cookie), so the row is a form
 * submit rather than a link: a Server Component cannot set a cookie while
 * rendering, and the message screen is owned elsewhere.
 */
async function openMessage(formData: FormData) {
  "use server";

  const id = String(formData.get("id") ?? "");
  if (!/^[A-Za-z0-9_-]{1,32}$/.test(id)) redirect("/");

  const jar = await cookies();
  const seen = parseRead(jar.get(READ_COOKIE)?.value);

  // Opening a thread reads the whole exchange. Marking only the newest message
  // would leave the row permanently bold, since a thread counts as unread while
  // any message in it is unread.
  const characterId = await requireCharacter();
  if (characterId) {
    const state = await getStore().read();
    const thread = threadContaining(characterId, id, state);
    for (const message of thread?.messages ?? []) seen.add(message.id);
  }
  seen.add(id);

  jar.set(READ_COOKIE, [...seen].slice(-READ_MAX).join(","), {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
  });

  redirect(`/m/${id}`);
}

/**
 * Pre-loaded mail (section 0) carries a narrative date. It is never rendered
 * in the clock slot: a phrase like "Six days before the anniversary" is not a
 * timestamp, it overruns the slot, and it must not read as just-arrived.
 */
function isArchival(message: DeliveredMessage): boolean {
  // The briefing is also section 0, but it is tonight's preparation rather
  // than kept correspondence, so it never takes the archive treatment.
  return message.section === 0 && message.type !== "briefing";
}

/** The clock time a live message landed. Empty for archival mail. */
function clockTime(message: DeliveredMessage): string {
  if (isArchival(message) || message.deliveredAt === null) return "";
  return new Date(message.deliveredAt).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * Preview text for a row. The briefing's body is Markdown, so syntax is
 * stripped rather than shown; the title heading is dropped too, since the
 * sender column already carries the character's name.
 */
function snippet(message: DeliveredMessage, limit = 110): string {
  let text = message.body;

  if (message.type === "briefing") {
    text = text
      .split("\n")
      .filter((line) => !/^#\s/.test(line))
      .join("\n");
  }

  const flat = text
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*[-*]\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\s+/g, " ")
    .trim();

  return flat.length <= limit ? flat : `${flat.slice(0, limit).trimEnd()}…`;
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-4 pb-1 pt-3 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
      {children}
    </div>
  );
}

function Row({ thread, unread }: { thread: Thread; unread: boolean }) {
  const message = thread.latest;
  const count = thread.messages.length;
  const archival = isArchival(message);
  const time = clockTime(message);

  // Unread carries weight and contrast plus a gutter dot; read demotes to
  // regular weight with a dimmed subject. Never colour — the amber rail is
  // already spoken for by archival provenance and must stay unambiguous.
  const senderClass = archival
    ? unread
      ? "font-semibold text-strong"
      : "font-normal text-muted"
    : unread
      ? "font-semibold text-strong"
      : "font-normal text-body";

  const subjectClass = unread ? "font-medium text-strong" : "font-normal text-muted";

  return (
    <li>
      {/*
        The visible control is the form button below. This anchor is a
        non-interactive stand-in that keeps `ol li a` resolvable for
        tests/shoot.mjs, which reads the first row's href to shoot /m/:id.
      */}
      <a href={`/m/${message.id}`} className="sr-only" tabIndex={-1} aria-hidden="true">
        {message.subject}
      </a>

      <form action={openMessage}>
        {/*
          The id rides on the button rather than a hidden input. Browser
          autofill heuristics style inputs on sight — injecting a caret-color
          that the server never rendered — which produced a hydration mismatch
          on every row. One fewer node, and nothing for autofill to touch.
        */}
        <button
          type="submit"
          name="id"
          value={message.id}
          className={
            archival
              ? "flex w-full gap-2 border-l-2 border-accent-line bg-accent-soft py-3 pl-2.5 pr-4 text-left active:bg-accent-soft"
              : "flex w-full gap-2 border-l-2 border-transparent py-3 pl-2.5 pr-4 text-left active:bg-raised"
          }
        >
          <span
            aria-hidden="true"
            className={
              unread
                ? "mt-[7px] size-[6px] shrink-0 rounded-full bg-invert-bg"
                : "mt-[7px] size-[6px] shrink-0 rounded-full bg-transparent"
            }
          />

          <span className="min-w-0 flex-1">
            <span className="flex items-baseline justify-between gap-3">
              <span className={`flex min-w-0 items-baseline gap-1.5 text-[15px] ${senderClass}`}>
                <span className="truncate">{message.from}</span>
                {count > 1 ? (
                  <span className="shrink-0 text-[12px] font-normal tabular-nums text-muted">
                    {count}
                  </span>
                ) : null}
              </span>
              {time ? (
                <span
                  className={
                    unread
                      ? "shrink-0 text-[12px] tabular-nums text-muted"
                      : "shrink-0 text-[12px] tabular-nums text-faint"
                  }
                >
                  {time}
                </span>
              ) : null}
            </span>

            <span className={`mt-0.5 block truncate text-[15px] ${subjectClass}`}>
              {message.subject}
            </span>

            <span
              className={
                unread
                  ? "mt-0.5 line-clamp-1 text-[13px] leading-snug text-muted"
                  : "mt-0.5 line-clamp-1 text-[13px] leading-snug text-faint"
              }
            >
              {snippet(message)}
            </span>

            {archival ? (
              <span className="mt-1.5 inline-flex max-w-full items-center gap-2 rounded-sm border border-accent-line bg-accent-soft px-2 py-0.5">
                <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-accent">
                  Archive
                </span>
                <span className="truncate text-[12px] italic text-accent">
                  {message.narrativeDate}
                </span>
              </span>
            ) : null}
          </span>
        </button>
      </form>
    </li>
  );
}

export default async function InboxPage() {
  const characterId = await requireCharacter();
  if (!characterId) redirect("/login");

  const character = getCharacter(characterId);
  if (!character) redirect("/login");

  const state = await getStore().read();

  const jar = await cookies();
  const seen = parseRead(jar.get(READ_COOKIE)?.value);
  const isUnread = (t: Thread) => t.messages.some((m) => !seen.has(m.id));

  const threads = threadsFor(characterId, state);
  const briefing = threads.find((t) => t.latest.type === "briefing") ?? null;
  const tonight = threads.filter((t) => !isArchival(t.latest) && t.latest.type !== "briefing");
  const archive = threads.filter((t) => isArchival(t.latest));

  return (
    <main className="min-h-dvh bg-surface pb-16 text-strong">
      {/*
        One compact row. An earlier version stacked an eyebrow, the character
        name, and a "N messages · N unread" counter, which cost a fifth of the
        viewport before the first message and read as a game-menu stat rather
        than the character's own mail. The unread dots already carry the count.
      */}
      <header className="sticky top-0 z-10 flex min-h-12 items-baseline justify-between gap-3 border-b border-line bg-surface/95 px-4 py-3 backdrop-blur">
        <h1 className="truncate text-[17px] font-semibold leading-none tracking-tight text-strong">
          {character.name}
        </h1>
        <p className="shrink-0 text-[10px] font-medium uppercase tracking-[0.22em] text-muted">
          Fifteen Years of R
        </p>
      </header>

      {briefing ? (
        <>
          <GroupLabel>Your briefing</GroupLabel>
          <ol className="divide-y divide-line border-y border-line">
            <Row thread={briefing} unread={isUnread(briefing)} />
          </ol>
        </>
      ) : null}

      {tonight.length > 0 ? (
        <>
          <GroupLabel>Tonight</GroupLabel>
          <ol className="divide-y divide-line border-y border-line">
            {tonight.map((thread) => (
              <Row key={thread.id} thread={thread} unread={isUnread(thread)} />
            ))}
          </ol>
        </>
      ) : null}

      {archive.length > 0 ? (
        <>
          <GroupLabel>Kept mail</GroupLabel>
          <ol className="divide-y divide-line border-y border-line">
            {archive.map((thread) => (
              <Row key={thread.id} thread={thread} unread={isUnread(thread)} />
            ))}
          </ol>
        </>
      ) : null}

      {threads.length === 0 ? (
        <p className="px-4 py-16 text-center text-sm text-muted">No messages.</p>
      ) : null}
    </main>
  );
}
