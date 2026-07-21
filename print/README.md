# Print — Physical Materials

Printable, in-room props and handouts. Per the app design principle, physical items are for things that work better in the hand than on a screen, or that seed face-to-face interaction.

## Candidate materials
- **Name badges** — character name + public role (private goals stay in the app).
- **Character quick-cards** — optional at-table reminder of main goal + 2 sub-goals (kept minimal; full sheet lives in the app).
- **Physical evidence props** — e.g. a printed restaurant order ticket, a disputed photograph, a redacted document, a dead-drop note. Drive from `evidence.csv` (type = document/photo/physical).
- **Venue/building map** — lobby, shift-change layout supporting the delivery/doorman cluster.
- **Ballot cards** — fallback for the §17 final vote if not done in-app.
- **Host run-sheet** — printed message-release schedule as a backup to the dashboard.

## Notes
- Keep anything **secret** off paper unless the prop *is* the reveal — paper can't enforce scope the way the app can.
- Build tooling TBD (could be simple HTML → print-to-PDF, or a small script). Not started; stub only.
- Outputs belong in `print/out/` (gitignored).
