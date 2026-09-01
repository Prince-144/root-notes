/**
 * Serialises a JSON-LD object for embedding in a `<script type="application/ld+json">`.
 *
 * `JSON.stringify` escapes quotes and backslashes but not `<`, so an article
 * title containing `</script>` closes the block early and everything after it
 * is parsed as HTML by the browser. The site's CSP allows `'unsafe-inline'`
 * scripts (analytics needs it), so an injected `<script>` there would actually
 * run — CSP is not a backstop for this one.
 *
 * Article titles, excerpts and tags all flow into the structured data, and they
 * are written by the admin panel and by the drafting cron, which summarises
 * third-party news pages. Neither is a place to assume the text is inert.
 *
 * The three escapes stay valid JSON — `<` parses back to `<` — so the
 * structured data is unchanged for anything reading it as JSON.
 */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}
