import type { CollectionConfig } from "payload";

export const Subscribers: CollectionConfig = {
  slug: "subscribers",
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "confirmed", "subscribedAt"],
  },
  access: {
    // No public read/update/delete — only the newsletter API routes (server-side, full access) touch this.
    read: () => false,
    create: () => false,
    update: () => false,
    delete: () => false,
  },
  fields: [
    { name: "email", type: "email", required: true, unique: true, index: true },
    { name: "confirmed", type: "checkbox", defaultValue: false },
    { name: "confirmToken", type: "text", required: true, index: true },
    { name: "subscribedAt", type: "date", required: true, defaultValue: () => new Date().toISOString() },
    { name: "unsubscribedAt", type: "date" },
  ],
};
