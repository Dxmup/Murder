import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { recordVisit } from "@/lib/activity";
import { Avatar, listNameOf } from "@/lib/avatar";
import { getCharacter } from "@/lib/content";
import { DeliveredMessage, Thread, threadContaining, threadsFor } from "@/lib/delivery";
import { previewOf } from "@/lib/mailbody";
import { MailWatcher } from "@/lib/mailwatch";
import { READ_COOKIE, READ_MAX, parseRead } from "@/lib/readstate";
import { requireCharacter } from "@/lib/session";
import { getStore } from "@/lib/state";

export const dynamic = "force-dynamic";
export const metadata = { title: "Inbox" };

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

/** The character's own preparation, in the order it sits above the mail. */
const OWN_TYPES: string[] = ["briefing", "cheatsheet", "props"];

/**
 * Pre-loaded mail (section 0) carries a narrative date. It is never rendered
 * in the clock slot: a phrase like "Six days before the anniversary" is not a
 * timestamp, it overruns the slot, and it must not read as just-arrived.
 */
function isArchival(message: DeliveredMessage): boolean {
  // The briefing is also section 0, but it is tonight's preparation rather
  // than kept correspondence, so it never takes the archive treatment.
  return message.section === 0 && !OWN_TYPES.includes(message.type);
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
function snippet(message: DeliveredMessage, limit = 190): string {
  if (message.type !== "briefing" && message.type !== "cheatsheet") return previewOf(message.body, limit);

  const flat = message.body
    .split("\n")
    .filter((line) => !/^#/.test(line.trim()))
    .join(" ")
    .replace(/^\s*[-*]\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\s+/g, " ")
    .trim();

  return flat.length <= limit ? flat : `${flat.slice(0, limit).trimEnd()}…`;
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="px-4 pb-1.5 pt-5 text-[13px] font-semibold tracking-[0.01em] text-muted">
      {children}
    </h2>
  );
}

function Row({ thread, unread }: { thread: Thread; unread: boolean }) {
  const message = thread.latest;
  const count = thread.messages.length;
  const archival = isArchival(message);
  const time = clockTime(message);

  // Unread carries weight and full contrast; read demotes a step. No colour on
  // the text itself — the blue belongs to the unread dot alone, and the amber
  // is spoken for by archival provenance.
  const senderClass = unread
    ? "font-semibold text-strong"
    : "font-normal text-body";
  const subjectClass = unread ? "font-medium text-strong" : "font-normal text-muted";

  return (
    <li className="border-b border-line last:border-b-0">
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
          className={`flex w-full items-start gap-3 py-2.5 pr-4 text-left transition-colors active:bg-raised ${
            // Kept mail keeps a hairline amber rail: enough to mark provenance
            // when a row is seen out of its section, not enough to read as a
            // warning. The old amber row fill did read as one.
            archival
              ? "border-l-2 border-accent-line pl-[14px]"
              : "border-l-2 border-transparent pl-[14px]"
          }`}
        >
          {/*
            Unread gutter, always reserved so sender names line up whether or
            not a dot is present. Apple Mail's arrangement, and the fastest
            unread signal there is: one saturated dot in an otherwise
            colourless column.
          */}
          <span
            aria-hidden="true"
            className={
              unread
                ? "mt-[13px] size-[9px] shrink-0 rounded-full bg-brand"
                : "mt-[13px] size-[9px] shrink-0 rounded-full bg-transparent"
            }
          />

          <Avatar name={message.from} size={40} />

          <span className="min-w-0 flex-1">
            <span className="flex items-baseline gap-2">
              <span className={`flex min-w-0 flex-1 items-baseline gap-1.5 text-[16px] leading-tight ${senderClass}`}>
                <span className="truncate">{listNameOf(message.from)}</span>
                {count > 1 ? (
                  <span className="shrink-0 text-[13px] font-normal tabular-nums text-faint">
                    {count}
                  </span>
                ) : null}
              </span>
              {time ? (
                <span
                  className={`shrink-0 text-[13px] tabular-nums leading-tight ${
                    unread ? "font-semibold text-strong" : "text-faint"
                  }`}
                >
                  {time}
                </span>
              ) : null}
            </span>

            <span className={`mt-[2px] block truncate text-[15px] leading-snug ${subjectClass}`}>
              {message.subject}
            </span>

            {archival && message.narrativeDate ? (
              // A label chip, exactly where a real client puts one: on the
              // preview line, ahead of the text. It says when this letter is
              // from without ever occupying the clock slot.
              <span className="mt-1.5 flex w-fit max-w-full items-center gap-1.5 rounded border border-accent-line bg-accent-soft px-1.5 py-[3px]">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-3 shrink-0 text-accent"
                >
                  <path d="M6 3h12v18l-6-4-6 4z" />
                </svg>
                <span className="truncate text-[12px] leading-none text-accent">
                  {message.narrativeDate}
                </span>
              </span>
            ) : null}

            <span
              className={`mt-[3px] text-[14px] leading-[1.35] ${
                // The clamp, not the character limit, decides how tall a row is:
                // two lines of preview for live mail, one for kept mail, whose
                // label chip has already taken a line.
                archival ? "line-clamp-1" : "line-clamp-2"
              } ${unread ? "text-muted" : "text-faint"}`}
            >
              {snippet(message)}
            </span>
          </span>
        </button>
      </form>
    </li>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <GroupLabel>{label}</GroupLabel>
      <ol className="border-y border-line bg-surface">{children}</ol>
    </>
  );
}

export default async function InboxPage() {
  const characterId = await requireCharacter();
  if (!characterId) redirect("/login");

  const character = getCharacter(characterId);
  if (!character) redirect("/login");

  const state = await getStore().read();
  await recordVisit(characterId);

  const jar = await cookies();
  const seen = parseRead(jar.get(READ_COOKIE)?.value);
  const isUnread = (t: Thread) => t.messages.some((m) => !seen.has(m.id));

  const threads = threadsFor(characterId, state);
  const deliveredIds = threads.flatMap((t) => t.messages.map((m) => m.id));
  const unreadCount = deliveredIds.filter((id) => !seen.has(id)).length;
  // The briefing, cheat sheet and props note are the character's own
  // preparation, so they sit together above the mail rather than among it.
  const own = (t: Thread) => OWN_TYPES.includes(t.latest.type);
  const preparation = threads
    .filter(own)
    .sort((a, b) => OWN_TYPES.indexOf(a.latest.type) - OWN_TYPES.indexOf(b.latest.type));
  const tonight = threads.filter((t) => !isArchival(t.latest) && !own(t));
  const archive = threads.filter((t) => isArchival(t.latest));

  return (
    <main className="min-h-dvh bg-surface pb-20 text-strong">
      <MailWatcher initialIds={deliveredIds} initialUnread={unreadCount} onInbox />
      {/*
        The app bar every stock client has: where you are on the left, whose
        account you are in on the right. An earlier version stacked an eyebrow,
        the character name and a "N messages · N unread" counter, which cost a
        fifth of the viewport before the first message and read as a game menu
        rather than the character's own mail.
      */}
      <header className="sticky top-0 z-10 flex min-h-14 items-center justify-between gap-3 border-b border-line bg-surface/95 px-4 py-2.5 backdrop-blur">
        <h1 className="text-[20px] font-semibold leading-none tracking-tight text-strong">
          Inbox
        </h1>
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="truncate text-[13px] leading-none text-muted">
            {character.name}
          </span>
          <Avatar name={character.name} size={30} />
        </div>
      </header>

      {preparation.length > 0 ? (
        <Group label="Your briefing">
          {preparation.map((thread) => (
            <Row key={thread.id} thread={thread} unread={isUnread(thread)} />
          ))}
        </Group>
      ) : null}

      {tonight.length > 0 ? (
        <Group label="Tonight">
          {tonight.map((thread) => (
            <Row key={thread.id} thread={thread} unread={isUnread(thread)} />
          ))}
        </Group>
      ) : null}

      {archive.length > 0 ? (
        <Group label="Kept mail">
          {archive.map((thread) => (
            <Row key={thread.id} thread={thread} unread={isUnread(thread)} />
          ))}
        </Group>
      ) : null}

      {threads.length === 0 ? (
        <div className="flex flex-col items-center px-8 py-24 text-center">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-12 text-line-strong"
          >
            <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
            <path d="m3.5 7 8.5 6 8.5-6" />
          </svg>
          <p className="mt-4 text-[17px] font-medium text-body">No mail yet</p>
          <p className="mt-1.5 max-w-[24rem] text-[15px] leading-relaxed text-muted">
            Nothing has arrived for you. Leave this open; new mail appears here
            as the evening goes on.
          </p>
        </div>
      ) : null}
    </main>
  );
}
