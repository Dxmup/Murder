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
    <main className="mx-auto min-h-dvh w-full max-w-2xl bg-surface px-4 py-5 text-strong">
      <Link href="/host" className="text-[15px] text-brand">
        ← Host
      </Link>

      <h1 className="mt-3 text-[20px] font-semibold tracking-tight">{character.name}</h1>
      <p className="text-[13px] text-muted">{character.publicRole}</p>

      <h2 className="mt-7 text-[13px] font-semibold text-muted">
        Delivered ({delivered.length})
      </h2>
      <ul className="mt-1 divide-y divide-line">
        {delivered.map((message) => (
          <li key={message.id} className="py-2.5">
            <div className="text-[15px] text-strong">{message.subject}</div>
            <div className="text-[13px] text-muted">
              {message.from} · act {message.section}
              {message.offset !== null ? ` · +${message.offset}m` : ""}
            </div>
          </li>
        ))}
      </ul>

      <h2 className="mt-7 text-[13px] font-semibold text-muted">
        Queued ({pending.length})
      </h2>
      <ul className="mt-1 divide-y divide-line">
        {pending.map((message) => (
          <li key={message.id} className="py-2.5">
            <div className="text-[15px] text-muted">{message.subject}</div>
            <div className="text-[13px] text-faint">
              {message.from} · act {message.section}
              {message.offset !== null ? ` · +${message.offset}m` : ""}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
