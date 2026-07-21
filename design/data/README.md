# Data Tables (§18 source-of-truth)

The six CSVs here are the canonical, machine-readable spine of the game. Everything else (character sheets, app content) derives from them. Headers match §18 (with one addition, noted below).

| File | Table | Key |
|---|---|---|
| `characters.csv` | Character Table | `character_id` (C01–C20) |
| `facts.csv` | Fact Table | `fact_id` (F001–F059 established, PF01–PF17 provisional) |
| `events.csv` | Event Table | `event_id` |
| `messages.csv` | Message Table | `message_id` |
| `evidence.csv` | Evidence Table | `evidence_id` |
| `relationships.csv` | Relationship Matrix | (`character_a`, `character_b`) |

## Conventions
- **Frameworks:** `A` = one real human · `B` = passed-down mantle (Dread Pirate Roberts) · `C` = rogue AI faking a human · `D` = never existed / emergent myth. Used in `facts.csv` (`interpretations_supported`/`weakened`) and as `framework_lean` in `characters.csv` (which possibility that character champions or resists — keep the set balanced).
- **Release phase:** `1`, `2`, `3`, or `pre` / `any`.
- **Status:** `immutable` or `provisional` (§13 vs §14).
- **Multi-value cells:** semicolon-separated (e.g. `C14;C15;C16`) so commas stay CSV-safe.
- `facts.csv` is **pre-seeded** from §13 (immutable) and §14 (provisional); analytic columns (who-knows, evidence, phase, framework tags) are `TODO` pending Next Steps #3–#4. The others are header + a couple of example rows to copy.
- `characters.csv` roster is **revised for diversity + framework balance** — see [`../roster.md`](../roster.md). `framework_lean` is a non-§18 helper column added to keep the four possibilities evenly championed.

> Keep these as the single source of truth. If a fact changes here, update derived sheets — not the other way around.
