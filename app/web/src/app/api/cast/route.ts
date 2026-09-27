import { NextResponse } from "next/server";
import { characters } from "@/lib/content";
import { isHost } from "@/lib/session";
import { getStore } from "@/lib/state";

/**
 * Switches a character in or out of play for tonight (a no-show, or an
 * optional role nobody took). Out of play means the password stops working
 * and any open session is signed out; the character's mail is untouched.
 */
export async function POST(request: Request) {
  if (!(await isHost())) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const form = await request.formData();
  const id = String(form.get("id") ?? "");
  const inPlay = String(form.get("inPlay") ?? "") === "true";

  if (!characters.some((c) => c.id === id)) {
    return NextResponse.json({ error: "unknown character" }, { status: 400 });
  }

  const store = getStore();
  const state = await store.read();
  const disabled = new Set(state.disabled);
  if (inPlay) disabled.delete(id);
  else disabled.add(id);

  await store.write({ ...state, disabled: [...disabled].sort() });
  return NextResponse.redirect(new URL("/host", request.url), { status: 303 });
}
