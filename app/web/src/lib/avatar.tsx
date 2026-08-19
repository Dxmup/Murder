/**
 * Sender avatars.
 *
 * A circle of initials in a stable colour is most of why Gmail and Apple Mail
 * scan as fast as they do: the eye locates a known correspondent by colour and
 * shape before it has read a single word. In a dim room, at arm's length,
 * that is the difference between finding tonight's new message in one second
 * and reading six sender names to find it.
 *
 * The colour is a pure function of the sender name, so the same correspondent
 * is the same colour on every screen and across a reload — and, because it is
 * derived rather than stored, a sender invented later needs no palette entry.
 */

/** Eight hues, defined per theme in globals.css. */
const SLOTS = 8;

/**
 * FNV-1a. Any stable hash would do; this one is three lines, has no
 * dependencies, and spreads short strings like "R." and "Vale" evenly enough
 * that neighbouring rows rarely collide.
 */
function hash(value: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/**
 * One initial, or two when the name is plainly a person's.
 *
 * Display names here are messy — "Sasha Meline, Veridian Dynamics",
 * "Veridian Dynamics — house account", "Night Desk archive". Blindly taking
 * the first and last word produces nonsense pairs like SD for Sasha, so the
 * qualifier after a comma or dash is dropped first, and two initials are only
 * used for the two-capitalised-words shape a personal name actually has.
 * Everything else gets a single letter, which is what Gmail does for an
 * organisation and reads perfectly well.
 */
export function initialsFor(name: string): string {
  // "Sasha Meline, Veridian Dynamics" -> "Sasha Meline"
  const primary = name.split(/\s*[,(—–|]|\s-\s/)[0];

  const words = primary
    .split(/[\s/·.]+/)
    .map((word) => word.replace(/[^\p{L}\p{N}]/gu, ""))
    .filter(Boolean);

  if (words.length === 0) return name.trim().slice(0, 1).toUpperCase() || "?";

  const personal =
    words.length === 2 && words.every((w) => /^\p{Lu}/u.test(w) && w.length > 1);

  return personal
    ? (words[0][0] + words[1][0]).toUpperCase()
    : words[0][0].toUpperCase();
}

/**
 * The sender as a mail list shows them: the person, without their affiliation.
 *
 * The message data carries qualified senders — "Priya Raghunathan, Veridian
 * Dynamics", "Veridian Dynamics — house account" — because the message screen
 * wants the whole thing. A 390px row does not: qualified names truncate to
 * "Priya Raghunathan, Veridi…" and the eye has to read three rows of identical
 * prefix to tell them apart. Gmail shows the person in the list and saves the
 * affiliation for the open message; this does the same, using the same split
 * as the initials so the two never disagree about who a sender is.
 */
export function listNameOf(name: string): string {
  const primary = name.split(/\s*[,(—–|]|\s-\s/)[0].trim();
  return primary || name.trim();
}

export function avatarColor(name: string): string {
  return `var(--av-${(hash(name) % SLOTS) + 1})`;
}

/**
 * @param size the circle's diameter in pixels. 40 in the list, 44 on the
 * message screen, where the sender is the subject of the header rather than
 * one row among many.
 */
export function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  return (
    <span
      aria-hidden="true"
      className="flex shrink-0 select-none items-center justify-center rounded-full font-semibold leading-none text-av-fg"
      style={{
        width: size,
        height: size,
        // Inline because the value is data-derived; it is a plain string
        // computed identically on server and client, so there is nothing here
        // for hydration to disagree about.
        backgroundColor: avatarColor(name),
        fontSize: Math.round(size * 0.4),
      }}
    >
      {initialsFor(name)}
    </span>
  );
}
