import type { Metadata } from "next";
import Link from "next/link";
import { Prompt, TerminalWindow } from "@/components/terminal-window";

export const metadata: Metadata = {
  title: "Unsubscribed",
  robots: { index: false, follow: true },
};

export default async function NewsletterUnsubscribedPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>;
}) {
  const { ok } = await searchParams;
  const unsubscribed = ok === "1";

  return (
    <div className="container-page py-10 sm:py-14">
      <TerminalWindow title="subscribe --unsubscribe">
        <Prompt>echo $STATUS</Prompt>
        {unsubscribed ? (
          <p className="mt-3 font-mono text-sm text-fg-muted">
            You&apos;re unsubscribed. No more emails from us.
          </p>
        ) : (
          <p className="mt-3 font-mono text-sm text-fg-muted">
            That unsubscribe link is invalid or expired.
          </p>
        )}
        <Link href="/" className="link-underline mt-6 inline-block font-mono text-xs text-fg-subtle">
          &larr; back to home
        </Link>
      </TerminalWindow>
    </div>
  );
}
