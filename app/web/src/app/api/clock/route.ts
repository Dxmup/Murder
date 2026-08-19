import { NextResponse } from "next/server";
import { isHost } from "@/lib/session";
import { ACTS, getStore, pause, reset, start } from "@/lib/state";

export async function POST(request: Request) {
  if (!(await isHost())) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const form = await request.formData();
  const act = String(form.get("act") ?? "");
  const action = String(form.get("action") ?? "");

  if (!(ACTS as readonly string[]).includes(act)) {
    return NextResponse.json({ error: "unknown act" }, { status: 400 });
  }

  const store = getStore();
  const state = await store.read();
  const clock = state.acts[act];

  const next =
    action === "start"
      ? start(clock)
      : action === "pause"
        ? pause(clock)
        : action === "reset"
          ? reset()
          : null;

  if (next === null) {
    return NextResponse.json({ error: "unknown action" }, { status: 400 });
  }

  await store.write({ ...state, acts: { ...state.acts, [act]: next } });
  return NextResponse.redirect(new URL("/host", request.url), { status: 303 });
}
