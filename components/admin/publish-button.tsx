"use client";

import { useState } from "react";
import { Button, useField, useForm } from "@payloadcms/ui";
import { siteConfig } from "@/site.config";

const ARTICLES_LIST = "/admin/collections/articles";

/**
 * One-click publish for the article edit view.
 *
 * Saving with the Status select alone is two steps and easy to half-do (change
 * the select, forget to Save). This sets status and saves in one action, then
 * returns to the Articles list so the next draft in the queue can be reviewed
 * without navigating back by hand.
 */
export function PublishButton() {
  const { submit } = useForm();
  const { value: status } = useField<string>({ path: "status" });
  const { value: slug } = useField<string>({ path: "slug" });
  const [busy, setBusy] = useState(false);

  const articleUrl = slug ? `${siteConfig.url}/article/${slug}` : null;

  async function publish() {
    setBusy(true);
    try {
      // Pass status via overrides rather than setValue-then-submit: the field
      // update is async, so submitting straight after can send stale state.
      await submit({ overrides: { status: "published" } });

      // Full navigation, not a router push: the list is server-rendered and a
      // client transition can show the row with its pre-publish status.
      window.location.href = ARTICLES_LIST;
    } catch {
      // submit() surfaces its own validation errors in the form UI; just
      // release the button so the field can be corrected and retried.
      setBusy(false);
    }
  }

  if (status === "published") {
    return (
      <div style={{ marginBottom: "1rem" }}>
        <Button el="link" to={articleUrl ?? "#"} newTab buttonStyle="secondary" size="medium">
          View live article
        </Button>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: "1rem" }}>
      <Button onClick={publish} disabled={busy} buttonStyle="primary" size="medium">
        {busy ? "Publishing…" : "Publish now"}
      </Button>
      <p style={{ fontSize: "0.75rem", opacity: 0.6, marginTop: "0.4rem" }}>
        Saves, sets status to Published, and returns to the Articles list.
      </p>
    </div>
  );
}

export default PublishButton;
