/**
 * Uploads a batch's cover files into Payload so they do not need a deploy.
 *
 *   npx tsx --env-file=.env.local scripts/attach-covers.ts scripts/draft-long-157.ts
 *
 * Covers normally live at public/covers/NAME.jpg and reach the site through
 * a Vercel build, because that is how a batch drafted on this machine gets
 * deployed. An unattended run has no way to deploy: the site is pushed with
 * the Vercel CLI from the author's own machine, and the author publishes
 * from a phone. A cover committed by a robot would therefore 404 on every
 * article it drafted.
 *
 * Payload already has the answer. The media collection stores uploads in
 * Vercel Blob rather than in the build, and Articles.coverImage takes
 * precedence over coverImageUrl. So this reads the file the draft script
 * already pointed at, uploads it as a media document, and sets coverImage
 * on the article. The cover is then live the moment the article is
 * published, with no build in between.
 *
 * Additive on purpose. The draft scripts are unchanged, coverImageUrl stays
 * where it is as the fallback, and a batch that never runs this behaves
 * exactly as every batch before it did.
 *
 * Needs BLOB_READ_WRITE_TOKEN as well as DATABASE_URI and PAYLOAD_SECRET.
 * Without the blob token Payload falls back to its disk adapter, which on a
 * runner means the upload is written to a directory that disappears, so
 * this refuses to run rather than appearing to succeed.
 */
import fs from "node:fs/promises";
import path from "node:path";

type LooseDraft = {
  slug: string;
  title: string;
  excerpt: string;
  coverImageUrl?: string;
  coverAlt?: string;
};

const target = process.argv[2];

if (!target) {
  console.error("usage: attach-covers.ts scripts/draft-long-NNN.ts");
  process.exit(1);
}

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error(
    "BLOB_READ_WRITE_TOKEN is not set. Without it Payload writes uploads to a\n" +
      "local directory that does not survive, and the covers would be lost\n" +
      "silently. Copy the token from the Vercel project's environment.",
  );
  process.exit(1);
}

const modulePath = path.resolve(target);
const mod: { drafts?: LooseDraft[] } = await import(`file://${modulePath}`);
const drafts = mod.drafts;

if (!Array.isArray(drafts) || drafts.length === 0) {
  console.error(`${target} does not export a drafts array.`);
  process.exit(1);
}

const { getPayload } = await import("payload");
const { default: config } = await import("@payload-config");
const payload = await getPayload({ config });

let attached = 0;
let skipped = 0;

for (const draft of drafts) {
  const found = await payload.find({
    collection: "articles",
    where: { slug: { equals: draft.slug } },
    limit: 1,
    depth: 0,
    select: { coverImage: true, status: true },
  });

  const article = found.docs[0];

  if (!article) {
    console.log(`no such article, skipped: ${draft.slug}`);
    skipped += 1;
    continue;
  }

  // An article that already carries an upload has been dealt with, either by
  // an earlier run of this script or by hand in the admin. Re-uploading would
  // orphan a blob and change a cover somebody may have chosen deliberately.
  if (article.coverImage) {
    console.log(`already has an upload, skipped: ${draft.slug}`);
    skipped += 1;
    continue;
  }

  if (!draft.coverImageUrl) {
    console.log(`no coverImageUrl, skipped: ${draft.slug}`);
    skipped += 1;
    continue;
  }

  // coverImageUrl is a site-absolute path such as /covers/name.jpg, which
  // maps onto public/covers/name.jpg on disk.
  const filePath = path.join(process.cwd(), "public", draft.coverImageUrl.replace(/^\//, ""));

  let data: Buffer;
  try {
    data = await fs.readFile(filePath);
  } catch {
    console.log(`cover file missing, skipped: ${draft.slug} (${filePath})`);
    skipped += 1;
    continue;
  }

  const media = await payload.create({
    collection: "media",
    // alt is required on the media collection, because a cover with no alt
    // text is a hole in the page for anyone using a screen reader.
    data: { alt: draft.coverAlt ?? draft.title },
    file: {
      data,
      name: path.basename(filePath),
      mimetype: "image/jpeg",
      size: data.byteLength,
    },
  });

  await payload.update({
    collection: "articles",
    id: article.id,
    data: { coverImage: media.id },
  });

  console.log(`attached: ${draft.slug} (media ${media.id}, ${Math.round(data.byteLength / 1024)} kB)`);
  attached += 1;
}

console.log(`\n${attached} attached, ${skipped} skipped.`);

await new Promise((resolve) => setTimeout(resolve, 3000));
process.exit(0);
