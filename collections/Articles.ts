import type { CollectionConfig } from "payload";
import { revalidatePath } from "next/cache";
import { categories } from "../site.config";
import { submitToIndexNow } from "../lib/indexnow";

/**
 * Article pages are statically generated (generateStaticParams) with no
 * time-based revalidation, so without this, publishing/editing/deleting in
 * the admin panel updates Postgres but the live site keeps serving the old
 * build until the next `vercel --prod` — the CMS write and the public site
 * would silently disagree indefinitely.
 *
 * `revalidatePath` only works inside an active Next.js request (the admin
 * panel's writes qualify, since Payload runs embedded via @payloadcms/next).
 * One-off scripts that call the Local API directly (scripts/*.ts) have no
 * such request context and would otherwise crash on this — silently no-op
 * instead; a script-driven change just waits for the next deploy.
 */
function revalidateArticlePaths(doc: { slug?: string; categorySlug?: string }) {
  try {
    revalidatePath("/");
    revalidatePath("/search");
    revalidatePath("/sitemap.xml");
    revalidatePath("/news-sitemap.xml");
    revalidatePath("/rss.xml");
    revalidatePath("/archive");
    if (doc.slug) revalidatePath(`/article/${doc.slug}`);
    if (doc.categorySlug) revalidatePath(`/category/${doc.categorySlug}`);
  } catch {
    // No active Next.js request context (e.g. a standalone script) — skip.
  }
}

export const Articles: CollectionConfig = {
  slug: "articles",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "status", "categorySlug", "publishedAt", "featured"],
  },
  hooks: {
    /**
     * Stamp publishedAt at the moment of publishing, not at the moment the
     * draft was created. Drafts are written days ahead of time, so the
     * creation-time default would put a date on the live site that has nothing
     * to do with when readers could first see the article.
     *
     * Skipped when the editor set the date themselves in the same write —
     * backdating or scheduling a specific time is a deliberate act and this
     * should not silently undo it.
     */
    beforeChange: [
      ({ data, originalDoc, operation }) => {
        if (data.status !== "published") return data;
        if (originalDoc?.status === "published") return data;

        if (operation === "update") {
          const incoming = data.publishedAt ? new Date(data.publishedAt).getTime() : null;
          const previous = originalDoc?.publishedAt
            ? new Date(originalDoc.publishedAt).getTime()
            : null;
          if (incoming !== null && previous !== null && incoming !== previous) return data;
        }

        return { ...data, publishedAt: new Date().toISOString() };
      },
    ],
    afterChange: [
      ({ doc, previousDoc }) => {
        revalidateArticlePaths(doc);
        if (previousDoc?.categorySlug && previousDoc.categorySlug !== doc.categorySlug) {
          try {
            revalidatePath(`/category/${previousDoc.categorySlug}`);
          } catch {
            // No active Next.js request context (e.g. a standalone script) — skip.
          }
        }

        // Only on the draft -> published transition. Re-pinging on every later
        // edit would be noise to the search engines and pointless to us.
        if (doc.status === "published" && previousDoc?.status !== "published") {
          void submitToIndexNow([
            `/article/${doc.slug}`,
            `/category/${doc.categorySlug}`,
            "/",
            "/sitemap.xml",
          ]);
        }
      },
    ],
    afterDelete: [({ doc }) => revalidateArticlePaths(doc)],
  },
  // Reads require an authenticated admin, and so does everything else —
  // without this, Payload's default is fully open create, update and delete
  // for every collection.
  //
  // Closing read as well is about the database bill rather than secrecy: the
  // articles are public on the site, but /api/articles is a query interface
  // onto the same rows, and one unauthenticated request asking for every
  // document with depth moves megabytes out of a metered database. Crawlers
  // find REST endpoints. In September 2026 the project spent a fortnight
  // suspended for exceeding its transfer quota, and this was one of the open
  // taps.
  //
  // The site is unaffected: every page reads through Payload's Local API
  // (lib/articles.ts), which runs in-process and bypasses access control, and
  // the admin panel calls REST as a logged-in user.
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: "publishAction",
      type: "ui",
      admin: {
        position: "sidebar",
        components: {
          Field: "@/components/admin/publish-button#PublishButton",
        },
      },
    },
    { name: "title", type: "text", required: true },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: { position: "sidebar" },
    },
    { name: "excerpt", type: "textarea", required: true },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "draft",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
      ],
      admin: { position: "sidebar" },
    },
    /**
     * Two ways in, because they serve different authors. The generator writes
     * a stock URL it picks itself; a human editing in the admin usually has a
     * file. The upload wins when both are set — it's the deliberate choice.
     */
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
      admin: { description: "Upload a cover image. Takes precedence over the URL below." },
    },
    {
      name: "coverImageUrl",
      type: "text",
      admin: {
        description:
          "Fallback if no image is uploaded. Full https:// URL on an allowed host (see next.config.ts remotePatterns).",
      },
    },
    {
      name: "body",
      type: "code",
      required: true,
      admin: {
        language: "markdown",
        description: "MDX source, rendered via next-mdx-remote on the article page.",
      },
    },
    {
      name: "categorySlug",
      type: "select",
      required: true,
      options: categories.map((c) => ({ label: c.name, value: c.slug })),
    },
    { name: "tags", type: "text", hasMany: true },
    { name: "author", type: "text", required: true },
    /**
     * A draft's publishedAt is a placeholder until the beforeChange hook stamps
     * it at publish time, so the Articles list renders an em dash for drafts
     * rather than a date nobody should read as one.
     *
     * The field itself stays visible on the edit page. Hiding it with an
     * `admin.condition` also makes Payload generate `publishedAt?: string |
     * null` — a required field becomes optional across every consumer of
     * payload-types, which is too much to give up for one hidden input.
     */
    {
      name: "publishedAt",
      type: "date",
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        date: { pickerAppearance: "dayAndTime" },
        position: "sidebar",
        description: "Set automatically when the article is published.",
        components: {
          Cell: "@/components/admin/published-at-cell#PublishedAtCell",
        },
      },
    },
    { name: "readingMinutes", type: "number", required: true, min: 1 },
    { name: "featured", type: "checkbox", defaultValue: false, admin: { position: "sidebar" } },
    // Nothing writes this any more: the per-view database write was removed in
    // September 2026 to save the metered database. Hidden rather than deleted
    // so the column stays and no migration is needed.
    { name: "views", type: "number", defaultValue: 0, admin: { hidden: true } },
  ],
};
