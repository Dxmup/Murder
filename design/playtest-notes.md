# Playtest Notes

A running log of playtests — simulated and live. Each entry captures what we learned and what changed as a result. The host guide (§8) points here.

> **How to read balance results:** the goal is that all four readings of R. (A one human / B mantle / C rogue AI / D never existed) stay **arguable but unprovable**, every player stays engaged and can win personal goals without solving the mystery, and the room never converges on a single “correct” answer.

---

## Playtest 01 — Full multi-agent simulation (COMPLETE)

**Method:** 20 role-agents (one per character) acting in-character across 3 phases, a game-master agent resolving each phase, a 20-player final ballot, a designer synthesis. 84 agents total. Fully-interpretive rules enforced (no agent, including the GM, knew a “true” answer).

### Headline: balance FAILED in play, despite looking fine on the scoreboard
Phase momentum (A/B/C/D) ended **33 / 72 / 63 / 58** — all four *look* alive. But the actual **vote** on R.’s nature:

| Reading | Ballots |
|---|---|
| **B — multiple humans / operated mantle** | **19** |
| A — one human | 0 |
| C — AI persona (standalone) | 0 |
| D — never existed | 0 |
| unsure | 1 (Amara) |

**Release the article:** 11 release / 9 stop — a genuinely healthy split. **Authenticity:** 20/20 “disputed” — nobody proved it real or fake (good).

### Root cause: B is a “union attractor”
B is the compromise every clue feeds — automation → “machine-assisted mantle,” mismatched faces → “multiple hands,” zero witness → “no single person.” A/C/D each require *committing*; B is where you retreat when nothing is provable. **It has no natural predator.** The per-framework pressure-tests (rounds 1–2) never tested for this — they checked each framework in isolation, not whether one reading absorbs the other three.

Two authored forces amplified it:
1. **M40 spells out B.** R.’s final message (“fragments, more than one hand, some machine-made”) *is* the operated-mantle answer, handed to all 20; multiple players cited it as confirmation. The capstone pre-solved the mystery.
2. **The hard rules starved A.** “No proof of a human / no verifiable relationship” left A with zero affirmative ammunition; every A-claimant (Renata, Dorian, Rafi, Nikos) defected to B.

### Mechanics review
- ✅ **Vivian’s Buy/Bury & Ruiz’s Compel** — the model abilities: they *preserved* ambiguity (sealed the fingerprint / froze the artifact) AND created a suspect vector. Abilities should protect the mystery, not resolve it.
- 🔴 **Farah’s Expert Verdict — overpowered.** Single-handedly canonized B as “the reading of record” on standing alone (“won on standing, not data”). Its corpus-gate didn’t constrain her.
- 🔴 **Eleanor’s Hold — too central.** The ONLY ability to fire in Phase 1; froze all 19 other tracks. A room-wide freeze that should be target-limited.
- ⚪ **Rick’s Print It — dead weight.** Never fired in three phases.
- 🔴 **A-witness hooks too soft.** Nikos’s order, Rafi’s tab, Manny’s errands never converted; flagged “keep A alive” every phase, died anyway.
- ✅ **M40 auto-release & M26 “publish anyway”** worked well as endgame drivers.

### Engagement
- **Sidelined:** Renata (only clean main-goal FAIL), Rafi, Eddie, Nikos, Manny, Patrice — mostly **no-ability** characters who spectated the deep-pocket plays (Vivian/Grayson/Eleanor/Farah). Marisol & Ruiz faded in the back half.
- **Goal completion compressed to “partial”:** main goal = 2 yes / 1 no / **17 partial**. Nobody stuck at all-no (good), but almost nobody wins cleanly (bad) — endgame “armed but never fired.”

### Fix backlog (prioritized)

**Tier 1 — clearly right, low creative risk:**
1. **Rewrite M40** so it does NOT describe B. Make it multivalent — readable as single-author OR machine OR relay depending on the reader’s prior. (Biggest single lever; it pre-solves the mystery.)
2. **Nerf Farah’s Expert Verdict** — restrict output to “how many hands” WITHOUT resolving human-vs-machine; make it rebuttable by an opposing expert; make the corpus-gate binding.
3. **Retarget Eleanor’s Hold** — freeze ONE track, not the room.
4. **Fix Rick’s Print It** — give it a forcing trigger (auto-publishes Eleanor’s 7-year gap if she doesn’t concede by Phase 3) or cut it.

**Tier 2 — needs care (touches the hard rules / creative):**
5. **Break B’s union-attractor status.** Add mutually-exclusive clues: one only a single continuous author can explain, one only a pure machine can explain — forcing players to CHOOSE rather than retreat to B. *(Tension: must not cross into PROVING A or C — see below.)*
6. **Arm Framework A** with affirmative-but-deniable ammunition (a witness who sincerely swears to an in-person meeting; a dated letter) so A survives without being provable.
7. **Give no-ability characters a lever** (a spendable asset, or a mechanic where soft/social capital can block a leverage move).
8. **Fix the everyone-lands-partial endgame** — make the final trigger actually resolve so players get clean win/loss, add goal conditions meetable before the last beat.

### ⚠ The core design tension this surfaced
Our hard rules (“no proof of a human,” “no verifiable relationship”) were tuned so tightly that they **starved A into non-existence**, which handed the game to B. Fixes 5–6 must thread a needle: give A and C *strong, roughly equal, affirmative* champions **without** making either PROVABLE (which would kill C/D or A). The likely resolution: affirmative-but-rebuttable evidence for each framework of comparable weight, and a capstone (M40) that refuses to confirm any of them. This is the next design problem to solve before re-running the sim.

### Actions taken
_(pending decision on the fix backlog)_

---

## Template for future entries

### Playtest NN — [live / simulated] — [date]
- **Players / setup:**
- **What worked:**
- **What broke:**
- **Framework balance (A/B/C/D):**
- **Engagement gaps:**
- **Changes made:** (commits)
