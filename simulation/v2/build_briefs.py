#!/usr/bin/env python3
"""Build deterministic abbreviated V2 simulation briefs for the 16 core roles."""

from __future__ import annotations

import csv
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DESIGN = ROOT / "design" / "v2"
OUTPUT = Path(__file__).resolve().parent / "briefs"
NOTES = Path(__file__).resolve().parent / "notes"


def read_csv(name: str) -> list[dict[str, str]]:
    with (DESIGN / name).open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def bullets(value: str) -> str:
    return "\n".join(f"- {item.strip()}" for item in value.split(";") if item.strip())


def main() -> int:
    characters = {
        row["character_id"]: row
        for row in read_csv("../data/characters.csv")
        if row["availability"] == "core"
    }
    goals = {row["character_id"]: row for row in read_csv("goal-interaction-matrix.csv")}
    bargains = {row["character_id"]: row for row in read_csv("bargain-matrix.csv")}
    facts = read_csv("atomic-facts.csv")

    if set(characters) != set(goals) or set(characters) != set(bargains):
        raise RuntimeError("core character, goal, and bargain IDs do not match")

    OUTPUT.mkdir(parents=True, exist_ok=True)
    for cid, char in sorted(characters.items()):
        goal = goals[cid]
        bargain = bargains[cid]
        owned = [row for row in facts if row["initial_holder"] == cid]
        if not owned:
            raise RuntimeError(f"{cid} has no firsthand fact")

        fact_text = "\n\n".join(
            f"- **{row['fact_id']} ({row['cluster_id']}):** {row['objective_statement']}\n"
            f"  - Why you may share it: {row['disclosure_pressure']}\n"
            f"  - Why you may protect it: {row['concealment_pressure']}"
            for row in owned
        )
        note_path = NOTES / f"{cid}.md"
        role_note = note_path.read_text(encoding="utf-8") if note_path.exists() else ""
        brief = f"""# {char['character_name']} — {char['public_role']}

**Character ID:** {cid}

## How to play

{char['personality']}. Your social mode is `{char['social_mode']}`. You are a person at a party, not a detective solving a prompt. Pursue relationships, commitments, reputation, and personal choices through face-to-face conversation.

## Main goal

{goal['main_goal']}

**Success condition:** {goal['main_success_condition']}

## Supporting goals

- **{goal['subgoal_one']}** — {goal['subgoal_one_success']}
- **{goal['subgoal_two']}** — {goal['subgoal_two_success']}

## Your final choice

{goal['final_choice']}

## Facts you personally hold

These are bounded observations, not their objective meaning. You may interpret them, conceal them, show them, or describe them inaccurately. You may not invent additional evidence.

{fact_text}

## What you can offer and what you need

**Offers:** {bargain['offers']}

**Needs:** {bargain['needs']}

**Likely first bargain:** {bargain['likely_first_bargain']}

**Valuable commitment:** {bargain['valuable_commitment']}

## Exposure

{char['exposure']}

You may be tempted to: {bargain['likely_betrayal']}

If exposed: {bargain['consequence_if_exposed']}

{role_note}

## People to seek

### Opening

{bullets(goal['opening_targets'])}

### Middle

{bullets(goal['midgame_targets'])}

### Endgame

{bullets(goal['endgame_targets'])}

## Mystery discipline

- An R-associated account does not identify its sender.
- Human involvement does not prove a human was R.
- Harm to Vale does not prove Vale was R.
- An alleged fragment does not prove a complete article existed.
- Technical capability does not prove historical use, autonomy, intent, or murder.
- No ending is hidden truth. Argue what you believe from what reaches you.
"""
        (OUTPUT / f"{cid}.md").write_text(brief, encoding="utf-8")

    print(f"built {len(characters)} briefs in {OUTPUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
