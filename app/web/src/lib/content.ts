import charactersJson from "@/data/generated/characters.json";
import messagesJson from "@/data/generated/messages.json";
import propsJson from "@/data/generated/props.json";

export const EVERYONE = "everyone";

export type Character = {
  id: string;
  name: string;
  availability: "core" | "optional";
  publicRole: string;
  socialMode: string;
  briefing: string;
};

export type MessageType =
  | "welcome"
  | "historical"
  | "live"
  | "final"
  | "briefing"
  | "props";

/** A physical prop, pictured in the inbox of the character who holds it. */
export type Prop = { id: string; title: string; caption: string };

/** Synthetic id for the private briefing, which has no row in messages.csv. */
export const BRIEFING_ID = "BRIEFING";

export type GameMessage = {
  id: string;
  /** Messages sharing a threadId are one correspondence. Standalone mail uses its own id. */
  threadId: string;
  /** The message this one answers, when it continues an earlier exchange. */
  inReplyTo: string | null;
  type: MessageType;
  /** 0 = pre-loaded inbox; 1-3 = live acts. */
  section: number;
  /** A character id, or EVERYONE for an all-guest message. */
  recipient: string;
  /** Authored offset in minutes, before act compression. */
  authoredOffset: number | null;
  /** Delivery offset in minutes from the start of its act. */
  offset: number | null;
  narrativeDate: string;
  provenance: string;
  from: string;
  /** Sender mailbox, or null for a sender that has no address (an unknown number). */
  fromAddress: string | null;
  subject: string;
  body: string;
  factRefs: string[];
  /** Prop ids pictured beneath the body. */
  attachments: string[];
};

export const characters = charactersJson as Character[];
export const messages = messagesJson as GameMessage[];

const props = propsJson as Prop[];

const byId = new Map(characters.map((c) => [c.id, c]));
const propById = new Map(props.map((p) => [p.id, p]));

export function getProp(id: string): Prop | undefined {
  return propById.get(id);
}

export function getCharacter(id: string): Character | undefined {
  return byId.get(id);
}

/**
 * The private briefing carrying the character's booklet.
 *
 * `design/messages.md` deliberately keeps briefings out of messages.csv and has
 * the app render them straight from `characters/`, so this row is synthesised
 * rather than loaded. It is framed as the character's own preparation — mail
 * they wrote to themselves — which keeps the inbox reading as their archive
 * instead of a game menu handing out a dossier.
 */
export function briefingFor(characterId: string): GameMessage | null {
  const character = byId.get(characterId);
  if (!character?.briefing) return null;

  return {
    id: BRIEFING_ID,
    threadId: BRIEFING_ID,
    inReplyTo: null,
    type: "briefing",
    section: 0,
    recipient: characterId,
    authoredOffset: null,
    offset: null,
    narrativeDate: "Written before the party",
    provenance: "original",
    from: character.name,
    fromAddress: null,
    subject: "Before tonight",
    body: character.briefing,
    factRefs: [],
    attachments: [],
  };
}

/**
 * Every message this character can ever receive, in the order the inbox
 * should show it: pre-loaded mail first by act, then by delivery offset.
 * Delivery gating is applied separately — this is the full manifest.
 */
export function manifestFor(characterId: string): GameMessage[] {
  const briefing = briefingFor(characterId);

  return [
    ...(briefing ? [briefing] : []),
    ...messages.filter((m) => m.recipient === characterId || m.recipient === EVERYONE),
  ].sort((a, b) => a.section - b.section || (a.offset ?? 0) - (b.offset ?? 0));
}

/** Longest authored offset in an act, i.e. how long that act's mail runs. */
export function actRunway(section: number): number {
  return messages
    .filter((m) => m.section === section && m.offset !== null)
    .reduce((max, m) => Math.max(max, m.offset ?? 0), 0);
}
