# Fact-to-Character Matrix (§15 / Next Steps #4–#5)

Who knows what, and when. Normalized source of truth is `data/facts.csv` (`who_knows` + `release_phase`) and `data/characters.csv` (`starting_facts`). This is the readable view plus the design checks.

> `ALL` = public knowledge every character starts with: **F001, F002, F003, F009, F010, F014, F015, F016** (the pseudonym, its reputation, no photo, the announced article, its non-publication, the fight to control it, the disappearance, death unconfirmed).

## What each character *owns* (their cluster + signature private facts)

| ID | Role | Owns / anchors | Starts knowing (beyond ALL) |
|---|---|---|---|
| C01 | Claimed kin | disappearance stakes | — (claim is private, not a fact) |
| C02 | “Lover” | the differing-descriptions tell | F006; later PF14 |
| C03 | Mentor | authorship origin | F004, F050; later F052 |
| C04 | Successor | the “naming” message | later F046, PF16 |
| C05 | Short-seller | money & influence | F012, F055–F057; later F059, PF03 |
| C06 | AI exec | suppression / is-it-an-AI | F005, F011, F012, F055–F057 |
| C07 | Organizer | the article-for-workers | F012, F055, F058 |
| C08 | AI-safety source | digital + AI-persona | F004, F005, F011, F043; later F044–F049, F053 |
| C09 | Hacker | **all metadata** | F043, F056; later F044–F049, F038, F041–F042, F059, PF03/04/13 |
| C10 | Editor | the article + byline control | F004, F011, F012, F017, F043, F050, F055, F058 |
| C11 | Debunker | the never-existed reading | later F007, F008, F019, F032–F034 |
| C12 | Detective | **logistics records** (not identity) | F004, F017, F018, delivery F020–F036, F059, PF03/04/05/08/17 |
| C13 | Councilwoman | narrative / politics | F055; later PF09, PF14 |
| C14 | Restaurant | delivery origin | F020–F023, F031, F035; later PF15 |
| C15 | Doorman | the shift-gap / non-witness | F020–F023, F026, F036; later F025, F027–F030, F037–F042, PF11/12 |
| C16 | Tabloid | the disputed photo + all gossip | later F006, F007, F047, PF05–PF10, PF14–PF17 |
| C17 | Believer | the legend / one-author faith | F050, F058; later F008, F019, F049, F051, PF09 |
| C18 | Authorship expert | **style analysis** | F050; later F051–F054, F048, PF06 |
| C19 | Fixer | the errands + dead drop | F021, F036; later F024, F029, F037, F039, PF07/11/17 |
| C20 | Bodega | the second node + auto-pay tell | F021, F036; later F006, F029, F033, F037, F045, PF11 |

## Phase-release shape (§16)
- **Phase 1 (Where is the journalist?):** public facts + each character’s foundational cluster facts. The room can map the disappearance, the article stakes, and the delivery routine.
- **Phase 2 (Who is the journalist?):** the contradictions land — differing descriptions (F006–F007), the mantle theory (F008), no-witness facts (F027/F029), channel identities (F045), authorship split (F051–F052), the disputed photo (PF10), the successor message (PF16), the romance (PF14).
- **Phase 3 (Was there ever a journalist?):** the destabilizers — authentic-account-≠-present-author (F048), infrastructure-runs-itself (F049), “doesn’t prove they ate the food” (F034), deleted footage (F042/PF04), model-prose-explains-all (F053), and the physical breadcrumbs (PF05–PF08, PF17).

## Design checks
- **≥2 knowers per fact:** every fact is known by ≥2 characters (public = ALL); most contested facts by 3–4. No orphan facts.
- **≥1 cluster per character:** every C01–C20 owns/anchors at least one cluster or signature fact (see table). No passenger characters.
- **No master detective (§15):** C12 holds the **logistics records** (delivery, building, financial-transaction) but *not* the identity/authorship/digital-internals facts — those live with C08/C09/C16/C18. The detective can reconstruct the *routine* but not *who/what* alone.
- **The breadcrumb trap (keeps C alive):** the physical provisional facts (taxi trips, dry-cleaning, library books, dead drop — PF05–PF07, PF17) *surface-read as A* (a body moving through the city). But they are exactly the trail Framework **C** claims was **planted** by an AI, and Framework **D** claims was **assembled from unrelated people**. Surface lean A; deeper function feeds C/D. No breadcrumb is ever corroborated by a witness who met the human.

## ⚠ The one rule to re-verify after every change
**No character’s total fact-set — nor any plausible pooling of a few characters’ sets — should *prove* a single living human.** Every A-leaning fact has a documented C/D escape (see `interpretations_weakened`). This is the thing the Phase-8 adversarial pressure-test must attack.
