import { siteConfig } from "@/site.config";

/**
 * Tells Bing, DuckDuckGo, Yandex and Seznam about a URL the moment it changes,
 * instead of waiting to be crawled.
 *
 * Google does not participate in IndexNow, so this does nothing for Google
 * results — it is worth having because Bing indexes new domains far faster
 * than Google does, and a site a week old has nothing to lose by being found
 * somewhere first.
 *
 * The key is not a secret. It is a public token, and ownership is proven by
 * serving it at https://<host>/<key>.txt — which is why it lives in the repo
 * under public/ rather than in an environment variable.
 */
const INDEXNOW_KEY = "8cd8ecd4f8461e92bb7c3f623dcf1d18";
const ENDPOINT = "https://api.indexnow.org/indexnow";

/**
 * Never throws and never blocks anything important: a search engine failing to
 * accept a ping is not a reason for a publish to fail, or even to be slower.
 */
export async function submitToIndexNow(paths: string[]): Promise<void> {
  if (paths.length === 0) return;

  const host = new URL(siteConfig.url).host;
  const urlList = [...new Set(paths)].map((p) =>
    p.startsWith("http") ? p : `${siteConfig.url}${p.startsWith("/") ? p : `/${p}`}`,
  );

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host,
        key: INDEXNOW_KEY,
        keyLocation: `${siteConfig.url}/${INDEXNOW_KEY}.txt`,
        urlList,
      }),
    });

    // 200 and 202 both mean accepted; anything else is worth a line in the log
    // but not an exception.
    if (res.ok) console.log(`[indexnow] submitted ${urlList.length} url(s)`);
    else console.warn(`[indexnow] ${res.status} for ${urlList.length} url(s)`);
  } catch (err) {
    console.warn("[indexnow] submission failed", err);
  }
}
