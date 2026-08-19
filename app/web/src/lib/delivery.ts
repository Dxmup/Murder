import { EVERYONE, GameMessage, manifestFor } from "@/lib/content";
import { ActClock, GameState, elapsedMinutes, hasStarted, wallClockAt } from "@/lib/state";

export type DeliveredMessage = GameMessage & {
  /** Epoch ms this message became visible, for the inbox's Date field. */
  deliveredAt: number | null;
};

/**
 * Pre-loaded mail (act 0) is present the moment a player signs in. Live mail
 * appears once its act's clock passes the message's offset. A paused act
 * simply stops advancing, so nothing arrives while the host holds the room.
 */
export function isDelivered(message: GameMessage, state: GameState, now = Date.now()): boolean {
  if (message.section === 0) return true;

  const clock: ActClock | undefined = state.acts[String(message.section)];
  if (!clock) return false;

  // An act that has not been started delivers nothing. Without this, every
  // act's offset-0 mail satisfies `0 >= 0` and lands in the inbox before the
  // host has opened the act.
  if (!hasStarted(clock)) return false;

  return elapsedMinutes(clock, now) >= (message.offset ?? 0);
}

function deliveredAt(message: GameMessage, state: GameState, now: number): number | null {
  // Pre-loaded mail shows its narrative date, never a delivery time.
  if (message.section === 0) return null;

  const clock = state.acts[String(message.section)];
  if (!clock) return null;

  return wallClockAt(clock, (message.offset ?? 0) * 60_000, now);
}

/**
 * The inbox as this character should currently see it: newest first, which is
 * what an email client does and what a player scanning a phone expects.
 */
export function inboxFor(
  characterId: string,
  state: GameState,
  now = Date.now(),
): DeliveredMessage[] {
  return manifestFor(characterId)
    .filter((m) => isDelivered(m, state, now))
    .map((m) => ({ ...m, deliveredAt: deliveredAt(m, state, now) }))
    .sort((a, b) => b.section - a.section || (b.offset ?? 0) - (a.offset ?? 0));
}

/** Mail still queued for this character, for the host dashboard only. */
export function pendingFor(
  characterId: string,
  state: GameState,
  now = Date.now(),
): GameMessage[] {
  return manifestFor(characterId)
    .filter((m) => !isDelivered(m, state, now))
    .sort((a, b) => a.section - b.section || (a.offset ?? 0) - (b.offset ?? 0));
}

export function isBroadcast(message: GameMessage): boolean {
  return message.recipient === EVERYONE;
}

export type Thread = {
  id: string;
  /** Delivered messages in this thread, oldest first — the reading order. */
  messages: DeliveredMessage[];
  /** The most recent delivered message, which represents the thread in the list. */
  latest: DeliveredMessage;
};

/**
 * Groups a character's delivered mail into threads. A thread only ever contains
 * messages that have actually been delivered, so a follow-up cannot reveal that
 * an earlier message exists before its own moment arrives.
 */
export function threadsFor(
  characterId: string,
  state: GameState,
  now = Date.now(),
): Thread[] {
  const grouped = new Map<string, DeliveredMessage[]>();

  for (const message of inboxFor(characterId, state, now)) {
    const bucket = grouped.get(message.threadId);
    if (bucket) bucket.push(message);
    else grouped.set(message.threadId, [message]);
  }

  const threads: Thread[] = [];
  for (const [id, messages] of grouped) {
    // inboxFor returns newest first; a conversation reads oldest first.
    const ordered = [...messages].reverse();
    threads.push({ id, messages: ordered, latest: ordered[ordered.length - 1] });
  }

  // Threads sort by their most recent message, as an email client does.
  return threads.sort(
    (a, b) =>
      b.latest.section - a.latest.section ||
      (b.latest.offset ?? 0) - (a.latest.offset ?? 0),
  );
}

/** The thread containing a given message id, or null if it is not delivered. */
export function threadContaining(
  characterId: string,
  messageId: string,
  state: GameState,
  now = Date.now(),
): Thread | null {
  return (
    threadsFor(characterId, state, now).find((t) =>
      t.messages.some((m) => m.id === messageId),
    ) ?? null
  );
}
