# The bar

## Status: transcription, not the artifact

The reference image was a mobile mail-client inbox screenshot supplied by the
host. It was examined directly and then disappeared from disk before it could
be filed here. What follows is a written record of what it showed.

Treat this as weaker than the image. A written bar is a description, and
comparing against a description is exactly the failure this method warns about.
If the image is restored at `design-refs/bar-inbox-mobile.png`, use it instead
and ignore this file's layout notes.

## What the reference showed

A light-theme mobile inbox at phone width, in a drawn phone frame.

Chrome:
- A rounded search field spanning the width, hamburger at its left, a circular
  account avatar at its right.
- A small uppercase section label beneath it (`RECIBIDOS`), letter-spaced,
  low-contrast.

Each list row:
- Circular sender avatar, left, roughly one-and-a-half text lines tall.
- Sender name in bold near-black, immediately right of the avatar.
- A small chevron/importance marker preceding the sender name.
- Subject on the second line, regular weight, near-black.
- Snippet on the third line, single line, grey, truncated.
- Timestamp top-right, small, grey, baseline-aligned with the sender name.
- A star at bottom-right of the row, outline when inactive, filled amber when
  active.
- Optional attachment chips below the snippet, pill-shaped with a small file
  glyph.
- A hairline divider between rows; generous vertical padding.

Roughly seven rows fit in an 844pt-tall viewport.

## Known defects in the reference

It was a UI-kit mockup, not a capture of real Gmail:

- Placeholder sender names (Ralph Edwards, Eleanor Pena, Leslie Alexander,
  Esther Howard, Jenny Wilson, Cameron Williamson).
- Two rows repeated verbatim, subject and snippet both.
- Attachment chips reading the literal string `filename`.
- Mixed locale: a Spanish search placeholder above a Spanish section header,
  with English body content.
- Timestamps in no chronological order, which a real client never does.

So its *proportions and hierarchy* are worth matching. Its *content behaviour*
is not evidence of anything.

## How to judge against it

Judge craft, not feature parity. This app deliberately has no avatars, no
stars, no search, and no attachments — fictional senders, and attachments are
deferred by design. A critic that rewards the reference for having more
features is measuring the wrong thing and will push the build outside its
design boundaries.

Compare on:

- **Scanning speed.** How fast does the eye separate sender, subject, and time?
- **Type hierarchy.** Are the three text levels clearly ranked by weight, size,
  and contrast, or do they mush together?
- **Row density.** Does a screen hold a useful number of messages without
  feeling cramped or wasteful?
- **Touch targets.** Is every tappable row comfortably thumb-sized?
- **Restraint.** Does anything decorative earn its place?

## Constraints the bar does not cover

From `app/README.md`, and they outrank the reference wherever they conflict:

- The inbox must read as a partial, biased archive belonging to the character —
  not a game menu.
- Narrative dates on historical mail must stay visually distinct from tonight's
  clock, so a fifteen-year-old letter never reads as just-arrived.
- Provenance must never be presented as stronger than the fiction supports.
- A live message must be readable in under twenty seconds and send the player
  back into the room.
