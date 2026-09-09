"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/language-context";

const FAV_KEY = "toolboxvn:favorites";
const RECENT_KEY = "toolboxvn:recent";
const USAGE_KEY = "toolboxvn:usage";

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

function bumpUsage(slug: string) {
  if (typeof window === "undefined") return;
  try {
    const usage: Record<string, number> = JSON.parse(localStorage.getItem(USAGE_KEY) || "{}");
    usage[slug] = (usage[slug] || 0) + 1;
    localStorage.setItem(USAGE_KEY, JSON.stringify(usage));
  } catch {}
}

export default function ToolActions({ slug }: { slug: string }) {
  const [favs, setFavs] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const mounted = useRef(false);
  const { t } = useLang();

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;
    setFavs(getFavs());
    addRecent(slug);
    bumpUsage(slug);
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
    <div className="mt-3 flex items-center gap-2 border-t border-[var(--border-subtle)] pt-3">
      <button
        onClick={toggleFav}
        className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[12px] font-medium transition-default ${isFav ? "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-400" : "border-[var(--border)] bg-[var(--bg-recessed)] text-[var(--fg-secondary)] hover:bg-[var(--bg)]"}`}
      >
        {isFav ? (
          <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
        ) : (
          <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
        )}
        {isFav ? t("saved") : t("save")}
      </button>
      <button
        onClick={share}
        className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--bg-recessed)] px-2.5 py-1 text-[12px] font-medium text-[var(--fg-secondary)] transition-default hover:bg-[var(--bg)]"
      >
        <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.282-3.068a4.5 4.5 0 00-6.364 0l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>
        {copied ? t("copied") : t("share")}
      </button>
    </div>
  );
}
