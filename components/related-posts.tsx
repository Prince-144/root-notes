import { ArticleRow } from "@/components/article-card";
import type { Article } from "@/lib/article-types";

export function RelatedPosts({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null;

  return (
    <section className="mt-16 border-t border-line pt-10">
      <h2 className="label-mono">Related</h2>
      <div className="mt-6">
        {articles.map((article) => (
          <ArticleRow key={article.slug} article={article} />
        ))}
      </div>
    </section>
  );
}
