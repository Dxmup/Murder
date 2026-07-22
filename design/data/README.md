# Data Tables — Version Status

Only `characters.csv` and `relationships.csv` have been migrated to Version 2. They are the current machine-readable cast model and derive from `design/v2/cast-and-mechanics.md`.

The other four CSVs remain Version 1 design history. They must not be used to generate V2 booklets, messages, evidence, or app content until they are replaced.

| File | Table | Key |
|---|---|---|
| `characters.csv` | **Current V2** character table | `character_id` (C01–C20) |
| `relationships.csv` | **Current V2, provisional** relationship matrix | (`character_a`, `character_b`) |
| `facts.csv` | **Legacy V1 — not current canon** | `fact_id` |
| `events.csv` | **Legacy V1 — not current canon** | `event_id` |
| `messages.csv` | **Legacy V1 — not current canon** | `message_id` |
| `evidence.csv` | **Legacy V1 — not current canon** | `evidence_id` |

## V2 conventions

- `availability` is `core` for the 16-player base cast and `optional` for C17–C20.
- Multi-value cells use semicolons so commas remain CSV-safe.
- `design_status` and relationship `status` identify material that still needs booklet-level development.
- The four intended finale readings are: one human R; R as a human mantle; R as AI; and the progressive composite history. Evidence must also preserve doubt that the rumored article ever existed.

Do not blend rows from the legacy tables into V2. Replace those tables only after the V2 ending/evidence and timeline passes establish their schemas and content.
