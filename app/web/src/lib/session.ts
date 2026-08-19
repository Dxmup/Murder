import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "rmurder_session";
const HOST_ID = "host";

function secret(): string {
  const value = process.env.SESSION_SECRET;
  if (!value) {
    // A missing secret would silently downgrade every session to forgeable.
    throw new Error("SESSION_SECRET is not set");
  }
  return value;
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

/**
 * Cookie value is `<subject>.<signature>`. There is no expiry: the game runs
 * for one evening and a session expiring mid-party is worse than a stale one.
 */
export function mint(subject: string): string {
  return `${subject}.${sign(subject)}`;
}

export function verify(token: string | undefined): string | null {
  if (!token) return null;
  const cut = token.lastIndexOf(".");
  if (cut <= 0) return null;

  const subject = token.slice(0, cut);
  const provided = Buffer.from(token.slice(cut + 1));
  const expected = Buffer.from(sign(subject));

  if (provided.length !== expected.length) return null;
  return timingSafeEqual(provided, expected) ? subject : null;
}

export const SESSION_COOKIE = COOKIE;
export const HOST_SUBJECT = HOST_ID;

/** The signed-in subject: a character id, or "host". */
export async function currentSubject(): Promise<string | null> {
  const jar = await cookies();
  return verify(jar.get(COOKIE)?.value);
}

export async function requireCharacter(): Promise<string | null> {
  const subject = await currentSubject();
  return subject && subject !== HOST_ID ? subject : null;
}

export async function isHost(): Promise<boolean> {
  return (await currentSubject()) === HOST_ID;
}
