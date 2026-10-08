import type { CollectionConfig } from "payload";

export const Subscribers: CollectionConfig = {
  slug: "subscribers",
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "confirmed", "subscribedAt"],
  },
  access: {
    // Public write access stays fully closed — only the newsletter API
    // routes touch this, via the Local API, which bypasses these access
    // functions entirely. Read is admin-only (was `() => false` for
    // everyone, which also hid the subscriber list from the admin panel).
    read: ({ req: { user } }) => Boolean(user),
    create: () => false,
    update: () => false,
    // Delete is admin-only rather than closed, so test and bounced addresses
    // can be cleared out of the panel. It was `() => false`, which removed
    // the button from the admin UI as well as blocking the REST API.
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: "email", type: "email", required: true, unique: true, index: true },
    { name: "confirmed", type: "checkbox", defaultValue: false },
    { name: "confirmToken", type: "text", required: true, index: true },
    { name: "subscribedAt", type: "date", required: true, defaultValue: () => new Date().toISOString() },
    { name: "unsubscribedAt", type: "date" },
  ],
};
