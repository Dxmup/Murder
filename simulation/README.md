# Simulation

[`run_simulation.py`](run_simulation.py) runs the active 16-character, three-section isolated-agent test. It reads only canonical content from `design/data/` and `characters/`; there is no second versioned input tree.

For the complete operating procedure, information-boundary rules, evaluator roles, recovery steps, output guide, and usage-saving advice, see [`AGENT-RUNBOOK.md`](AGENT-RUNBOOK.md).

```bash
python3 simulation/run_simulation.py --validate-only
python3 simulation/run_simulation.py --run-id baseline-05
```

The runner reads the authored core booklets directly from `characters/`. There is deliberately no booklet generator: simulation utilities must never overwrite player-facing prose.

Run outputs land in `runs/`, which is not tracked: the historical baseline
outputs and their findings notes were removed once the V2.1 design settled, and
nothing in `design/` depends on them. `design/playtest-notes.md` keeps the
conclusions worth carrying forward.
