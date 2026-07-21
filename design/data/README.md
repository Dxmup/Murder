# Data Tables (§18 source-of-truth)

The six CSVs here are the canonical, machine-readable spine of the game. Everything else (character sheets, app content) derives from them. Headers match §18 (with two helper columns on `characters.csv`, noted below).

| File | Table | Key |
|---|---|---|
| `characters.csv` | Character Table | `character_id` (C01–C20) |
| `facts.csv` | Fact Table | `fact_id` (F001–F059 established, PF01–PF17 provisional) |
| `events.csv` | Event Table | `event_id` |
| `messages.csv` | Message Table | `message_id` |
| `evidence.csv` | Evidence Table | `evidence_id` |
| `relationships.csv` | Relationship Matrix | (`character_a`, `character_b`) |

## Conventions
- **Frameworks:** `A` = one private human · `B` = human-origin passed-down mantle · `C` = synthetic/AI persona from the beginning · `D` = no single coherent journalist / emergent institutional myth. These are incompatible complete reconstructions, not eras in a canonical sequence. Used in `facts.csv` (`interpretations_supported`/`weakened`) and as `framework_lean` in `characters.csv`.
- **`relationship_status` (characters.csv helper):** how that character’s apparent tie to the “journalist” works — `none` / `mediated` (remote-only) / `remembered` / `inherited` / `fabricated` / `parasocial`. **Hard rule:** no value is ever a *verified in-person* relationship — that would kill Frameworks C and D. See [`../roster.md`](../roster.md#-hard-rule-no-verifiable-relationship-with-the-human).
- **Release phase:** `1`, `2`, `3`, or `pre` / `any`.
- **Status:** `immutable` or `provisional` (§13 vs §14).
- **Multi-value cells:** semicolon-separated (e.g. `C14;C15;C16`) so commas stay CSV-safe.
- `facts.csv` is **pre-seeded** from §13 (immutable) and §14 (provisional); analytic columns are `TODO` pending Next Steps #3–#4.
- `characters.csv` roster is **revised for diversity + framework balance** with a **no-verifiable-relationship** rule applied to every personal tie. `framework_lean` and `relationship_status` are non-§18 helper columns.

> Keep these as the single source of truth. If a fact changes here, update derived sheets — not the other way around.
