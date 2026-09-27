/**
 * Which messages this handset has already opened. Read state is per-device and
 * disposable (a scanning aid for a player standing in a dark room, not game
 * state), so it lives in a plain cookie rather than the shared store.
 */
export const READ_COOKIE = "rmurder_read";
export const READ_MAX = 200;

export function parseRead(value: string | undefined): Set<string> {
  if (!value) return new Set();
  return new Set(value.split(",").filter(Boolean));
}
