#!/usr/bin/env python3
"""Refuse to run the retired V1 simulation against incomplete V2 inputs."""

from __future__ import annotations

import sys


def main() -> int:
    print(
        "V2 simulation is not ready: create V2 character booklets, messages, "
        "evidence matrix, ballot schema, and action schema first. "
        "See simulation/README.md. The preserved baseline-01 artifacts are V1 only.",
        file=sys.stderr,
    )
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
