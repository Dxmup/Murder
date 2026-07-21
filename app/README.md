# App — Player Portal & Host Dashboard

A lightweight web app that delivers character materials and runs the **dynamic inbox** — the game's core mechanic (§10–§12). It **supplements** the room; it does not replace face-to-face play.

> **Design principle (§10):** Anything best done human-to-human happens in the room. Anything private, timed, multimedia, tedious, or administrative happens in the app.

## Scope

### Player interface (§10)
Login via **private per-character code**. After login, a player sees **only** their character's data:
- Name & public role, background, what-they-know, main goal + 2 sub-goals, relationships
- Private documents, photos, maps, audio, video
- **Message inbox** (see below)
- **Personal AI assistant** (character-scoped — see §12 rules)
- **Final voting interface**

### Pre-game content (§10)
Before the event, limited unlocks: character intro, costume suggestions, public bio, short video, basic relationships, prep guidance. Full private info unlocks at **check-in**.

### Host dashboard (§10)
- Assign player codes & characters; view login status
- **Trigger messages** (timed / manual / conditional)
- Release documents & evidence
- Broadcast public updates; send private updates to selected characters
- Monitor final submissions; display/calculate results

### Dynamic inbox (§11) — the priority feature
Messages arrive by: predetermined time · host trigger · completion of another event · opening a specific item · host judgement that the room needs momentum. Messages can be **private, public broadcast, or public-with-per-character-variation**. Sources & display-sender can differ from **actual origin** (see `messages.csv` `truth_status`). Design rule: *resolve one uncertainty while creating another.*

### Character-scoped AI assistant (§12)
Not the GM. Scoped **strictly** to the assigned character: may know that character's sheet, facts, relationships, private docs, public facts released so far, that character's messages, and player-entered notes. Must **never** know other players' private info, the full solution, host-only info, future messages, or the objective meaning of ambiguous facts. Helps organize/interpret; does **not** solve the game. Assistants may carry distinct tone/bias but must not fabricate facts.

### Explicitly out of scope (for now)
- **No player-to-player chat** unless testing proves it necessary (§10). Players talk face-to-face.

## Suggested build (proposal — not locked)

Repo owner already uses Vercel, so:

- **Next.js (App Router) on Vercel.** Server components for the character portal; server actions / route handlers for host triggers.
- **Data:** the game spine lives in [`../design/data/`](../design/data/) CSVs during design. For runtime, import into a small DB (Vercel Postgres or SQLite/Turso). Keep CSV as authoring source; generate a seed script.
- **Auth:** per-character login codes (no accounts). Signed session cookie carrying `character_id`. Host dashboard behind a separate host code + allowlist.
- **Inbox delivery:** scheduled messages via time checks + host-triggered pushes. Live updates via polling or SSE (avoid heavy realtime infra for a 20-person, 3-hour event).
- **AI assistant:** server-side calls to the Claude API with a **per-character system prompt** built only from that character's authorized data; hard filter so released-fact scope is enforced server-side, never trusting the client. (See the `claude-api` skill for current model IDs/params before wiring this up.)
- **Multimedia:** store images/audio/video as static assets or blob storage; gate access by `character_id` + unlock condition from `evidence.csv`.

## Not started
No code yet — this is the spec. Build order should follow the game design: finalize roster, facts, and the message schedule (see [`../docs/next-steps.md`](../docs/next-steps.md)) **before** committing app data models, so the schema matches real content. The `messages` and `evidence` tables are the two that most directly drive the app.
