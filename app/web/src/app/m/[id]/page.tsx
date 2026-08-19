import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { EVERYONE, getCharacter } from "@/lib/content";
import { Markdown } from "@/lib/markdown";
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

  // Three date framings, never interchangeable: the briefing was written
  // before the party, kept mail carries a narrative date, and live mail
  // carries tonight's clock.
  const dateLabel = briefing ? "Written" : historical ? "Dated" : "Arrived";
  const when =
    briefing || historical
      ? message.narrativeDate
      : message.deliveredAt
        ? new Date(message.deliveredAt).toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          })
        : "";

  const provenance = PROVENANCE[message.provenance];

  return (
    <main className="flex min-h-dvh flex-col bg-surface text-strong">
      <header className="sticky top-0 z-10 border-b border-line bg-surface/95 backdrop-blur">
        <Link
          href="/"
          className="flex min-h-11 items-center gap-1.5 px-4 text-sm text-muted active:text-strong"
        >
          <span aria-hidden="true" className="text-base leading-none">
            ‹
          </span>
          Inbox
        </Link>
      </header>

      <article className="flex-1 px-4 pb-16 pt-5">
        <h1 className="text-[22px] font-semibold leading-tight tracking-tight text-strong">
          {message.subject}
        </h1>

        <dl className="mt-4 grid grid-cols-[3.25rem_1fr] gap-x-3 gap-y-1.5 text-[13px] leading-snug">
          {/*
            The briefing is the character's own notes, so From and To would
            both read as their own name and look like a rendering fault.
          */}
          {briefing ? null : (
            <>
              <dt className="text-[11px] uppercase tracking-wider text-faint pt-px">From</dt>
              <dd className="text-body">{message.from}</dd>

              <dt className="text-[11px] uppercase tracking-wider text-faint pt-px">To</dt>
              <dd className="text-body">{to}</dd>
            </>
          )}

          <dt className="text-[11px] uppercase tracking-wider text-faint pt-px">
            {dateLabel}
          </dt>
          <dd className={briefing || historical ? "italic text-muted" : "text-body"}>
            {when}
            {briefing || historical ? null : (
              <span className="text-muted"> · tonight</span>
            )}
          </dd>
        </dl>

        {briefing ? null : (
          <p className="mt-2.5 text-[11px] leading-snug text-muted">
            From shows the account, not proof of who typed it.
          </p>
        )}

        {provenance ? (
          <div className="mt-4 rounded border border-line bg-raised px-3 py-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">
              {provenance.label}
            </p>
            <p className="mt-1 text-[12px] leading-snug text-muted">{provenance.note}</p>
          </div>
        ) : null}

        <div className="mt-6 border-t border-line pt-6" id="body">
          {briefing ? (
            // The booklet is authored Markdown; every other message is plain
            // text and must not be run through a parser that could reinterpret
            // an asterisk in the fiction as formatting.
            <Markdown source={message.body} stripTitle />
          ) : (
            <div className="space-y-4 text-[15px] leading-relaxed text-body">
              {message.body.split(/\n{2,}/).map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          )}
        </div>


        {earlier.length > 0 ? (
          <section className="mt-10 border-t border-line pt-6">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
              Earlier in this exchange
            </h2>
            <ol className="mt-4 space-y-5">
              {earlier.map((prior: DeliveredMessage) => (
                <li key={prior.id} className="border-l-2 border-line pl-4">
                  <p className="text-[13px] text-muted">
                    <span className="text-body">{prior.from}</span>
                    {prior.deliveredAt ? (
                      <>
                        {" · "}
                        {new Date(prior.deliveredAt).toLocaleTimeString([], {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </>
                    ) : prior.narrativeDate ? (
                      <>
                        {" · "}
                        <span className="italic">{prior.narrativeDate}</span>
                      </>
                    ) : null}
                  </p>
                  <p className="mt-0.5 text-[15px] font-medium text-strong">{prior.subject}</p>
                  <div className="mt-2 space-y-3 text-[15px] leading-relaxed text-body">
                    {prior.body.split(/\n{2,}/).map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
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
