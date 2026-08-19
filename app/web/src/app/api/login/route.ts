import { NextResponse } from "next/server";
import { authenticate } from "@/lib/credentials";
import { HOST_SUBJECT, SESSION_COOKIE, mint } from "@/lib/session";

export async function POST(request: Request) {
  const form = await request.formData();
  const email = String(form.get("email") ?? "");
  const password = String(form.get("password") ?? "");

  const subject = authenticate(email, password);
  if (!subject) {
    return NextResponse.redirect(new URL("/login?error=1", request.url), { status: 303 });
  }

  const destination = subject === HOST_SUBJECT ? "/host" : "/";
  const response = NextResponse.redirect(new URL(destination, request.url), { status: 303 });

  response.cookies.set(SESSION_COOKIE, mint(subject), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    // The session must outlast the party; a mid-evening logout is worse
    // than a cookie that lingers on a player's phone afterwards.
    maxAge: 60 * 60 * 12,
  });

  return response;
}
