# App — The Character Inbox

The player app is a single email-style inbox. It should feel like a partial, biased archive belonging to the character, not a collection of game menus.

The inbox contains every required player-facing element:

- a welcome email with the public premise and practical instructions;
- a private briefing email containing the character booklet;
- character-specific historical emails and recovered correspondence;
- messages delivered during the game's three live sections;
- a final reconstruction email linking to the ballot.

Players may reread any delivered email from the same chronological list. There are no separate story, booklet, evidence, or ballot screens. Attachments open from their parent email, and the ballot is reached only through the final reconstruction message.

## Message presentation

Every inbox item uses the same visible fields:

- `From:` fictional presentation; it authenticates only the displayed account unless the text establishes more;
- `To:` the true in-game visibility of the item;
- `Date:` the narrative date for historical mail or actual delivery time for live mail;
- `Subject:` a short, useful hook;
- body;
- optional attachments.

Forwarded, archived, recovered, drafted, and potentially spoofed messages must be identified in the presentation or body. The interface must never silently make their provenance stronger than the fiction supports.

## Delivery

Pre-game mail is present when the player first signs in. It may include old correspondence with original narrative dates; those dates must remain visually distinct from the current game clock.

The host dashboard has one **Send Section** control for each live section. Pressing it starts that section's queue. Messages addressed to `Everyone at Fifteen Years of R` notify all players together; individual mail arrives at the configured offsets.

The final live message tells players that no further mail will arrive and opens the ballot. The ballot remains a form reached from that email, not a persistent navigation destination.

## Design boundaries

The inbox delivers claims, traces, private context, and provocations—not authoritative deductions. In particular:

- an R-associated sender does not identify who controlled the account;
- an email about the rumored article does not establish that a complete article existed;
- a recovered message does not automatically authenticate its author, date, or completeness;
- Vale's escalating fears must remain compatible with surveillance, coincidence, manipulation, performance, or misinterpretation;
- historical mail should be distributed so no inbox contains the complete Progressive reconstruction;
- live messages should take under twenty seconds to read and send the recipient back into the party to find someone, seek privacy, compare accounts, or move an object.

The app does not provide player-to-player chat or track objects, promises, private conversations, deductions, inventories, credibility, or evidence graphs.

Canonical inputs:

- roster and availability: `design/data/characters.csv`;
- private briefing content: `characters/`;
- inbox records and delivery schedule: `design/data/messages.csv`;
- ballot choices and endings: `design/canon.md`.
