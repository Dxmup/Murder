import { timingSafeEqual } from "node:crypto";
import { HOST_SUBJECT } from "@/lib/session";

/**
 * In-fiction credentials. These are usernames and passwords for a party game,
 * not real accounts — no mailbox exists behind any address here. They are
 * authored per character (see design notes in credentials JSON) and handed to
 * players ahead of the evening.
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

const byEmail = new Map(credentials.map((c) => [c.email.toLowerCase(), c]));

function constantTimeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

/**
 * Resolves a sign-in to a subject id, or null. The host signs in with the
 * address in HOST_EMAIL and the password in HOST_PASSWORD so that the
 * dashboard is never reachable with a character's credentials.
 */
export function authenticate(email: string, password: string): string | null {
  const normalised = email.trim().toLowerCase();

  const hostEmail = process.env.HOST_EMAIL?.toLowerCase();
  const hostPassword = process.env.HOST_PASSWORD;
  if (hostEmail && hostPassword && normalised === hostEmail) {
    return constantTimeEqual(password, hostPassword) ? HOST_SUBJECT : null;
  }

  const record = byEmail.get(normalised);
  if (!record) return null;
  return constantTimeEqual(password, record.password) ? record.id : null;
}

export function credentialFor(id: string): Credential | undefined {
  return credentials.find((c) => c.id === id);
}
