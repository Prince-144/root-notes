import { sql } from "drizzle-orm";
import { getPayload } from "payload";
import config from "@payload-config";

/**
 * Records one view of a published article.
 *
 * Deliberately raw SQL rather than payload.update(): the Articles collection's
 * afterChange hook calls revalidatePath on "/", "/search", the sitemap, the
 * feed, the article and its category. Routing view counts through the Local
 * API would fire all of that on every single page view. The raw statement
 * skips hooks entirely, and `views = views + 1` is atomic, so concurrent
 * readers can't clobber each other the way read-modify-write would.
 *
 * Only published rows are touched, so a guessed or draft slug is a silent
 * no-op rather than a way to probe what's unpublished.
 */
export async function recordView(slug: string): Promise<boolean> {
  const payload = await getPayload({ config });
  const result = await payload.db.drizzle.execute(sql`
    UPDATE articles
    SET views = COALESCE(views, 0) + 1
    WHERE slug = ${slug} AND status = 'published'
  `);

  return (result.rowCount ?? 0) > 0;
}
