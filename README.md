# How Many R’s in Murder?

> **Current direction:** the game is being rebuilt as Version 2. See [`design/v2/core-concept.md`](design/v2/core-concept.md). The existing roster, character sheets, and simulations are retained as legacy design material while the new ending/evidence structure and cast are developed.

> **Working title.** An original, ~3-hour, in-person social mystery game (LARP) for **~20 players**. New York City, 2027.

A celebrated investigative journalist — operating for ~15 years under a pseudonym (think *Satoshi Nakamoto* / *Dread Pirate Roberts*) — announces an article that will “change the course of AI and humanity,” then **disappears** before it publishes. Twenty people connected to the journalist are in a room together. The mystery evolves through three questions:

1. **Where is the journalist?**
2. **Who — or what — is the journalist?**
3. **Was there ever a journalist at all?**

Inspired by the balance and accessibility of Freeform Games: every player has a character, one **main goal** and **two sub-goals**, information is distributed, and *no one* is reduced to a bystander. This project is independent of Oratia and does **not** copy any Freeform stories, characters, or wording — only the structural simplicity.

## Design pillars

- **Facts, not clues.** The game is built from objective facts that don’t announce their own meaning. Players build interpretations by combining them.
- **Four live frameworks.** The same facts stay plausibly compatible with: (A) one private human, (B) a human-origin mantle with many authors, (C) an AI persona that was synthetic from the beginning, or (D) no coherent journalist. Each needs an affirmative case; none is the hidden answer.
- **No mandatory ontology.** Players ultimately vote on what they believe happened. There is deliberately no host-only truth about whether R. was ever human.
- **App supplements the room.** Anything best done human-to-human happens in person; anything private, timed, multimedia, or tedious happens in the app.
- **Dynamic inbox is the core mechanic.** Timed/triggered messages introduce and recontextualize facts. Character-scoped AI assistants are a secondary (but important) mechanic.

## Repo layout

| Path | What’s here |
|---|---|
| [`docs/design-handoff.md`](docs/design-handoff.md) | **Source of truth.** The full design handoff, verbatim. |
| [`docs/next-steps.md`](docs/next-steps.md) | §20 immediate design steps as a checklist. |
| [`design/roster.md`](design/roster.md) | Provisional ~20-role roster (§9). |
| [`design/data/`](design/data/) | The six §18 source-of-truth tables as CSVs (+ schema README). `facts.csv` is pre-seeded from §13–§14. |
| [`design/timeline.md`](design/timeline.md) | Objective timeline stub (15-year history + final week). |
| [`design/fact-clusters.md`](design/fact-clusters.md) | The 10–12 major fact clusters to assign to characters. |
| [`characters/TEMPLATE.md`](characters/TEMPLATE.md) | §8 character-sheet structure. |
| [`app/README.md`](app/README.md) | Player portal, host dashboard, dynamic inbox, character-scoped AI — spec + build plan. |
| [`print/README.md`](print/README.md) | Printable materials stub. |

## Status & next step

Pre-writing. **Do not** write all twenty character sheets yet. Per [`docs/next-steps.md`](docs/next-steps.md): finalize the roster → build the objective timeline → pick 10–12 fact clusters → assign each cluster to ≥3 characters → draft goals → design the message schedule → stress-test that all four frameworks survive → *then* write sheets.
