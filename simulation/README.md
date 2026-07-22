# Simulation

[`run_simulation.py`](run_simulation.py) runs the active 16-character, three-section isolated-agent test. It reads only canonical content from `design/data/` and `characters/`; there is no second versioned input tree.

For the complete operating procedure, information-boundary rules, evaluator roles, recovery steps, output guide, and usage-saving advice, see [`AGENT-RUNBOOK.md`](AGENT-RUNBOOK.md).

```bash
python3 simulation/run_simulation.py --validate-only
python3 simulation/run_simulation.py --run-id baseline-05
```

The runner reads the authored core booklets directly from `characters/`. There is deliberately no booklet generator: simulation utilities must never overwrite player-facing prose.

The `runs/` directory contains historical outputs. `baseline-01/` is the discarded original-design test; directories named `v2-baseline-*` are the four development runs that produced the current design. Their names remain unchanged so report links and test provenance do not break.

Concise conclusions are in `baseline-01-findings.md` through `baseline-04-findings.md`.
