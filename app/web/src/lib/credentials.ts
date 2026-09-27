import { timingSafeEqual } from "node:crypto";
import { HOST_SUBJECT } from "@/lib/session";

/**
 * In-fiction credentials for a party game, not real accounts; no mailbox
 * exists behind any address here. Each character's password is authored in
 * the credentials JSON (some hide a clue) and texted to the player with the
 * link. The address is kept for the To: line of the fiction.
 */
export type Credential = {
  id: string;
  name: string;
  email: string;
  password: string;
  significance: string;
  carriesInfo: boolean;
  infoNote: string;
};

// Authored in two halves so the files stay reviewable; merged at build.
import partA from "@/data/credentials-c01-c10.json";
import partB from "@/data/credentials-c11-c20.json";

export const credentials: Credential[] = [
  ...(partA as Credential[]),
  ...(partB as Credential[]),
].sort((a, b) => a.id.localeCompare(b.id));

/**
 * Players get a link and a password by text, so the password alone picks the
 * inbox. Phones capitalise the first letter and some players will type the
 * words with spaces, so both are ignored when matching.
 */
export function normalisePassword(raw: string): string {
  return raw.toLowerCase().replace(/[^a-z0-9]/g, "");
}

const byPassword = new Map<string, Credential>();
for (const c of credentials) {
  const key = normalisePassword(c.password);
  const clash = byPassword.get(key);
  if (clash) throw new Error(`${c.id} and ${clash.id} share a password`);
  byPassword.set(key, c);
}

function constantTimeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

/**
 * Resolves a password to a subject id, or null. The host password lives in
 * HOST_PASSWORD, never in the character files, so the dashboard is never
 * reachable with a character's password.
 */
export function authenticate(password: string): string | null {
  const key = normalisePassword(password);
  if (!key) return null;

  const hostPassword = process.env.HOST_PASSWORD;
  if (hostPassword) {
    const hostKey = normalisePassword(hostPassword);
    if (byPassword.has(hostKey)) throw new Error("HOST_PASSWORD matches a character password");
    if (constantTimeEqual(key, hostKey)) return HOST_SUBJECT;
  }

  return byPassword.get(key)?.id ?? null;
}

export function credentialFor(id: string): Credential | undefined {
  return credentials.find((c) => c.id === id);
}
