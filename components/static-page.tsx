import type { ReactNode } from "react";
import { Prompt, TerminalWindow } from "@/components/terminal-window";
import { BackButton } from "@/components/back-button";

export function StaticPage({
  promptCmd,
  title,
  children,
}: {
  promptCmd: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="container-page py-10 sm:py-14">
      <div className="mb-4">
        <BackButton />
      </div>
      <TerminalWindow title={title}>
        <Prompt>{promptCmd}</Prompt>
      </TerminalWindow>
      <article className="article-body mx-auto mt-10 max-w-content">{children}</article>
    </div>
  );
}
