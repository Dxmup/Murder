# Agent Simulation Runbook

This runbook explains how to run the current compressed simulation in which one isolated Codex agent plays each core character and independent agents evaluate the result.

The simulation is a design diagnostic, not a substitute for a live playtest. It models private conversations, public statements, evidence circulation, bargains, and changing beliefs in three compressed sections. It does not reproduce movement through a house, overhearing, interruptions, chemistry, performance, or the social pressure of a real party.

## What the runner does

[`run_simulation.py`](run_simulation.py) orchestrates the complete test:

1. Loads the 16 core roles from `design/data/characters.csv`.
2. Loads each role's authored booklet from `characters/`.
3. Gives each character only its initial facts, current objects, delivered inbox messages, received private statements, and its own prior actions.
4. Runs one isolated character agent per role in each of three sections.
5. Routes private conversations, public facts, object transfers, and commitments into the next section.
6. Validates every action against [`action.schema.json`](action.schema.json) and deterministic information-boundary rules.
7. Aggregates ballots, belief changes, fact circulation, objects, and commitments.
8. Runs five independent evaluator agents.
9. Runs one game-master agent to synthesize the evaluations into `GM-REPORT.md`.

A full run normally makes 48 character-agent calls, five evaluator calls, and one GM call: at least 54 model calls. A character response that fails deterministic validation may require one correction call.

## Prerequisites

- Run commands from the repository root.
- `python3` must be available.
- The `codex` CLI must be installed and authenticated.
- The canonical CSV files, 16 core booklets, and three JSON schemas must be internally consistent.
- Use a new, descriptive run ID. Never overwrite or reuse a completed run directory.

Quick checks:

```bash
cd /home/chadhensel/Murder
codex --version
python3 simulation/run_simulation.py --validate-only
```

Expected validation output currently reports 16 characters, 44 facts, 40 live messages, and 14 object components. Counts may legitimately change as the design changes; `status` must be `valid`.

## Before spending model usage

Record the exact design change being tested and a falsifiable success criterion. A useful test note includes:

- the hypothesis;
- files changed since the comparison run;
- the prior run used as a baseline;
- expected effects on ballots, belief curves, circulation, or agency;
- outcomes that would show the change failed;
- known simulation limitations that should not be mistaken for design findings.

Run these inexpensive checks first:

```bash
git diff --check
python3 -m py_compile simulation/run_simulation.py
python3 simulation/run_simulation.py --validate-only
```

Review `git status --short` and preserve the commit SHA or diff associated with the run. Simulation results are difficult to interpret later if the tested design cannot be identified.

## Run the simulation

Choose a unique ID that states the experiment rather than merely the date:

```bash
python3 simulation/run_simulation.py \
  --run-id baseline-05-inbox-history \
  --workers 4
```

`--workers` controls concurrent character calls, not the number of roles. Four is the default and is a reasonable starting point. Lower it if the model service is rate-limiting; increasing it reduces wall-clock time but not usage.

Do not edit character booklets, canonical data, schemas, or the runner while a run is active.

## Information isolation

Each role agent must remain isolated. The runner enforces this by constructing a separate prompt from authorized material rather than allowing the agent to inspect the repository.

An agent may use only:

- its character booklet;
- facts initially assigned to it or subsequently shared with it;
- inbox messages delivered to it in the current section;
- private statements routed to it from the prior section;
- public statements and public facts;
- its own action history;
- objects currently in its inventory.

Agents must not read other booklets, future messages, fact interpretations assigned to other roles, evaluator prompts, or ending diagnostics. Do not manually combine role contexts to “help” an agent make a coherent decision; imperfect coordination is part of the test.

## Character action protocol

For each section, every character returns one schema-valid action containing:

- one to three targeted conversations;
- an optional public statement;
- facts made public;
- voluntary object shows or transfers;
- proposed, accepted, rejected, countered, fulfilled, or breached commitments;
- corrections and goal progress;
- numerical identity, article, and Vale beliefs;
- a short reasoning summary;
- a final ballot in Section 3 only.

Beliefs about the four R identities must total 100. Final ballots may cite only facts the character actually knows. A ballot is a character's social conclusion, not a legal proof verdict; the later evaluators separately measure evidentiary support.

## If a run is interrupted

Do not start over immediately. Resume the same run ID:

```bash
python3 simulation/run_simulation.py \
  --run-id baseline-05-inbox-history \
  --workers 4 \
  --resume
```

Resume mode reuses each existing `action.json` that still parses and validates, then regenerates only missing or invalid character actions. Inspect the run directory before resuming so an accidental run-ID collision is not mistaken for an interrupted run.

If failure occurred only during reporting and a complete `transcript.json` exists, regenerate the aggregate and reports with:

```bash
python3 simulation/run_simulation.py \
  --report-existing baseline-05-inbox-history
```

This reruns all five evaluator agents and the GM agent, so it consumes additional usage. Do not use it merely to re-render unchanged Markdown.

## Evaluator agents

After the three sections, five evaluators independently receive the same transcript and aggregate summary:

- `mystery`: balance among primary identity reconstructions and quality of evidence;
- `progressive`: difficulty and assembly of the human-to-mantle-to-AI reconstruction;
- `agency`: meaningful goals, choices, bargains, and success independent of guessing correctly;
- `circulation`: private/public information flow, bottlenecks, saturation, and message-caused encounters;
- `adversarial`: exploits, contradictions, accidental authentication, and design failure modes.

Every evaluator must:

- cite section and character IDs;
- distinguish game-design findings from agent or prompt artifacts;
- avoid claiming statistical robustness from one run;
- identify evidence, failure modes, recommendations, and scored dimensions;
- return JSON valid against [`evaluator.schema.json`](evaluator.schema.json).

The GM synthesis agent receives the aggregate plus all five evaluations. It resolves disagreements, states what worked and broke, prioritizes changes, and proposes the next test. It must not invent a canonical solution to the mystery.

## Output layout

Results are written to `simulation/runs/<run-id>/`:

```text
section-1/C01/action.json ... C16/action.json
section-1/actions.json
section-2/...
section-3/...
transcript.json
summary.json
evaluators/<role>/evaluation.json
evaluations.json
game-master/synthesis.json
GM-REPORT.md
```

Start review with `GM-REPORT.md`, then verify important claims against `summary.json`, `evaluations.json`, and the cited character actions. The report is analysis, not ground truth.

## How to interpret a run

Separate three categories in the final findings:

1. **Likely design signal:** repeated circulation failures, inaccessible evidence, dominant clue packages, dead goals, or deterministic rule conflicts.
2. **Likely agent artifact:** uniformly careful caveats, unusually cooperative bargains, stylistic convergence, or mechanically tidy behavior unlikely at a party.
3. **Not tested:** spatial movement, overhearing, privacy in a real house, interruption, charisma, player fatigue, prop visibility, acting skill, and host timing.

Do not rebalance the game from ballot totals alone. Review whether each ballot had an actual support chain, which facts became public, whether characters had personal reasons to act, and whether an apparent consensus resulted from duplicated prompt language.

One run supports hypotheses, not conclusions. Prefer a small canonical change followed by a named comparison run. Avoid changing evidence, goals, messages, and evaluator rules simultaneously unless the test is explicitly a broad reset.

## Usage-saving procedure

When usage is limited:

1. Validate before every run.
2. Make one coherent design change per comparison.
3. Use `--resume` after interruption instead of discarding valid actions.
4. Do not run `--report-existing` unless reports are missing or evaluator prompts changed.
5. Read `summary.json` before commissioning any extra analysis.
6. Preserve concise findings in a `baseline-XX-findings.md` file so future sessions need not reread the full transcript.
7. Never use simulation agents to rewrite the canonical character booklets automatically.

## Completion checklist

- Validation passed before the run.
- The run ID is unique and tied to a known design state.
- All 48 character actions exist and validate.
- `transcript.json` and `summary.json` exist.
- All five evaluator outputs exist.
- `game-master/synthesis.json` and `GM-REPORT.md` exist.
- Major report claims were checked against cited actions.
- Design signals were separated from agent artifacts and untested live-party behavior.
- Concise findings and the next falsifiable test were recorded.
