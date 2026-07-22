#!/usr/bin/env python3
"""Run an auditable three-phase, 20-character baseline simulation."""

from __future__ import annotations

import argparse
import csv
import json
import os
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CHAR_DIR = ROOT / "characters"
DATA_DIR = ROOT / "design" / "data"
ACTION_SCHEMA = ROOT / "simulation" / "action.schema.json"
EVALUATOR_SCHEMA = ROOT / "simulation" / "evaluator.schema.json"


def load_csv(name: str) -> list[dict[str, str]]:
    with (DATA_DIR / name).open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def character_files() -> dict[str, Path]:
    result: dict[str, Path] = {}
    for path in sorted(CHAR_DIR.glob("C[0-9][0-9]-*.md")):
        result[path.name[:3]] = path
    return result


def phase_messages(messages: list[dict[str, str]], phase: int, cid: str) -> list[str]:
    marker = f"P{phase} "
    delivered: list[str] = []
    for msg in messages:
        if not msg["delivery_time"].startswith(marker):
            continue
        recipient = msg["recipient_or_group"]
        if recipient == "ALL" or recipient.startswith("ALL ") or recipient.startswith(cid):
            delivered.append(
                f'{msg["message_id"]} from {msg["sender_displayed"]}: {msg["content"]}'
            )
    return delivered


def run_codex(prompt: str, cwd: Path, schema: Path, output: Path) -> dict:
    cmd = [
        "codex", "exec", "--ephemeral", "--skip-git-repo-check",
        "--ignore-rules", "--sandbox", "read-only", "--color", "never",
        "--output-schema", str(schema), "--output-last-message", str(output), "-"
    ]
    proc = subprocess.run(
        cmd, input=prompt, text=True, cwd=cwd, capture_output=True,
        timeout=240, env={**os.environ, "NO_COLOR": "1"}
    )
    if proc.returncode != 0:
        raise RuntimeError(f"codex failed ({proc.returncode}): {proc.stderr[-2000:]}")
    return json.loads(output.read_text(encoding="utf-8"))


def character_prompt(cid: str, phase: int, sheet: str, roster: dict[str, str], messages: list[str], inbox: list[str], history: list[dict]) -> str:
    return f"""You are playing one character in a social mystery simulation. Stay fully in character and make strategic choices toward your goals.

INFORMATION BOUNDARY: The material below is everything you know. Do not inspect files, use tools, or invent facts. You do not know a hidden answer; there is none. A human action around R does not prove the human was R. Treat messages, claims, memories, and evidence according to their stated reliability.

This is phase {phase} of 3. You may target at most two characters. Your public claim is heard by everyone. Private messages go only to named recipients. Share only evidence IDs you possess or were shown. Belief values for A/B/C/D must sum to 100. In phase 3, complete the final ballot; before then final_ballot must be null.

PUBLIC ROSTER (use these exact IDs when targeting)
{json.dumps(roster, indent=2)}

CHARACTER SHEET
{sheet}

NEW OFFICIAL MESSAGES
{json.dumps(messages, indent=2)}

STATEMENTS AND OFFERS RECEIVED FROM OTHER CHARACTERS
{json.dumps(inbox, indent=2)}

YOUR PRIOR ACTIONS AND BELIEFS
{json.dumps(history, indent=2)}

Return only the required structured response for character {cid}, phase {phase}. Be decisive and concise. Do not expose private reasoning beyond the reasoning_summary field.
"""


def route_actions(actions: dict[str, dict]) -> tuple[list[str], dict[str, list[str]]]:
    public = []
    inboxes: dict[str, list[str]] = {cid: [] for cid in actions}
    for cid, action in actions.items():
        if action["public_claim"].strip():
            public.append(f'{cid} publicly: {action["public_claim"]}')
        for item in action["private_messages"]:
            target = item["to"][:3]
            if target in inboxes:
                inboxes[target].append(f'{cid} privately: {item["message"]}')
        for evidence in action["evidence_shared"]:
            public.append(f"{cid} publicly shares or cites {evidence}.")
        if action["ability"].strip():
            public.append(f'{cid} ability declaration: {action["ability"]}')
    for cid in inboxes:
        inboxes[cid] = public + inboxes[cid]
    return public, inboxes


def aggregate(actions_by_phase: dict[int, dict[str, dict]]) -> dict:
    final = actions_by_phase[3]
    frameworks = {key: 0 for key in ["A", "B", "C", "D"]}
    human = {}
    releases = 0
    for action in final.values():
        ballot = action["final_ballot"]
        belief_keys = {
            "A": "A_one_human", "B": "B_human_mantle",
            "C": "C_synthetic_origin", "D": "D_institutional_construct"
        }
        primary = max(belief_keys, key=lambda key: action["beliefs"][belief_keys[key]])
        frameworks[primary] += 1
        human[ballot["was_R_ever_human"]] = human.get(ballot["was_R_ever_human"], 0) + 1
        releases += int(ballot["release_article"])
    belief_means = {}
    for phase, actions in actions_by_phase.items():
        belief_means[str(phase)] = {
            key: round(sum(a["beliefs"][key] for a in actions.values()) / len(actions), 1)
            for key in ["A_one_human", "B_human_mantle", "C_synthetic_origin", "D_institutional_construct", "crime_occurred", "victim_was_R"]
        }
    return {"primary_framework_by_final_belief": frameworks, "human_ballot_raw": human, "release_article": {"yes": releases, "no": len(final) - releases}, "belief_means_by_phase": belief_means}


def evaluator_prompt(role: str, transcript: dict, summary: dict) -> str:
    lenses = {
        "mechanics": "Audit abilities, evidence transfers, trigger handling, dead or dominant mechanics, and whether Ruiz collapsed separate propositions.",
        "mystery": "Audit whether A/B/C/D each had affirmative cases, when beliefs converged, and whether human embodiment or murder became effectively proven.",
        "agency": "Audit character participation, goal pursuit, negotiation access, chokepoints, and sidelining.",
        "adversarial": "Find exploits, information leaks, prompt artifacts, dominant strategies, GM/engine bias, and conclusions unsupported by observations."
    }
    return f"""You are an independent post-game evaluator. You did not participate in play and must judge only the transcript and aggregate data below. Be skeptical: distinguish game-design findings from limitations of this three-phase simulation. Cite phase and character IDs in the evidence field. Do not claim statistical robustness from one run.

ROLE: {role}
LENS: {lenses[role]}

AGGREGATE
{json.dumps(summary, indent=2)}

TRANSCRIPT
{json.dumps(transcript, indent=2)}
"""


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--run-id", default=datetime.now(timezone.utc).strftime("baseline-%Y%m%dT%H%M%SZ"))
    parser.add_argument("--workers", type=int, default=4)
    args = parser.parse_args()

    run_dir = ROOT / "simulation" / "runs" / args.run_id
    run_dir.mkdir(parents=True, exist_ok=True)
    chars = character_files()
    if len(chars) != 20:
        raise RuntimeError(f"expected 20 characters, found {len(chars)}")
    messages = load_csv("messages.csv")
    roster = {row["character_id"]: row["character_name"] for row in load_csv("characters.csv")}
    histories: dict[str, list[dict]] = {cid: [] for cid in chars}
    inboxes: dict[str, list[str]] = {cid: [] for cid in chars}
    phases: dict[int, dict[str, dict]] = {}

    for phase in (1, 2, 3):
        phase_dir = run_dir / f"phase-{phase}"
        phase_dir.mkdir(exist_ok=True)
        actions: dict[str, dict] = {}
        for cid in chars:
            existing = phase_dir / cid / "action.json"
            if existing.exists() and existing.stat().st_size:
                try:
                    action = json.loads(existing.read_text(encoding="utf-8"))
                except json.JSONDecodeError:
                    continue
                if action.get("character_id") == cid and action.get("phase") == phase:
                    actions[cid] = action
        with ThreadPoolExecutor(max_workers=args.workers) as pool:
            futures = {}
            for cid, sheet_path in chars.items():
                if cid in actions:
                    continue
                agent_dir = phase_dir / cid
                agent_dir.mkdir(exist_ok=True)
                sheet = sheet_path.read_text(encoding="utf-8")
                (agent_dir / "AUTHORIZED_CONTEXT.md").write_text(sheet, encoding="utf-8")
                output = agent_dir / "action.json"
                prompt = character_prompt(cid, phase, sheet, roster, phase_messages(messages, phase, cid), inboxes[cid], histories[cid])
                futures[pool.submit(run_codex, prompt, agent_dir, ACTION_SCHEMA, output)] = cid
            for future in as_completed(futures):
                cid = futures[future]
                action = future.result()
                if action["character_id"] != cid or action["phase"] != phase:
                    raise RuntimeError(f"identity mismatch for {cid} phase {phase}")
                total = sum(action["beliefs"][key] for key in ["A_one_human", "B_human_mantle", "C_synthetic_origin", "D_institutional_construct"])
                if total != 100:
                    raise RuntimeError(f"framework beliefs for {cid} phase {phase} sum to {total}")
                actions[cid] = action
        phases[phase] = dict(sorted(actions.items()))
        for cid, action in actions.items():
            histories[cid].append(action)
        _, inboxes = route_actions(actions)
        (phase_dir / "actions.json").write_text(json.dumps(phases[phase], indent=2), encoding="utf-8")

    transcript = {"run_id": args.run_id, "protocol": "three-phase isolated-agent baseline", "phases": phases}
    summary = aggregate(phases)
    (run_dir / "transcript.json").write_text(json.dumps(transcript, indent=2), encoding="utf-8")
    (run_dir / "summary.json").write_text(json.dumps(summary, indent=2), encoding="utf-8")

    eval_dir = run_dir / "evaluators"
    eval_dir.mkdir()
    evaluations = {}
    with ThreadPoolExecutor(max_workers=4) as pool:
        futures = {}
        for role in ["mechanics", "mystery", "agency", "adversarial"]:
            role_dir = eval_dir / role
            role_dir.mkdir()
            output = role_dir / "evaluation.json"
            futures[pool.submit(run_codex, evaluator_prompt(role, transcript, summary), role_dir, EVALUATOR_SCHEMA, output)] = role
        for future in as_completed(futures):
            evaluations[futures[future]] = future.result()
    (run_dir / "evaluations.json").write_text(json.dumps(dict(sorted(evaluations.items())), indent=2), encoding="utf-8")
    print(json.dumps({"run_dir": str(run_dir), "summary": summary, "evaluators": evaluations}, indent=2))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise
