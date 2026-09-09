"use client";

import { useLang } from "@/lib/language-context";
import { getToolDisplay } from "@/lib/tools";
import type { Tool } from "@/lib/tools";

export default function ToolHeader({ tool }: { tool: Tool }) {
  const { lang } = useLang();
  const display = getToolDisplay(tool, lang);
  return (
    <header>
      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--fg-muted)]">
        {tool.category}
      </p>
      <h1 className="mt-2 max-w-2xl text-[clamp(1.7rem,4.5vw,2.5rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-[var(--fg)]">
        {display.name}
      </h1>
      <p className="mt-2.5 max-w-xl text-[14px] leading-relaxed text-[var(--fg-secondary)]">
        {display.description}
      </p>
    </header>
  );
}
