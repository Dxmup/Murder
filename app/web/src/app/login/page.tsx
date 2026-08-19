import { redirect } from "next/navigation";
import { currentSubject, HOST_SUBJECT } from "@/lib/session";

export const metadata = { title: "Sign in" };

const fieldClass =
  "mt-2 block h-14 w-full rounded-xl border border-line-strong bg-raised px-4 text-[17px] leading-none text-strong outline-none transition-colors placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/30";

const labelClass = "block text-sm font-medium text-body";

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
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-invert-bg text-invert-fg"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
              <path d="m3.5 7 8.5 6 8.5-6" />
            </svg>
          </span>
          <h1 className="text-2xl font-semibold tracking-tight">Mail</h1>
        </div>

        <p className="mt-5 text-base text-muted">
          Sign in to your account to read your mail.
        </p>

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
              className="rounded-xl border border-danger-line bg-danger-soft px-4 py-3 text-sm text-danger"
            >
              That email and password do not match. Check for typos and try
              again.
            </p>
          ) : null}

          <button
            type="submit"
            className="h-14 w-full rounded-xl bg-invert-bg text-[17px] font-semibold text-invert-fg transition-opacity active:opacity-80"
          >
            Sign in
          </button>
        </form>

        <p className="mt-8 text-sm leading-relaxed text-muted">
          Your address and password are on your invitation card. Ask your host
          if you cannot find them.
        </p>
      </div>
    </main>
  );
}
