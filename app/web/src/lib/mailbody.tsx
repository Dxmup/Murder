/**
 * Message bodies, set for sustained reading.
 *
 * Message text is plain, never Markdown: an asterisk inside the fiction is an
 * asterisk. What this does recognise is the structure real mail actually has —
 * paragraphs, a signature block, and quoted reply text — because those three
 * are the difference between a wall of type and something a player can skim in
 * fifteen seconds and take back into the room.
 *
 * Every rule below is conservative. Anything unrecognised falls through to a
 * plain paragraph, which is always a correct rendering.
 */

type Block =
  | { kind: "paragraph"; text: string }
  | { kind: "attribution"; text: string }
  | { kind: "quote"; text: string }
  | { kind: "signature"; text: string };

/** `> quoted`, the convention every mail client on earth emits. */
const QUOTE_LINE = /^\s*>+\s?/;
/** The RFC 3676 signature separator, plus the em-dash form people type. */
const SIG_SEPARATOR = /^\s*(--|—)\s*$/;
/** "On Tuesday, Vale wrote:" — the line a client puts above a quote. */
const ATTRIBUTION = /(wrote|writes|forwarded|said):\s*$/i;

function isQuoted(paragraph: string): boolean {
  const lines = paragraph.split("\n").filter((l) => l.trim());
  return lines.length > 0 && lines.every((l) => QUOTE_LINE.test(l));
}

/**
 * Strips the `> ` markers and unwraps the sender's hard line breaks. Quoted
 * text arrives wrapped for a 78-column terminal; replayed literally on a
 * 390px screen every second line is a ragged stub. Blank lines inside the
 * quote are real paragraph breaks and survive.
 */
function stripQuote(paragraph: string): string {
  return paragraph
    .split("\n")
    .map((l) => l.replace(QUOTE_LINE, ""))
    .join("\n")
    .split(/\n{2,}/)
    .map((part) => part.split("\n").join(" ").replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n\n")
    .trim();
}

export function parseBody(source: string): Block[] {
  const paragraphs = source
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((p) => p.replace(/\s+$/, ""))
    .filter((p) => p.trim());

  const blocks: Block[] = [];
  let inSignature = false;

  for (const paragraph of paragraphs) {
    const lines = paragraph.split("\n");

    // A separator on its own turns everything after it into the signature.
    // The separator itself is not rendered; the block's styling says it.
    if (lines.every((l) => SIG_SEPARATOR.test(l) || !l.trim())) {
      inSignature = true;
      continue;
    }

    // A leading separator line with the signature on the lines beneath it.
    if (SIG_SEPARATOR.test(lines[0])) {
      inSignature = true;
      const rest = lines.slice(1).join("\n").trim();
      if (rest) blocks.push({ kind: "signature", text: rest });
      continue;
    }

    // Quoted text and its attribution line end the signature. Mail clients
    // routinely put the reply history *below* the sign-off, and treating that
    // history as part of the signature left the "> " markers on screen.
    if (isQuoted(paragraph)) {
      inSignature = false;
      blocks.push({ kind: "quote", text: stripQuote(paragraph) });
      continue;
    }

    if (lines.length === 1 && ATTRIBUTION.test(paragraph) && paragraph.length < 120) {
      inSignature = false;
      blocks.push({ kind: "attribution", text: paragraph.trim() });
      continue;
    }

    if (inSignature) {
      blocks.push({ kind: "signature", text: paragraph });
      continue;
    }

    blocks.push({ kind: "paragraph", text: paragraph });
  }

  return blocks;
}

/**
 * Plain preview text: quotes and signatures stripped, whitespace collapsed.
 * A list row that previews a quoted reply shows the player nothing they have
 * not already read.
 */
export function previewOf(source: string, limit = 120): string {
  const flat = parseBody(source)
    .filter((b) => b.kind === "paragraph")
    .map((b) => b.text)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  const text = flat || source.replace(/\s+/g, " ").trim();
  return text.length <= limit ? text : `${text.slice(0, limit).trimEnd()}…`;
}

/**
 * @param size `full` is the message being read: 17px, generous leading, and a
 * measure that stops around 66 characters even on a tablet. `compact` is an
 * earlier message in the same thread, one step down so the newest message
 * still owns the screen.
 */
export function MailBody({
  source,
  size = "full",
}: {
  source: string;
  size?: "full" | "compact";
}) {
  const blocks = parseBody(source);
  const full = size === "full";

  return (
    <div
      className={
        full
          ? "max-w-[66ch] text-[17px] leading-[1.65] text-body"
          : "max-w-[66ch] text-[15px] leading-[1.6] text-body"
      }
    >
      {blocks.map((block, i) => {
        if (block.kind === "quote") {
          return (
            <blockquote
              key={i}
              className="mt-4 whitespace-pre-line border-l-2 border-line-strong pl-4 text-muted first:mt-0"
            >
              {block.text}
            </blockquote>
          );
        }

        if (block.kind === "attribution") {
          return (
            <p key={i} className="mt-5 text-[14px] leading-snug text-faint first:mt-0">
              {block.text}
            </p>
          );
        }

        if (block.kind === "signature") {
          return (
            <p
              key={i}
              className={`whitespace-pre-line text-[14px] leading-relaxed text-muted ${
                // The rule sits above the first signature paragraph only, so a
                // three-line sign-off does not get three rules.
                blocks[i - 1]?.kind === "signature"
                  ? "mt-2"
                  : "mt-6 border-t border-line pt-4"
              }`}
            >
              {block.text}
            </p>
          );
        }

        return (
          <p key={i} className={`whitespace-pre-line ${full ? "mt-5" : "mt-4"} first:mt-0`}>
            {block.text}
          </p>
        );
      })}
    </div>
  );
}
