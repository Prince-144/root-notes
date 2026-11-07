"use client";

import { useEffect, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Button } from "@payloadcms/ui";

/**
 * Refresh for the Articles list view, rendered next to Create New.
 *
 * Drafts are written by scripts (scripts/draft-long-*.ts) against the same
 * database the admin panel reads, so the list in an open tab is stale the
 * moment a batch is inserted.
 *
 * This calls router.refresh() rather than reloading the page: the list is a
 * server component, so refresh() re-runs the query on the server, discards
 * the client router cache for this route and swaps in the new rows. Search
 * text, column choices, filters and scroll position all survive, which a
 * reload would throw away for the sake of the same rows.
 *
 * Payload has no config slot for the list header's title actions — the
 * nearest one, beforeListTable, puts a block above the table — so this
 * registers there and portals itself into the header instead. If Payload's
 * markup ever changes, the lookup misses and nothing renders, which is the
 * right failure: no stray button in the wrong place.
 */
const TITLE_ACTIONS = ".list-header__title-actions";
const SPIN_KEYFRAMES = "@keyframes rn-refresh-spin { to { transform: rotate(360deg); } }";

export function RefreshButton() {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    const actions = document.querySelector<HTMLElement>(TITLE_ACTIONS);
    if (!actions) return;

    const mount = document.createElement("div");
    mount.style.display = "inline-flex";
    actions.appendChild(mount);
    setHost(mount);

    return () => {
      mount.remove();
    };
  }, []);

  if (!host) return null;

  return createPortal(
    <>
      <style>{SPIN_KEYFRAMES}</style>
      <Button
        onClick={() => {
          startTransition(() => {
            router.refresh();
          });
        }}
        disabled={isPending}
        // Same style and size as Create New beside it, so the two read as one
        // row of controls rather than a button and a loose icon.
        buttonStyle="pill"
        size="small"
        aria-label="Refresh list"
        tooltip="Re-read the articles from the database"
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          style={{
            display: "block",
            animation: isPending ? "rn-refresh-spin 0.8s linear infinite" : undefined,
          }}
        >
          <path d="M21 12a9 9 0 1 1-2.64-6.36" />
          <polyline points="21 3 21 9 15 9" />
        </svg>
      </Button>
    </>,
    host,
  );
}

export default RefreshButton;
