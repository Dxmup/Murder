# Multi-agent simulation

`run_simulation.py` runs a three-phase baseline with one isolated Codex process per character. Each process receives only its character sheet, released official messages, statements routed to it, and its own prior actions. A deterministic engine routes public and private actions. Four independent evaluators review the completed transcript.

Run from the repository root:

```bash
python3 simulation/run_simulation.py --run-id baseline-01 --workers 4
```

Artifacts are written under `simulation/runs/<run-id>/` and intentionally excluded from character contexts. This is a compressed simulation, not a replacement for a live playtest or a claim of statistical robustness.
