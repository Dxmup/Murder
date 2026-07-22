# Pressure-Test Round 1 (Next Step #8) — findings & applied fixes

> **Legacy V1 test.** Its findings motivated the rebuild, but its cast and four-framework model are not V2 inputs.

Four adversarial auditors, one per framework, each tasked to (a) *prove* their framework trivially true via fact-pooling (a **leak**), and (b) check whether their framework is too weak to argue (**starvation**). Both are failures.

## The structural finding
The cast/fact-set was **A/B-heavy and C/D-starved**: A and B could be pushed to *proven*; C and D could barely be *argued*.

| Framework | Before | After fixes |
|---|---|---|
| A (one human) | leaked (PF14/PF15, C16 monopoly) | tightened |
| B (mantle) | leaked via roster (C03/C04 stated as fact) | hedged |
| C (rogue AI) | starved — never led on any fact | given a leading fact + a champion |
| D (never existed) | starved — zero affirmative evidence | given an origin + provable ammunition |

## Fixes applied (all nine)

### Close the A leaks
1. **PF15 reworded** — was "a private in-person meeting." Two reliable witnesses (C14, C10) pooling it proved a live human with no rebuttal, and it contradicted their own "never met" backstories. Now: *a meeting was proposed / summons sent, attendance never confirmed*, explicitly second-hand for C10/C14. Tag flipped to weaken A.
2. **PF14 reworded** — was an asserted romance corroborated by agnostic C13. Now: *an actor CLAIMS a disputed, uncorroborated romance*, with the fabrication hedge surfaced. C13 holds it only as "C02 claims."
3. **C16 breadcrumb monopoly broken** — C16 held 9 embodiment breadcrumbs (a one-seat proof of a human, defeating the pooling safeguard). Redistributed: PF06→C18/C19, PF07→C19/C20, PF08→C12/C19, PF09→C17/C13, PF17→C19/C12. C16 now holds a small set, each co-held with a rebuttal or pro-C/D reading.

### Close the B leak
4. **C03 & C04 public-hedged** — they were stated as fact ("first published the byline", "named successor") while the escape hatch sat in private notes. Now public roles read *"claims he first published (unverified)"* and *"self-claimed successor via an unauthenticated message."*
5. **PF19 added** (message-provenance hatch) — C09/C10 can show the successor-naming message carries the same automated/scheduled signature as F046/F049, so it could be machine-emitted or self-authored. Tag C;D>B. Lets C/D reabsorb the handoff.

### Cure the C starvation
6. **PF18 added** (machine-timing signature) — forensic timing shows near-zero-variance latency and no diurnal/timezone/sleep cycle for years. The **first fact where C leads** (a team has *more* variance; coincidence can't produce it), yet "a human ran an autoresponder" keeps A/B alive — so it strengthens C without proving it. Held by C09/C08, phase 3.
7. **C08 self-expose belief** (private, not fact) — C08 privately suspects the article was the entity **writing about the AI it secretly is**, collapsing the subject-vs-author confusion and giving C a committed advocate. Belief only, so it can't be presented as proof.

### Cure the D starvation
8. **PF21 added** (desk-brand origin) — the byline may have begun as an in-house editorial **pseudonym / desk brand** the paper attached to miscellaneous and freelance pieces, with a bio accreting over time. D's master key: reframes the accurate oeuvre and consistent style as *institutional/emergent* rather than one mind. Held as a **contested C03 belief** (C03 now anchors both the B-hedge and the D-origin). Tag D>A;C, provisional.
9. **PF20 added** (provable misattribution) — ≥2 breadcrumb trails trace to *different unrelated real people* (taxi = a realtor, library = a grad student). Finally gives a D player a card to lay down instead of arguing a negative. Held by C16/C11, phase 3, partial by design (other breadcrumbs survive for A).

## Guardrails honored
- No new fact *proves* any framework: PF18 leaves an A/B escape; PF20/PF21 are provisional and explain only a *subset*; PF19 defuses rather than asserts.
- The C/D medicine is affirmative-but-partial, so A and B stay arguable too — the goal is four live contenders, not a new imbalance.

## Re-test trigger
Re-run this adversarial pass after: assigning the message schedule (Next Step #7), writing character sheets, or any change to the provisional-fact set. Watch especially that PF20/PF21 don't, in combination with the debunker coalition, let D win by *elimination* — keep at least one affirmative A survivor the NOT-A coalition can't fully debunk.
