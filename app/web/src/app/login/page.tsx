import { redirect } from "next/navigation";
import { currentSubject, HOST_SUBJECT } from "@/lib/session";

export const metadata = { title: "Sign in" };

/*
 * 17px fields, because iOS zooms the whole page in on focus for anything
 * smaller, and a player who has just had their screen lurch sideways at a
 * party does not read the rest of the form.
 */
const fieldClass =
  "mt-2 block h-14 w-full rounded-xl border border-line-strong bg-raised px-4 text-[17px] leading-none text-strong outline-none transition-colors placeholder:text-faint focus:border-brand focus:ring-2 focus:ring-brand/35";

const labelClass = "block text-[15px] font-medium text-body";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const subject = await currentSubject();
  if (subject) redirect(subject === HOST_SUBJECT ? "/host" : "/");

  const { error } = await searchParams;

  return (
    <main className="flex min-h-dvh flex-col justify-center bg-surface px-6 py-12 text-strong">
      <div className="mx-auto w-full max-w-sm">
        <div className="flex flex-col items-center text-center">
          <span
            aria-hidden="true"
            className="flex size-14 items-center justify-center rounded-2xl bg-brand text-brand-fg"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-7"
            >
              <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
              <path d="m3.5 7 8.5 6 8.5-6" />
            </svg>
          </span>
          <h1 className="mt-4 text-[28px] font-semibold leading-tight tracking-tight">
            Mail
          </h1>
          <p className="mt-2 text-[16px] leading-snug text-muted">
            Sign in to your account to read your mail.
          </p>
        </div>

        <form action="/api/login" method="post" className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className={labelClass}>
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoFocus
              inputMode="email"
              enterKeyHint="next"
              placeholder="you@example.com"
              autoComplete="username"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              className={fieldClass}
            />
          </div>

          <div>
            <label htmlFor="password" className={labelClass}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              enterKeyHint="go"
              placeholder="••••••••"
              autoComplete="current-password"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              className={fieldClass}
            />
          </div>

          {error ? (
            <p
              role="alert"
              className="rounded-xl border border-danger-line bg-danger-soft px-4 py-3 text-[15px] leading-snug text-danger"
            >
              That email and password do not match. Check for typos and try
              again.
            </p>
          ) : null}

          <button
            type="submit"
            className="h-14 w-full rounded-xl bg-brand text-[17px] font-semibold text-brand-fg transition-opacity active:opacity-80"
          >
            Sign in
          </button>
        </form>

        <p className="mt-8 text-center text-[15px] leading-relaxed text-muted">
          Your address and password are on your invitation card. Ask your host
          if you cannot find them.
        </p>
      </div>
    </main>
  );
}
