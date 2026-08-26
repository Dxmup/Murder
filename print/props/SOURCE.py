#!/usr/bin/env python3
"""Exact text for every document prop.

Until this file existed the wording lived only inside the PNGs, which meant a
reprint depended on whoever still had the prompt. It is the source of truth
now: regenerate from here, and keep it in step with design/data/messages.csv.

FLAT is the house style for anything a player reads as a document: a
straight-on scan, no desk, no lamp, no coffee cup, no hand. Objects that are
genuinely three-dimensional (the sealed envelope, the open notebook) stay as
photographs and are not in this file.
"""

# Field contract, so this file is safe to use unsupervised:
#   text        - printed wording that must appear on the document, verbatim
#   text_b      - printed wording for a second item shown in the same frame
#   handwritten - wording written ON the document by hand (stays in the image)
#   stickies    - wording on sticky notes. Chad writes these on real sticky
#                 notes and attaches them, so the generated plate must be
#                 CLEAN: no notes, and no blank note shapes either.
#   note        - guidance to whoever regenerates. Never printed.

FLAT = (
    "A flat, straight-on, full-bleed scan of the document itself. Fills the "
    "entire frame edge to edge with no background, no surface, no desk, no "
    "table, no props, no hands, no shadows cast by objects, no perspective and "
    "no tilt. Even lighting, as from a flatbed scanner. The paper's own texture, "
    "age, folds, stains and print imperfections stay - they are on the paper, "
    "not in the room."
)

PROPS = {

"INVITATION": dict(ar="3:4", look=(
 "Letterpress invitation card, heavy cream cotton stock, deckled edge, visible "
 "letterpress bite. Vintage newspaper composing-room typography: bold condensed "
 "slab serif, small caps, generous letterspacing. Printed in black and dull "
 "oxblood red, and the red plate is misregistered about one millimetre down and "
 "to the right of the black on every element - a real error from a tired press. "
 "Small crosshair registration marks in two corners outside the text. Small QR "
 "code lower right. Faint ink smudge near one edge."), text="""
FIFTEEN YEARS OF R
Veridian Dynamics

Friday, the ninth of April
Seven o'clock

219 Harrow Street, fourth floor
LOADING ENTRANCE, NORTH SIDE
Take the freight elevator

MASKS, PLEASE
"""),

"O01": dict(ar="3:4", look=(
 "A typewritten letter on aged cream paper, fifteen years old, softly yellowed, "
 "two deep horizontal fold lines, slightly foxed edges. Struck on a real "
 "typewriter: uneven inking, some letters harder than others, one or two "
 "overtyped corrections. No signature."), text="""
To the desk, not to a name.

I have something and I do not want a byline for it. I want it printed.

You will want to know who I am. I am not going to tell you, and I would ask you to notice that you do not need to. Check the corner. Check the hydrant cap and which way it points. Check the times against the log. What the record will not say for itself, a person standing on that street at four in the morning will say for it.

If you print it, print it under an initial. R will do.

If you do not print it, burn this, and I will find a desk that will.

What the record will not say for itself is not the same as what nobody knows.
"""),

"O02": dict(ar="4:3", look=(
 "A newsroom workflow routing slip: a landscape carbon-copy form on pale green "
 "paper, worn and handled, a soft crease down the middle, a coffee ring, a "
 "staple hole top left. Printed grid, hand-filled in several different inks and "
 "hands. A red rubber-stamped drop code reads DROP 11 in the top right. "
 "Editorial marks and small corrections in green pen in the margins. Columns "
 "headed STAGE, CONTRIBUTOR, DATE IN, DATE OUT, NOTES, with the CONTRIBUTOR "
 "column showing only two-letter initials."), text="""
NIGHT DESK COLLECTIVE - ROUTING SLIP        DROP 11

STAGE        CONTRIBUTOR   DATE IN        DATE OUT       NOTES
RESEARCH     MM            6/14 19:20     6/14 21:45     interview w/ tax attorney
TRANSLATION  PC            6/14 22:10     6/15 00:35     from Portuguese
FACT CHECK   AV            6/15 00:40     6/15 01:20     numbers look off - verify
REWRITE      JB            6/15 01:25     6/15 02:15     tighten lede, cut para 4
SUB          RT            6/15 02:20     6/15 02:50     headline: too cute?
"""),

"O03": dict(ar="3:4", look=(
 "A printed-out email on plain white paper, folded into quarters and flattened "
 "again so the creases show. Clean sans-serif screen typography. A browser print "
 "header across the very top reads: Kestrel Mail - printed 2 April 2027. The "
 "last paragraph is underlined twice in blue ballpoint."), text="""
From: R.
To: Jules Kwan
Subject: the next one

You have been circling this for a year and being polite about it, which I have noticed and which is more than most manage.

I am not going to explain myself. Explanations are how a thing like this gets argued with.

There is a way of working that outlasts the person doing it. You already know what it costs, because you have watched it cost other people, and you did not flinch, and you did not romanticise it either.

Take it or do not take it. If you take it, take the obligations, which are heavier than the name and considerably less interesting.

What the record will not say for itself, you will have to.

R.
"""),

"O03b": dict(ar="3:4", look=(
 "A printed technical report on white paper. Letterhead with a small falcon mark "
 "reads KESTREL MAIL - DISCLOSURE OFFICE. Clean monospace body. A red rubber "
 "stamp reading ATTESTED sits at an angle in the upper right. Slight paper curl."), text="""
FULL HEADER EXTRACT - TICKET #88301
Attested copy. Fee paid.

Message-ID: 0f2a9c
Composed: 11 days before delivery timestamp
Queued: single session, web composer
Scheduled-send window cap: 12 months

Sending account: continuously active 9 yr 2 mo, never lapsed
Account privacy configuration: MAXIMUM, legacy policy
Originating IP: NOT RETAINED under policy in force at composition
Device fingerprint: NOT RETAINED
Client user-agent: NOT RETAINED

WE CANNOT ATTEST: that any particular human being composed this message. We do not hold that information.

Requester of this extract: WITHHELD. We do not disclose requester identity, to you or to them.
"""),

"O04": dict(ar="4:3", two_cards=True, look=(
 "Two items shown flat side by side, filling the frame: on the left a small "
 "old-fashioned calling card, cream stock with a fine engraved border, slightly "
 "foxed, in elegant engraved script and small caps; on the right a plain card in "
 "fountain-pen handwriting."), text="""
E. VELEZ
VOICE AND PRESENCE
Commissions accepted
Discretion assumed
""", text_b="""
One evening. One room. No name given, none asked. Paid through an intermediary. I never saw a face and I have never once said so out loud until tonight.
"""),

"O05a": dict(ar="3:4", look="A printed white index card, clean monospace, one corner slightly bent.", text="""
CONTINUITY LOG - CARD 1 OF 3
CAPABILITY

The process was specified to maintain a single persistent persona across operator handovers and across infrastructure migrations. Tone, stance and prior positions carry forward without a human restating them.

Source: project charter, retained copy.

LIMIT: this card describes what the system was built to be able to do. It does not show it doing it, does not name what it operated, and does not connect it to any byline. Anyone could learn this from the charter.
"""),

"O05b": dict(ar="3:4", look="A printed white index card, clean monospace, a faint thumb smudge at one edge.", text="""
CONTINUITY LOG - CARD 2 OF 3
ACCESS

The continuity process held credentials on infrastructure that was also used by accounts associated with the byline. The overlap ran for a period of years. Shared vendor infrastructure is common and is not by itself remarkable.

Source: access grant records, retained without authorisation.

LIMIT: an overlap is two things touching the same system. This card cannot show what passed between them, in which direction, or whether anything did. Retaining it was itself a breach.
"""),

"O05c": dict(ar="3:4", look="A printed white index card, clean monospace, slightly curled.", text="""
CONTINUITY LOG - CARD 3 OF 3
ACTIVITY

Across a thirty-one hour window, activity attributable to the associated accounts continued. Two edits in that window reference material that entered the public feed nine hours after the queue was last written.

Source: timing logs.

LIMIT: an external feed explains this completely. So does a person reading the news. No record here excludes a remote operator, and no record here identifies one. Say this card last or do not say it at all.
"""),

"O06": dict(ar="3:4", look=(
 "A narrow paper till-roll ledger strip, faded dot-matrix monospace on cheap "
 "till paper, curling slightly at top and bottom. A hand-inked oval is drawn "
 "around the ORDER CHANGED line with 'ask me' written beside it in pencil."), text="""
ACCOUNT HOUSE-041   LABEL: R
STATEMENT EXPORT

BEC no pepper, cut in half,
wrapped separate .............. 612

coffee, black, 2 cups, 1 lid
............................... 588

OPENED 14 YR 9 MO   TRANSACTIONS 1431
AUTHORISED PICKUPS 9

LONGEST GAP 41 DAYS

--- ORDER CHANGED --- WK OF 16 FEB 2025

coffee, black, 1 cup ......... from 02/2025
BEC no pepper, not cut ....... from 02/2025

BALANCE 1904.15   PAST DUE 2187 DAYS
"""),

"O07a": dict(ar="3:4", look=(
 "A printed report on white office paper with a city government letterhead "
 "reading NYC DEPARTMENT OF INFORMATION TECHNOLOGY - RECORDS RETRIEVAL. Clean "
 "official sans-serif. A paperclip impression dents the top left corner."), text="""
RETENTION SNAPSHOT RECOVERY - ITEM DETAIL

Requested by: PARK, C.
Recovered from: nightly snapshot, 7 year retention

ITEM 1
Duration: 90 minutes
Room: none booked
Agenda: none
Attendees: 3, by initials. 1 flagged EXTERNAL.
Organiser flag: PARK, C.
Deletion stamped: 9 days after meeting date

ITEM 2 - same deletion session
Duration: 40 minutes
Attendees: not listed
Subject: PLLX - posture

NOTE: this is the second retrieval performed against this calendar for this quarter. The first was requested through Law under a preservation hold. That hold remains open.
"""),

"O07b": dict(ar="3:4", look=(
 "A printed record on white paper with a discreet corporate letterhead reading "
 "PARALLAX SYSTEMS - OFFICE OF THE GENERAL COUNSEL, and the word PRIVILEGED in "
 "red at the top right. Clean corporate typography."), text="""
AUTHORISATION CHAIN - SUMMARY EXTRACT

Parent authorisation: CONTINUITY PROGRAMME
Signed: SEN, N. - scoped, stated purpose, review cadence specified
Review cadence convened: never

Subsequent access grants under this authorisation: 11
Signed by SEN, N.: 0
Countersigned at director level under delegated authority: 11

GRANT 11 - TEMPORARY EXTERNAL CREDENTIAL ext-4471
Raised: Thursday. Issued: same afternoon.
Requesting note reads, in full: per City Hall
Named requester: none recorded
Calendar entry, our side: none
Calendar entry, their side: none reported

NOTE: the parent authorisation created the delegation that permitted these grants to be approved without the signatory.
"""),

"O08": dict(ar="4:3", look=(
 "A private investigator's route board: one large sheet filling the frame, a "
 "hand-drawn Manhattan street map in blue ballpoint, four numbered route "
 "segments traced in red marker, small night photographs and paper receipts "
 "taped flat onto the sheet, yellow sticky notes stuck flat to it. Everything is "
 "attached to the sheet and in the same plane as it - no desk, no ruler, no cup, "
 "nothing lying beside it. Handwritten in blue at the top left: WEDNESDAY 7 "
 "APRIL 2027, and beneath it a column of times 21:14, 21:22, 21:30, 21:38, "
 "21:46. Red marker labels SEGMENT 1 through SEGMENT 4 on the map, and RUTLEDGE "
 "CUT written in red with two question marks circled beside it. Every taped "
 "receipt is dated 04/07/27 with times between 9 and 10 PM."), text="", stickies=[
 "SPACING IS TOO EVEN.",
 "WHO GAVE ME THIS.",
 "NOT IN ORDER.",
]),

"O09a": dict(ar="3:4", look=(
 "A lined white index card covered in careful handwriting in blue fountain pen, "
 "a neat hand, written slowly. The final line is underlined."), text="""
Copied from V's message, 26 March.
Deleted the original, as asked.

'If it comes to it I need somewhere that isn't mine and isn't yours and isn't anywhere we have ever been together. Not a hotel. Somewhere with a person in it who owes nobody an explanation.

You know the one.

Don't write this down.'

I wrote it down.
"""),

"O09b": dict(ar="4:3", note="Storefront is a SHOE REPAIR, deliberately not a "
     "laundromat: V2M009 puts the laundromat on Rosa's block, and a player "
     "holding both would merge Sam's bolt-hole with Harrow Street, pushing "
     "Ballot 3 toward voluntarily-vanished. Keep them different trades.", look=(
 "An old colour snapshot print with a white border, drugstore-processed, faded "
 "and warm-shifted with age, one corner soft from handling. The print fills the "
 "frame. The image shows a New York street corner in late afternoon light: a "
 "laundromat on the ground floor of a tenement, a dark blue awning, a roll-down "
 "gate pushed up, handwritten price signs taped inside the window, a painted "
 "standpipe and a battered steel bollard at the kerb. NO fire hydrant anywhere "
 "in the frame. Nobody in shot except one long shadow cast by whoever took the "
 "picture. Written in blue ballpoint on the white border beneath the image."), text="", handwritten="the one I told you about."),

"O10a": dict(ar="3:4", look=(
 "A printed automated notice on plain white A4 office paper, a fold line across "
 "the middle, slightly creased, a coffee ring staining one corner. Monospaced "
 "dot-matrix office typeface, black toner, a little uneven. Letterhead reads "
 "CASTELLANE PROPERTY MANAGEMENT - CLAIMS."), text="""
THIRD-PARTY CONTACT NOTICE - RETENTION REQUIRED

Property: 219 Harrow, loading and service crossing, level G
Reference: HS-3062-C
Site contact of record: NOWAK, D.

An autonomous last-mile delivery unit operated by Lodestar Logistics under vendor agreement 5530 made contact with a bicycle at the level-G service crossing. The crossing is not on the unit's filed route for that shift.

Cyclist: unidentified. Declined medical attention. Declined to provide contact details.

ACTION REQUIRED: retain all camera media, access logs and written notes covering thirty minutes either side of the contact time.

This notice is generated automatically. Replies are not monitored.
"""),

"O10b": dict(ar="3:4", look="A printed card on white card stock, clean monospace, one corner bent.", text="""
SYSTEM EVENT - CONTROL PLATFORM
219 ESTATE

Scheduled change set pushed via vendor fleet management.
One door group after-hours permission window moved.
Hold-open alert suppressed, same group.
Origin: vendor, not site panel.
Change ticket: requested, not supplied.

LIMIT: a change set is a system doing what it was scheduled to do. This card cannot establish who scheduled it, when it was scheduled, or why. Correlation is not causation.
"""),

"O12a": dict(ar="4:3", look=(
 "Two small aged newspaper clippings, yellowed and brittle at the edges, cut "
 "unevenly with scissors, taped flat onto a scrapbook page which fills the "
 "frame. Dense small newsprint in a classic broadsheet face. One passage is "
 "highlighted in faded yellow marker. Each clipping carries the byline: R. A "
 "handwritten note in blue ink in the scrapbook margin."), text="""
The water was at the top of its hour and the block was at the bottom of its own.
""", handwritten="nobody edited this in. nobody wrote this by committee. - F.L."),

"O12b": dict(ar="3:4", look=(
 "A single page of a typed manuscript draft, aged, handled and creased, marked "
 "up by three different people in three different media: heavy green felt pen "
 "strikethroughs and rewrites; cramped illegible shorthand in blue ballpoint in "
 "the right margin; lighter pencil notes in a third hand in the left margin that "
 "visibly argue with the green pen, including a pencilled circle around a green "
 "edit with the word NO beside it. The typed text is a dense double-spaced "
 "newspaper feature about housing court. Page number 3 typed at the bottom."), text="", note="No fixed wording. The body is a dense housing-court feature; the "
     "three distinct marking hands ARE the prop. If they are not clearly "
     "three different people, it has failed."),

"O12c": dict(ar="4:3", look=(
 "Two crisp modern newspaper clippings, clean white paper, recent, laid flat "
 "side by side filling the frame. Modern newspaper typography, tight columns. "
 "One passage is underlined in red pen. Both clippings carry the byline: R. Two "
 "yellow sticky notes are stuck flat beside them."), text="""
The floor still smelled of ink and hot metal and the particular sourness of paper waiting to be told what to say.
""", stickies=[
 "that floor was gutted the year before this ran. - B.F.",
 "four beats, comma, contrast, stop. over and over.",
]),

"O13": dict(ar="3:4", look=(
 "A scanned loose sheet - slightly grey, one edge showing the dark band of a "
 "scanner lid. Typed manuscript text, ragged right, no header, no byline, no "
 "page number, no date. The text ends abruptly mid-sentence at the bottom. A "
 "yellow sticky note is stuck flat to one corner."), text="""
—— and the second thing they tell you, once they have decided you are safe, is the thing they told nobody at the hearing. You do not get it in the office. You get it on the sidewalk, in the ninety seconds between the door closing and the car door opening, because the sidewalk is the only room in this city that nobody owns.

I have stood on that sidewalk four times this year. Twice I was lied to. Once I was told something true by a person who did not know it was true. And once ——
""", stickies=[
 "no byline. no slug. no second page. WHO SENT THIS.",
]),

"O14": dict(ar="3:4", look=(
 "A long narrow accounting till strip on pale paper, faded monospace print. "
 "A pencilled note at the bottom."), text="""
NIGHT DESK COLLECTIVE
DROP DISBURSEMENTS - PAYEE EXTRACT

PAYEE HANDLE: SORREL
NOT ON CONTRIBUTOR ROLL
NO CONTRIBUTOR NUMBER

ACTIVE WEEKS BY YEAR

YR 1   wk 04 05 06        then nothing 7 wks
YR 2   wk 22 23           then nothing 11 wks
YR 3   wk 09 10 11 12     then nothing 5 wks
YR 4   wk 31 32           then nothing 9 wks
YR 5   wk 03 04 05        then nothing 6 wks
YR 6   wk 40 41

PATTERN: irregular. Draws shortly after a filing lands.
SPAN: approx 6 years.
""", handwritten="our people are paid when they file. our people file continuously. they need to eat."),
}


# --- Added 2026-08-26: props for the four characters who held none. ---
# None carries a fact_ref or bears on R, Vale or the article. Each exists to
# give its holder something to put on a table.

PROPS.update({

"O15a": dict(ar="3:4", holder="Arden", look=(
 "A formal archive report on white paper, letterhead reading VERIDIAN DYNAMICS "
 "- ARCHIVES, clean institutional serif, a small accession label in the top "
 "right corner, a paperclip impression at the top edge."), text="""
MATERIALS INTAKE REPORT

Item: one letter and one envelope, single sheet
Accession: VDA-2027-0114
Examined by: P. Raghunathan, Archivist

FINDINGS

Stock: rag content and weight consistent with the period.
Ink: typewriter ribbon, carbon black, consistent with the period.
Fold pattern: three folds, consistent with the envelope.
Foxing: consistent with age, and in the locations age produces.
Envelope gum: aged as gum of that decade ages.

CONCLUSION

The object is what it appears to be, as an object.

THIS REPORT DOES NOT ESTABLISH who wrote the item, who addressed it, who carried it, or its relationship to any published work. Period-consistent stock is period-consistent stock. A ream bought in 2009 could be written on last spring.
"""),

"O15b": dict(ar="4:3", holder="Arden", look=(
 "A small sheet of headed notepaper covered in quick fountain-pen handwriting, "
 "one corner folded over."), text="", handwritten="""
Arden - not in the report, and not going in it.

Pulling the Herald deposit for the folds comparison I ended up in the old expense binders. There is a reimbursement in Lowell's name for that week which puts them somewhere other than the desk they describe.

I am telling you. Not the programme committee, and not Lowell.

It may well be nothing. Expense claims are filed late by people who are lying about lunch.

Tell me how much of this you want said out loud on Friday and I will draft the sentence.

- P.
"""),

"O16a": dict(ar="4:3", holder="Grace", note="Sheets 1 and 2 of 4. Print, cut "
     "apart, keep separate: Grace shows them one at a time.", look=(
 "Two separate printed task-instruction sheets laid side by side with a clear "
 "white gap between them, ready to be cut apart. Plain office print, a faint "
 "photocopy grey, punch holes down the left edge of each."), text="""
LEFT SHEET:
PARALLAX SYSTEMS - EVALUATION TASK INSTRUCTIONS
Programme: CONTINUITY / EVAL
Sheet 1        Issued 05/2023        Supervisor: R.O.
PERSONA SECTION
"Voice: direct, first person where natural. Prefer concrete detail. Do not soften."

RIGHT SHEET:
PARALLAX SYSTEMS - EVALUATION TASK INSTRUCTIONS
Programme: CONTINUITY / EVAL
Sheet 2        Issued 09/2023        Supervisor: R.O.
PERSONA SECTION
"Voice: direct, first person where natural. Prefer concrete detail. Do not soften. Maintain continuity of prior stance. Do not contradict earlier positions."
"""),

"O16b": dict(ar="4:3", holder="Grace", note="Sheets 3 and 4 of 4. Sheet 3 "
     "carries DIFFERENT supervisor initials -- that change is the point. Sheet "
     "4's attached samples are missing and must stay missing.", look=(
 "Two separate printed task-instruction sheets laid side by side with a clear "
 "white gap between them, ready to be cut apart. Plain office print, a faint "
 "photocopy grey, punch holes down the left edge of each."), text="""
LEFT SHEET:
PARALLAX SYSTEMS - EVALUATION TASK INSTRUCTIONS
Programme: CONTINUITY / EVAL
Sheet 3        Issued 01/2024        Supervisor: D.K.
PERSONA SECTION
"Voice: measured, institutional. Avoid first person. Avoid speculation."

RIGHT SHEET:
PARALLAX SYSTEMS - EVALUATION TASK INSTRUCTIONS
Programme: CONTINUITY / EVAL
Sheet 4        Issued 04/2024        Supervisor: D.K.
PERSONA SECTION
"Restore Sheet 1 voice. See attached samples."
ATTACHMENTS: samples not present in this pack.
"""),

"O17a": dict(ar="3:4", holder="Graham", note="Fragment A. Must look nothing "
     "like O17b. Visibly page one of something longer, cut off mid-sentence. "
     "Canon: no player ever receives a complete article.", look=(
 "A photocopied manuscript page, third person, dense, double-column, with "
 "superscript footnote markers and three numbered footnotes in smaller type at "
 "the foot of the page. Page number 1 at the bottom. No title, no byline, no "
 "date, no slug. The text stops mid-sentence at the bottom edge."), text="""
Procurement records obtained across four agencies show a consistent pattern in the award of evaluation contracts.1 In each instance the successful vendor had participated in the drafting of the technical requirement, a practice permitted under the relevant procurement rule provided the participation is disclosed.2 Disclosure was recorded in one of the four.

The value of the awards is not itself remarkable. What is remarkable is the sequencing: in three of the four the requirement was amended within eleven days of the vendor's submission, and in each case the amendment narrowed the field to a single qualifying supplier.3

Officials interviewed for this account described the sequence as ordinary. Two declined to be recorded. One asked whether the reporter had spoken to
"""),

"O17b": dict(ar="3:4", holder="Graham", note="Fragment B. Must look nothing "
     "like O17a: different paper, different typeface, no notes, first person.", look=(
 "A printout on plain paper, single column, ragged right, no footnotes, no page "
 "furniture at all. Modern sans-serif screen typeface, as though printed "
 "straight from a document. No title, no byline, no date, no page number."), text="""
The floor is colder than you expect and nobody mentions it, because mentioning it is the kind of thing that gets noticed.

I was there four hours. In that time I watched a woman label two thousand three hundred images and stop twice, both times to ask a supervisor a question about a category that did not fit. Both times she was told to pick the nearest one and move on.

She has done this work for two years. She can tell you which categories are wrong and why, in more detail than anyone who wrote them.

Nobody has ever asked her.

I want to be careful here, because the temptation is to make this about the machine. It is not about the machine. It is about a room in Queens where the cold is a cost decision and the expertise on the floor is worth nothing to anyone upstairs.

She asked me not to use her name. I said of course. She said, they all say of course.
"""),

"O18": dict(ar="3:4", holder="Rosa", look=(
 "A sheet torn from a spiral notepad, covered in fast ballpoint handwriting, "
 "a numbered list, one corner creased."), text="", handwritten="""
Rosa - written down like you asked, so you are not inventing it at midnight with a glass in your hand. Four things, in order, and the order matters.

1. The service side stays ours. Tenants keep key access to the service entrance. In writing, attached to the lease, not a promise from a person who might leave.

2. Dee keeps the pension. Whatever the insurer decides about that gap, the building does not make a super pay for a contractor's 2011 paperwork.

3. Ruben's lease gets regularised. Nine years. Every time somebody comes asking questions he is the one who can be hurt cheapest.

4. If they photograph this block for anything, they pay the association, the way they would pay a location.

2 and 3 are the ones I would trade the rest for. If you can only get two things tonight, get those, and let them feel clever about the others.

Do not come home with a nice conversation.

- Yaz
"""),
})

# Genuinely three-dimensional. Photographs, not scans. Not regenerated flat.
KEEP_AS_PHOTOGRAPH = ["O09", "O11"]

if __name__ == "__main__":
    print(f"{len(PROPS)} flat document props; keeping {KEEP_AS_PHOTOGRAPH} as photographs")
