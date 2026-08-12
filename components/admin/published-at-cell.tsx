/**
 * Articles list cell for publishedAt.
 *
 * A draft's publishedAt is a placeholder — it holds whatever the row was
 * created with, and the real value is only stamped when the article is
 * published (see the beforeChange hook on the collection). Rendering that
 * placeholder as a date makes the list look like the draft has a publication
 * date, which is the one thing it does not have.
 */
import { siteConfig } from "@/site.config";

type CellProps = {
  cellData?: string | null;
  rowData?: { status?: string } | null;
};

export function PublishedAtCell({ cellData, rowData }: CellProps) {
  if (rowData?.status !== "published" || !cellData) {
    return <span style={{ opacity: 0.4 }}>—</span>;
  }

  const date = new Date(cellData);
  if (Number.isNaN(date.getTime())) return <span style={{ opacity: 0.4 }}>—</span>;

  // Pinned to the site's timezone. This renders on the server, which is UTC on
  // Vercel, so without it the list shows a time five and a half hours off.
  return (
    <span>
      {date.toLocaleString("en-GB", {
        timeZone: siteConfig.timeZone,
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })}
    </span>
  );
}

export default PublishedAtCell;
