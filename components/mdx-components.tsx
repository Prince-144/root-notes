import { Children, isValidElement, type ComponentProps } from "react";

/**
 * Components the article body's MDX renders with.
 *
 * Inline images are written as plain markdown — `![alt](url "Caption")` — so
 * bodies keep the house rule of no angle brackets. Markdown puts a lone image
 * inside a paragraph, and a <figure> inside a <p> is invalid HTML that React
 * reports as a hydration error, so the figure is built by the paragraph
 * component when an image is its only child. An image that sits within a
 * sentence stays a plain inline <img>.
 *
 * A plain <img> rather than next/image: body images have no known dimensions,
 * and next/image needs them or a fixed-aspect box, which would crop a
 * screenshot or letterbox a diagram. Optimisation is off site-wide anyway
 * (next.config.ts), so next/image would add nothing here.
 */
function ArticleImage({ alt, ...props }: ComponentProps<"img">) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...props} alt={alt ?? ""} loading="lazy" decoding="async" />;
}

function Paragraph({ children, ...props }: ComponentProps<"p">) {
  const content = Children.toArray(children).filter(
    (child) => !(typeof child === "string" && child.trim() === ""),
  );
  const only = content.length === 1 ? content[0] : null;

  if (isValidElement<ComponentProps<"img">>(only) && only.type === ArticleImage) {
    const { src, alt, title } = only.props;
    return (
      <figure>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt ?? ""} loading="lazy" decoding="async" />
        {title ? <figcaption>{title}</figcaption> : null}
      </figure>
    );
  }

  return <p {...props}>{children}</p>;
}

export const articleMdxComponents = { img: ArticleImage, p: Paragraph };
