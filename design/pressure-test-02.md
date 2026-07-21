# Pressure-Test Round 2 (message schedule) — findings & applied fixes

Same four adversaries, re-run against the [message schedule](data/messages.csv) (M01–M40) after round 1 balanced the facts. Question: does message *timing/delivery* re-open a leak or unbalance play?

## The structural finding
**No hard proof-leak survived** — the fact-layer balance held. But the imbalance **moved to the delivery layer**: who receives what, and what is public vs private. Three real issues, all about routing rather than truth.

## Fixes applied

### 1. (Critical) M40 was quietly killing D — the article artifact
**Problem:** handing the room a clean `article.pdf` at the endgame proved “a coherent author existed,” refuting D. The hard rule guarded “no proof of a living human” but left “no proof of coherent single authorship” open — and M40 walked through the gap 8 minutes before the vote.
**Fix:** M40 now delivers `article-fragments.pdf` — fragmentary, multi-voice, possibly machine-made, authenticity disputed (truth-status misleading-true; ties F011/F053). **Added canon Rule 2:** no artifact may prove coherent single authorship (see [`canon.md`](canon.md)).

### 2. (High) D was winning by elimination in *delivery*
**Problem:** every ALL-broadcast leaned anti-A (M10/M22/M26/M28/M37), while A's affirmative survivors sat in private messages to discredited holders. The jury (neutrals) only ever heard the case *against* A.
**Fix:** M28 reworded to surface an un-debunked **A residue publicly** — “two trails trace to strangers, *but the taxi account and a sealed locker stay unexplained*.” This both bounds the “two implies all” overreach (D stays honest) and puts an affirmative-A card in front of neutrals.

### 3. (High) C's evidence reached the wrong hands
**Problem:** the zero-variance timing (M12) landed only with C09 (who has a *sell* incentive, M31); the exec's AI-fear (M16) landed only with anti-C C06 (who buries it, M37). C08 — the intended C advocate — got only M27, which as worded *undercut* C.
**Fixes:**
- **New M41** — the timing analysis **leaks semi-public** at P2 1:20 (after C09 gets first crack at 1:10). One move fixes two findings: C08 finally gets C's leading card, and the B-heavy C03/C04 rooms hear the AI-succession reading. The “autoresponder” note keeps it from proving C or killing A.
- **M27 reworded** off the self-undercutting “who taught the model to write like *me*” to C's cleanest exclusive: *“Ask if anyone ever saw me type live. Every word from me was queued.”*
- M16's content can now also leak via the M30 C05/C06 negotiation.

### 4. (Medium) Minor hardening
- **M05** given an explicit spoof cue (“sent from a number that isn't R.'s usual”) so its anti-A content isn't over-trusted before M32 debunks the romance.
- **M11** tagged as auto-released/mailmerge so “not the only letter I sent” reads equally as C/D, not just deliberate human succession.
- **M29** phrasing (“[redacted] editor / contributor never met in person”) locked so C03's reveal can't settle A/B/D.
- **M06/M13** confirmed to keep C01's kinship explicitly unproven.

## Net state after round 2
All four frameworks are **arguable but unprovable at the 2:52 vote**, and — the round-2 addition — all four are **represented in the public broadcast layer** the neutral jury actually hears, so none wins by silence or by artifact.

## Residual watch-items (for the next re-test, after character sheets)
- Confirm C is now *winnable by its advocate*, not just arguable — M41 + reworded M27 should do it, but verify against a real read-through.
- Verify the M28 “residue” line keeps A alive without over-restoring the A tilt round 1 corrected.
- Re-run once the evidence payloads (`article-fragments.pdf`, `timing-analysis.json`, etc.) are authored, since their exact contents can leak or prove things the summaries don't.
