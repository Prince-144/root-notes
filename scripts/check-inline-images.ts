/**
 * Renders inline-image markdown through the real article components and checks
 * the HTML that comes out.
 *
 * The thing worth testing is structural, not visual: markdown wraps a lone
 * image in a paragraph, and a <figure> inside a <p> is invalid HTML that React
 * reports as a hydration error. components/mdx-components.tsx builds the
 * figure from the paragraph instead, and that only works while MDX keeps
 * handing the image element to the `p` component — a detail no type check can
 * hold in place.
 *
 * Needs no database, unlike check-mdx.ts.
 *
 *   npx tsx scripts/check-inline-images.ts
 */
import { evaluate } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import * as runtime from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { articleMdxComponents } from "@/components/mdx-components";

async function render(source: string): Promise<string> {
  const { default: Content } = await evaluate(source, {
    ...(runtime as Parameters<typeof evaluate>[1]),
    remarkPlugins: [remarkGfm],
  });
  return renderToStaticMarkup(
    createElement(Content, { components: articleMdxComponents }),
  );
}

type Case = { name: string; source: string; expect: (html: string) => string | null };

const CASES: Case[] = [
  {
    name: "image alone becomes a figure, not a paragraph",
    source: `![A router rack](/api/media/file/rack.png)`,
    expect: (html) =>
      html.includes("<figure>") && !html.includes("<p>")
        ? null
        : `expected a figure and no paragraph, got: ${html}`,
  },
  {
    name: "figure is never nested inside a paragraph",
    source: `![A router rack](/api/media/file/rack.png)`,
    expect: (html) => (/<p>[^]*<figure>/.test(html) ? `figure inside p: ${html}` : null),
  },
  {
    name: "quoted title becomes the caption",
    source: `![A router rack](/api/media/file/rack.png "CERT Polska's lab")`,
    expect: (html) =>
      html.includes("<figcaption>") && html.includes("CERT Polska")
        ? null
        : `expected a figcaption carrying the title, got: ${html}`,
  },
  {
    name: "no title means no empty caption",
    source: `![A router rack](/api/media/file/rack.png)`,
    expect: (html) => (html.includes("figcaption") ? `unexpected caption: ${html}` : null),
  },
  {
    name: "image inside a sentence stays inline in the paragraph",
    source: `The panel ![icon](/api/media/file/i.png) sits in the corner.`,
    expect: (html) =>
      html.startsWith("<p>") && html.includes("<img") && !html.includes("<figure>")
        ? null
        : `expected an inline image inside a paragraph, got: ${html}`,
  },
  {
    name: "images are lazy so a body full of them does not block the article",
    source: `![A router rack](/api/media/file/rack.png)`,
    expect: (html) =>
      html.includes('loading="lazy"') ? null : `expected lazy loading, got: ${html}`,
  },
  {
    name: "ordinary prose still renders as a paragraph",
    source: `Check Point disclosed two critical flaws.`,
    expect: (html) =>
      html.startsWith("<p>") && html.includes("Check Point")
        ? null
        : `expected a plain paragraph, got: ${html}`,
  },
];

let failed = 0;
for (const testCase of CASES) {
  const problem = testCase.expect(await render(testCase.source));
  if (problem) {
    failed += 1;
    console.log(`FAIL  ${testCase.name}\n      ${problem}`);
  } else {
    console.log(`ok    ${testCase.name}`);
  }
}

console.log(failed === 0 ? `\nall ${CASES.length} checks pass` : `\n${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
