# Fact-to-Character Matrix (§15 / Next Steps #4–#5)

Who knows what, and when. Normalized source of truth is `data/facts.csv` (`who_knows` + `release_phase`) and `data/characters.csv` (`starting_facts`). Updated after [`pressure-test-01.md`](pressure-test-01.md) round 1.

> `ALL` = public knowledge every character starts with: **F001, F002, F003, F009, F010, F014, F015, F016**.

## What each character *owns* (cluster + signature private facts)

| ID | Role | Owns / anchors | Starts knowing (beyond ALL) |
|---|---|---|---|
| C01 | Claimed kin | disappearance stakes | — (claim is private) |
| C02 | “Lover” | differing-descriptions tell | F006; later PF14 (disputed) |
| C03 | Mentor | authorship origin **+ desk-brand (D)** | F004, F050; later F052, **PF21** |
| C04 | Successor | the “naming” message | later F046, PF16, **PF19** |
| C05 | Short-seller | money & influence | F012, F055–F057; later F059, PF03 |
| C06 | AI exec | suppression / is-it-an-AI | F005, F011, F012, F055–F057 |
| C07 | Organizer | article-for-workers | F012, F055, F058 |
| C08 | AI-safety source | digital + AI-persona **champion (C)** | F004, F005, F011, F043; later F044–F049, F053, **PF18** |
| C09 | Hacker | **all metadata** | F043, F056; later the digital cluster, F059, **PF18, PF19**, PF03/04/13 |
| C10 | Editor | the article + byline control | F004, F011, F012, F017, F043, F050, F055, F058; later PF19, PF21 |
| C11 | Debunker | never-existed reading **+ D cards** | later F007, F008, F019, F032–F034, **PF20, PF21** |
| C12 | Detective | **logistics records** (not identity) | F004, F017, F018, delivery F020–F036, F059, PF03/04/08/10/17 |
| C13 | Councilwoman | narrative / politics | F055; later PF09, PF14 |
| C14 | Restaurant | delivery origin | F020–F023, F031, F035; later PF15 (2nd-hand) |
| C15 | Doorman | shift-gap / non-witness | F020–F023, F026, F036; later F025–F042, PF11/12 |
| C16 | Tabloid | disputed photo + gossip *(trail redistributed)* | later F006/F007/F047, PF05, PF10, PF14, PF15, **PF20** |
| C17 | Believer | legend / one-author faith | F050, F058; later F008, F019, F049, F051, PF09 |
| C18 | Authorship expert | **style analysis** | F050; later F051–F054, F048, PF06 |
| C19 | Fixer | errands + dead drop | F021, F036; later F024, F029, F037, F039, PF06/07/08/11/17 |
| C20 | Bodega | second node + auto-pay tell | F021, F036; later F006, F029, F033, F037, F045, PF07/11 |

## Phase-release shape (§16)
- **Phase 1 (Where?):** public facts + each character’s foundational cluster. Map the disappearance, article stakes, delivery routine.
- **Phase 2 (Who?):** contradictions land — F006/F007, F008, F027/F029, F045, F051/F052, the disputed photo (PF10), the disputed romance (PF14), the successor message + its automated signature (PF16/**PF19**), device IDs (PF13).
- **Phase 3 (Was there ever?):** destabilizers — F048/F049, F034, F042, F053, the physical breadcrumbs (PF05–PF08, PF17), plus the two new balancers: **PF18 machine-timing (C leads)** and **PF20 misattribution + PF21 desk-brand (D’s affirmative cards)**.

## Design checks
- **≥2 knowers per fact:** holds after redistribution (PF06→C18/C19, PF07→C19/C20, PF08→C12/C19, PF09→C17/C13, PF17→C19/C12). No orphans.
- **≥1 cluster per character:** every C01–C20 anchors something.
- **No master detective:** C12 holds logistics, not identity/authorship/digital-internals.
- **Breadcrumb trap intact + rebalanced:** physical PFs surface-read A, but PF20 now proves *some* trace to unrelated people (D), and C16 no longer holds the whole trail alone.
- **C & D no longer starved:** PF18 gives C a leading fact; PF20/PF21 give D affirmative cards; both kept provisional/partial so they don’t prove their framework.

## ⚠ The rule to re-verify after every change
**No character’s fact-set — nor any plausible pooling — should *prove* a single living human, and none should let one framework win by elimination.** Re-run the [`pressure-test-01.md`](pressure-test-01.md) pass after the message schedule and after writing sheets.
