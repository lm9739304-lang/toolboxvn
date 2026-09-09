"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Tool } from "@/lib/tools";
import { getToolDisplay } from "@/lib/tools";
import Icon from "./Icon";
import { useLang } from "@/lib/language-context";

const FAV_KEY = "toolboxvn:favorites";

export default function ToolCard({ tool, featured = false }: { tool: Tool; featured?: boolean }) {
  const [favs, setFavs] = useState<string[]>([]);
  const initRef = useRef(false);
  const { lang, t } = useLang();
  const display = getToolDisplay(tool, lang);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    try { setFavs(JSON.parse(localStorage.getItem(FAV_KEY) || "[]")); } catch {}
  }, []);

  const isFav = favs.includes(tool.slug);
  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = isFav ? favs.filter((s) => s !== tool.slug) : [...favs, tool.slug];
    localStorage.setItem(FAV_KEY, JSON.stringify(next));
    setFavs([...next]);
  };

  if (featured) {
    return (
      <Link href={`/cong-cu/${tool.slug}`} className="tool-featured group">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-[var(--bg-recessed)] text-[var(--fg-muted)] tg group-hover:text-[var(--accent)]">
          <Icon name={tool.icon} className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-[13px] font-semibold text-[var(--fg)]">{display.name}</h3>
          <p className="mt-0.5 truncate text-[12px] text-[var(--fg-secondary)]">{display.description}</p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <button onClick={toggle} className="text-[var(--fg-muted)] opacity-30 tg hover:opacity-100" title={isFav ? t("unfavorite") : t("favorite")}>
            {isFav ? (
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
            ) : (
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
            )}
          </button>
          <svg className="tool-arrow h-3.5 w-3.5 text-[var(--fg-muted)]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/cong-cu/${tool.slug}`} className="tool-row group">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[7px] bg-[var(--bg-recessed)] text-[var(--fg-muted)] tg group-hover:text-[var(--accent)]">
        <Icon name={tool.icon} className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-[13px] font-medium text-[var(--fg)]">{display.name}</h3>
        <p className="truncate text-[11px] text-[var(--fg-muted)]">{display.description}</p>
      </div>
      <button onClick={toggle} className="shrink-0 text-[var(--fg-muted)] opacity-0 group-hover:opacity-40 tg-fast hover:!opacity-100" title={isFav ? t("unfavorite") : t("favorite")}>
        {isFav ? (
          <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
        ) : (
          <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
        )}
      </button>
    </Link>
  );
}
