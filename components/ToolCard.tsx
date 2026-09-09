"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Tool } from "@/lib/tools";

const FAV_KEY = "toolboxvn:favorites";

function getFavs(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(FAV_KEY) || "[]"); } catch { return []; }
}

export default function ToolCard({ tool, index = 0 }: { tool: Tool; index?: number }) {
  const [favs, setFavs] = useState<string[]>([]);

  useEffect(() => { setFavs(getFavs()); }, []);

  const isFav = favs.includes(tool.slug);
  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = isFav ? favs.filter((s) => s !== tool.slug) : [...favs, tool.slug];
    localStorage.setItem(FAV_KEY, JSON.stringify(next));
    setFavs([...next]);
  };

  return (
    <Link
      href={`/cong-cu/${tool.slug}`}
      className="tool-card group relative flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/50"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-2xl transition group-hover:scale-110 group-hover:bg-blue-50 dark:bg-slate-800 dark:group-hover:bg-blue-900/30">
        {tool.icon}
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-bold text-slate-900 group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400">{tool.name}</h3>
        <p className="mt-0.5 line-clamp-1 text-xs text-slate-500 dark:text-slate-400">{tool.description}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          onClick={toggle}
          className="text-sm opacity-30 transition hover:opacity-100"
          title={isFav ? "Bỏ yêu thích" : "Yêu thích"}
        >
          {isFav ? "⭐" : "☆"}
        </button>
        <svg className="tool-arrow h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </div>
    </Link>
  );
}
