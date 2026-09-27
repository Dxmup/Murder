import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { inboxFor } from "@/lib/delivery";
import { READ_COOKIE, parseRead } from "@/lib/readstate";
import { requireCharacter } from "@/lib/session";
import { getStore } from "@/lib/state";

export const dynamic = "force-dynamic";

/**
 * What the phone polls while a player's page is open: the ids of every message
 * delivered so far and how many are unread. Bodies stay server-side; the page
 * refreshes itself to show them.
 */
export async function GET() {
  const characterId = await requireCharacter();
  if (!characterId) return NextResponse.json({ error: "signed out" }, { status: 401 });

  const state = await getStore().read();
  const ids = inboxFor(characterId, state).map((m) => m.id);
  const seen = parseRead((await cookies()).get(READ_COOKIE)?.value);
  const unread = ids.filter((id) => !seen.has(id)).length;

  return NextResponse.json({ ids, unread }, { headers: { "Cache-Control": "no-store" } });
}
