<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Commands

npm (package-lock.json).

- `npm run dev`, `npm run build`, `npm run lint`
- `npm run data` rebuilds the game data with `scripts/build_data.py`. Rerun it after editing `design/data/*.csv` or `characters/*.md`; the CSVs are the source of truth.
- `npm run test:clock` compiles `src/lib/state.ts` and runs the clock tests.
- `npm run test:e2e` runs `tests/e2e.sh`.
