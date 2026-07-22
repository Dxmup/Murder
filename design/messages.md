# Messaging System

## Principle

The inbox creates pacing and private pressure while minimizing phone time. Every message should send its recipient back into face-to-face play.

## Host flow

1. The host opens the next section's queue.
2. The app displays the section name, recipients, and relative send schedule.
3. The host presses **Send Section**.
4. The opening group message is sent to all players simultaneously.
5. Personal messages deliver at their configured offsets.
6. The host may pause or resume the queue for safety or practical interruptions.
7. When the room is ready, the host advances to the next section; unsent messages from the previous section do not silently carry over.

## Header contract

- `From:` is fictional presentation and may be spoofed, automated, mistaken, or authentic only to an account.
- `To:` truthfully states message visibility.
- `Sent:` shows actual delivery time.
- `Subject:` supplies flavor and a quickly readable hook.

Use only two recipient forms in the initial design:

- one named character;
- `Everyone at Fifteen Years of R`.

This lets players infer whether information is private without an immersion-breaking `PRIVATE` or `PUBLIC` badge.

## Timing contract

Messages use relative offsets from the moment the host starts a section. Example:

| Offset | Recipient | Purpose |
|---:|---|---|
| 0:00 | Everyone | Open the section's question |
| 0:04 | One character | Create first private movement |
| 0:09 | One character | Pressure a different social knot |
| 0:16 | One character | Recontextualize a conversation likely already underway |
| 0:24 | Everyone or one character | Escalate only if the section needs it |

The exact schedule should distribute notifications rather than create synchronized phone use. Group delivery is deliberately synchronized; individual delivery is deliberately staggered.

## Message test

Before including a message, complete this sentence:

> After reading this, the player will put the phone away and ________.

If the blank cannot be filled with a face-to-face action, reconsider the message.
