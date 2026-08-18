"use client";

import { useState } from "react";
import { siteConfig } from "@/site.config";

/**
 * Share links for an article.
 *
 * Plain anchors rather than platform SDKs — the share widgets those vendors
 * ship load third-party script and set their own cookies, which would undo
 * the point of asking permission before loading analytics.
 *
 * Copy link is included because it is what people actually use for the places
 * a button cannot reach: Slack, WhatsApp on desktop, a colleague's DM.
 */
export function ShareLinks({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false);

  const url = `${siteConfig.url}/article/${slug}`;
  const text = encodeURIComponent(title);
  const link = encodeURIComponent(url);

  const targets = [
    { label: "X", href: `https://x.com/intent/tweet?text=${text}&url=${link}` },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${link}`,
    },
    { label: "WhatsApp", href: `https://wa.me/?text=${text}%20${link}` },
    { label: "Reddit", href: `https://reddit.com/submit?url=${link}&title=${text}` },
  ];

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked — the URL is in the address bar anyway.
    }
  }

  return (
    <div className="mx-auto mt-12 max-w-content border-t border-line pt-6">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="font-mono text-2xs uppercase tracking-widest text-fg-subtle">
          Share
        </span>

        {targets.map((t) => (
          <a
            key={t.label}
            href={t.href}
            target="_blank"
            rel="noreferrer noopener"
            className="tag-chip text-fg-subtle transition-colors hover:border-accent hover:text-fg"
          >
            {t.label}
          </a>
        ))}

        <button
          type="button"
          onClick={copy}
          className="tag-chip text-fg-subtle transition-colors hover:border-accent hover:text-fg"
        >
          {copied ? "Copied" : "Copy link"}
        </button>
      </div>
    </div>
  );
}
