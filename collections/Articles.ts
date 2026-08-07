import type { CollectionConfig } from "payload";
import { categories } from "../site.config";

export const Articles: CollectionConfig = {
  slug: "articles",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "categorySlug", "publishedAt", "featured"],
  },
  // Public reads (the site fetches articles unauthenticated at build/request
  // time), but write access requires an authenticated admin — without this,
  // Payload's default is fully open create/update/delete for every collection.
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
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
    {
      name: "coverImageUrl",
      type: "text",
      admin: {
        description: "Full https:// URL. Must be on an allowed image host (see next.config.ts remotePatterns).",
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
