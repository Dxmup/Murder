import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

/**
 * The only mutable state in the game: where each act's clock stands, and which
 * characters are in play tonight. Everything else — mail, briefings,
 * credentials — is static content baked at build time.
 *
 * Local dev persists to a JSON file. Vercel's filesystem is read-only at
 * runtime, so production swaps in the Supabase-backed store; both satisfy
 * `StateStore`, and nothing above this module knows which is in use.
 */

/** One stretch of wall-clock time during which the act was running. */
export type RunInterval = {
  start: number;
  /** Epoch ms the act was paused; null while still running. */
  end: number | null;
};

/**
 * An act is stored as the intervals it actually ran, not a single start stamp.
 * That costs a few bytes and buys the thing a start stamp cannot give us:
 * mapping a message's offset back to the real time it landed on a player's
 * phone, even across several pauses.
 */
export type ActClock = {
  intervals: RunInterval[];
};

export type GameState = {
  acts: Record<string, ActClock>;
  /** Character ids toggled out of play (no-show or cancellation). */
  disabled: string[];
};

export interface StateStore {
  read(): Promise<GameState>;
  write(state: GameState): Promise<void>;
}

export const ACTS = ["1", "2", "3"] as const;

export function initialState(): GameState {
  return {
    acts: Object.fromEntries(ACTS.map((a) => [a, { intervals: [] }])),
    disabled: [],
  };
}

export function elapsedMs(clock: ActClock, now = Date.now()): number {
  return clock.intervals.reduce((sum, i) => sum + ((i.end ?? now) - i.start), 0);
}

/** Minutes elapsed on an act's clock, counting only time it was running. */
export function elapsedMinutes(clock: ActClock, now = Date.now()): number {
  return elapsedMs(clock, now) / 60_000;
}

export function isRunning(clock: ActClock): boolean {
  return clock.intervals.some((i) => i.end === null);
}

export function hasStarted(clock: ActClock): boolean {
  return clock.intervals.length > 0;
}

export function start(clock: ActClock, now = Date.now()): ActClock {
  if (isRunning(clock)) return clock;
  return { intervals: [...clock.intervals, { start: now, end: null }] };
}

export function pause(clock: ActClock, now = Date.now()): ActClock {
  if (!isRunning(clock)) return clock;
  return {
    intervals: clock.intervals.map((i) => (i.end === null ? { ...i, end: now } : i)),
  };
}

export function reset(): ActClock {
  return { intervals: [] };
}

/**
 * The wall-clock time at which this act's clock reached `targetMs`, or null if
 * it has not reached it yet. This is what lets a delivered message show the
 * real time it arrived rather than an offset.
 */
export function wallClockAt(clock: ActClock, targetMs: number, now = Date.now()): number | null {
  let banked = 0;
  for (const interval of clock.intervals) {
    const span = (interval.end ?? now) - interval.start;
    if (banked + span >= targetMs) {
      return interval.start + (targetMs - banked);
    }
    banked += span;
  }
  return null;
}

class FileStore implements StateStore {
  constructor(private readonly path: string) {}

  async read(): Promise<GameState> {
    try {
      const parsed = JSON.parse(await readFile(this.path, "utf8")) as Partial<GameState>;
      return { ...initialState(), ...parsed };
    } catch {
      return initialState();
    }
  }

  async write(state: GameState): Promise<void> {
    await mkdir(dirname(this.path), { recursive: true });
    await writeFile(this.path, JSON.stringify(state, null, 2), "utf8");
  }
}

let store: StateStore | null = null;

export function getStore(): StateStore {
  if (!store) {
    store = new FileStore(join(process.cwd(), ".data", "state.json"));
  }
  return store;
}

/** Lets the production entrypoint (or a test) install a different backend. */
export function setStore(next: StateStore): void {
  store = next;
}
