# Multi-Agent Simulation

## Current status

`runs/baseline-01/` is a completed **Version 1 historical simulation**. It used the discarded cast, the old four-framework model, publication voting, and mechanics that V2 has removed. Its report remains useful evidence for why the redesign occurred, but its character results do not evaluate the V2 game.

`run_simulation.py` is intentionally disabled. The legacy character sheets and message table no longer align with the current V2 character IDs, and running them together would generate a misleading report. New protocol inputs and the abbreviated-brief generator are under [`v2/`](v2/).

The JSON schemas are also legacy protocol artifacts until the V2 ballot and agent action model are implemented.

## Requirements before a V2 simulation

- complete V2 character booklets;
- a V2 message table using the three-section relative schedule;
- an ending/evidence matrix with equal weight for Lone Author, Human Mantle, and Synthetic Persona;
- a ballot model covering R's identity, Vale's relationship to R, and Vale's fate;
- no publication vote, Immunity, Compel, police authority, or forced evidence transfer;
- one isolated agent context per character;
- evaluators for mystery balance, character agency, social circulation, mechanical exploits, article ambiguity, and progressive-ending difficulty.

Once those inputs exist, rebuild the harness against V2 rather than adapting conclusions from `baseline-01`.
