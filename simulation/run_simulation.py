#!/usr/bin/env python3
"""Direct users away from the retired V1 simulation entry point."""

from __future__ import annotations

import sys


def main() -> int:
    print(
        "The V1 runner is retired. Validate or run V2 with "
        "python3 simulation/v2/run.py --validate-only (or see simulation/v2/README.md).",
        file=sys.stderr,
    )
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
