import type { Metadata } from "next";
import Link from "next/link";
import { Prompt, TerminalWindow } from "@/components/terminal-window";

export const metadata: Metadata = {
  title: "Subscription",
  robots: { index: false, follow: true },
};

export default async function NewsletterConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>;
}) {
  const { ok } = await searchParams;
  const confirmed = ok === "1";

  return (
    <div className="container-page py-10 sm:py-14">
      <TerminalWindow title="subscribe --confirm">
        <Prompt>echo $STATUS</Prompt>
        {confirmed ? (
          <p className="mt-3 font-mono text-sm text-[var(--color-sig-green)]">
            ✓ Subscribed. You&apos;re on the list.
          </p>
        ) : (
          <p className="mt-3 font-mono text-sm text-fg-muted">
            That confirmation link is invalid or expired.
          </p>
        )}
        <Link href="/" className="link-underline mt-6 inline-block font-mono text-xs text-fg-subtle">
          &larr; back to home
        </Link>
      </TerminalWindow>
    </div>
  );
}
