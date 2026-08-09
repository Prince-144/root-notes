import type { CollectionConfig } from "payload";

/**
 * Uploaded images, used for article cover art.
 *
 * Files live in Vercel Blob, not on disk (see payload.config.ts). Vercel's
 * filesystem is ephemeral and read-only outside /tmp, so Payload's default
 * disk adapter would appear to work locally and then lose every upload in
 * production.
 *
 * `alt` is required because these are content images on article pages — a
 * cover with no alt text is a hole in the page for anyone using a screen
 * reader, and it's the one thing an uploader can't add later without
 * remembering the image.
 */
export const Media: CollectionConfig = {
  slug: "media",
  admin: { useAsTitle: "filename", defaultColumns: ["filename", "alt", "updatedAt"] },
  access: {
    // Covers are rendered on public article pages, so the files must be
    // readable without a session. Writing still requires one.
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  upload: {
    mimeTypes: ["image/*"],
    // Matches the 16:9 slot the cards and article header render into, so the
    // browser isn't handed a 4MB original to scale down on every view.
    imageSizes: [{ name: "cover", width: 1600, height: 900, position: "centre" }],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      admin: { description: "Describe the image for screen readers and when it fails to load." },
    },
  ],
};
