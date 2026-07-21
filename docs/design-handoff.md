# Game Design Handoff: *How Many R’s in Murder?*

> This document is the **source of truth**, reproduced verbatim from the original handoff. Working files under `/design`, `/characters`, `/app`, and `/print` derive from it.

## 1. Project Status

This is an original, three-hour, in-person social mystery game for approximately twenty players.

It is inspired by the balance and accessibility of Freeform Games, particularly:

* Every player portrays a specific character.
* Every character has one main goal and two sub-goals.
* Information is distributed among players.
* Players pursue their personal objectives through conversation, negotiation, accusation, secrecy, and exchange.
* No player is reduced to merely observing or solving the central mystery.

The existing Freeform character structure should be emulated in simplicity, but its specific stories, characters, wording, and proprietary content should not be copied.

The project is independent of Oratia.

---

## 2. Working Title

### *How Many R’s in Murder?*

This is a working title and may change.

The title references the unreliability of AI reasoning, apparently simple questions with disputed answers, and the broader theme of deciding what information can be trusted.

---

## 3. Setting

### Time
New York City, 2027.

### Place
The exact venue has not been finalized. The game should occur at a gathering where approximately twenty people connected to a missing investigative journalist have been brought together. A newsroom, private media event, apartment-building common space, restaurant event room, technology summit, or combination of connected locations could support the story.

A previous idea suggested that everyone was summoned by a timed message from the journalist. This has not been formally adopted.

### Social Environment
The world is recognizably near-future rather than science fiction. AI systems are widespread, commercially important, politically controversial, and embedded in daily life. The game should feature familiar institutions and technologies: investigative journalism; AI companies and researchers; venture capital and hedge funds; New York politics; law enforcement; restaurants and apartment buildings; secure messaging; digital assistants; delivery platforms; financial markets; social media and online conspiracy communities. Technology should feel plausible for 2027.

---

## 4. Central Premise

A celebrated investigative journalist has announced an upcoming article that will allegedly change the course of AI and humanity. Before the article is published, the journalist disappears.

It is not initially known whether: the journalist has been murdered; disappeared voluntarily; was abducted or otherwise silenced; was one human being; the identity was shared or inherited by several people; the journalist was an AI-operated persona reporting on AI; the journalist never existed as a coherent entity; apparently connected events have been assembled into a false narrative around a nonexistent person.

The central mystery therefore evolves through three questions:

1. **Where is the journalist?**
2. **Who or what is the journalist?**
3. **Was there ever a journalist at all?**

The game is not simply about identifying a killer. It is about how people construct truth from incomplete, contradictory, and mediated information.

---

## 5. The Journalist’s Identity

The journalist uses a famous pseudonymous identity analogous to Satoshi Nakamoto or the Dread Pirate Roberts. The exact name has not been selected. The identity has existed publicly for approximately fifteen years and has developed a legendary reputation.

> The byline is verifiably real. The individual behind it is not.

The identity may have been: one extremely private journalist; a title passed from one journalist to another; a collective operating under one byline; a digital persona supported by human agents; an autonomous or semi-autonomous AI; a mythology produced by unrelated anonymous sources and coincidental events.

The game must not disclose a single objective explanation too early.

---

## 6. Narrative Philosophy

### Facts, Not Clues
The game should be built from facts rather than traditional clues. A fact is something that objectively occurred in the game world. A fact should not automatically tell players what it means.

Example:
> Food was delivered every Thursday to the lobby of the same apartment building.

That fact does not establish: who placed the order; who collected it; whether the recipient lived in the building; whether the order was for one person; whether the order had any meaningful connection to the journalist.

Players create interpretations by combining facts.

### Multiple Interpretive Frameworks
The same facts should remain reasonably compatible with several explanations:

- **Framework A: One Human** — A single journalist deliberately protected their identity.
- **Framework B: Many Humans** — The identity was shared, inherited, or maintained by a collective.
- **Framework C: AI Persona** — The journalist was an AI identity using human intermediaries or representatives.
- **Framework D: No Coherent Journalist** — The supposed journalist was a story people constructed from unrelated anonymous activities, mistaken identities, copied writing styles, automated systems, and coincidence.

The facts should create pressure toward and against each framework without making one explanation trivially correct.

### No Mandatory Canonical Ending
The current preferred structure is similar to *Clue* in the sense that players ultimately determine what they believe happened. At the conclusion, players vote on questions such as: what happened to the journalist; who or what was the journalist; who bears responsibility for the disappearance or deception; should the unpublished article be released.

It remains unresolved whether the game will contain a hidden canonical truth known to the designer or whether the outcome will be entirely interpretive.

---

## 7. Intended Player Experience

The game should run for approximately three hours. Players should spend the majority of that time: speaking directly with other characters; exchanging facts; withholding facts; negotiating access to information; pursuing personal objectives; comparing inconsistent accounts; reacting to new messages; revising theories; forming alliances; accusing or protecting other players; deciding which systems and witnesses they trust.

Players should not all function as detectives. Different characters should care about different outcomes. Examples: a detective wants to establish what happened; a hedge fund manager wants to know whether the article will move markets; an executive wants the article suppressed; an actor wants a personal relationship kept secret; a restaurant owner wants to protect the business from scandal; a journalist wants the article published; a politician wants to control the public narrative.

A character should be capable of “winning” their personal game even if they incorrectly interpret the central mystery.

---

## 8. Character Structure

The character format should remain approximately as simple as the Freeform model. Every character receives:

- **Character Background** — Who the character is and why they are involved.
- **What the Character Knows** — Facts, observations, memories, rumors, relationships, and private information available at the start.
- **Main Goal** — The character’s most important objective for the evening.
- **Sub-Goal One** — A secondary personal, professional, social, or investigative objective.
- **Sub-Goal Two** — Another secondary objective.
- **Relationships** — Relevant connections to other characters.
- **Starting Materials** — Documents, messages, recordings, photographs, maps, credentials, or other data where required.

Special mechanics should be added only to characters who genuinely need them. The structure should not be expanded with separate mandatory fields for fears, resources, secrets, or similar categories. Such material may appear naturally inside the established sections.

---

## 9. Provisional Character Roster

The game is being designed for approximately twenty characters. The following roles have been proposed but are not yet final.

**Government and Law Enforcement:** 1. NYPD detective · 2. Federal prosecutor or federal investigator · 3. New York City councilwoman or another local political figure.

**Finance:** 4. Hedge fund founder or “finance bro” · 5. Quantitative trader · 6. Venture capitalist.

**Technology:** 7. AI safety researcher · 8. AI evangelist or AI-company executive · 9. Open-source AI developer · 10. Hacker or cybersecurity specialist.

**Media:** 11. Investigative journalist · 12. Editor-in-chief · 13. Celebrity podcaster, broadcaster, or media personality · 14. Conspiracy livestreamer.

**Arts and Culture:** 15. Broadway actor · 16. Gallery owner · 17. AI artist.

**New York Institutional Characters:** 18. Restaurant owner · 19. Apartment-building doorman, concierge, superintendent, or related building employee · 20. Delivery driver, ride-share driver, or another mobile witness.

This roster currently exceeds or overlaps the likely twenty-player limit. Roles will need to be combined, cut, or prioritized. A chef, kitchen manager, janitor, postal employee, librarian, photographer, linguist, dry cleaner, and various delivery workers have appeared in brainstorming. They are not established player characters and may instead exist through documents, recordings, or secondhand testimony.

---

## 10. Web Application

Character materials should be delivered through a lightweight web application. Each player receives a private login code. After entering the code, the player accesses only the information assigned to that character.

**Player Interface** may contain: character name and public role; character background; what the character knows; main goal; two sub-goals; relationship information; private documents; photographs; maps; audio; video; message inbox; personal AI assistant; final voting interface.

**Pre-Game Content** may provide limited information before the event: character introduction; costume suggestions; public biography; short video; basic relationships; preparation guidance. The full private character information may unlock at check-in.

**Host Interface** should support: player-code assignment; character assignment; viewing player login status; triggering new messages; releasing documents or evidence; broadcasting public updates; sending private updates to selected characters; monitoring final submissions; displaying or calculating results.

**Design Principle:**
> Anything best accomplished through human interaction should happen in the room. Anything private, timed, multimedia, tedious, or administratively difficult should happen through the app.

The app should not include player-to-player chat unless later testing proves it necessary. Players should communicate face-to-face.

---

## 11. Dynamic Message Mechanic

The message inbox is a core game mechanic. Messages may arrive: at predetermined times; when the host manually triggers them; when another event is completed; after a player opens a specific item; after the host observes that the room needs new momentum.

Players do not necessarily receive the same messages. Some messages should be private. Some should be public broadcasts. Some may appear to be public but contain character-specific variations.

**Message Sources** can appear to come from: the missing journalist; news organizations; police or government systems; lawyers; financial trading desks; AI companies; other characters; unknown numbers; building systems; delivery platforms; secure messaging services; social media; personal AI assistants; automated scheduled systems.

**Message Functions** can: introduce new facts; recontextualize existing facts; change a goal; create urgency; expose or threaten a secret; request a meeting; direct a player to another character; release a document; spread true information; spread false information; contain a technically authentic but misleading statement; announce breaking news; contradict an earlier public report.

**Scheduled Messages from the Journalist:** the missing journalist may have scheduled messages before disappearing, allowing the journalist to remain an active force during the game. Example functions: warning one character not to trust another; revealing the existence of a hidden file; directing someone to retrieve evidence; naming a successor; suggesting that one person in the room may inherit the identity. The specific messages have not been finalized.

**Message Design Rule:** a strong message should ideally resolve one uncertainty while creating additional questions. Messages should not merely dump explanations.

---

## 12. Personal AI Assistants

Each player may have access to a real AI assistant through the web application. The AI assistant is not the Game Master. The AI assistant is limited to the knowledge and permissions of the assigned character.

**The Assistant May Know:** the character sheet; the character’s starting facts; the character’s relationships; the character’s private documents; public facts released during the game; new messages delivered to that character; notes the player deliberately enters.

**The Assistant Must Not Know:** other characters’ private information; conversations it did not witness or receive; the complete game solution; host-only information; future messages; the objective meaning of ambiguous facts.

**Intended Uses** — a player may ask: How do I know this person? What are my goals? What facts do I have about the restaurant? Which people should I question? What inconsistencies have I noticed? Summarize my current theory. What information am I missing?

Different assistants may have different tones, assumptions, or biases, provided they do not fabricate game facts. The assistant may help organize and interpret information but should not solve the game for the player. The AI-assistant feature is important, but the dynamic inbox is currently considered the more important gameplay mechanic.

---

## 13. Established Facts

The following facts have been discussed and should be treated as the current factual foundation. Some details, particularly durations and exact times, may still be adjusted during development.

### 13.1 The Public Identity
1. A journalist operating under a pseudonym has published major investigative work for approximately fifteen years.
2. The journalist has a highly respected public reputation.
3. No verified photograph of the journalist exists.
4. The journalist’s reporting has historically been accurate enough to attract important sources.
5. Whistleblowers and insiders have trusted the identity with sensitive information.
6. Different people describe the journalist’s voice or physical presence differently.
7. It has not been established that the people describing these encounters all met the same person.
8. The identity may function as a mantle, collective identity, digital persona, or constructed mythology.

### 13.2 The Unpublished Article
9. The journalist announced an article that would allegedly change the course of AI and humanity.
10. The article was not published as scheduled.
11. At least part of the article may exist.
12. Different parties want the article published, suppressed, purchased, verified, or destroyed.
13. The article’s exact subject has not yet been finalized.
14. The article is the central object that many characters want to control.

### 13.3 The Disappearance
15. The journalist disappeared shortly before the article’s planned publication.
16. The journalist’s death has not been confirmed.
17. Voluntary disappearance remains possible.
18. Murder or forced disappearance remains possible.
19. The disappearance may refer to a human being, an identity, an AI system, or an information network ceasing activity.

### 13.4 The Restaurant Orders
20. For several years, the journalist’s identity regularly ordered food from the same restaurant.
21. The delivery was always sent to the same New York apartment building.
22. No apartment number was included.
23. Delivery instructions said to leave the food in the lobby.
24. The delivery worker marked or messaged that the order had arrived.
25. The order was deliberately timed to arrive near the end of the doorman’s shift.
26. The doorman’s shift ended shortly after the delivery.
27. The doorman therefore never saw who collected the food.
28. The overnight staff did not normally see the food remain in the lobby.
29. No known witness has definitively seen the recipient collect the food.
30. The food was gone by the following morning.
31. The restaurant owner or restaurant records can establish the repeated pattern.
32. This does not prove that the journalist lived in the building.
33. This does not prove that the same person collected each order.
34. This does not prove that the journalist personally ate the food.
35. The restaurant delivery pattern must be retained as a core fact.

Exact frequency, meal, tip, duration, and day of the week have not been finalized. Earlier examples used Thursday evenings, approximately eight years, and a recurring order, but these should be treated as placeholders.

### 13.5 The Apartment Building
36. The apartment building is connected to the food-delivery routine.
37. The building contains enough residents, staff, visitors, contractors, delivery workers, cleaners, dog walkers, and guests that entering or leaving does not establish residency.
38. The journalist’s pseudonym is not necessarily known to building management.
39. The lobby operates as an accidental or intentional anonymity mechanism.
40. Shift changes are important to the absence of a direct witness.
41. Building security records may be incomplete.
42. A period of surveillance footage may be missing, deleted, corrupted, or otherwise unavailable. This fact is still provisional and requires integration into the final timeline.

### 13.6 Digital Identity
43. The journalist communicates remotely through secure or encrypted systems.
44. The journalist may have used voice calls, text, email, secure-drop systems, or AI-mediated communication.
45. Different communication channels may present different apparent identities.
46. Some communications may have been scheduled rather than sent live.
47. Someone may have impersonated the journalist.
48. An authentic account does not necessarily prove that the human author was present.
49. The journalist’s digital infrastructure may continue functioning after the disappearance.

### 13.7 Authorship and Style
50. The journalist’s published work has a recognizable style.
51. Some experts may interpret the consistent style as evidence of one author.
52. Other experts may interpret variations as evidence of multiple authors.
53. AI-assisted editing, shared editorial standards, deliberate imitation, or model-generated prose could explain either consistency or variation.
54. Writing analysis should provide evidence but not a definitive answer.

### 13.8 Money and Influence
55. The unpublished article may materially affect AI companies, investors, markets, government policy, and public trust.
56. Financial actors have reason to learn whether the article is authentic.
57. Technology companies have reason to control its release.
58. Journalists and public-interest figures have reason to publish it.
59. A cryptocurrency transfer, unusual financial transaction, or market position shortly before the disappearance has been proposed but is not yet finalized as an immutable fact.

---

## 14. Provisional Facts Requiring Review

The following ideas have appeared but should not yet be treated as established canon: a Thursday-night encrypted chatroom appearance; a missed weekly AI chat; a large cryptocurrency transfer immediately before the disappearance; twenty-three minutes of deleted building footage; taxi trips billed to the journalist; rare-library-book reservations; dry-cleaning pickups under the pseudonym; a long-running PO box; annual charity donations signed “Questions matter”; one disputed photograph; multiple people collecting clothing or documents; a guest Wi-Fi connection at the apartment building; changing device identifiers; a romantic relationship between the journalist and an actor; a private meeting at the restaurant; a newsroom summons; a specific final message naming a successor; a hidden locker or physical dead drop.

These may be used later, but they should first be tested for necessity, plausibility, character connectivity, and redundancy.

---

## 15. Information Distribution

Facts should be distributed across characters rather than stored in one master detective role. Each important event should ideally connect at least three characters.

Example: the food-delivery routine might involve: restaurant owner (ordering history and payment pattern); delivery driver (lobby instructions and delivery timing); doorman (end-of-shift routine); overnight concierge (food was not present later); building employee (resident and visitor patterns); detective (collected records); financial character (payment method); hacker or AI specialist (account or device metadata).

No one person should initially possess the complete interpretation. Characters should have: facts they personally know; facts they believe but cannot prove; rumors they have heard; private incentives affecting what they disclose; goals that require interacting with specific other players.

The developer should maintain a fact-to-character matrix showing who knows each fact and when they can access it.

---

## 16. Three-Hour Game Structure

The exact act structure has not been finalized, but the app and message system should support approximately three phases.

**Phase One: Where Is the Journalist?** Players establish relationships, pursue initial goals, and reconstruct the immediate disappearance. Information focuses on: the promised article; the last known communications; scheduled meetings; financial and political stakes; the apartment building; the restaurant-delivery routine.

**Phase Two: Who Is the Journalist?** New messages and evidence reveal contradictions in identity. Information focuses on: different voices; different physical descriptions; authorship analysis; shared credentials; human intermediaries; long-term infrastructure; possible succession of the identity.

**Phase Three: Was There Ever a Journalist?** Late information undermines assumptions shared by the room. Players must decide: whether there was one person; whether there were multiple people; whether an AI operated the identity; whether the identity was an emergent myth; what happened to the article; what should happen next. The final phase culminates in accusations, public arguments, voting, and personal-goal resolution.

---

## 17. Ending and Scoring

The final scoring system has not been finalized. It should likely include two separate layers.

**Personal Outcome** — Each player evaluates or reports whether they completed: main goal; sub-goal one; sub-goal two. Some objectives may be objectively verified by the app or host. Others may require player declarations or votes.

**Collective Conclusion** — Players vote on the central questions. Possible ballot:
1. Was the journalist one human, multiple humans, an AI persona, or no coherent entity?
2. What happened immediately before the disappearance?
3. Who bears the greatest responsibility?
4. Is the unpublished article authentic?
5. Should the article be released?

The game may award recognition for: best-supported theory; most persuasive accusation; most goals completed; best performance; best costume; best deception; most surprising alliance. Awards are optional and separate from the core design.

---

## 18. Development Artifacts Required

Before writing complete character sheets, create the following source-of-truth data structures. (Implemented as CSVs under [`../design/data/`](../design/data/).)

**Character Table:** Character ID; Character name; Public role; Private background; Main goal; Sub-goal one; Sub-goal two; Relationships; Starting facts; Starting assets; AI configuration; Messages received; Endgame questions.

**Fact Table:** Fact ID; Objective statement; Event or topic; Time; Location; Characters who know it; Evidence supporting it; Release phase; Interpretations supported; Interpretations weakened; Whether it is immutable or provisional.

**Event Table:** Event ID; Chronological placement; What objectively occurred; Participants; Witnesses; Digital records; Physical records; Related messages; Related facts.

**Message Table:** Message ID; Sender displayed to player; Actual origin; Recipient or recipient group; Trigger condition; Delivery time; Content; Attachments; Truth status; Facts introduced; Intended interaction created.

**Evidence Table:** Evidence ID; Type; Owner; Initial visibility; Unlock condition; Related facts; Authenticity; Whether it can be shared; App display requirements.

**Relationship Matrix:** For every pair of characters — Public relationship; Private relationship; Relevant event; Information imbalance; Conflict; Dependency; Goal connection.

---

## 19. Key Design Constraints

1. The game must support approximately three hours of active interaction.
2. Every character must have one main goal and two sub-goals.
3. The character structure should remain simple.
4. No player should need to solve the central mystery to remain engaged.
5. The app should supplement social interaction rather than replace it.
6. Dynamic messages are a central mechanic.
7. AI assistants must be character-limited rather than omniscient.
8. Facts should be objective while interpretations remain disputed.
9. Major facts should connect multiple characters.
10. No single character should initially possess the complete story.
11. The game should be playable without requiring expert technical knowledge.
12. The technology must feel plausible in New York City in 2027.
13. The journalist’s identity must remain meaningfully ambiguous through most of the game.
14. The food-delivery and doorman-shift routine is established and should remain in the story.
15. New facts should be added only when they create useful interaction, deepen a character connection, or recontextualize existing information.

---

## 20. Immediate Next Design Step

The next step should not be writing all twenty characters. The next step should be:

1. Finalize the twenty-player roster.
2. Establish the objective timeline covering the journalist’s fifteen-year history and final week.
3. Select approximately ten to twelve major fact clusters.
4. Assign each fact cluster to three or more characters.
5. Ensure every character has meaningful ownership of at least one fact cluster.
6. Draft each character’s main goal and two sub-goals.
7. Design the message-release schedule across the three-hour game.
8. Test whether the one-human, many-humans, AI-persona, and no-coherent-journalist explanations remain plausible.
9. Remove facts that exist only to make the mystery more complicated.
10. Only then write the full character sheets and application content.
