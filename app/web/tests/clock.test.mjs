import { initialState, start, pause, elapsedMinutes, isRunning, wallClockAt, reset } from "../.test-build/state.js";

const M = 60_000;
let fails = 0;
const eq = (label, got, want) => {
  const ok = Math.abs(got - want) < 1e-6 || got === want;
  if (!ok) { console.log(`FAIL ${label}: got ${got}, want ${want}`); fails++; }
  else console.log(`ok   ${label}`);
};

const T0 = 1_000_000_000_000;

// A single uninterrupted run.
let c = start(initialState().acts["1"], T0);
eq("running", isRunning(c), true);
eq("elapsed after 10m", elapsedMinutes(c, T0 + 10 * M), 10);

// Pause banks time and freezes the clock.
const paused = pause(c, T0 + 10 * M);
eq("paused not running", isRunning(paused), false);
eq("elapsed frozen at 10m", elapsedMinutes(paused, T0 + 45 * M), 10);

// Resume 30 minutes of wall time later; only running time counts.
const resumed = start(paused, T0 + 40 * M);
eq("elapsed after resume +5m", elapsedMinutes(resumed, T0 + 45 * M), 15);

// Double-start must not create a second open interval.
eq("double start is a no-op", start(resumed, T0 + 46 * M).intervals.length, resumed.intervals.length);
// Double-pause likewise.
const p2 = pause(resumed, T0 + 45 * M);
eq("double pause is a no-op", pause(p2, T0 + 50 * M).intervals.filter(i => i.end === null).length, 0);

// wallClockAt maps an offset back across the pause gap.
eq("wallClock 5m -> during first run", wallClockAt(resumed, 5 * M, T0 + 45 * M), T0 + 5 * M);
eq("wallClock 10m -> boundary", wallClockAt(resumed, 10 * M, T0 + 45 * M), T0 + 10 * M);
eq("wallClock 12m -> after resume", wallClockAt(resumed, 12 * M, T0 + 45 * M), T0 + 42 * M);
eq("wallClock 99m -> not yet reached", wallClockAt(resumed, 99 * M, T0 + 45 * M), null);

// A never-started act delivers nothing.
const fresh = reset();
eq("fresh elapsed", elapsedMinutes(fresh, T0), 0);
eq("fresh wallClock null", wallClockAt(fresh, 0, T0), null);

console.log(fails === 0 ? "\nALL PASS" : `\n${fails} FAILURES`);
process.exit(fails ? 1 : 0);
