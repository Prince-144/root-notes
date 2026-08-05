import { ImageResponse } from "next/og";
import { getArticles, getBySlug } from "@/lib/articles";
import { siteConfig } from "@/site.config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CATEGORY_COLORS: Record<string, string> = {
  security: "#7f9cf5",
  ai: "#9b8ff5",
  startups: "#5ddba0",
  gadgets: "#f0b453",
  world: "#56d4dd",
};

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export default async function ArticleOpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getBySlug(slug);
  const accent = article ? (CATEGORY_COLORS[article.categorySlug] ?? "#3b7dff") : "#3b7dff";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0d111a",
          color: "#f2f5f9",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 26,
            color: accent,
            textTransform: "uppercase",
            letterSpacing: 6,
          }}
        >
          {article?.categorySlug ?? siteConfig.shortName.toLowerCase()}
        </div>
        <div style={{ display: "flex", fontSize: 58, fontWeight: 700, lineHeight: 1.2 }}>
          {article?.title ?? siteConfig.name}
        </div>
        <div style={{ display: "flex", fontSize: 26, opacity: 0.6 }}>
          {siteConfig.name}
          {article ? ` · ${article.author}` : ""}
        </div>
      </div>
    ),
    { ...size },
  );
}
