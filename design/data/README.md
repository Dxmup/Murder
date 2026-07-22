# Canonical Data Tables

All tables describe the current game. There are no legacy design tables in this directory.

| File | Key | Purpose |
|---|---|---|
| `characters.csv` | `character_id` | Core and optional cast records |
| `relationships.csv` | character pair | Social knots and reciprocal pressures |
| `goals.csv` | `character_id` | Core goals, success conditions, choices, and section targets |
| `bargains.csv` | `character_id` | Offers, needs, commitments, betrayals, and consequences |
| `facts.csv` | `fact_id` | Atomic observations and competing interpretations |
| `events.csv` | `event_id` | Grouped events referenced by facts and timelines |
| `evidence.csv` | `evidence_id` | Physical objects and split components |
| `messages.csv` | `message_id` | Unified inbox content: pre-game briefing/history, timed live mail, and final ballot invitation |

Multi-value cells use semicolons. C01–C16 are core; C17–C20 are optional. Facts and messages retain their `V2F` and `V2M` IDs because simulation reports cite those stable identifiers; the prefix is an identifier namespace, not a separate versioned design.

`messages.csv` implements the full record contract defined in [`../messages.md`](../messages.md): section `0` rows are pre-game inbox items (one welcome email and nine dated historical items) delivered as the pre-loaded inbox at the start of Section 1, and sections `1`–`3` are the timed live schedule. Private briefings are rendered from [`../../characters/`](../../characters/) rather than duplicated here. `goals.csv` and `bargains.csv` now include optional roles C17–C20.
