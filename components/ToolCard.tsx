"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Tool } from "@/lib/tools";

const FAV_KEY = "toolboxvn:favorites";

function getFavs(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(FAV_KEY) || "[]"); } catch { return []; }
}

export default function ToolCard({ tool }: { tool: Tool }) {
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
      className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-500 dark:hover:shadow-blue-900/30"
    >
      <button
        onClick={toggle}
        className="absolute right-2 top-2 z-10 text-sm opacity-40 transition hover:opacity-100"
        title={isFav ? "Bỏ yêu thích" : "Yêu thích"}
      >
        {isFav ? "⭐" : "☆"}
      </button>
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-2xl transition group-hover:bg-blue-50 dark:bg-slate-700 dark:group-hover:bg-blue-900/40">
          {tool.icon}
        </span>
        <div className="min-w-0">
          <h3 className="truncate font-bold text-[15px] text-slate-900 group-hover:text-blue-700 dark:text-slate-100 dark:group-hover:text-blue-400">{tool.name}</h3>
          <span className="inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500 dark:bg-slate-700 dark:text-slate-400">
            {tool.category}
          </span>
        </div>
      </div>
      <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-slate-600 dark:text-slate-400">{tool.description}</p>
    </Link>
  );
}
