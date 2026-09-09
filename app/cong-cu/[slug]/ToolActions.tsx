"use client";

import { useEffect, useRef, useState } from "react";

const FAV_KEY = "toolboxvn:favorites";
const RECENT_KEY = "toolboxvn:recent";

function getFavs(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(FAV_KEY) || "[]"); } catch { return []; }
}

function addRecent(slug: string) {
  if (typeof window === "undefined") return;
  try {
    const recents: string[] = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
    const next = [slug, ...recents.filter((s: string) => s !== slug)].slice(0, 6);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {}
}

export default function ToolActions({ slug }: { slug: string }) {
  const [favs, setFavs] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;
    setFavs(getFavs());
    addRecent(slug);
  }, [slug]);

  const isFav = favs.includes(slug);
  const toggleFav = () => {
    const next = isFav ? favs.filter((s) => s !== slug) : [...favs, slug];
    localStorage.setItem(FAV_KEY, JSON.stringify(next));
    setFavs([...next]);
  };

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try { await navigator.share({ title: document.title, url }); } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
      <button
        onClick={toggleFav}
        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${isFav ? "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400" : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"}`}
      >
        {isFav ? "⭐" : "☆"} Yêu thích
      </button>
      <button
        onClick={share}
        className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
      >
        🔗 {copied ? "Đã copy!" : "Chia sẻ"}
      </button>
    </div>
  );
}
