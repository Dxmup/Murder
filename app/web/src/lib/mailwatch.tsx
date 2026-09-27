"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const POLL_MS = 15_000;

/**
 * A two-note chime synthesised on the spot, so there is no audio file to load.
 * Browsers only let a page make sound after the player has touched it, so the
 * context is created on the first tap and reused.
 */
function useChime() {
  const ctx = useRef<AudioContext | null>(null);

  useEffect(() => {
    const unlock = () => {
      if (!ctx.current) ctx.current = new AudioContext();
      void ctx.current.resume();
    };
    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  return () => {
    const audio = ctx.current;
    if (audio && audio.state === "running") playTones(audio);
    // Android buzzes; iPhones ignore this and rely on the chime.
    navigator.vibrate?.([90, 70, 90]);
  };
}

/** The two notes themselves: A5 then E6, each fading out over half a second. */
function playTones(audio: AudioContext) {
  const start = audio.currentTime + 0.02;
  [880, 1318.5].forEach((freq, i) => {
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    const t = start + i * 0.14;
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.25, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
    osc.connect(gain).connect(audio.destination);
    osc.start(t);
    osc.stop(t + 0.5);
  });
}

/**
 * For the host's pre-game briefing: plays the new-mail chime on demand so the
 * whole room learns what it sounds like before the first act starts.
 */
export function ChimeButton() {
  const ctx = useRef<AudioContext | null>(null);
  return (
    <button
      type="button"
      onClick={() => {
        if (!ctx.current) ctx.current = new AudioContext();
        void ctx.current.resume().then(() => playTones(ctx.current!));
        navigator.vibrate?.([90, 70, 90]);
      }}
      className="flex h-11 shrink-0 items-center gap-2 rounded-lg border border-line-strong bg-raised px-3.5 text-[14px] font-semibold text-strong active:opacity-70"
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-4"
      >
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </svg>
      Play chime
    </button>
  );
}

/**
 * Keeps an open page current during play. Every fifteen seconds while the page
 * is on screen it asks which messages have arrived. New mail chimes, puts the
 * unread count in the tab title, and either refreshes the inbox in place or,
 * on a message screen, shows a banner back to the inbox. Nothing chimes on the
 * first load: the server already rendered what was there.
 */
export function MailWatcher({
  initialIds,
  initialUnread,
  onInbox,
}: {
  initialIds: string[];
  initialUnread: number;
  onInbox: boolean;
}) {
  const router = useRouter();
  const chime = useChime();
  const known = useRef(new Set(initialIds));
  const [banner, setBanner] = useState(0);

  useEffect(() => {
    // Next.js rewrites <title> from page metadata after hydration and after a
    // refresh, which wipes the count. Re-apply it a few times after each
    // change instead of watching the title, which would fight Next in a loop.
    const unread = { current: initialUnread };
    const applyTitle = () => {
      const base = document.title.replace(/^\(\d+\)\s*/, "");
      const wanted = unread.current > 0 ? `(${unread.current}) ${base}` : base;
      if (document.title !== wanted) document.title = wanted;
    };
    const timeouts: number[] = [];
    const settleTitle = () => {
      applyTitle();
      for (const ms of [250, 1000, 2500]) timeouts.push(window.setTimeout(applyTitle, ms));
    };
    const setTitle = (n: number) => {
      unread.current = n;
      settleTitle();
    };
    settleTitle();

    let stopped = false;
    const check = async () => {
      if (document.visibilityState !== "visible") return;
      try {
        const response = await fetch("/api/mail", { cache: "no-store" });
        if (!response.ok || stopped) return;
        const { ids, unread } = (await response.json()) as { ids: string[]; unread: number };
        const fresh = ids.filter((id) => !known.current.has(id));
        setTitle(unread);
        if (fresh.length === 0) return;
        fresh.forEach((id) => known.current.add(id));
        chime();
        if (onInbox) router.refresh();
        else setBanner((n) => n + fresh.length);
      } catch {
        // A dropped connection at a party is normal; the next tick retries.
      }
    };

    const timer = window.setInterval(check, POLL_MS);
    // A phone coming back out of a pocket checks at once rather than waiting.
    document.addEventListener("visibilitychange", check);
    return () => {
      stopped = true;
      timeouts.forEach((t) => window.clearTimeout(t));
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", check);
    };
    // The watcher is set up once per page; the refresh re-renders the list itself.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (banner === 0) return null;
  return (
    <Link
      href="/"
      role="status"
      className="fixed inset-x-4 z-20 flex items-center justify-between rounded-xl bg-brand px-4 py-3 text-[15px] font-semibold text-brand-fg shadow-lg"
      style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)" }}
    >
      <span>{banner === 1 ? "New mail" : `${banner} new messages`}</span>
      <span aria-hidden="true">Inbox ›</span>
    </Link>
  );
}
