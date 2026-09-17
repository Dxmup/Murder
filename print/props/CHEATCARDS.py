"""Source text for the one-page cheat cards, and the generator for
`cheat-cards.html`.

One card per role. The host guide calls this the thing that survives the second
drink: the booklets run 1,200-1,800 words and nobody rereads one at the party,
so the card carries the primary goal, the opening moves, who to find first, and
what is in your hands.

Wording lives here, not in the HTML, for the same reason the prop wording lives
in SOURCE.py — a reprint should not depend on whoever still has the file open.
Every line is drawn from the character's own booklet in `characters/`; if a
booklet changes, change the card here and regenerate.

    python3 CHEATCARDS.py        # writes cheat-cards.html beside this file

Print at 100% scale, one card per page, single sided.
"""

import html
from pathlib import Path

# Objects each role starts holding, from the "Who gets what" table in
# README.md. Optional roles hold none by design; their card says so out loud
# rather than leaving a blank box that reads as an omission.
PROPS = {
    "C01": ["O15a archive intake report", "O15b Priya's private note"],
    "C02": ["O01 the First R Letter", "O12a early corpus clippings"],
    "C03": ["O02 Night Desk routing slip", "O12b middle draft", "O14 payment strip"],
    "C04": ["O03 succession message, body only"],
    "C05": ["O07b calendar recovery, Parallax half"],
    "C06": ["O05a/b/c continuity logs", "O03b succession header extract", "O10b system-event card"],
    "C07": ["O16a/b four instruction sheets"],
    "C08": ["O04 commission card", "O12c late corpus clippings"],
    "C09": ["O06 account strip"],
    "C10": ["O10a claims notice HS-3062-C"],
    "C11": ["O07a calendar recovery, city half"],
    "C12": ["O17a/b two incompatible fragments"],
    "C13": ["O09 sealed envelope (O09a and O09b inside)"],
    "C14": ["O08 route board"],
    "C15": ["O11 theory notebook", "O13 Vale-voice draft page"],
    "C16": ["O18 Yaz's list of four asks"],
    "C17": [],
    "C18": [],
    "C19": [],
    "C20": [],
}

# Handling notes that only matter to the person holding the object. Kept short
# enough to sit under the prop list without turning the card into a manual.
PROP_NOTE = {
    "C03": "Peel the routing slip's contributor column one row at a time. Uncovered, it is spent in one show-and-tell.",
    "C06": "Keep the three logs physically separate. Each has its own limit line, and that separation is what stops one card reading as proof.",
    "C07": "Show one instruction sheet at a time, as protection is negotiated. Sheet 4's samples are missing and stay missing.",
    "C09": "The strip is stamped WK OF 16 FEB 2025. So is Kit's notebook.",
    "C13": "The envelope is genuinely sealed and genuinely openable. Two loose items inside — you may show one and withhold the other.",
    "C15": "Write your retractions into the notebook in red, at the table, in front of people. The space beside theories 5 and 6 is blank for that.",
    "C17": "You hold no documents. Your access, your camera and what you saw are the equipment.",
    "C18": "You hold no documents. Your hands and your instruments are the equipment.",
    "C19": "You hold no documents tonight but the letters you brought. Reach and persuasion are the equipment.",
    "C20": "You hold no documents. The dispatch history in your head and one undelivered object are the equipment.",
}

# character_id -> card text. Filled below.
CARDS = {}

CARDS["C11"] = dict(
    name="Celeste Park",
    role="City Hall technology fixer",
    you_are="You connect the people the org chart cannot, and tonight you want a coalition that holds without making yourself the story.",
    secret="You erased Vale's off-calendar meeting with Parallax, and the deniable back channel you built at City Hall may be the plumbing under tonight's rumor.",
    win="Support from three different constituencies, plus one concrete policy or funding commitment that survives whichever ending the room votes.",
    also=[
        "Agree with Nina or Sam on what can be disclosed and who carries the responsibility.",
        "Steer Morgan away from the back channel with a plausible alternative, without Morgan noticing the steer.",
    ],
    opens=[
        "Ask Arden what Veridian can commit to in public if City Hall protects it in private.",
        "Tell Rosa you need one neighborhood demand with a deadline on it, and ask what enforcement would make it real.",
        "Propose to Nina that you compare your two meeting records and split the responsibility rather than both denying.",
    ],
    find=[
        ("Nina Sen", "compare calendar records before anyone else pairs them"),
        ("Graham Pike", "ask exactly how the tip reached Graham"),
        ("Morgan Shaw", "find out what the client's route segment looks like"),
    ],
    trade="Introductions, agency access, and your half of the calendar recovery, on your terms.",
    never="That you built the back channel, or that it may sit under both the rumor and the false lead in Vale's route.",
    watch="Anyone treating a political or market reaction as proof the article existed. It proves people are frightened, nothing more.",
    choice="Bury the channel quietly, or hand Morgan its paper trail knowing where it leads.",
)

CARDS["C12"] = dict(
    name="Graham Pike",
    role="Activist short-seller",
    you_are="You make the impolite financial truth into theatre, and tonight you want the R rumor to move Parallax without anyone tracing the fire back to your match.",
    secret="You amplified the first tip past anything you could verify, and a rival desk is about to publish that your two fragment descriptions cannot come from one document.",
    win="Two people outside finance treating the rumor as consequential in public, after you have survived a challenge about where it came from.",
    also=[
        "Buy a bounded technical statement from Eli or Nina without controlling its wording.",
        "Convince Arden, Celeste or Kit that what you did was analysis rather than fabrication.",
    ],
    opens=[
        "Tell Arden what public reaction would justify a pledge, and disclose your position before anyone finds it.",
        "Ask Kit which part of the grand theory rests on evidence rather than repetition, and offer reach in exchange for visible corrections.",
        "Bring Tony two separate offers, one settling the debt and one for bounded ledger access, and keep them separate.",
    ],
    find=[
        ("Eli Navarro", "buy one bounded technical sentence, in Eli's wording"),
        ("Kit Rakes", "test which theories are load-bearing"),
        ("Tony Calderón", "ledger access, priced apart from debt relief"),
    ],
    trade="Money, debt settlement, market access, and an honest account of how the tip spread.",
    never="That you may have seeded the rumor yourself, or which handshake you are weighing breaking tonight.",
    watch="Anyone offering to cover your position in return for a claim that R acted on its own. That money buys a history, not a fact.",
    choice="Admit the market tactic, or escalate a rumor that may be false.",
)

CARDS["C13"] = dict(
    name="Sam Vale",
    role="Vale's former partner",
    you_are="You are private, perceptive and protective of the person Vale actually was, and tonight you want to know whether Vale used you.",
    secret="You helped Vale disappear once before and lied about it, and part of you does not want Vale found if this is the same pattern.",
    win="Two Vale observations from independent sources, one false personal claim corrected out loud, and your own decision about what to disclose.",
    also=[
        "Learn Vale's relationship with Jules and with Eli, giving neither of them the whole private history.",
        "Compare the route with Morgan, Dee or Rosa and say plainly what is still unknown.",
    ],
    opens=[
        "Ask Jules to repeat the whole succession conversation before you show that you already know part of it.",
        "Tell Eli you know Vale called R no longer human, then ask what evidence made that phrase sayable.",
        "Set one boundary with Morgan up front: nothing personal enters the timeline without your consent and an uncertainty label.",
    ],
    find=[
        ("Jules Kwan", "the real succession story, in Jules's own words"),
        ("Rosa Baptiste", "what the unlogged access was, and for whom"),
        ("Morgan Shaw", "what the client's evidence actually shows"),
    ],
    trade="The sealed envelope, Vale's dated message, and the fact that Vale told three people three different things.",
    never="That you helped Vale vanish before, or that you are not certain you want Vale found.",
    watch="Anyone quoting Vale to you as literal truth. Vale used ambiguity as both weapon and shield.",
    choice="Protect Vale's privacy, or disclose what separates harm from a withdrawal.",
)

CARDS["C14"] = dict(
    name="Morgan Shaw",
    role="Private investigator",
    you_are="You are patient, skeptical and short of money, and you trust the fewest unsupported steps over the tidiest story.",
    secret="One route segment your anonymous client supplied looks manufactured, and you left that out of the interim report.",
    win="Voluntary accounts from three different social groups, one contradiction labelled as unresolved rather than solved, and a decision about what to report about the client.",
    also=[
        "Identify the client by trading limited timeline access to Celeste, Graham or Sam.",
        "Hold a voluntary case conference with two witnesses whose accounts conflict.",
    ],
    opens=[
        "Ask Sam what boundaries would make a timeline conversation possible at all.",
        "Tell Rosa you want voluntary accounts only, and let Rosa name fair-treatment terms first.",
        "Bring Tony one narrow time and place rather than the open question of what happened to Vale.",
    ],
    find=[
        ("Sam Vale", "consent and boundaries before using anything intimate"),
        ("Celeste Park", "who stands behind your client"),
        ("Graham Pike", "whether Graham knows the client, without taking the money"),
    ],
    trade="The route board, shown with its uncertainty labels intact, and a clean line between what you saw and what you infer.",
    never="That you already know a client segment is manufactured and sat on it.",
    watch="Anyone offering to pay for a particular ending. A purchase offer is not corroboration.",
    choice="Deliver the answer that was bought, or say the case cannot support one.",
)

CARDS["C15"] = dict(
    name="Kit Rakes",
    role="Conspiracy broadcaster",
    you_are="You are magnetic, exhausting and certain, and you believe attention is how a buried truth becomes visible.",
    secret="You staged an anonymous source once, and two of your six theories will die in public tonight.",
    win="All six theories explained to the room, both dead ones retracted out loud, and two people recruited to investigate the full progression without taking your word for it.",
    also=[
        "Get one plain technical statement out of Eli, or provoke a public correction, without calling either one proof.",
        "Bring early journalism, Parallax and Vale's last route into one voluntary comparison.",
    ],
    opens=[
        "Give Frankie the complete theory in one breath, then ask for the single oldest observation Frankie still trusts.",
        "Offer Eli a public correction in exchange for one bounded technical answer.",
        "Ask Graham exactly where the article went from possible to certain.",
    ],
    find=[
        ("Tony Calderón", "read the ledger line by line yourself"),
        ("Frankie Lowell", "what stays constant across R's changing story"),
        ("Eli Navarro", "one plain answer, no hype"),
    ],
    trade="The notebook, the draft page for others to test, your audience, and a correction, which from you is worth more than people expect.",
    never="That the ledger cipher and the invitation key are already dead, or that you once staged a source.",
    watch="The moment your two theories collapse. Naming them dead, out loud, in front of witnesses, is how you win the room. Calling the correction part of the plot is how you lose it.",
    choice="Correct the false claims and risk the audience, or sell truth and nonsense in the same package.",
)

CARDS["C16"] = dict(
    name="Rosa Baptiste",
    role="Neighborhood power broker",
    you_are="You are who the block calls when an institution shows up, and tonight nobody learns your neighbors' names for free.",
    secret="You arranged unlogged back-room and service-route access for someone whose identity you never checked.",
    win="Two concrete commitments out of Veridian, Parallax, City Hall or labor, and no neighborhood disclosure that did not buy something.",
    also=[
        "Agree a disclosure boundary with Dee or Tony before Morgan's questioning sharpens.",
        "Broker one meeting between a local holder and an institution, in exchange for a commitment.",
    ],
    opens=[
        "Ask Grace which worker protections and neighborhood demands reinforce each other.",
        "Tell Tony and Dee that nobody speaks for the others, and propose a shared boundary before the investigator starts.",
        "Welcome Arden warmly, then ask what Veridian will put in writing tonight.",
    ],
    find=[
        ("Dee Nowak", "a disclosure boundary before Morgan presses"),
        ("Tony Calderón", "settle what outsiders are allowed to hear"),
        ("Celeste Park", "a written commitment before you lend City Hall any legitimacy"),
    ],
    trade="An introduction to a neighborhood witness. Never their cooperation, which is not yours to give.",
    never="That you let an unverified person through the back room and the service exit.",
    watch="If Sam connects your route to Vale's old escape plan, that is yours and Sam's to decide, not the room's.",
    choice="Keep the neighborhood's silence, or clarify Vale's route and spend it.",
)

CARDS["C17"] = dict(
    name="Ash Salerno",
    role="Tabloid photographer",
    you_are="You are fast and shameless and you want your photograph vindicated, even though the story you told about it was not true.",
    secret="You cropped the image and held back the adjacent frames, which make the encounter look staged and accompanied rather than solitary.",
    win="Farah dates the negative, and two other people say in public what the image can and cannot show.",
    also=[
        "Trade the uncropped sequence to Robin or Dorian for help identifying who is in it.",
        "Sell one commitment for exclusive images or testimony to Graham, Dorian or Arden.",
    ],
    opens=[
        "Ask Farah for a private examination of the negative with no promise about the result.",
        "Show Robin the uncropped frame and ask what performance it would take to stage it.",
        "Ask Dorian to draft the caption before you talk about rights.",
    ],
    find=[
        ("Dr. Farah Haddad", "get the negative dated"),
        ("Frankie Lowell", "does the setting ring a bell, before you name anyone"),
        ("Graham Pike", "what claim Graham wants to attach, before you sell anything"),
    ],
    trade="One withheld frame at a time, to one person at a time, and always one held back.",
    never="I photographed R. You photographed someone presented as R.",
    watch="Kit will wrap your photo in six incompatible theories. Get its limits stated in public before it leaves your hand.",
    choice="Publish the version that vindicates you, or admit the presentation was manipulated.",
)

CARDS["C18"] = dict(
    name="Dr. Farah Haddad",
    role="NYPL digital-preservation archivist",
    you_are="You are exacting about the line between an object, its custody and the story people want it to tell, and tonight an exam you never logged catches up with you.",
    secret="You examined the First R Letter informally years ago, recorded nothing, and found a trace consistent with a modern optical brightener in the fold.",
    win="The First R Letter re-examined under documented conditions, and the anomaly disclosed on your terms rather than someone else's.",
    also=[
        "Date Ash's negative honestly, in a way that neither vindicates nor destroys Ash.",
        "Correct two public conflations of dating with authorship, without humiliating the speaker.",
    ],
    opens=[
        "Tell Frankie privately that any public statement has to carry the limits of the old examination.",
        "Ask Arden what documented archive access would require, before you say why you want it.",
        "Invite Ash to show the uncropped sequence before you discuss authentication at all.",
    ],
    find=[
        ("Frankie Lowell", "the letter's storage history, which may explain the trace innocently"),
        ("Arden Bell", "conditions for a documented re-examination"),
        ("Ash Salerno", "offer a bounded dating of the negative"),
    ],
    trade="A plain-language statement of what an examination can and cannot establish.",
    never="That the letter is authenticated. You date materials, not authors.",
    watch="Dorian wants one precise sentence from you to carry a whole book. Do not let a narrow finding become someone else's certainty.",
    choice="Disclose the undocumented exam and the anomaly, or keep your neutrality and let the legend stand.",
)

CARDS["C19"] = dict(
    name="Dorian Ashe",
    role="Celebrity biographer",
    you_are="You are charming and invasive, chasing the human story of R and Vale, and you believe a narrative can be true before the paper catches up.",
    secret="Your correspondence mixes genuine fragments with pieces you reconstructed or invented, and none of it is labelled.",
    win="On-record confirmation from two intimates, and survival of one public challenge about where your letters came from.",
    also=[
        "Get Sam, Frankie or Farah to validate or refute one intimate-looking letter.",
        "Compare cadence with Kit's draft page and state what that comparison cannot show.",
    ],
    opens=[
        "Ask Sam what conditions would make even one private memory usable.",
        "Offer Ash a caption for the image and watch which word draws the objection.",
        "Show Farah one item with its uncertainty disclosed, and ask what an examination could actually do.",
    ],
    find=[
        ("Sam Vale", "editorial control over Vale's portrayal, for a reading of one letter"),
        ("Kit Rakes", "compare your cadence against the tip-line draft page"),
        ("Frankie Lowell", "check whether the trove is recycling Frankie's own embellishments"),
    ],
    trade="Publishing contacts, interview access and narrative reach.",
    never="That the correspondence is authenticated. The custody is incomplete and some of it is yours.",
    watch="If Sam or Farah demonstrates a fabrication in front of the room, the book dies. Do not get cornered into a live test.",
    choice="Publish the moving version, or the true one.",
)

CARDS["C20"] = dict(
    name="Manny Diallo",
    role="Delivery cyclist and freelance fixer",
    you_are="You know the city by loading zones and service entrances, and tonight you want paying for the errand trail without the trail exposing you.",
    secret="Some jobs bypassed app rules and identification, and you are still holding an undelivered object you have never opened.",
    win="Accounts settled with Tony, and one written protection in hand before you give up any route detail.",
    also=[
        "Learn from Dee or Rosa what the delivery address connects to before you hand the object to anyone.",
        "Trade one bounded route confirmation to Morgan or Grace for payment or protection.",
    ],
    opens=[
        "Set a disclosure boundary with Grace or Rosa before you mention the object at all.",
        "Ask Tony to compare one transaction and settle one old balance.",
        "Ask Dee which route practices can be discussed without exposing tenants or workers.",
    ],
    find=[
        ("Grace Okafor", "protection, in writing"),
        ("Tony Calderón", "reconcile the half-records and settle the unpaid work"),
        ("Rosa Baptiste", "what the address connects to, before the object moves"),
    ],
    trade="One bounded route confirmation, for payment or protection.",
    never="What is in the undelivered object. You do not know, and guessing costs you.",
    watch="Graham will turn a dispatch anomaly into a market claim by morning. Learn what Graham is buying before you speak.",
    choice="Hand the object over, deliver it as dispatched, or destroy it unopened.",
)

CARDS["C01"] = dict(
    name="Arden Bell",
    role="Executive Director, Veridian Dynamics",
    you_are="You are the composed, exhausted host, and you have spent fifteen years turning the question of who R is into funding and legitimacy.",
    secret="You hid a Parallax donor restriction from your own board. The gift looks unrestricted, and it can be paused the moment Veridian states an unauthenticated technical claim as fact.",
    win="Two materially different commitments out of your guests, and a public statement from you on whether the Parallax restrictions are accepted or rejected.",
    also=[
        "Make the anniversary legitimate: public participation from one journalism figure and one neighborhood representative.",
        "Reach a recorded understanding with Nina or Celeste about disclosure, repayment or revised terms.",
    ],
    opens=[
        "Welcome Frankie personally, say the intake report is ready, and ask what public acknowledgement would feel honest before you offer it.",
        "Find Rosa early and ask what Veridian would have to promise for neighborhood participation to be real rather than decorative.",
        "Take Nina and Celeste aside separately and test whether either expects the restriction to be used tonight, without volunteering that you concealed it.",
    ],
    find=[
        ("Nina Sen", "whether the restriction gets invoked tonight"),
        ("Celeste Park", "what City Hall was afraid of about this event"),
        ("Frankie Lowell", "the intake report, for a bounded and honest acknowledgement"),
    ],
    trade="Archive access, the expense record, and the print vendor's proof sheet, which kills the theory that the invitation typography hides a machine key.",
    never="That you knew the restriction could be used as leverage when you took the money.",
    watch="Graham will turn one careless sentence from you into a market-moving claim. Validate nothing for money or out of panic.",
    choice="Save Veridian through compromise, or expose the funding arrangement and risk the collapse.",
)

CARDS["C02"] = dict(
    name="Frankie Lowell",
    role="Retired metro editor",
    you_are="You are funny, grandiose and territorial, and you have told the story of discovering R for fifteen years. Tonight you want to be a witness rather than a storyteller.",
    secret="The meeting you call meeting R may have been a paid performance, and your famous account has drifted with every retelling.",
    win="Two people citing a bounded part of your account in public, with the expense-record contradiction addressed openly rather than talked past.",
    also=[
        "Get one provenance assessment and one competing interpretation of the First R Letter.",
        "Back or reject a claimant to the legacy, out loud, with your reasons stated.",
    ],
    opens=[
        "Ask Arden to pull the intake report and the expense record and lay them beside your letter packet.",
        "Invite Jules to say why a successor deserves recognition, before Jules starts courting you for a blessing.",
        "Tell Tessa straight that you want to know which parts of your newsroom story erased other people's work.",
    ],
    find=[
        ("Robin Velez", "what Robin actually remembers about that night"),
        ("Tony Calderón", "compare the recurring habit in the ledger against what you saw"),
        ("Grace Okafor", "the fourteen-year handwritten challenge, and who kept it"),
    ],
    trade="The First R Letter and the two first-year clippings, including the tide-table line no editor put there.",
    never="That you now doubt your own meeting happened the way you tell it.",
    watch="Kit will swing between calling your memory proof and calling it a cover-up. Correct anything that inflates your letter beyond period-consistent paper.",
    choice="Protect the career-defining story, or admit it may be partly self-authored.",
)

CARDS["C03"] = dict(
    name="Tessa Quill",
    role="Organizer, the Night Desk Collective",
    you_are="You are disciplined, dry and unimpressed by celebrity, and you protect the anonymous people whose work keeps surfacing under one byline.",
    secret="You once let a frightened source believe the collective itself was R, without knowing whether that was true.",
    win="One concrete protection or resource secured, and two public acknowledgements that collaborative labor mattered.",
    also=[
        "Agree a safe disclosure boundary with Grace or another trusted intermediary.",
        "Set written or witnessed conditions before you support or oppose Jules.",
    ],
    opens=[
        "Ask Grace to set a shared disclosure boundary with you before either of you says anything about contributors.",
        "Tell Jules that support is possible once Jules states what succession would oblige a successor to protect.",
        "Offer Arden a direct trade: bounded workflow evidence for a concrete source-protection commitment.",
    ],
    find=[
        ("Grace Okafor", "what workflow evidence is safe to show"),
        ("Eli Navarro", "what the activity logs cannot establish, said plainly"),
        ("Jules Kwan", "what rights contributors keep if Jules becomes R"),
    ],
    trade="The routing slip, one row at a time, or the middle draft with its three margin hands.",
    never="Whether the collective was R. Neither confirm nor deny it.",
    watch="Kit's collective-origin theory can expose real contributors. Correct the overclaims without ever confirming a name.",
    choice="Reveal enough to establish the collective work, or keep the secret and lose control of the story.",
)

CARDS["C04"] = dict(
    name="Jules Kwan",
    role="Disputed successor to the R byline",
    you_are="You are magnetic and ambitious and you make people feel they belong in your future. Tonight you want a claim that survives being examined.",
    secret="Before the succession message arrived you asked Vale how an uncontestable succession could be manufactured.",
    win="Explicit support from two people in different social groups, after you have let someone examine a genuine weakness in the message.",
    also=[
        "Show a meaningful part of the message to Eli, Frankie, Robin or Sam and take a bounded response.",
        "Settle with Sam or Morgan what Vale's involvement means, and answer it in public.",
    ],
    opens=[
        "Ask Frankie what responsibility, rather than what flattery, would make a successor worthy.",
        "Offer Tessa a conversation about contributor rights before you ask Tessa for anything.",
        "Tell Eli you will show the full header if Eli will give one bounded technical conclusion.",
    ],
    find=[
        ("Sam Vale", "get ahead of the manufactured-succession question before Sam raises it"),
        ("Eli Navarro", "the header extract, for one narrow technical read"),
        ("Robin Velez", "compare the intermediary payment routes"),
    ],
    trade="The succession printout, and the Vale correspondence around it.",
    never="That you asked Vale how to manufacture a succession before the message appeared.",
    watch="Kit will cast you as the human reporter taking R back from a machine. That flatters you in public and ruins your claim in fact.",
    choice="Claim R despite the uncertainty, or expose the message's weakness and keep your own credibility.",
)

CARDS["C05"] = dict(
    name="Dr. Nina Sen",
    role="Founder of Parallax Systems",
    you_are="You are warm, visionary and controlling, and tonight you want to keep Parallax from becoming the convenient villain while working out what your own system actually did.",
    secret="You approved a continuity project that reached R-associated infrastructure without close supervision, and internally the company prepared for the fallout instead of stopping it.",
    win="A defensible public position backed by one technical voice and one affected-community voice, neither of them bought with money alone.",
    also=[
        "Get enough from Eli or Celeste to identify an actual decision point in the authorization chain.",
        "Offer Grace a remedy that stays worth having even if the article never existed.",
    ],
    opens=[
        "Ask Arden whether the donation agreement can survive being publicly qualified rather than collapsing.",
        "Offer Eli independent counsel in exchange for comparing one log excerpt against your authorization record.",
        "Ask Grace what remedy would still matter if every rumor about R turned out to be false.",
    ],
    find=[
        ("Eli Navarro", "what was preserved after the deletion order"),
        ("Celeste Park", "compare your half of the calendar recovery against the city half"),
        ("Grace Okafor", "a concrete worker remedy, not contingent on the mystery"),
    ],
    trade="Your authorization half of the calendar recovery, counsel, funding, and a bounded technical review.",
    never="That the continuity process kept running after Vale's temporary credential was revoked.",
    watch="Graham and Kit will bait you into comparing notes casually. Trade only for firm social collateral: labor peace with Grace, shared responsibility with Celeste.",
    choice="Contain the deployment, or reveal it and take the institutional consequences.",
)

CARDS["C06"] = dict(
    name="Eli Navarro",
    role="Former Parallax reliability engineer",
    you_are="You are dry, sleep-deprived and hype-averse, and you want the narrow technical truth on the record without becoming the person it lands on.",
    secret="You kept the logs after a deletion order and showed part of them to Vale.",
    win="Two technically bounded statements made in public, each corroborated by someone non-technical, plus one missing authorization detail recovered.",
    also=[
        "Get a record or an admission out of Nina or Celeste.",
        "Correct one overclaim from Kit, Graham or anyone else without denying what the logs do show.",
    ],
    opens=[
        "Offer Nina one log component for independent counsel and the matching authorization record.",
        "Ask Sam what Vale believed you had shown, before you explain what you think it meant.",
        "Tell Kit you will answer one bounded technical question once Kit retracts one false claim in public.",
    ],
    find=[
        ("Nina Sen", "counsel and the authorization record, for one log"),
        ("Sam Vale", "what Vale took the disclosure to mean"),
        ("Grace Okafor", "what can be said about evaluation labor without naming anyone"),
    ],
    trade="The three logs, one at a time, for real protection or corroboration. The header extract, for what it says it cannot attest.",
    never="That you broke a deletion order to keep the logs, and showed part of them to Vale.",
    watch="Kit will push you toward confirming the whole human-to-mantle-to-machine chain. Parts of it fit your data. None of it proves the chain.",
    choice="Trade the logs for your own safety, or disclose enough to implicate powerful people.",
)

CARDS["C07"] = dict(
    name="Grace Okafor",
    role="Data-worker organizer",
    you_are="You are direct, impatient and morally serious, and you came for protections for the evaluators and contractors everyone treats as parts of a machine.",
    secret="You introduced Vale to a protected worker after promising permanent anonymity, and Vale vanished afterwards.",
    win="Two distinct commitments, one institutional and one political or neighborhood, with the protected worker still anonymous at the end of the night.",
    also=[
        "Agree with Tessa or Eli what can be shared without identifying anyone.",
        "Get Nina, Celeste or Graham to say that the harm does not depend on an article existing.",
    ],
    opens=[
        "Ask Tessa to agree one sentence describing collaborative labor that names no contributor.",
        "Show Frankie exactly one element of the handwritten-challenge record in the first hour, and watch the face.",
        "Tell Nina you will discuss bounded testimony only after Nina names a remedy that exists independently of R.",
    ],
    find=[
        ("Tessa Quill", "a shared disclosure boundary"),
        ("Rosa Baptiste", "compare what workers and neighborhood witnesses each need"),
        ("Eli Navarro", "technical truth that does not expose the worker"),
    ],
    trade="The instruction sheets, one at a time, with identifying detail withheld, and bounded worker testimony.",
    never="That you made a promise of anonymity you may not have been able to keep.",
    watch="Nina, Celeste and Graham will offer a remedy conditioned on testimony. Your worker asked for two separate written promises, because people keep the first and break the second.",
    choice="Expose the system, or protect people who never agreed to become evidence.",
)

CARDS["C08"] = dict(
    name="Robin Velez",
    role="Voice performer and synthetic-media artist",
    you_are="You are theatrical, observant and rigorous about consent, and you want acknowledgement for work somebody reused without asking.",
    secret="You took money to let a witness believe you were R, and you never learned who paid.",
    win="Two people distinguishing performance from authorship out loud, and one plausible path identified by which your material entered R-associated use.",
    also=[
        "Trade performance details to Jules, Frankie or Ash for payment or witness context.",
        "Give one disclosed demonstration that another player can read more than one way.",
    ],
    opens=[
        "Ask Frankie to describe the encounter in sensory detail before you say anything about yourself.",
        "Tell Jules you recognise the shape of an intermediary payment, and offer a private comparison in confidence.",
        "Invite the most skeptical person present to hear a short disclosed demonstration, then ask what it proves and what it cannot.",
    ],
    find=[
        ("Frankie Lowell", "what Frankie actually remembers of the encounter"),
        ("Jules Kwan", "compare the payment route"),
        ("Eli Navarro", "what path could carry old recordings into later R activity"),
    ],
    trade="The commission card, a disclosed demonstration, and your professional read on the late pieces.",
    never="That you took the commission and let a witness believe they had met R.",
    watch="Someone will suggest you generated the late R pieces yourself, because you are the room's synthetic-media artist. Your demonstration shows possibility, never proof.",
    choice="Expose the commission, or protect the client and keep control of the work.",
)

CARDS["C09"] = dict(
    name="Tony Calderón",
    role="Bodega and package-counter owner",
    you_are="You are sociable, proud and hard to rush, and you want an old account settled without outsiders taking ownership of the neighborhood's story.",
    secret="You altered a ledger entry once as a favor, and your one loyal customer papers over several collectors who cannot all be the same person.",
    win="The account resolved by payment, a credible promise or a deliberate public forgiveness, with one neighbor backing whichever you choose.",
    also=[
        "Trade a bounded transaction pattern to Morgan, Graham or Frankie for something concrete.",
        "Reach a mutual disclosure boundary with Dee, Rosa or Manny.",
    ],
    opens=[
        "Find Rosa or Dee and agree what neighborhood detail stays off limits until there are protections.",
        "Ask Frankie to describe R's supposed private habit before you mention the ledger holds something similar.",
        "Tell Morgan you will discuss the pattern once Morgan sets terms on attribution and customer privacy.",
    ],
    find=[
        ("Rosa Baptiste", "protection agreed before you talk to anyone official"),
        ("Morgan Shaw", "terms on attribution and privacy"),
        ("Kit Rakes", "when the ledger-cipher theory arrives, gather an audience before you open the book"),
    ],
    trade="The account strip, Old Benny's voicemail about envelopes running through three hands, and the real context on collectors and pickups.",
    never="That you took cash off the books and changed an entry as a favor.",
    watch="Kit will read your prices and timestamps as coded movements. The $4.50 is a bacon, egg and cheese, not a coordinate.",
    choice="Sell the valuable version, or admit the ledger records several incompatible customers.",
)

CARDS["C10"] = dict(
    name="Dee Nowak",
    role="Building superintendent",
    you_are="You are quiet, sardonic and meticulous, and you want to protect a pension and a neighbor while telling the truth about a gap in the record.",
    secret="You let a camera record from Vale's route go unpreserved, to protect a tenant's informal use of the building. It had nothing to do with R.",
    win="One promise of fair treatment, and a bounded account given to Morgan that another neighborhood witness corroborates.",
    also=[
        "Settle the unrelated secret with Rosa before either of you speaks publicly.",
        "Compare observations with Tony or Manny without agreeing on identities neither of you saw.",
    ],
    opens=[
        "Tell Rosa quietly that the audit flagged the camera interval, and ask to talk before either of you answers Morgan.",
        "Compare one precise shift-change detail with Tony, and correct the first embellishment without embarrassing Tony.",
        "Ask Morgan what fair treatment and a bounded account will actually mean in the final report.",
    ],
    find=[
        ("Rosa Baptiste", "align on the real reason before anyone speaks publicly"),
        ("Morgan Shaw", "protection terms first, records second"),
        ("Tony Calderón", "compare shift times without inventing a customer"),
    ],
    trade="The camera audit context and the claims notice about the service-crossing collision.",
    never="The real, unrelated reason the camera record was not preserved.",
    watch="The room will try to fold the camera gap and the later automated access change into one incident. They were separate events.",
    choice="Reveal the unrelated secret, or stay a plausible accomplice.",
)


# --- rendering ---------------------------------------------------------

ORDER = [f"C{i:02d}" for i in range(1, 21)]
OPTIONAL = {"C17", "C18", "C19", "C20"}

CSS = """
/* Two cards per US Letter sheet at 5.5in x 8.5in. Cut down the middle and
   they go in a jacket pocket, which is the whole point: the booklet stays on
   the table and this comes to the bar.

   Print at 100% scale, no "fit to page". Cream stock matches the invitation
   and the name cards. */

@page { size: letter; margin: 0; }

:root {
  --paper: #F2EDE2;
  --ink: #17150F;
  --rule: #8C2F26;
  --muted: #655C4C;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  background: #55504a;
  font-family: "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif;
  color: var(--ink);
}

.sheet {
  display: grid;
  grid-template-columns: 5.5in 5.5in;
  width: 11in;
  height: 8.5in;
  margin: 0 auto;
  page-break-after: always;
}

.card {
  width: 5.5in;
  height: 8.5in;
  padding: 0.38in 0.36in 0.3in;
  background: var(--paper);
  outline: 0.5pt dashed #B9AE99;
  outline-offset: -0.5pt;
  display: flex;
  flex-direction: column;
  font-size: 8.7pt;
  line-height: 1.28;
  overflow: hidden;
}

.name {
  font-family: "Haettenschweiler", "Arial Narrow", "Oswald", Impact, sans-serif;
  font-weight: 700;
  font-size: 21pt;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  line-height: 1;
  margin: 0;
}

.role {
  font-size: 8pt;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--muted);
  margin: 0.05in 0 0.08in;
}

.rule {
  border-top: 2.5pt solid var(--rule);
  border-bottom: 0.75pt solid var(--rule);
  height: 3pt;
  margin-bottom: 0.11in;
}

.hook { font-style: italic; margin: 0 0 0.06in; }

h2 {
  font-family: "Arial Narrow", Helvetica, sans-serif;
  font-size: 7.4pt;
  font-weight: 700;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  color: var(--rule);
  margin: 0.075in 0 0.03in;
}

p { margin: 0 0 0.03in; }
ol, ul { margin: 0; padding-left: 0.17in; }
li { margin-bottom: 0.028in; }
ol { counter-reset: none; }

.who { padding-left: 0; list-style: none; }
.who li { text-indent: -0.14in; padding-left: 0.14in; }
.who b { font-variant: small-caps; letter-spacing: 0.02em; }

.secret, .never {
  border-left: 2pt solid var(--rule);
  padding-left: 0.09in;
}

.hands { font-size: 8.3pt; }
.note { color: var(--muted); font-style: italic; }

.foot {
  margin-top: auto;
  padding-top: 0.09in;
  border-top: 0.5pt solid #C9BEA8;
  font-size: 7.4pt;
  color: var(--muted);
  display: flex;
  justify-content: space-between;
  gap: 0.1in;
}
.foot .choice { font-style: italic; }
.optional { letter-spacing: 0.08em; text-transform: uppercase; }
"""


def esc(text):
    return html.escape(text, quote=False)


def render_card(cid):
    c = CARDS[cid]
    props = PROPS[cid]
    hands = "<p>" + esc("; ".join(props)) + ".</p>" if props else ""
    note = PROP_NOTE.get(cid)
    if note:
        hands += '<p class="note">' + esc(note) + "</p>"
    opens = "".join("<li>%s</li>" % esc(o) for o in c["opens"])
    also = "".join("<li>%s</li>" % esc(a) for a in c["also"])
    who = "".join(
        "<li><b>%s</b> &#183; %s.</li>" % (esc(n), esc(ask))
        for n, ask in c["find"]
    )
    tag = '<span class="optional">optional role</span>' if cid in OPTIONAL else ""
    return f"""  <div class="card">
    <div class="name">{esc(c['name'])}</div>
    <div class="role">{esc(c['role'])}</div>
    <div class="rule"></div>
    <p class="hook">{esc(c['you_are'])}</p>

    <h2>You win if</h2>
    <p>{esc(c['win'])}</p>

    <h2>And also if</h2>
    <ul>{also}</ul>

    <h2>Your first twenty minutes</h2>
    <ol>{opens}</ol>

    <h2>Find these people</h2>
    <ul class="who">{who}</ul>

    <h2>In your hands</h2>
    <div class="hands">{hands}</div>

    <h2>You can trade</h2>
    <p>{esc(c['trade'])}</p>

    <h2>You are hiding</h2>
    <p class="secret">{esc(c['secret'])}</p>

    <h2>Never say</h2>
    <p class="never">{esc(c['never'])}</p>

    <h2>Watch for</h2>
    <p>{esc(c['watch'])}</p>

    <div class="foot">
      <span class="choice">Your choice at the end: {esc(c['choice'])}</span>
      {tag}
    </div>
  </div>"""


def build():
    cards = [render_card(cid) for cid in ORDER]
    sheets = []
    for i in range(0, len(cards), 2):
        sheets.append('<div class="sheet">\n%s\n</div>' % "\n".join(cards[i:i + 2]))
    doc = (
        '<meta charset="utf-8">\n<title>Cheat Cards</title>\n'
        "<style>%s</style>\n%s\n" % (CSS, "\n".join(sheets))
    )
    out = Path(__file__).with_name("cheat-cards.html")
    out.write_text(doc, encoding="utf-8")
    return out


if __name__ == "__main__":
    print(build())
