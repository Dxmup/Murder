# App — Opening, Booklets, and Messages

The app should minimize phone time. It has four player-facing surfaces:

1. Opening story
2. The player’s character booklet
3. An email-style inbox
4. The final ballot

The host dashboard has one Send control for each of the three sections. Pressing it starts that section’s queue. Messages addressed to `Everyone at Fifteen Years of R` notify all players together; individual recipients receive their messages at the offsets in [`../design/data/messages.csv`](../design/data/messages.csv).

Every message displays `From:`, `To:`, `Subject:`, and body. The `To:` line quietly communicates whether information is individual or public. There is no BCC mechanic and no AI assistant inside the app.

Messages should take under twenty seconds to read and provoke face-to-face action. The app does not manage object custody, promises, private conversations, evidence graphs, inventories, or automated deductions.

Canonical inputs:

- character roster and availability: `design/data/characters.csv`
- booklets: `characters/`
- message schedule: `design/data/messages.csv`
- ballot and endings: `design/canon.md`
