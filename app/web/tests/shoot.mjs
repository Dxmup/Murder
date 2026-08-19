/**
 * Renders the app's screens to PNGs at phone viewport so a critic can compare
 * them against a reference image. Without this, a critic has only our source
 * and its own recollection of what a mail client looks like — which is the
 * hallucinated comparison the whole exercise is meant to avoid.
 *
 * Usage: BASE=http://localhost:3000 OUT=/tmp/shots node tests/shoot.mjs
 */
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = process.env.OUT ?? "/tmp/shots";
const PLAYER = { email: "abell@veridiandynamics.org", password: "pressproofregmarks" };
const HOST = {
  email: process.env.HOST_EMAIL ?? "host@veridiandynamics.org",
  password: process.env.HOST_PASSWORD ?? "fifteenyears",
};

// iPhone-class viewport: the reference is a phone screenshot and every player
// is on their own handset.
const VIEWPORT = { width: 390, height: 844 };

async function signIn(page, { email, password }) {
  await page.goto(`${BASE}/login`, { waitUntil: "networkidle" });
  await page.fill("#email", email);
  await page.fill("#password", password);
  await Promise.all([page.waitForURL((u) => !u.pathname.startsWith("/login")), page.click("button[type=submit]")]);
}

async function shoot(page, path, name) {
  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: false });
  console.log(`${name}.png  <- ${path}`);
}

const browser = await chromium.launch();
try {
  await mkdir(OUT, { recursive: true });

  const anon = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 2 });
  const anonPage = await anon.newPage();
  await shoot(anonPage, "/login", "01-login");

  const player = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 2 });
  const playerPage = await player.newPage();
  await signIn(playerPage, PLAYER);
  await shoot(playerPage, "/", "02-inbox");

  // Whichever message is currently at the top of the delivered list.
  const first = await playerPage.getAttribute("ol li a", "href");
  if (first) await shoot(playerPage, first, "03-message");

  const host = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 2 });
  const hostPage = await host.newPage();
  await signIn(hostPage, HOST);
  await shoot(hostPage, "/host", "04-host");
} finally {
  await browser.close();
}
