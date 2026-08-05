import type { ReactNode } from "react";

/**
 * The signature chrome of the site: a fake terminal window.
 * Reused for the homepage hero, code samples, and the newsletter box.
 */
export function TerminalWindow({
  title = "session",
  children,
  className = "",
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden rounded-md border border-line bg-panel ${className}`}>
      <div className="flex items-center gap-3 border-b border-line bg-chrome px-4 py-2.5">
        <div className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-[var(--color-dot-1)]" />
          <span className="size-2.5 rounded-full bg-[var(--color-dot-2)]" />
          <span className="size-2.5 rounded-full bg-[var(--color-dot-3)]" />
        </div>
        <span className="font-mono text-xs text-fg-subtle">{title}</span>
      </div>
      <div className="p-5 sm:p-7">{children}</div>
    </div>
  );
}

/** A `$ command` line inside a terminal window. */
export function Prompt({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-sm text-fg-subtle">
      <span className="mr-2 text-accent" aria-hidden>
        $
      </span>
      {children}
    </p>
  );
}
