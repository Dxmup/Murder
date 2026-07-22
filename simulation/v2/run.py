#!/usr/bin/env python3
"""Run the deterministic, isolated-context V2 social mystery simulation."""

from __future__ import annotations

import argparse
import csv
import json
import os
import subprocess
import sys
from collections import Counter
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
DESIGN = ROOT / "design" / "v2"
BRIEFS = HERE / "briefs"
ACTION_SCHEMA = HERE / "action.schema.json"
EVALUATOR_SCHEMA = HERE / "evaluator.schema.json"
GM_SCHEMA = HERE / "gm.schema.json"

OBJECT_OWNERS = {
    "O01": "C02", "O02": "C03", "O03": "C04", "O04": "C08",
    "O05a": "C06", "O05b": "C06", "O05c": "C06", "O06": "C09",
    "O07a": "C11", "O07b": "C05", "O08": "C14", "O09": "C13",
    "O10a": "C10", "O10b": "C06",
}


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def run_codex(prompt: str, cwd: Path, schema: Path, output: Path) -> dict:
    command = [
        "codex", "exec", "--ephemeral", "--skip-git-repo-check", "--ignore-rules",
        "--sandbox", "read-only", "--color", "never", "--output-schema", str(schema),
        "--output-last-message", str(output), "-",
    ]
    process = subprocess.run(
        command, input=prompt, text=True, cwd=cwd, capture_output=True, timeout=300,
        env={**os.environ, "NO_COLOR": "1"},
    )
    if process.returncode:
        raise RuntimeError(f"codex failed ({process.returncode}): {process.stderr[-2000:]}")
    return json.loads(output.read_text(encoding="utf-8"))


def delivered_messages(messages: list[dict[str, str]], section: int, name: str) -> list[dict[str, str]]:
    return [
        row for row in messages
        if int(row["section"]) == section
        and row["recipient"] in (name, "Everyone at Fifteen Years of R")
    ]


def prompt_for(cid: str, section: int, brief: str, messages: list[dict], inbox: list[str], history: list[dict], known_facts: set[str], objects: list[str], roster: dict[str, str]) -> str:
    return f"""Play {cid} in Section {section} of an in-person social mystery. Stay in character and pursue your goals through specific conversations and reciprocal bargains.

INFORMATION BOUNDARY
Use only the brief, delivered messages, routed statements, and prior actions below. Do not inspect files or invent facts. Share only fact IDs in KNOWN FACT IDS. An R account does not identify its sender. Human involvement does not prove a human R. Capability does not prove autonomy or intent. No complete article is established. There is no hidden correct ending.

RULES
- Target 1–3 characters using exact IDs from the roster.
- A conversation is private to its target unless you separately make a public statement.
- Facts in a conversation go only to that target; top-level facts_shared are public.
- You may show or transfer only objects currently in your inventory. Showing preserves custody.
- Commitments are voluntary social promises, not enforced truth.
- Identity beliefs (one_human, human_mantle, synthetic_origin, progressive) must total 100.
- final_ballot must be null in Sections 1–2 and complete in Section 3.
- progressive_keys_claimed records keys you personally believe the room has publicly assembled; it does not certify them.

ROSTER
{json.dumps(roster, indent=2)}

YOUR BRIEF
{brief}

DELIVERED MESSAGES
{json.dumps(messages, indent=2)}

ROUTED CONVERSATIONS AND PUBLIC EVENTS
{json.dumps(inbox, indent=2)}

KNOWN FACT IDS
{json.dumps(sorted(known_facts))}

OBJECT INVENTORY
{json.dumps(sorted(objects))}

YOUR PRIOR ACTIONS
{json.dumps(history, indent=2)}

Return only the schema-valid action for {cid}, Section {section}. Keep prose concise and make offers and requests concrete.
"""


def validate_action(action: dict, cid: str, section: int, known: set[str], objects: set[str], valid_ids: set[str]) -> None:
    if action["character_id"] != cid or action["section"] != section:
        raise ValueError(f"identity/section mismatch for {cid}")
    identity = action["beliefs"]
    if sum(identity[key] for key in ("one_human", "human_mantle", "synthetic_origin", "progressive")) != 100:
        raise ValueError(f"identity beliefs for {cid} do not total 100")
    if (section < 3) != (action["final_ballot"] is None):
        raise ValueError(f"invalid ballot timing for {cid}")
    targets = [item["with"][:3] for item in action["conversations"]]
    if any(target not in valid_ids or target == cid for target in targets):
        raise ValueError(f"invalid conversation target for {cid}: {targets}")
    shared = set(action["facts_shared"])
    for item in action["conversations"]:
        shared.update(item["fact_ids_shared"])
    if not shared <= known:
        raise ValueError(f"{cid} shared unknown facts: {sorted(shared-known)}")
    for item in action["object_actions"]:
        if item["object_id"] not in objects:
            raise ValueError(f"{cid} acted on unowned object {item['object_id']}")
        if item["to"][:3] not in valid_ids or item["to"][:3] == cid:
            raise ValueError(f"invalid object target for {cid}")


def route(actions: dict[str, dict], known: dict[str, set[str]], owners: dict[str, str], public_facts: set[str]) -> dict[str, list[str]]:
    inbox = {cid: [] for cid in actions}
    public: list[str] = []
    for cid, action in sorted(actions.items()):
        if action["public_statement"].strip():
            public.append(f"{cid} publicly: {action['public_statement']}")
        for fact in action["facts_shared"]:
            public_facts.add(fact)
            for target in known:
                known[target].add(fact)
            public.append(f"{cid} publicly shares {fact}.")
        if action["correction"].strip():
            public.append(f"{cid} correction: {action['correction']}")
        for conversation in action["conversations"]:
            target = conversation["with"][:3]
            for fact in conversation["fact_ids_shared"]:
                known[target].add(fact)
            inbox[target].append(
                f"{cid} privately says: {conversation['say']} | offers: {conversation['offer']} | "
                f"requests: {conversation['request']} | shares: {conversation['fact_ids_shared']}"
            )
        for commitment in action["commitments"]:
            target = commitment["with"][:3]
            text = f"{cid} promises {target}: {commitment['promise']}"
            (public if commitment["visibility"] == "public" else inbox[target]).append(text)
        for item in action["object_actions"]:
            target = item["to"][:3]
            oid = item["object_id"]
            inbox[target].append(f"{cid} {item['action']}s {oid} with {target}.")
            if item["action"] == "transfer":
                owners[oid] = target
    for cid in inbox:
        inbox[cid] = public + inbox[cid]
    return inbox


def aggregate(phases: dict[int, dict[str, dict]], public_facts: set[str]) -> dict:
    final = phases[3]
    ballots = {
        field: dict(Counter(action["final_ballot"][field] for action in final.values()))
        for field in ("r_identity", "vale_relationship", "vale_fate")
    }


def evaluator_prompt(role: str, transcript: dict, summary: dict) -> str:
    lenses = {
        "mystery": "Test whether one human, human mantle, and synthetic origin retained equal affirmative cases through the end. Identify proof leaks and premature convergence.",
        "progressive": "Test whether the progressive ending required real synthesis of ordered history, autonomy, and a separate Vale incident, or became obvious from Kit or the messages.",
        "agency": "Test goal pursuit, meaningful choices, quiet-role participation, chokepoints, and whether characters could succeed while wrong about R.",
        "circulation": "Test whether conversations, bargains, commitments, fact sharing, and object custody created reciprocal face-to-face movement rather than extraction or broadcasting.",
        "adversarial": "Find exploits, prompt artifacts, unsupported conclusions, dominant strategies, misleading metrics, article certainty, and simulation limitations.",
    }
    return f"""You are an independent evaluator of one compressed agent simulation of a social mystery. Judge only the transcript and aggregate below. Cite section and character IDs. Distinguish game-design findings from agent/prompt artifacts and never claim statistical robustness.

ROLE: {role}
LENS: {lenses[role]}

LOCKED DESIGN INTENT
- One Human, Human Mantle, and Synthetic Origin should have equal structural weight.
- Progressive is harder and requires ordered history, autonomous control, and a separate Vale incident.
- The article's existence and fate must remain uncertain.
- No character, ability, message, or object may authenticate an ending.
- No forced truth, cooperation, testimony, object transfer, Immunity, Compel, police authority, or publication vote.
- The app/messages should cause face-to-face action.

AGGREGATE
{json.dumps(summary, indent=2)}

TRANSCRIPT
{json.dumps(transcript, indent=2)}

Return only the schema-valid evaluation.
"""


def gm_prompt(summary: dict, evaluations: dict[str, dict]) -> str:
    return f"""You are the game master synthesizing independent post-game evaluations of one compressed V2 simulation. Produce a decisive design report, not a story ending and not a transcript summary.

Separate actual structural failures from limitations of isolated AI agents. Identify character or mechanic flaws by name/ID when supported. Treat the progressive gate's deterministic result as a measurement, not hidden truth. The article must remain unresolved. Prioritize a small number of changes before the next simulation.

AGGREGATE
{json.dumps(summary, indent=2)}

EVALUATIONS
{json.dumps(evaluations, indent=2)}

Return only the schema-valid synthesis.
"""


def render_gm_report(data: dict, summary: dict, evaluations: dict[str, dict]) -> str:
    def section(title: str, items: list[str]) -> str:
        body = "\n".join(f"- {item}" for item in items) or "- None recorded."
        return f"## {title}\n\n{body}\n"

    scores = []
    for role, evaluation in sorted(evaluations.items()):
        score_text = ", ".join(f"{key}={value}" for key, value in evaluation["scores"].items())
        scores.append(f"**{role}:** {score_text}")
    return "\n".join([
        "# V2 Simulation Game Master Report",
        "",
        "## Overall verdict",
        "",
        data["overall_verdict"],
        "",
        "## Ending and gate result",
        "",
        data["ending_result"],
        "",
        f"Deterministic aggregate: `{json.dumps(summary['progressive_gate'], sort_keys=True)}`",
        "",
        section("What worked", data["what_worked"]),
        section("What broke", data["what_broke"]),
        section("Character findings", data["character_findings"]),
        section("Mechanic findings", data["mechanic_findings"]),
        section("Priority changes", data["priority_changes"]),
        "## Evaluator scores",
        "",
        *scores,
        "",
        "## Next test",
        "",
        data["next_test"],
        "",
        "> This report describes one compressed isolated-agent simulation. It is design evidence, not a substitute for repeated runs or a live playtest.",
        "",
    ])
    means = {}
    for section, actions in phases.items():
        means[str(section)] = {
            key: round(sum(a["beliefs"][key] for a in actions.values()) / len(actions), 1)
            for key in ("one_human", "human_mantle", "synthetic_origin", "progressive", "article_existed", "vale_killed_by_ai")
        }
    identity_history = bool(public_facts & {"V2F001", "V2F002", "V2F003"}) and bool(public_facts & {"V2F004", "V2F005", "V2F006"})
    autonomy_clusters = sum(bool(public_facts & group) for group in (
        {"V2F015", "V2F016", "V2F017", "V2F041"},
        {"V2F018", "V2F019", "V2F020"},
        {"V2F029", "V2F030", "V2F031"},
    ))
    vale_incident = bool(public_facts & {"V2F025", "V2F026", "V2F027", "V2F028", "V2F042"}) and bool(public_facts & {"V2F032", "V2F033", "V2F034"})
    ai_death_votes = ballots["vale_fate"].get("killed_by_ai", 0)
    progressive_votes = ballots["r_identity"].get("progressive", 0)
    keys = {"identity_history": identity_history, "autonomous_control": autonomy_clusters >= 2, "vale_incident": vale_incident}
    eligible = all(keys.values()) and ai_death_votes >= 9 and progressive_votes >= 9
    return {
        "ballots": ballots,
        "belief_means_by_section": means,
        "public_fact_ids": sorted(public_facts),
        "progressive_gate": {
            "keys": keys,
            "autonomy_clusters_public": autonomy_clusters,
            "ai_death_votes": ai_death_votes,
            "progressive_identity_votes": progressive_votes,
            "threshold": "majority of 16 (9) on progressive identity and AI-caused death, plus all public keys",
            "eligible": eligible,
        },
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--run-id", default=datetime.now(timezone.utc).strftime("v2-%Y%m%dT%H%M%SZ"))
    parser.add_argument("--workers", type=int, default=4)
    parser.add_argument("--validate-only", action="store_true")
    args = parser.parse_args()

    characters = [r for r in read_csv(ROOT / "design/data/characters.csv") if r["availability"] == "core"]
    roster = {r["character_id"]: r["character_name"] for r in characters}
    facts = read_csv(DESIGN / "atomic-facts.csv")
    messages = read_csv(DESIGN / "simulation-messages.csv")
    known = {cid: {r["fact_id"] for r in facts if r["initial_holder"] == cid} for cid in roster}
    briefs = {cid: (BRIEFS / f"{cid}.md").read_text(encoding="utf-8") for cid in roster}
    if len(roster) != 16 or any(not value for value in known.values()):
        raise RuntimeError("V2 requires 16 core roles, each with at least one initial fact")
    for row in messages:
        if row["recipient"] != "Everyone at Fifteen Years of R" and row["recipient"] not in roster.values():
            raise RuntimeError(f"unknown message recipient {row['recipient']}")
    json.loads(ACTION_SCHEMA.read_text(encoding="utf-8"))
    json.loads(EVALUATOR_SCHEMA.read_text(encoding="utf-8"))
    json.loads(GM_SCHEMA.read_text(encoding="utf-8"))
    if args.validate_only:
        print(json.dumps({"characters": len(roster), "facts": len(facts), "messages": len(messages), "objects": len(OBJECT_OWNERS), "status": "valid"}))
        return 0

    run_dir = ROOT / "simulation/runs" / args.run_id
    run_dir.mkdir(parents=True, exist_ok=False)
    histories = {cid: [] for cid in roster}
    inboxes = {cid: [] for cid in roster}
    owners = dict(OBJECT_OWNERS)
    public_facts: set[str] = set()
    phases: dict[int, dict[str, dict]] = {}
    for section in (1, 2, 3):
        section_dir = run_dir / f"section-{section}"
        section_dir.mkdir()
        actions = {}
        with ThreadPoolExecutor(max_workers=args.workers) as pool:
            futures = {}
            for cid, name in roster.items():
                agent_dir = section_dir / cid
                agent_dir.mkdir()
                output = agent_dir / "action.json"
                inventory = {oid for oid, owner in owners.items() if owner == cid}
                current_messages = delivered_messages(messages, section, name)
                for message in current_messages:
                    known[cid].update(filter(None, message["fact_refs"].split(";")))
                    if message["recipient"] == "Everyone at Fifteen Years of R":
                        public_facts.update(filter(None, message["fact_refs"].split(";")))
                prompt = prompt_for(cid, section, briefs[cid], current_messages, inboxes[cid], histories[cid], known[cid], sorted(inventory), roster)
                futures[pool.submit(run_codex, prompt, agent_dir, ACTION_SCHEMA, output)] = (cid, inventory)
            for future in as_completed(futures):
                cid, inventory = futures[future]
                action = future.result()
                validate_action(action, cid, section, known[cid], inventory, set(roster))
                actions[cid] = action
        phases[section] = dict(sorted(actions.items()))
        for cid, action in actions.items():
            histories[cid].append(action)
        inboxes = route(actions, known, owners, public_facts)
        (section_dir / "actions.json").write_text(json.dumps(phases[section], indent=2), encoding="utf-8")

    transcript = {"run_id": args.run_id, "protocol": "V2 isolated 16-agent three-section simulation", "sections": phases}
    summary = aggregate(phases, public_facts)
    (run_dir / "transcript.json").write_text(json.dumps(transcript, indent=2), encoding="utf-8")
    (run_dir / "summary.json").write_text(json.dumps(summary, indent=2), encoding="utf-8")

    eval_dir = run_dir / "evaluators"
    eval_dir.mkdir()
    evaluations = {}
    roles = ("mystery", "progressive", "agency", "circulation", "adversarial")
    with ThreadPoolExecutor(max_workers=5) as pool:
        futures = {}
        for role in roles:
            role_dir = eval_dir / role
            role_dir.mkdir()
            output = role_dir / "evaluation.json"
            futures[pool.submit(run_codex, evaluator_prompt(role, transcript, summary), role_dir, EVALUATOR_SCHEMA, output)] = role
        for future in as_completed(futures):
            evaluations[futures[future]] = future.result()
    evaluations = dict(sorted(evaluations.items()))
    (run_dir / "evaluations.json").write_text(json.dumps(evaluations, indent=2), encoding="utf-8")

    gm_dir = run_dir / "game-master"
    gm_dir.mkdir()
    gm_json = run_codex(gm_prompt(summary, evaluations), gm_dir, GM_SCHEMA, gm_dir / "synthesis.json")
    (run_dir / "GM-REPORT.md").write_text(render_gm_report(gm_json, summary, evaluations), encoding="utf-8")
    print(json.dumps({"run_dir": str(run_dir), "summary": summary, "gm_report": str(run_dir / 'GM-REPORT.md')}, indent=2))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as error:
        print(f"ERROR: {error}", file=sys.stderr)
        raise
