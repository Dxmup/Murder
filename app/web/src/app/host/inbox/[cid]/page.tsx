import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCharacter } from "@/lib/content";
import { inboxFor, pendingFor } from "@/lib/delivery";
import { isHost } from "@/lib/session";
import { getStore } from "@/lib/state";

export const dynamic = "force-dynamic";

/** Read-only view of any character's inbox, for the host only. */
export default async function HostInboxPage({ params }: { params: Promise<{ cid: string }> }) {
  if (!(await isHost())) redirect("/login");

  const { cid } = await params;
  const character = getCharacter(cid);
  if (!character) notFound();

  const state = await getStore().read();
  const delivered = inboxFor(cid, state);
  const pending = pendingFor(cid, state);

  return (
    <main className="min-h-dvh bg-surface px-4 py-5 text-strong">
      <Link href="/host" className="text-sm text-muted">
        ← Host
      </Link>

      <h1 className="mt-3 text-base font-medium tracking-tight">{character.name}</h1>
      <p className="text-xs text-muted">{character.publicRole}</p>

      <h2 className="mt-6 text-xs uppercase tracking-wide text-muted">
        Delivered ({delivered.length})
      </h2>
      <ul className="mt-2 divide-y divide-line">
        {delivered.map((message) => (
          <li key={message.id} className="py-2">
            <div className="text-sm">{message.subject}</div>
            <div className="text-xs text-muted">
              {message.from} · act {message.section}
              {message.offset !== null ? ` · +${message.offset}m` : ""}
            </div>
          </li>
        ))}
      </ul>

      <h2 className="mt-6 text-xs uppercase tracking-wide text-muted">
        Queued ({pending.length})
      </h2>
      <ul className="mt-2 divide-y divide-line">
        {pending.map((message) => (
          <li key={message.id} className="py-2 text-muted">
            <div className="text-sm">{message.subject}</div>
            <div className="text-xs text-faint">
              {message.from} · act {message.section}
              {message.offset !== null ? ` · +${message.offset}m` : ""}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
