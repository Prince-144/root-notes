import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: { useAsTitle: "email" },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    // Public create is allowed only while the collection is empty, so the
    // admin panel's "create first user" bootstrap still works — once an
    // admin exists, only an already-authenticated admin can create more.
    // Payload's default (no `access` block at all) is fully open create for
    // every request, always, which would let anyone self-register as admin.
    create: async ({ req }) => {
      if (req.user) return true;
      const { totalDocs } = await req.payload.count({ collection: "users" });
      return totalDocs === 0;
    },
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [],
};
