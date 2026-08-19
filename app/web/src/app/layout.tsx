import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  // The player's phone shows this on the tab and on a home-screen shortcut.
  // It has to read as a mail app, not as a party favour.
  title: { default: "Mail", template: "%s · Mail" },
  description: "Mail",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // The browser chrome above the app tints to match the surface, so the
  // status bar does not sit in a bright band above a dark inbox.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f11" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
