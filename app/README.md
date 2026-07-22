# V2 App — Opening, Booklets, and Messages

The web app is a small dramaturgical delivery layer. It supports the gathering without becoming the place where players conduct the game.

## Player experience

Each player enters a private character code and can access only:

1. the public opening story and cast list;
2. their individual character booklet;
3. their inbox.

The opening can also be projected or read aloud. Booklets must have printable equivalents. The app has no player-to-player chat, AI assistant, inventory, deal tracking, location system, credibility score, ability targeting, or required written replies.

## Booklet release

Before the event, the booklet may show public identity, costume guidance, and a short preparation note. At check-in it unlocks private background, wants, leverage, exposure, relationships, starting knowledge, and social suggestions.

The booklet is reference material. Players should not need to keep it open.

## Three-section inbox

Messages are organized into:

1. The Party and the Absence
2. Who Was R.?
3. What Happened to Vale?

For each section, the host reviews the queue and presses **Send Section** once. The opening group message goes to all players simultaneously. Personal messages then deliver at relative offsets unique to that section. The host can pause or resume a queue; unsent messages never roll into the next section silently.

Every message uses an email-style header. `From:` is fictional and may be unreliable. `To:` is mechanically truthful:

- one character name means only that character received it;
- `Everyone at Fifteen Years of R` means every player received the same message.

V2 has no BCC or concealed subset delivery. Messages should take under twenty seconds to read and provoke a face-to-face action. See [`../design/v2/messaging.md`](../design/v2/messaging.md).

## Host dashboard

The dashboard needs only:

- character assignment and check-in status;
- opening-story display controls;
- section preview with recipient, offset, subject, and delivery state;
- **Send Section**, pause, resume, and failure/retry controls;
- optional host-only ballot tally.

The host does not use the dashboard to authenticate claims, compel players, adjudicate deals, or establish the truth of R.

## Phone-time budget

Required phone attention should remain below five minutes across a three-hour game: one check-in, occasional booklet reference, and roughly four to six meaningful personal messages total per character. There are no required in-app responses.

## Build gate

Do not implement content schemas from the legacy V1 CSVs. App development can begin after V2 booklets and a V2 message table exist. The current `design/data/messages.csv`, `facts.csv`, and `evidence.csv` are explicitly legacy.
