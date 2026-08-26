# Next Steps

Updated 2026-08-26.

## Done since V2.1

- **V2.2 message rewrite.** All 54 bodies rewritten from design notes into real
  correspondence; clues land by inference rather than instruction.
- **V2.3 rename and masquerade.** Six characters renamed for pronounceability
  (fixing the Eli/Edi and Mira/Maren collisions); the party is masked; every
  booklet carries a mask chosen in character.
- **V2.4 lore pass.** Seventeen messages added (71 total). Every character is at
  the four-message floor and no one is inert until Act 2 any more.
- **Coherence audit** (`design/story-coherence-audit.md`). All four defects
  resolved, including the identifier collisions and the Act 3 broadcast that was
  handing the room the Vale sequence.
- **Physical props.** Twenty-two documents as flat scans in `print/props-flat/`,
  two objects as photographs, the route board as printable components, plus
  name cards and commitment cards as HTML. Exact wording lives in
  `print/props/SOURCE.py`.
- **The app.** Threaded inbox, host act clock, delivery gating, briefings
  rendered from `characters/` rather than duplicated into `messages.csv`.

## Open

### Before a party can run

1. **One-page cheat cards, one per role.** The host guide calls these the thing
   "that survives the second drink", and booklets run 1,200–1,800 words. Each
   needs the primary goal, three opening moves, who to find first, and the prop
   list. Everything they need now exists in `goals.csv` and `evidence.csv`.
2. **Print everything** — booklets, cheat cards, props, ballots, the four ending
   scripts, name cards, commitment cards. See `print/README.md`.
3. **Live playtest.** The simulator cannot measure fun, charisma cascades, or
   accidental overhearing. Every remaining design question is a human one.

### Before it can be deployed

4. **A production state store.** `app/web/src/lib/state.ts` has only
   `FileStore`, and Vercel's runtime filesystem is read-only, so the host clock
   breaks in production. Local works fine, which is enough to run the party off
   a laptop. `StateStore` is already the seam.

### Design weaknesses that will not fix themselves

These survived the audit because prose cannot repair them.

5. **V2M034 has no in-world sender who could plausibly know.** It needs someone
   aware of both Morgan's route board and that Sam personally chose that corner.
   That list is very short and nobody on it would text anonymously.
6. **Ballot 3's "voluntarily vanished" rests almost entirely on Sam.** V2M027 and
   V2M034 both land in one inbox. Rosa holds the neighbourhood half but has no
   message activating it as an *escape* reading.
7. **V2M024's confession triangle may be too self-defeating to fire.** Sam can
   corroborate all three statements but gets no prompt tying her to the beat.
8. **"Partner" in V2M035** reads as Morgan's partner rather than Vale's.

### Optional

9. **Props for the four characters who hold none** — Arden, Grace, Graham, Rosa.
   Each has an object described in their own mail that was never made: the
   archive intake report, the four instruction sheets, the two incompatible
   fragments, the written list of asks. Plus four optional-role props if running
   twenty.
10. **Further sim runs.** The harness is still in `simulation/`; the run archive
    was deleted as deadweight. Conclusions worth keeping are in
    `design/playtest-notes.md`, including the caveat that a model swap moved
    beliefs ~28 points with zero design change.

## The open question

Kit begins holding the complete Ending 4 narrative and is deliberately
discredited twice in public during play. Across fifteen simulation runs, Kit's
credibility arc single-handedly determined whether the progressive reading got
anywhere. Whether a person's conviction survives two public corrections and two
hours of social pressure is the thing the sims cannot answer, and the reason to
cast that role onto someone who enjoys being wrong in front of people.
