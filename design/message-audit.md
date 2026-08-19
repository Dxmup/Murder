# Message Audit 02

## Scope

[`data/messages.csv`](data/messages.csv) contains fifty-four rows after the V2.1 rebalance:

- one pre-game welcome email and nine pre-game historical items (section `0`), including the three escalating Vale incidents, the three corpus-excerpt deliveries, the courier voicemail, the tip-line draft, and the payment-strip flag;
- three section-opening group messages and three additional room-wide framing or closing messages;
- two to three personal live messages per core character;
- no required in-app replies.

## Pacing

- Pre-game: seed the four identity cases and the incident chain across ten different inboxes with narrative dates, so Section 1 conversation starts from asymmetric private archives.
- Section 1: establish the party, article-rumor uncertainty, institutional stakes, neighborhood protections — and now the pre-byline manifest, the early-voice clippings, and the challenge-ritual teaser, so no ending waits a section for affirmative material.
- Section 2: put origin, production, embodiment, succession, autonomous behavior, the fragment conflict, and the Vale-relationship artifacts into conflict.
- Section 3: assemble Vale's route, the intervention, and the incident chain while preserving escape and human-interference alternatives; deliver Kit's correlation beat after both staged disproofs.

Personal sends are staggered by at least three minutes in this compressed schedule. A live implementation may use wider intervals or fewer messages after testing.

## Guardrail checks

- `recipient` always names one core character or `Everyone at Fifteen Years of R`.
- Displayed senders may be unreliable; recipient scope is never misleading; provenance labels (`archived`, `forwarded`, `recovered`, `disputed`, `system`) never authenticate content.
- No message contains or promises a complete article.
- No message proves R's identity, Vale's role, murder, intent, or AI personhood; each incident message carries or implies an innocent reading.
- Technical messages explicitly separate capability, access, behavior, operator, and intent; the Section 3 group opener publishes the non-harm reading of the intervention alongside the incident itself.
- Morgan receives an invitation mechanic, not compelled testimony.
- Kit receives visible correction of both deliberately false theories before the redemption correlation arrives.
- Every live message names or strongly implies movement toward an in-person encounter somewhere in the party.

## Orphan check

Every fact now has a delivery vector or lives in a pre-loaded inbox: the previous orphans (the succession-manufacture question, Vale's "no longer human" statement via the confession-triangle prompt, the ambiguity limit, the intervention's non-harm reading, the fragment conflict) each gained a message or a fact reference. Facts with no message row (V2F001, V2F006, V2F022, V2F024, V2F038 previously) are either now referenced by live mail or held initially and activated by a targeted prompt.

## Standing hypotheses for the next run

1. The rewritten confession-triangle prompt (each recipient learns the other two exist) should make the three-statement comparison fire without broadcasting the sequence.
2. The Section 1 challenge-ritual teaser and manifest delivery should weaken Mantle anchoring; watch first-section belief drift.
3. Dee-first custody of the intervention record should keep the incident key alive when Eli goes quiet.
4. The incident chain should raise killed_by_ai above its 0–3 historical band without winning outright; if it wins in most runs, soften the collision message.
5. The tip-line draft and payment strip should produce at least three distinct Vale-relationship ballot answers.
6. Kit's correlation beat should visibly change how at least two characters treat Kit after the disproofs.

## V2.2 prose pass

The fifty-four bodies were rewritten from design notes into in-fiction correspondence. `message_id`, `thread_id`, `in_reply_to`, `message_type`, `narrative_date`, `provenance`, `section`, `offset`, `recipient`, `fact_refs`, `purpose`, `expected_face_to_face_action` and `status` are unchanged; `from_display`, `from_address`, `subject` and `body` were rewritten. Every message is now written by a named or institutional sender to its recipient, and no body addresses the player, names the clue, or prescribes a conclusion. Bodies run roughly 50–260 words — longer than the 80-word cadence note in `roster.md`, which was written for design notes rather than correspondence; the two-minute total phone budget still holds because arrivals per character are unchanged.

### Sender-address convention

`from_address` is populated for every sender that is a mailbox and left empty where the sender is not one: an unknown number (V2M003, V2M053, V2M034), a voicemail transcription (V2M045), an encrypted-chat handle (V2M022), a protected source using a relay (V2M039), a local process (V2M029), the player's own unsent drafts (V2M051), and the anonymous group sender (V2M025). Domains hold per organisation: `veridiandynamics.org`, `parallaxsystems.com`, `nightdesk.coop`, `castellane-pm.com` (219 Harrow's managing agent), `rakesfile.show` (Kit's show), `harrowtenants.org`, `shawinvestigations.nyc`, `ptwu.org` (the data-workers' local), and the city's `doitt.nyc.gov` / `law.nyc.gov`. The R-associated account is `r@postmark.nyc` on all three of its sends; the address is consistent, which is exactly what the account association establishes and all it establishes.

### Carry changes

Facts referenced are unchanged. Four items carry slightly more than they did, and one carries it from a different mouth:

- **V2M042** is now a Herald copy-desk memo Frankie kept, rather than a note about the clippings. It adds two observations that strengthen One Human without proving it: the tide-table line survived a copy editor's objection because the writer answered the desk phone in nine seconds, and a reporter sent to the street found the sensory detail correct. Both have ordinary rebuttals (a proxy can answer a phone; a person who stood on a street need not have written the sentence).
- **V2M016** now also names a second deletion in the same session — a forty-minute item titled "PLLX — posture" — which gives V2F038 (Mira and Celeste planning for a possible R story) a delivery vector it previously lacked in Celeste's inbox.
- **V2M027** is now a letter from the woman who kept the room used in Vale's earlier disappearance, reporting that somebody has used it again and that she does not know who. This strengthens the voluntary-withdrawal reading of Ballot 3, which the last run's data showed to be the weakest live option, while remaining consistent with V2F028's dual reading — the evidence is a moved kettle and a towel on the wrong hook.
- **V2M012** and **V2M014** each disclose that a second, unnamed party has made the same records request. No new fact; new social pressure toward finding out who.
- **V2M023**'s displayed sender changed from "Printer of record," which belonged to the invitation theory rather than the ledger theory. Kit's three staged beats (V2M008, V2M023, V2M054) now all come from one named producer, forming a continuous arc that ends by asking Kit to have Rafi and Graham check the correlation rather than announce it.

### Guardrail re-check after the rewrite

- No body confirms R's identity, Vale's role, or Vale's fate; the three strongest affirmative items (V2M042 for One Human, V2M043 for the Mantle, V2M040 for Synthetic Origin) each state or imply their own limits.
- No body confirms, describes or resolves the rumoured article. V2M049's tip-line page is a single unbylined sheet ending mid-sentence; V2M030's recovered revision is Vale's private notes; V2M052 hardens the fragment conflict rather than settling it.
- No group message discloses a private character secret. The Section 3 opener (V2M025) was written without reference to Samira's earlier assistance with a disappearance, which would have broadcast her exposure to the room.
- The three progressive keys remain split across separate inboxes: identity history (V2M042 / V2M043 / V2M044), autonomous control (V2M029 / V2M031 / V2M032), and the Vale incident (V2M046 / V2M047 / V2M048). No single message assembles two of them.
