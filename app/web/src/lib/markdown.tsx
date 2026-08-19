import type { ReactNode } from "react";

/**
 * A deliberately small Markdown renderer for one job: the character booklets
 * in `characters/`. An audit of all twenty found only headings (h1-h3), two
 * levels of unordered list, a single ordered list, bold, and italic — no
 * tables, links, code, or blockquotes. Rendering that subset directly costs a
 * few dozen lines and avoids pulling a parser onto a nearly full disk.
 *
 * Anything outside the subset degrades to plain text rather than breaking.
 */

type Block =
  | { kind: "heading"; level: 1 | 2 | 3; text: string }
  | { kind: "list"; ordered: boolean; items: { text: string; depth: number }[] }
  | { kind: "paragraph"; text: string };

const HEADING = /^(#{1,3})\s+(.*)$/;
const BULLET = /^(\s*)[-*]\s+(.*)$/;
const NUMBERED = /^(\s*)\d+\.\s+(.*)$/;

function parse(source: string): Block[] {
  const blocks: Block[] = [];
  const lines = source.replace(/\r\n/g, "\n").split("\n");

  let paragraph: string[] = [];
  let list: { ordered: boolean; items: { text: string; depth: number }[] } | null = null;

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push({ kind: "paragraph", text: paragraph.join(" ").trim() });
      paragraph = [];
    }
  };
  const flushList = () => {
    if (list) {
      blocks.push({ kind: "list", ...list });
      list = null;
    }
  };

  for (const line of lines) {
    if (!line.trim()) {
      flushParagraph();
      flushList();
      continue;
    }

    const heading = HEADING.exec(line);
    if (heading) {
      flushParagraph();
      flushList();
      blocks.push({
        kind: "heading",
        level: heading[1].length as 1 | 2 | 3,
        text: heading[2].trim(),
      });
      continue;
    }

    const bullet = BULLET.exec(line);
    const numbered = bullet ? null : NUMBERED.exec(line);
    const item = bullet ?? numbered;

    if (item) {
      flushParagraph();
      const ordered = Boolean(numbered);
      // Two spaces per level in the source; anything deeper clamps to one.
      const depth = Math.min(1, Math.floor(item[1].length / 2));
      if (!list || list.ordered !== ordered) {
        flushList();
        list = { ordered, items: [] };
      }
      list.items.push({ text: item[2].trim(), depth });
      continue;
    }

    flushList();
    paragraph.push(line.trim());
  }

  flushParagraph();
  flushList();
  return blocks;
}

/**
 * Inline emphasis. `**` is consumed before `*` so bold never gets shredded
 * into a pair of italics.
 */
function inline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let cursor = 0;
  let match: RegExpExecArray | null;
  let index = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > cursor) nodes.push(text.slice(cursor, match.index));

    const key = `${keyPrefix}-${index++}`;
    if (match[1] !== undefined) {
      nodes.push(
        <strong key={key} className="font-semibold text-strong">
          {match[1]}
        </strong>,
      );
    } else {
      nodes.push(
        <em key={key} className="italic text-body">
          {match[2]}
        </em>,
      );
    }
    cursor = match.index + match[0].length;
  }

  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}

const HEADING_CLASS: Record<1 | 2 | 3, string> = {
  1: "mt-8 text-[20px] font-semibold leading-tight tracking-tight text-strong",
  2: "mt-7 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted",
  3: "mt-5 text-[15px] font-semibold tracking-tight text-strong",
};

/**
 * @param stripTitle drops a leading level-1 heading, used where the surrounding
 * screen already shows the document's title.
 */
export function Markdown({
  source,
  stripTitle = false,
}: {
  source: string;
  stripTitle?: boolean;
}) {
  let blocks = parse(source);
  if (stripTitle && blocks[0]?.kind === "heading" && blocks[0].level === 1) {
    blocks = blocks.slice(1);
  }

  return (
    <div className="text-[15px] leading-relaxed text-body">
      {blocks.map((block, i) => {
        if (block.kind === "heading") {
          const Tag = (["h1", "h2", "h3"] as const)[block.level - 1];
          return (
            <Tag key={i} className={`${HEADING_CLASS[block.level]} first:mt-0`}>
              {inline(block.text, `h${i}`)}
            </Tag>
          );
        }

        if (block.kind === "list") {
          const Tag = block.ordered ? "ol" : "ul";
          return (
            <Tag key={i} className="mt-3 space-y-1.5">
              {block.items.map((item, j) => (
                <li
                  key={j}
                  className={`flex gap-2 ${item.depth > 0 ? "ml-4 text-body" : ""}`}
                >
                  <span aria-hidden="true" className="shrink-0 text-faint">
                    {block.ordered ? `${j + 1}.` : item.depth > 0 ? "–" : "•"}
                  </span>
                  <span>{inline(item.text, `l${i}-${j}`)}</span>
                </li>
              ))}
            </Tag>
          );
        }

        return (
          <p key={i} className="mt-3 first:mt-0">
            {inline(block.text, `p${i}`)}
          </p>
        );
      })}
    </div>
  );
}

export const __test = { parse };
export type { Block };
