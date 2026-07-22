# Inbox and Messaging System

## Principle

The inbox is the player's single digital interface and the character's partial, biased archive. The game itself takes place throughout the host's house as a free-moving party. Background, private briefing, historical correspondence, live pressure, and the final ballot invitation all use the same email form.

The inbox may introduce information naturally, but it never acts as an oracle. Every item has a source, provenance, recipient boundary, and reason to exist in that character's account. It delivers claims and traces, not canonical answers.

## Inbox item types

### Welcome

Present before play. Establishes the public premise, gathering, etiquette, and practical rules. It may include a public cast list. It contains no private character knowledge.

### Private briefing

Present before play and addressed only to its player. Contains the canonical character booklet: identity, history, beliefs, goals, knowledge, secrets, offers, relationships, and ways to begin. This is formatted as a private briefing email even when it is not literal correspondence inside the fiction.

### Historical

Present before play with an original narrative date. Includes character-specific correspondence, archived mail, drafts, forwards, account notices, and recovered records. Historical items should reward comparison between players without giving one recipient a complete evidentiary chain.

Vale's electronic-surveillance fears should use this type. Distribute the account anomaly, camera concern, and delivery-robot collision across different inboxes and dates. Each incident must support several explanations; the sequence becomes visible only when players find one another and voluntarily compare messages, often in private.

### Live

Delivered after the host starts one of the three sections. Live mail creates pacing, private pressure, and new reasons to speak with another player. Group mail opens or reframes a section; individual mail is staggered.

### Final reconstruction

The last live message states that no further mail will arrive and links to the ballot. The ballot is part of this inbox flow, not a separate always-visible app area.

## Record contract

All inbox items should ultimately live in `design/data/messages.csv`. The data model must distinguish:

| Field | Meaning |
|---|---|
| `message_id` | Stable identifier |
| `message_type` | `welcome`, `briefing`, `historical`, `live`, or `final` |
| `section` | `pre` or live section `1`–`3` |
| `offset` | Relative delivery time for live mail; blank for pre-game mail |
| `narrative_date` | Displayed original date for historical mail; blank when delivery time is displayed |
| `recipient` | One named character or `Everyone at Fifteen Years of R` |
| `from_display` | Fictional sender presentation |
| `subject` | Inbox subject line |
| `body` | Message body or briefing source reference |
| `attachment_refs` | Optional semicolon-separated attachment identifiers |
| `provenance` | `original`, `forwarded`, `archived`, `recovered`, `draft`, `system`, or `disputed` |
| `fact_refs` | Internal facts exposed by the item |
| `purpose` | Internal design purpose |
| `expected_face_to_face_action` | Intended movement or in-person encounter after reading |
| `status` | Drafting and approval state |

The table now implements this contract: every row carries `message_type`, `narrative_date`, and `provenance`. Pre-game rows (`welcome` and nine `historical` items, including the three escalating Vale incidents and the three corpus-excerpt deliveries) use `section` value `0` with a narrative date and no offset; live rows use sections `1`–`3` with offsets. The simulator delivers section-0 rows as the pre-loaded inbox at the start of Section 1. Private-briefing rows are not duplicated into the table; the app renders briefings directly from [`../characters/`](../characters/). `attachment_refs` remains unpopulated until the app supports attachments.

## Header contract

- `From:` is fictional presentation and may be spoofed, automated, mistaken, or authentic only to an account.
- `To:` truthfully states who received that inbox item.
- `Date:` shows the original narrative date for historical mail and delivery time for live mail.
- `Subject:` supplies flavor and a quickly readable hook.
- Provenance cues identify forwarded, recovered, archived, drafted, or disputed material without authenticating it.

Use only two recipient forms in the initial design:

- one named character;
- `Everyone at Fifteen Years of R`.

There is no BCC mechanic. A private message can be shown voluntarily, but the app does not forward mail between players or track that disclosure.

## Host flow for live mail

1. The host opens the next section's queue.
2. The app displays the section name, recipients, and relative schedule.
3. The host presses **Send Section**.
4. The opening group message is sent simultaneously.
5. Personal messages deliver at their configured offsets.
6. The host may pause or resume the queue for safety or practical interruptions.
7. Unsent mail from a previous section does not silently carry over.

## Timing contract

Live messages use relative offsets from the moment the host starts a section. Notifications should be distributed rather than creating synchronized phone use. Group delivery is deliberately synchronized; individual delivery is deliberately staggered.

Pre-game historical mail uses narrative dates, not offsets. Sorting must not make a historical message appear newly delivered merely because the player first signed in today.

## Message tests

For live mail, complete:

> After reading this, the player will put the phone away and ________.

For pre-game historical mail, also ask:

> Why is this item in this character's inbox, and what could its source or meaning be other than the most incriminating interpretation?

If either answer is weak, revise or remove the item.
