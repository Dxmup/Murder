# Message-Release Schedule (Next Step #7 draft)

The dynamic inbox -- the game's core mechanic (section 11). Source of truth is [`data/messages.csv`](data/messages.csv); this is the readable view + design notes. 40 messages across 3 phases; every character C01-C20 receives at least one private beat.

## The spine: scheduled-from-R.
R. queued a set of messages **before disappearing** (M01, M02, M06, M11, M14, M24, M26, M27*, M34, M40). This keeps R. an active force all game -- but a scheduled message **never proves R. is alive** (dead-man switch / successor / AI cron), so it can't collapse C or D. (*M27 is deliberately ambiguous origin.)

## Design rules honored (section 11)
- **Resolve one uncertainty, open another.** No message is a pure explanation dump.
- **Sender != origin is a weapon.** M05, M13, M27, M33, M36 arrive looking authoritative but are spoof/unverified -- players cannot trust the 'from' line.
- **Public-with-variation.** M10 is one wire alert with a private tail only C03/C04 see -- compare-notes drama.
- **Every message points at people,** not just facts (see `intended_interaction`).

## Phase 1 -- Where is R.? (0:00-0:55)
Establish stakes and routines. M01 opens and seeds distrust; M03 points at the money (C05/C06); M04 reactivates the dead drop (C19); M05/M06 rattle the two fabricators (C02/C01); M08/M09 raise urgency for the short-seller and the restaurant.

## Phase 2 -- Who is R.? (1:00-1:58)
Contradictions land. M10 (may-never-have-been-one-person, + successor tail) and M11 open the mantle question (B); M12 drops the zero-variance timing (C's leading card); M15 taints the successor's naming message; M16 is the exec's existential AI fear; M19/M20 pressure the doorman and detective; M22 puts the multiple-collectors clip on blast (B/D); M23 pre-loads the debunker for Phase 3.

## Phase 3 -- Was there ever an R.? (2:00-2:55)
Destabilize, then decide. M26 is the bomb (C/D); M27 arms the AI theory; M28/M29 give D its affirmative cards (misattribution + desk-brand origin); M30-M39 are the interpersonal end-state levers (collusion, bidding war, exposure, traps, alliances); **M40 triggers the endgame vote** -- the article auto-publishes at midnight unless the room stops it.

## Framework timing (deliberate, per pressure-test round 1)
- **B** peaks mid-game (M10, M11, M15, M22).
- **C** gets its leading evidence in Phase 2-3 (M12, M16, M27) so it isn't out-argued early.
- **D** gets affirmative cards only in Phase 3 (M23->M28, M29) so it converts from 'gesture' to 'playable' late.
- **A** is never handed a proof -- its support stays belief/claim (the fabricators' messages actually *threaten* A's champions).

## To finalize
- Attach real **document/evidence** payloads (the-article.pdf, timing-analysis.json, archive-stub.txt, clip.mp4) -- cross-ref `data/evidence.csv`.
- Decide **host-trigger vs hard-timed** per message (some should fire on room state, not the clock).
- Localize the M10 variant mechanic in the app (same alert, per-recipient tail).
- **Re-run the adversarial pressure-test** on the schedule (message timing can re-open a framework leak).
