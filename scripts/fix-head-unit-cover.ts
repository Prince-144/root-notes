/**
 * Cover swap for a published article.
 *
 * /article/dofun-head-unit-malware-twcore-updater-moyu-badbox is a story about
 * malware on DoFun-powered Android head units. Kaspersky names no vehicle
 * manufacturer and neither does the article. The cover image currently shows a
 * steering wheel with "Taycan" legible on it, which tells a reader Porsche is
 * involved. Nothing supports that.
 *
 * Swaps in a neutral night-driving image. Also applies the paragraph change
 * that was written for the draft and never landed, because the article was
 * published first: the section carrying the headline claim had no standalone
 * figure, so the Instagram carousel skipped it and the cover's claim went
 * unexplained across every slide.
 *
 * publishedAt is preserved by the beforeChange hook. Dry run by default;
 * pass --apply to write.
 */
import { getPayload } from "payload";
import config from "@payload-config";

const APPLY = process.argv.includes("--apply");
const SLUG = "dofun-head-unit-malware-twcore-updater-moyu-badbox";
const P = "?w=1600&h=900&fit=crop&crop=entropy&q=80";
const NEW_COVER = `https://images.unsplash.com/photo-1699205269431-1ab18afabac6${P}`;

const OLD_PARA = `The **TWCore** system app — **com.tw.core** — has a legitimate software update mechanism that pulls APK files using an **MQTT** message broker at **cardoor[.]cn**. A dropper Kaspersky calls **JarService** rides that channel.

This is the update path the head unit is built to trust. There is no user prompt to ignore, no sideloading to warn about, no permission dialog. The device asked for software, and software arrived, through the mechanism its manufacturer built.`;

const NEW_PARA = `The **TWCore** system app — **com.tw.core** — has a legitimate update mechanism that pulls APK files through an **MQTT** message broker at **cardoor[.]cn**, and a dropper Kaspersky calls **JarService** rides it. This is the path the head unit is built to trust: no user prompt to ignore, no sideloading to warn about, no permission dialog. Researchers counted **7** variants going back to version **3.57**, so it has been carrying payloads for a while.`;

const OLD_CHECKIN = `It checks for configuration updates every **90 minutes** by HTTP POST to its command servers. Researchers identified **7** variants by version number, going back to version **3.57**, which is the detail that says this is not new — a version numbered 3.57 has a history behind it.`;

const NEW_CHECKIN = `It checks for configuration updates every **90 minutes** by HTTP POST to its command servers, which is frequent enough to retask the fleet within a working day and quiet enough that nobody looking at a data bill would notice it.`;

const payload = await getPayload({ config });
const { docs } = await payload.find({
  collection: "articles", where: { slug: { equals: SLUG } }, limit: 1, depth: 0,
});
const doc = docs[0];
if (!doc) {
  console.error(`no article with slug "${SLUG}"`);
  process.exit(1);
}

let body = doc.body;
const changes: string[] = [];

if (doc.coverImageUrl !== NEW_COVER) {
  changes.push(`cover: ${(doc.coverImageUrl ?? "").slice(0, 60)}...\n    -> ${NEW_COVER.slice(0, 60)}...`);
}
if (body.includes(OLD_PARA)) {
  body = body.replace(OLD_PARA, NEW_PARA);
  changes.push("delivery section: two paragraphs merged, variant count moved in so it carries a figure");
}
if (body.includes(OLD_CHECKIN)) {
  body = body.replace(OLD_CHECKIN, NEW_CHECKIN);
  changes.push("check-in paragraph: reworded now the variant count lives above it");
}

if (changes.length === 0) {
  console.log("nothing to change — already applied, or the body has moved on");
  process.exit(0);
}

console.log(`status: ${doc.status}\n`);
for (const c of changes) console.log(`  - ${c}`);

if (!APPLY) {
  console.log("\ndry run — pass --apply to write this to the live article");
  process.exit(0);
}

await payload.update({
  collection: "articles",
  id: doc.id,
  data: { coverImageUrl: NEW_COVER, body },
});
console.log("\napplied. regenerate the carousel, then redeploy.");
process.exit(0);
