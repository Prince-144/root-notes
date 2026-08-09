import path from "path";
import { fileURLToPath } from "url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { buildConfig } from "payload";
import sharp from "sharp";
import { Articles } from "./collections/Articles";
import { Media } from "./collections/Media";
import { Subscribers } from "./collections/Subscribers";
import { Users } from "./collections/Users";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  collections: [Users, Articles, Media, Subscribers],
  editor: lexicalEditor(),
  // Required for Media's imageSizes — without it Payload stores the original
  // only, and the 1600x900 derivative the cards expect is never generated.
  sharp,
  plugins: [
    // Uploads go to Vercel Blob rather than disk: Vercel's filesystem is
    // ephemeral and read-only outside /tmp, so the default disk adapter
    // would work in dev and silently lose every upload in production.
    // Disabled without a token so local dev and CI still boot — uploading
    // is what breaks then, not the whole app.
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { [Media.slug]: true },
      token: process.env.BLOB_READ_WRITE_TOKEN ?? "",
    }),
  ],
  secret: process.env.PAYLOAD_SECRET ?? "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI ?? "",
    },
    // Schema is applied via `payload migrate`, not auto-pushed on every dev
    // reload — push mode was re-diffing the whole schema against Neon on
    // every Payload re-init, which is what made refreshes so slow.
    push: false,
  }),
});
