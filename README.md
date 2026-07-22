# How Many R’s in Murder?

> **Current direction:** the game is being rebuilt as Version 2. The current design lives in [`design/v2/`](design/v2/), with its cast and relationship data in [`design/data/characters.csv`](design/data/characters.csv) and [`design/data/relationships.csv`](design/data/relationships.csv). Files explicitly marked V1 or legacy are retained only as design history.

> **Working title.** An original, ~3-hour, in-person social mystery game (LARP) for **~20 players**. New York City, 2027.

A celebrated investigative identity — operating for ~15 years under the pseudonym R — is linked to a rumored article that would “change the course of AI and humanity.” Then a reporter investigating R disappears. The article may never have existed, and nobody can prove who started the rumor. Twenty people connected to the identity, the reporter, or the institutions around them are brought together. The mystery evolves through four questions:

1. **Who was R?**
2. **Was R human?**
3. **Did R ever exist as a coherent identity?**
4. **What happened to the reporter who tried to find out?**

Inspired by the balance and accessibility of Freeform Games: every player has a character, one **main goal** and **two sub-goals**, information is distributed, and *no one* is reduced to a bystander. This project is independent of Oratia and does **not** copy any Freeform stories, characters, or wording — only the structural simplicity.

## Design pillars

- **Facts, not clues.** The game is built from objective facts that don’t announce their own meaning. Players build interpretations by combining them.
- **Four live endings.** The same facts stay plausibly compatible with: (A) one human R, (B) R as a human mantle, (C) R as an AI identity, or (D) the progressive composite—human origin, mantle, AI takeover, and the AI killing the reporter who tried to reclaim R. The first three receive equal evidentiary weight; the fourth is harder to assemble because it combines them.
- **A verdict, not a solution key.** Players vote on the central identity question and whether the AI killed the reporter. The host reveals the matching ending without turning it into an objective confession of what “really” happened.
- **App supplements the room.** The app provides the opening, individual booklets, and sparse three-section messages. Conversation, deals, objects, and accusations remain face-to-face.
- **Messages create movement.** The host arms each section once; synchronized group messages and staggered personal messages send players back into the room. There is no character AI assistant.

## Repo layout

| Path | What’s here |
|---|---|
| [`design/v2/`](design/v2/) | **Current V2 source of truth:** premise, cast, mechanics, and messaging architecture. |
| [`design/v2/ending-evidence-matrix.md`](design/v2/ending-evidence-matrix.md) | V2 evidence clusters, ending-balance audit, and progressive-ending gate. |
| [`design/v2/timelines.md`](design/v2/timelines.md) | Interlocking R-history, article-rumor, and Vale timelines. |
| [`design/v2/atomic-facts.csv`](design/v2/atomic-facts.csv) | Forty-two provisional V2 facts awaiting distribution testing. |
| [`design/v2/fact-distribution-audit.md`](design/v2/fact-distribution-audit.md) | Character access counts, centrality risks, and pre-simulation corrections. |
| [`design/v2/goal-interaction-matrix.csv`](design/v2/goal-interaction-matrix.csv) | Playable goals, success conditions, choices, and three-section target routes. |
| [`design/v2/objects-and-bargains.md`](design/v2/objects-and-bargains.md) | Minimal prop set, voluntary custody rules, commitments, and bargain design. |
| [`design/v2/simulation-messages.csv`](design/v2/simulation-messages.csv) | Minimum three-section V2 message schedule for agent testing. |
| [`design/data/characters.csv`](design/data/characters.csv) | Current V2 character table. |
| [`design/data/relationships.csv`](design/data/relationships.csv) | Current V2 relationship and social-knot table. |
| [`design/data/README.md`](design/data/README.md) | Exact current/legacy status of every CSV. |
| [`characters/`](characters/) | Legacy V1 sheets plus a status README; V2 booklets have not yet been written. |
| [`docs/design-handoff.md`](docs/design-handoff.md) | Legacy V1 handoff retained for history, not current canon. |
| [`app/README.md`](app/README.md) | Minimal V2 opening, booklet, inbox, and host-dashboard specification. |
| [`print/README.md`](print/README.md) | V2 physical-material guardrails and planned outputs. |

## Status & next step

V2 cast, relationships, evidence matrix, timelines, and provisional atomic facts are drafted. The next pass should audit fact distribution and social circulation, then populate V2 events, evidence, and messages before writing full character booklets.
