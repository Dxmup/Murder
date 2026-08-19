import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Avatar } from "@/lib/avatar";
import { EVERYONE, getCharacter } from "@/lib/content";
import { Markdown } from "@/lib/markdown";
import { MailBody } from "@/lib/mailbody";
import { DeliveredMessage, threadContaining } from "@/lib/delivery";
import { requireCharacter } from "@/lib/session";
import { getStore } from "@/lib/state";

export const dynamic = "force-dynamic";

/**
 * How a message's provenance is presented. The rule from app/README.md is
 * one-directional: the interface may weaken a claim, never strengthen one. So
 * every note below subtracts confidence, and "original" says nothing at all
 * rather than implying the app has authenticated anything.
 */
const PROVENANCE: Record<string, { label: string; note: string }> = {
  archived: {
    label: "Archived copy",
    note: "A copy someone kept. The original is not here to compare it against.",
  },
  forwarded: {
    label: "Forwarded",
    note: "Forwarded text can be trimmed or altered. Only the forwarding is confirmed.",
  },
  recovered: {
    label: "Recovered",
    note: "Pulled from deleted or damaged storage. Author, date and completeness are unverified.",
  },
  disputed: {
    label: "Disputed",
    note: "Someone has contested that this message is what it appears to be.",
  },
  system: {
    label: "System",
    note: "Sent by the party's mail system rather than by a guest.",
  },
};

function timeOf(deliveredAt: number | null): string {
  if (deliveredAt === null) return "";
  return new Date(deliveredAt).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function MessagePage({ params }: { params: Promise<{ id: string }> }) {
  const characterId = await requireCharacter();
  if (!characterId) redirect("/login");

  const { id } = await params;
  const state = await getStore().read();

  // Read through the delivered set, never the full manifest: an undelivered
  // message must 404 rather than be reachable by guessing its id.
  const thread = threadContaining(characterId, id, state);
  if (!thread) notFound();

  // The newest delivered message heads the screen; earlier ones follow beneath
  // it, so a follow-up always arrives with the exchange it belongs to.
  const message = thread.latest;
  const earlier = thread.messages.slice(0, -1).reverse();

  const character = getCharacter(characterId);
  const to =
    message.recipient === EVERYONE
      ? "Everyone at Fifteen Years of R"
      : (character?.name ?? "");

  // Pre-loaded mail keeps its narrative date and is labelled as dated, not
  // delivered, so a fifteen-year-old letter never reads as just-arrived.
  const briefing = message.type === "briefing";
  const historical = message.section === 0 && !briefing;
  const dated = briefing || historical;

  // Three date framings, never interchangeable: the briefing was written
  // before the party, kept mail carries a narrative date, and live mail
  // carries tonight's clock.
  const when = dated ? message.narrativeDate : timeOf(message.deliveredAt);

  const provenance = PROVENANCE[message.provenance];

  return (
    <main className="flex min-h-dvh flex-col bg-surface text-strong">
      <header className="sticky top-0 z-10 border-b border-line bg-surface/95 backdrop-blur">
        <Link
          href="/"
          className="flex min-h-14 w-fit items-center gap-1 pl-3 pr-5 text-[16px] text-brand active:opacity-70"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-5"
          >
            <path d="m15 5-7 7 7 7" />
          </svg>
          Inbox
        </Link>
      </header>

      <article className="mx-auto w-full max-w-2xl flex-1 px-4 pb-24 pt-4">
        <h1 className="text-[24px] font-semibold leading-[1.2] tracking-tight text-strong">
          {message.subject}
        </h1>

        {/*
          The header block of a real client: who it is from, in what account,
          who it went to, and when. The briefing is the character's own notes,
          so From and To would both read as their own name and look like a
          rendering fault — it gets the date line only.
        */}
        <div className="mt-4 flex items-start gap-3">
          <Avatar name={message.from} size={44} />

          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-3">
              <p className="min-w-0 flex-1 truncate text-[16px] font-semibold leading-snug text-strong">
                {briefing ? "Your own notes" : message.from}
              </p>
              {!dated && when ? (
                <p className="shrink-0 text-[13px] tabular-nums leading-snug text-muted">
                  {when}
                </p>
              ) : null}
            </div>

            {/*
              The address, when the sender has a mailbox at all. Senders like
              an unknown number or a physical archive have none, and a real
              client simply shows the name — it never invents an address.
            */}
            {!briefing && message.fromAddress ? (
              <p className="mt-0.5 truncate text-[13px] leading-snug text-faint">
                {message.fromAddress}
              </p>
            ) : null}

            <p className="mt-1 truncate text-[13px] leading-snug text-muted">
              {briefing ? (
                <span className="italic">{when}</span>
              ) : (
                <>
                  to {to}
                  {historical && when ? (
                    <>
                      {" · "}
                      <span className="italic text-accent">{when}</span>
                    </>
                  ) : null}
                </>
              )}
            </p>
          </div>
        </div>

        {briefing ? null : (
          <p className="mt-3 text-[12px] leading-snug text-faint">
            From shows the account, not proof of who typed it.
          </p>
        )}

        {provenance ? (
          <div className="mt-4 rounded-lg border border-accent-line bg-accent-soft px-3.5 py-3">
            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-accent">
              {provenance.label}
            </p>
            <p className="mt-1 text-[14px] leading-snug text-muted">{provenance.note}</p>
          </div>
        ) : null}

        <div className="mt-5 border-t border-line pt-6" id="body">
          {briefing ? (
            // The booklet is authored Markdown; every other message is plain
            // text and must not be run through a parser that could reinterpret
            // an asterisk in the fiction as formatting.
            <Markdown source={message.body} stripTitle />
          ) : (
            <MailBody source={message.body} />
          )}
        </div>

        {earlier.length > 0 ? (
          <section className="mt-12 border-t border-line pt-6">
            <h2 className="text-[13px] font-semibold text-muted">
              Earlier in this exchange
            </h2>
            <ol className="mt-4 space-y-6">
              {earlier.map((prior: DeliveredMessage) => (
                <li key={prior.id} className="rounded-lg border border-line bg-raised p-4">
                  <div className="flex items-start gap-2.5">
                    <Avatar name={prior.from} size={32} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[15px] font-semibold leading-snug text-strong">
                        {prior.from}
                      </p>
                      <p className="truncate text-[13px] leading-snug text-faint">
                        {prior.deliveredAt !== null ? (
                          timeOf(prior.deliveredAt)
                        ) : prior.narrativeDate ? (
                          <span className="italic">{prior.narrativeDate}</span>
                        ) : null}
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 text-[15px] font-medium leading-snug text-strong">
                    {prior.subject}
                  </p>
                  <div className="mt-2">
                    <MailBody source={prior.body} size="compact" />
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ) : null}
      </article>
    </main>
  );
}
