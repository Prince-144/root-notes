/**
 * Escaping for the hand-written XML feeds.
 *
 * Shared because the RSS feed and the news sitemap carry the same headlines,
 * and a headline with an ampersand in it breaks a feed reader in exactly the
 * same way it breaks a sitemap parser.
 */
export function escapeXml(value: string): string {
  return value.replace(/[<>&'"]/g, (char) => {
    switch (char) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return char;
    }
  });
}
