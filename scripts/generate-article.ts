/**
 * Entry point for the scheduled article generator (see
 * .github/workflows/generate-articles.yml).
 *
 * This runs in GitHub Actions rather than behind the Vercel cron route because
 * a research run takes minutes — measured at 138s and 364s on two sample runs —
 * and Vercel's Hobby plan caps a function at 60s. The API route still exists
 * for manual one-off triggers, but the schedule drives this script.
 */
import { generateAndSaveDraft } from "@/lib/article-generator";

async function main() {
  const started = Date.now();
  const slug = await generateAndSaveDraft();
  const seconds = ((Date.now() - started) / 1000).toFixed(1);

  if (slug) {
    console.log(`Drafted "${slug}" in ${seconds}s`);
    process.exit(0);
  }

  // Finding no publishable story is a valid outcome, not a failure — the model
  // is told to decline rather than pad a thin story into an article.
  console.log(`No draft produced (${seconds}s)`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
