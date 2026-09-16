"use client";

import { useState } from "react";
import { Button, useField } from "@payloadcms/ui";

/**
 * Shows the markdown that places this upload inside an article body.
 *
 * Bodies are MDX, so an inline image is `![alt](url)`. The URL Payload gives
 * an upload isn't shown anywhere an editor would think to look, and alt text
 * containing brackets or braces breaks the markdown or the MDX compile — a
 * broken compile is a 500 on the live article. Building the snippet from the
 * saved upload means it can be pasted as-is.
 */
export function MediaMarkdown() {
  const { value: url } = useField<string>({ path: "url" });
  const { value: alt } = useField<string>({ path: "alt" });
  const [copied, setCopied] = useState(false);

  if (!url) {
    return (
      <p style={{ fontSize: "0.8rem", opacity: 0.7, margin: "0.5rem 0 1.5rem" }}>
        Save this upload to get the markdown for placing it inside an article.
      </p>
    );
  }

  // Braces open an MDX expression and angle brackets a JSX tag, so either one
  // in the alt text fails the compile; a square bracket ends the alt early.
  const safeAlt = (alt ?? "").replace(/[[\]{}<>]/g, "").replace(/\s+/g, " ").trim();
  // A space or a parenthesis ends a markdown link target.
  const safeUrl = url.replace(/ /g, "%20").replace(/\(/g, "%28").replace(/\)/g, "%29");
  const snippet = `![${safeAlt}](${safeUrl})`;

  async function copy() {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={{ margin: "0.5rem 0 1.5rem" }}>
      <div style={{ fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.4rem" }}>
        Markdown for an article body
      </div>
      <code
        style={{
          display: "block",
          padding: "0.6rem 0.75rem",
          marginBottom: "0.6rem",
          borderRadius: "4px",
          background: "var(--theme-elevation-50)",
          fontSize: "0.8rem",
          wordBreak: "break-all",
        }}
      >
        {snippet}
      </code>
      <Button onClick={copy} buttonStyle="secondary" size="small">
        {copied ? "Copied" : "Copy markdown"}
      </Button>
      <p style={{ fontSize: "0.75rem", opacity: 0.6, marginTop: "0.4rem" }}>
        Paste it on its own line in the body. For a caption, put it in quotes after the URL, before
        the closing bracket.
      </p>
    </div>
  );
}

export default MediaMarkdown;
