import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

/**
 * Who has looked at their inbox, for the host's follow-ups before the party.
 * Kept apart from the game state on purpose: players write here on every
 * visit, and a player's write must never be able to overwrite the host
 * starting an act. In Redis each fact is its own hash field, so writes from
 * different phones cannot clobber one another.
 */
export type Activity = {
  /** Epoch ms of the first successful sign-in. */
  firstLogin: number | null;
  /** Epoch ms the briefing was first opened. */
  briefingOpened: number | null;
  /** Epoch ms of the most recent page the player loaded. */
  lastSeen: number | null;
};

type Field = keyof Activity;

interface ActivityStore {
  setOnce(id: string, field: Field, at: number): Promise<void>;
  set(id: string, field: Field, at: number): Promise<void>;
  all(): Promise<Record<string, Activity>>;
}

const EMPTY: Activity = { firstLogin: null, briefingOpened: null, lastSeen: null };

class RedisActivity implements ActivityStore {
  private static readonly KEY = "murder:activity";

  constructor(
    private readonly url: string,
    private readonly token: string,
  ) {}

  private async command(args: string[]): Promise<unknown> {
    const response = await fetch(this.url, {
      method: "POST",
      headers: { Authorization: `Bearer ${this.token}` },
      body: JSON.stringify(args),
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`Redis ${args[0]} failed: ${response.status}`);
    return ((await response.json()) as { result: unknown }).result;
  }

  async setOnce(id: string, field: Field, at: number) {
    await this.command(["HSETNX", RedisActivity.KEY, `${id}:${field}`, String(at)]);
  }

  async set(id: string, field: Field, at: number) {
    await this.command(["HSET", RedisActivity.KEY, `${id}:${field}`, String(at)]);
  }

  async all() {
    const flat = (await this.command(["HGETALL", RedisActivity.KEY])) as string[] | null;
    const out: Record<string, Activity> = {};
    for (let i = 0; flat && i < flat.length; i += 2) {
      const [id, field] = flat[i].split(":") as [string, Field];
      out[id] ??= { ...EMPTY };
      out[id][field] = Number(flat[i + 1]);
    }
    return out;
  }
}

class FileActivity implements ActivityStore {
  // Each update rewrites the whole file, so updates take turns or they would
  // overwrite one another.
  private queue: Promise<void> = Promise.resolve();

  constructor(private readonly path: string) {}

  private async read(): Promise<Record<string, Activity>> {
    try {
      return JSON.parse(await readFile(this.path, "utf8")) as Record<string, Activity>;
    } catch {
      return {};
    }
  }

  private update(id: string, field: Field, at: number, once: boolean) {
    this.queue = this.queue.then(() => this.write(id, field, at, once));
    return this.queue;
  }

  private async write(id: string, field: Field, at: number, once: boolean) {
    const data = await this.read();
    const row = (data[id] ??= { ...EMPTY });
    if (once && row[field] !== null) return;
    row[field] = at;
    await mkdir(dirname(this.path), { recursive: true });
    await writeFile(this.path, JSON.stringify(data, null, 2), "utf8");
  }

  setOnce(id: string, field: Field, at: number) {
    return this.update(id, field, at, true);
  }

  set(id: string, field: Field, at: number) {
    return this.update(id, field, at, false);
  }

  all() {
    return this.read();
  }
}

let store: ActivityStore | null = null;

function getActivityStore(): ActivityStore {
  if (!store) {
    const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
    store =
      url && token
        ? new RedisActivity(url, token)
        : new FileActivity(join(process.cwd(), ".data", "activity.json"));
  }
  return store;
}

/**
 * Tracking must never break a player's page, so a failed write is dropped.
 */
async function quietly(write: Promise<void>) {
  try {
    await write;
  } catch {
    // The host loses one data point; the player loses nothing.
  }
}

export function recordLogin(id: string, now = Date.now()) {
  return Promise.all([
    quietly(getActivityStore().setOnce(id, "firstLogin", now)),
    quietly(getActivityStore().set(id, "lastSeen", now)),
  ]);
}

export function recordBriefing(id: string, now = Date.now()) {
  return quietly(getActivityStore().setOnce(id, "briefingOpened", now));
}

/**
 * Any page load. It also counts as a sign-in, because a phone that signed in
 * before tracking existed stays signed in and never passes the login again.
 */
export function recordVisit(id: string, now = Date.now()) {
  return Promise.all([
    quietly(getActivityStore().setOnce(id, "firstLogin", now)),
    quietly(getActivityStore().set(id, "lastSeen", now)),
  ]);
}

export async function allActivity(): Promise<Record<string, Activity>> {
  try {
    return await getActivityStore().all();
  } catch {
    return {};
  }
}
