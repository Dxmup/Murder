#!/usr/bin/env python3
"""Build the player app's runtime data from the canonical design sources.

Reads  : design/data/*.csv, characters/*.md
Writes : app/web/src/data/generated/*.json

The design CSVs stay the single source of truth. Nothing here invents content;
it normalises, resolves recipient names to character ids, and applies the
act-clock compression declared in TIMING.
"""

from __future__ import annotations

import csv
import json
import re
import sys
import unicodedata
from pathlib import Path

REPO = Path(__file__).resolve().parents[3]
DATA = REPO / "design" / "data"
BOOKLETS = REPO / "characters"
OUT = Path(__file__).resolve().parents[1] / "src" / "data" / "generated"

# Target minutes of message runway per act. The authored offsets run
# 38/50/43 = 131 minutes, which overruns a two-hour party once the opening
# briefing, act transitions, and the ballot are accounted for. Retune here.
TIMING = {"1": 28, "2": 34, "3": 28}

EVERYONE = "everyone"


def fold(name: str) -> str:
    """Accent- and title-insensitive key for matching a display name to an id."""
    stripped = unicodedata.normalize("NFKD", name)
    stripped = "".join(c for c in stripped if not unicodedata.combining(c))
    stripped = re.sub(r"^(dr|mr|ms|mrs)\.?\s+", "", stripped.strip(), flags=re.I)
    return re.sub(r"[^a-z]", "", stripped.lower())


def read_csv(path: Path) -> list[dict]:
    with path.open(newline="", encoding="utf-8") as fh:
        return list(csv.DictReader(fh))


def parse_offset(raw: str) -> int | None:
    """'MM:SS' -> whole minutes. The authored data only ever uses :00."""
    if not raw:
        return None
    mm, _, ss = raw.partition(":")
    return int(mm) + (1 if int(ss or 0) >= 30 else 0)


def compress(section: str, offset: int, authored_max: int) -> int:
    """Scale an authored offset into the target act duration, order-preserving."""
    target = TIMING.get(section)
    if target is None or authored_max == 0:
        return offset
    return round(offset * target / authored_max)


def load_briefings() -> dict[str, str]:
    briefings = {}
    for path in sorted(BOOKLETS.glob("C[0-9][0-9]-*.md")):
        briefings[path.name[:3]] = path.read_text(encoding="utf-8")
    return briefings


def main() -> int:
    characters = read_csv(DATA / "characters.csv")
    messages = read_csv(DATA / "messages.csv")
    props = {p["prop_id"]: p for p in read_csv(DATA / "props.csv")}
    briefings = load_briefings()

    by_name = {fold(c["character_name"]): c["character_id"] for c in characters}

    missing_booklets = [c["character_id"] for c in characters if c["character_id"] not in briefings]
    if missing_booklets:
        print(f"warn: no booklet for {', '.join(missing_booklets)}", file=sys.stderr)

    # Widest authored offset per act, used as the compression denominator.
    authored_max: dict[str, int] = {}
    for m in messages:
        off = parse_offset(m["offset"])
        if off is not None:
            authored_max[m["section"]] = max(authored_max.get(m["section"], 0), off)

    out_messages = []
    unresolved: set[str] = set()
    for m in messages:
        recipient = m["recipient"].strip()
        if recipient.lower().startswith("everyone"):
            rid = EVERYONE
        else:
            rid = by_name.get(fold(recipient))
            if rid is None:
                unresolved.add(recipient)
                continue

        authored = parse_offset(m["offset"])
        section = m["section"]
        out_messages.append(
            {
                "id": m["message_id"],
                "threadId": m.get("thread_id") or m["message_id"],
                "inReplyTo": m.get("in_reply_to") or None,
                "type": m["message_type"],
                "section": int(section),
                "recipient": rid,
                "authoredOffset": authored,
                "offset": compress(section, authored, authored_max.get(section, 0))
                if authored is not None
                else None,
                "narrativeDate": m["narrative_date"],
                "provenance": m["provenance"],
                "from": m["from_display"],
                # Blank for senders that are not mailboxes at all -- an unknown
                # number, a clippings folder. The UI falls back to the display
                # name alone rather than inventing an address.
                "fromAddress": (m.get("from_address") or "").strip() or None,
                "subject": m["subject"],
                "body": m["body"],
                "factRefs": [f for f in m["fact_refs"].split(";") if f],
                # Prop ids whose web-size scans ride along with this message.
                "attachments": [a for a in (m.get("attachments") or "").split(";") if a],
            }
        )

    missing_props = {a for m in out_messages for a in m["attachments"] if a not in props}
    if missing_props:
        print(f"error: attachments missing from props.csv: {sorted(missing_props)}", file=sys.stderr)
        return 1

    if unresolved:
        print(f"error: unresolved recipients: {sorted(unresolved)}", file=sys.stderr)
        return 1

    out_characters = [
        {
            "id": c["character_id"],
            "name": c["character_name"],
            "availability": c["availability"],
            "publicRole": c["public_role"],
            "socialMode": c["social_mode"],
            "briefing": briefings.get(c["character_id"], ""),
        }
        for c in characters
    ]

    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "characters.json").write_text(
        json.dumps(out_characters, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
    )
    (OUT / "messages.json").write_text(
        json.dumps(out_messages, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
    )

    out_props = [
        {"id": p["prop_id"], "title": p["title"], "caption": p["caption"]}
        for p in props.values()
    ]
    (OUT / "props.json").write_text(
        json.dumps(out_props, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
    )

    acts = {s: max((m["offset"] for m in out_messages if str(m["section"]) == s), default=0)
            for s in sorted(TIMING)}
    print(f"characters: {len(out_characters)}  messages: {len(out_messages)}")
    print(f"act runway (min): {acts}  total {sum(acts.values())}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
