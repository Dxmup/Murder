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

The current `messages.csv` contains the authored live schedule. Its planned expanded record contract is defined in [`../messages.md`](../messages.md); pre-game rows will be added when their email copy and provenance are authored, followed by a simulator migration.
