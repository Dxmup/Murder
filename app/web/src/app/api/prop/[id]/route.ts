import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";
import { getProp } from "@/lib/content";
import { inboxFor } from "@/lib/delivery";
import { requireCharacter } from "@/lib/session";
import { getStore } from "@/lib/state";

export const dynamic = "force-dynamic";

/**
 * A prop scan, served only to a player whose delivered mail carries it. Props
 * are private to their holder, so the scans live outside public/ and a guessed
 * URL from any other account gets the same 404 as a prop that does not exist.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const characterId = await requireCharacter();
  if (!characterId || !getProp(id)) return new NextResponse(null, { status: 404 });

  const state = await getStore().read();
  const holds = inboxFor(characterId, state).some((m) => m.attachments.includes(id));
  if (!holds) return new NextResponse(null, { status: 404 });

  const image = await readFile(join(process.cwd(), "props", `${id}.jpg`));
  return new NextResponse(image, {
    headers: {
      "Content-Type": "image/jpeg",
      // Private: a shared cache must never hand one player's prop to another.
      "Cache-Control": "private, max-age=3600",
    },
  });
}
