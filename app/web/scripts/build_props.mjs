// Web-size copies of the prop scans for the inbox. The print originals in
// print/ stay untouched at full resolution; these land in props/, outside
// public/, so only the prop route can serve them.
import { mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const web = join(dirname(fileURLToPath(import.meta.url)), "..");
const repo = join(web, "..", "..");
const out = join(web, "props");
mkdirSync(out, { recursive: true });

const rows = readFileSync(join(repo, "design/data/props.csv"), "utf8").trim().split("\n").slice(1);
for (const row of rows) {
  const [id, , , source] = row.split(",");
  await sharp(join(repo, source))
    .resize({ width: 1400, height: 1400, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(join(out, `${id}.jpg`));
}
console.log(`props: ${rows.length}`);
