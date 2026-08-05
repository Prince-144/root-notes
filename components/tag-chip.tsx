import { getCategory } from "@/site.config";

export function CategoryChip({ slug }: { slug: string }) {
  const category = getCategory(slug);
  return (
    <span className="tag-chip" style={{ color: category.color }}>
      {category.name}
    </span>
  );
}

export function MetaChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-2xs tracking-widest text-fg-subtle">{children}</span>
  );
}
