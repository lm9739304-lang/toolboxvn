"use client";

import Icon from "@/components/Icon";
import { useLang } from "@/lib/language-context";
import { getToolDisplay } from "@/lib/tools";
import type { Tool } from "@/lib/tools";

export default function ToolHeader({ tool }: { tool: Tool }) {
  const { lang } = useLang();
  const display = getToolDisplay(tool, lang);
  return (
    <header>
      <div className="flex items-center gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[9px] bg-[var(--bg-recessed)] text-[var(--fg-muted)]">
          <Icon name={tool.icon} className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <h1 className="text-[20px] font-bold tracking-[-0.02em] sm:text-[24px]">{display.name}</h1>
          <p className="mt-0.5 text-[13px] text-[var(--fg-secondary)]">{display.description}</p>
        </div>
      </div>
    </header>
  );
}
