# V2 Simulation Inputs

This directory contains the developing V2 protocol. It does not reuse the legacy ballots or 20-character sheets.

## Build briefs

From the repository root:

```bash
python3 simulation/v2/build_briefs.py
```

The generator combines the current core character table, goal matrix, bargain matrix, and facts for which each character is the initial holder. It writes sixteen abbreviated contexts under `simulation/v2/briefs/`.

These are simulation briefs, not finished player booklets. They intentionally omit prose polish, costume guidance, and optional characters.

## Information boundary

Each agent may receive only:

- its generated brief;
- messages addressed to it or everyone and released in the current section;
- statements, offers, facts, objects, and commitments actually routed to it;
- its own prior actions.

The GM evaluator may receive the resulting transcript and aggregate ballot data, but no hidden solution because V2 has none.

## Validate the inputs

```bash
python3 simulation/v2/run.py --validate-only
```

## Run

```bash
python3 simulation/v2/run.py --run-id v2-baseline-01 --workers 4
```

The runner enforces fact ownership, object ownership, valid targets, ballot timing, cited ballot evidence, and identity probabilities totaling 100. An invalid action receives one constrained correction attempt without adding knowledge. The runner routes public statements, private conversations, facts, objects, corrections, and commitments between isolated contexts. Five independent evaluators review mystery balance, progressive difficulty, agency, circulation, and adversarial failure modes; a separate game-master agent synthesizes `GM-REPORT.md`.

If character turns completed but reporting failed, regenerate only the aggregate and reports:

```bash
python3 simulation/v2/run.py --report-existing v2-baseline-01
```

If a character action fails deterministic validation after its correction attempt, resume the run and reuse every action that still validates:

```bash
python3 simulation/v2/run.py --run-id v2-baseline-04 --resume --workers 4
```

## Remaining build work

- run the first baseline and inspect whether the compressed protocol itself biases behavior;
- revise inputs, then repeat before treating any finding as stable.
