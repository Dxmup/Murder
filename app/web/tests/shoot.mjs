/**
 * Renders the app's screens to PNGs at phone viewport so a critic can compare
 * them against a reference image. Without this, a critic has only our source
 * and its own recollection of what a mail client looks like — which is the
 * hallucinated comparison the whole exercise is meant to avoid.
 *
 * Both themes are shot every time. Players arrive on their own handsets with
 * whatever setting they happen to have, so "it looks right in dark" is only
 * half an answer.
 *
 * Usage: BASE=http://localhost:3000 OUT=/tmp/shots node tests/shoot.mjs
 */
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = process.env.OUT ?? "/tmp/shots";
const PLAYER = { password: "pressproofregmarks" };
const HOST = { password: process.env.HOST_PASSWORD ?? "fifteenyears" };

// iPhone-class viewport: the reference is a phone screenshot and every player
// is on their own handset.
const VIEWPORT = { width: 390, height: 844 };

// Only shoot the themes asked for, so a quick dark-only pass stays quick.
const THEMES = (process.env.THEMES ?? "dark,light").split(",").filter(Boolean);

async function signIn(page, { password }) {
  await page.goto(`${BASE}/login`, { waitUntil: "networkidle" });
  await page.fill("#password", password);
  await Promise.all([
    page.waitForURL((u) => !u.pathname.startsWith("/login")),
    page.click("button[type=submit]"),
  ]);
}

async function shoot(page, path, name, { fullPage = false } = {}) {
  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage });
  console.log(`${name}.png  <- ${path}`);
}

/** Console errors are the point of this pass, not a side effect: a hydration
 *  mismatch shows up here and nowhere in a screenshot. */
function watch(page, label, sink) {
  page.on("console", (m) => {
    if (m.type() === "error" || m.type() === "warning") sink.push(`[${label}] ${m.text()}`);
  });
  page.on("pageerror", (e) => sink.push(`[${label}] pageerror: ${e.message}`));
}

// Prefer the headless shell Playwright installs by default; fall back to the
// full chromium build, which is what a partial `playwright install` leaves
// behind and is otherwise identical for screenshots.
const browser = await chromium
  .launch()
  .catch(() => chromium.launch({ channel: "chromium" }));
const noise = [];

try {
  await mkdir(OUT, { recursive: true });

  for (const colorScheme of THEMES) {
    const suffix = THEMES.length > 1 ? `-${colorScheme}` : "";
    const opts = { viewport: VIEWPORT, deviceScaleFactor: 2, colorScheme };

    const anon = await browser.newContext(opts);
    const anonPage = await anon.newPage();
    watch(anonPage, colorScheme, noise);
    await shoot(anonPage, "/login", `01-login${suffix}`);

    const player = await browser.newContext(opts);
    const playerPage = await player.newPage();
    watch(playerPage, colorScheme, noise);
    await signIn(playerPage, PLAYER);
    await shoot(playerPage, "/", `02-inbox${suffix}`);

    // The bottom of the list, where kept mail sits: its label chips and its
    // amber rail are the part of the design most easily got wrong.
    await playerPage.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await playerPage.screenshot({ path: `${OUT}/07-kept${suffix}.png` });
    console.log(`07-kept${suffix}.png  <- / (scrolled)`);

    // A live message, not the briefing: the briefing has its own shot below and
    // does not exercise the from/to header at all.
    const hrefs = await playerPage.$$eval("ol li a", (as) => as.map((a) => a.getAttribute("href")));
    const first = hrefs.find((h) => h && !h.endsWith("/BRIEFING")) ?? hrefs[0];
    if (first) await shoot(playerPage, first, `03-message${suffix}`);

    // The briefing is the longest and most-read screen in the game, so it gets
    // its own shot rather than being represented by whatever is on top.
    await shoot(playerPage, "/m/BRIEFING", `05-briefing${suffix}`);

    // Edge cases the seeded content never produces: a sender name and a
    // subject far longer than anything authored, and a one-word preview. The
    // row must truncate rather than reflow the layout around it.
    await playerPage.goto(`${BASE}/`, { waitUntil: "networkidle" });
    await playerPage.evaluate(() => {
      const row = document.querySelector("ol li");
      if (!row) return;
      const spans = row.querySelectorAll("button span span");
      const texts = [...spans].filter((s) => s.children.length === 0);
      if (texts[0]) texts[0].textContent = "Marguerite Ashworth-Delacroix-Fontaine, Night Desk";
      if (texts[1])
        texts[1].textContent =
          "A ninety character subject line written by someone who has never met a phone screen";
      if (texts[2]) texts[2].textContent = "Yes.";
    });
    await playerPage.screenshot({ path: `${OUT}/06-edges${suffix}.png` });
    console.log(`06-edges${suffix}.png  <- / (mutated row)`);

    const host = await browser.newContext(opts);
    const hostPage = await host.newPage();
    watch(hostPage, colorScheme, noise);
    await signIn(hostPage, HOST);
    await shoot(hostPage, "/host", `04-host${suffix}`);
  }
} finally {
  await browser.close();
}

if (noise.length) {
  console.log(`\n${noise.length} console message(s):`);
  for (const line of noise) console.log(`  ${line}`);
} else {
  console.log("\nno console errors or warnings");
}
