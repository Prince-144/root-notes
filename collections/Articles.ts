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
    revalidatePath("/rss.xml");
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
  // Public reads (the site fetches articles unauthenticated at build/request
  // time), but write access requires an authenticated admin — without this,
  // Payload's default is fully open create/update/delete for every collection.
  // Public read is further scoped to status=published — otherwise draft
  // content is reachable by anyone querying /api/articles directly, even
  // though the site's own pages (lib/articles.ts) already filter it out.
  // Logged-in admins still see everything, drafts included.
  access: {
    read: ({ req: { user } }) => (user ? true : { status: { equals: "published" } }),
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
    {
      name: "publishedAt",
      type: "date",
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { date: { pickerAppearance: "dayAndTime" }, position: "sidebar" },
    },
    { name: "readingMinutes", type: "number", required: true, min: 1 },
    { name: "featured", type: "checkbox", defaultValue: false, admin: { position: "sidebar" } },
    { name: "views", type: "number", defaultValue: 0, admin: { position: "sidebar" } },
  ],
};
