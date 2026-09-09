"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ToolCard from "./ToolCard";
import AdSlot from "./AdSlot";
import { CATEGORIES, TOOLS, type Tool, type ToolCategory } from "@/lib/tools";
import { useSite } from "@/lib/site-config";

const RECENT_KEY = "toolboxvn:recent";
const USAGE_KEY = "toolboxvn:usage";

function getRecent(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"); } catch { return []; }
}

function getUsage(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(USAGE_KEY) || "{}"); } catch { return {}; }
}

const TRENDING = [
  "tinh-bmi", "tao-ma-qr", "json-formatter", "ma-hoa-base64",
  "tao-mat-khau", "dem-tu", "tinh-phan-tram", "may-tinh",
  "doi-tien-te", "luong-gross-net", "tinh-diem-gpa", "tinh-tuoi",
];

function Sidebar({ active, onSelect }: { active: string; onSelect: (c: string) => void }) {
  return (
    <nav className="hidden w-48 shrink-0 lg:block">
      <div className="sticky top-20 space-y-0.5">
        <button
          onClick={() => onSelect("")}
          className={`cat-item w-full rounded-xl px-3 py-2 text-left text-sm font-medium ${!active ? "active" : "text-slate-600 dark:text-slate-400"}`}
        >
          Tất cả
        </button>
        <div className="my-2 h-px bg-slate-200 dark:bg-slate-800" />
        {CATEGORIES.map((c) => (
          <button
            key={c.name}
            onClick={() => onSelect(c.name === active ? "" : c.name)}
            className={`cat-item w-full rounded-xl px-3 py-2 text-left text-sm ${c.name === active ? "active" : "text-slate-600 dark:text-slate-400"}`}
          >
            <span className="mr-2">{c.icon}</span>{c.name}
          </button>
        ))}
      </div>
    </nav>
  );
}

function MobileCatBar({ active, onSelect }: { active: string; onSelect: (c: string) => void }) {
  return (
    <div className="scroll-x flex gap-1.5 pb-2 lg:hidden">
      <button
        onClick={() => onSelect("")}
        className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition ${!active ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"}`}
      >
        Tất cả
      </button>
      {CATEGORIES.map((c) => (
        <button
          key={c.name}
          onClick={() => onSelect(c.name === active ? "" : c.name)}
          className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition ${c.name === active ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"}`}
        >
          {c.icon} {c.name}
        </button>
      ))}
    </div>
  );
}

export default function HomeClient({ q0 = "", cat0 = "" }: { q0?: string; cat0?: string }) {
  const [q, setQ] = useState(q0);
  const [cat, setCat] = useState(cat0);
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);
  const [usage, setUsage] = useState<Record<string, number>>({});
  const { enabledTools } = useSite();

  useEffect(() => {
    setRecentSlugs(getRecent());
    setUsage(getUsage());
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return enabledTools.filter((t) => {
      if (cat && t.category !== cat) return false;
      if (!s) return true;
      return (
        t.name.toLowerCase().includes(s) ||
        t.description.toLowerCase().includes(s) ||
        t.keywords.some((k) => k.toLowerCase().includes(s))
      );
    });
  }, [q, cat, enabledTools]);

  const grouped = useMemo(() => {
    if (cat || q.trim()) return null;
    const m = new Map<string, Tool[]>();
    for (const t of filtered) {
      if (!m.has(t.category)) m.set(t.category, []);
      m.get(t.category)!.push(t);
    }
    return [...m.entries()];
  }, [filtered, cat, q]);

  const recentTools = useMemo(
    () => recentSlugs.map((s) => enabledTools.find((t) => t.slug === s)).filter(Boolean) as Tool[],
    [recentSlugs, enabledTools]
  );

  const trendingTools = useMemo(
    () => TRENDING.map((s) => enabledTools.find((t) => t.slug === s)).filter(Boolean) as Tool[],
    [enabledTools]
  );

  const mostUsedTools = useMemo(() => {
    const entries = Object.entries(usage).sort((a, b) => b[1] - a[1]).slice(0, 8);
    return entries.map(([slug, count]) => {
      const tool = enabledTools.find((t) => t.slug === slug);
      return tool ? { tool, count } : null;
    }).filter(Boolean) as { tool: Tool; count: number }[];
  }, [usage, enabledTools]);

  const isSearching = q.trim() || cat;

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden py-12 text-center sm:py-16">
        {/* Glow background */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[300px] w-[500px] rounded-full bg-blue-500/10 blur-[100px] animate-glow dark:bg-blue-400/5" />
        </div>
        <div className="relative">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
            Mọi công cụ bạn cần.
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">Nhanh. Miễn phí.</span>
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-slate-500 dark:text-slate-400">
            Không cần đăng nhập. Chạy 100% trên trình duyệt.
          </p>

          {/* Big search */}
          <div className="mx-auto mt-6 flex max-w-xl items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 shadow-lg shadow-slate-200/50 transition focus-within:border-blue-400 focus-within:shadow-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:shadow-none dark:focus-within:border-blue-500">
            <svg className="h-5 w-5 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={`Tìm trong ${enabledTools.length} công cụ...`}
              className="h-12 w-full bg-transparent text-sm text-slate-900 outline-none dark:text-slate-100"
              aria-label="Tìm công cụ"
            />
            {q && (
              <button onClick={() => setQ("")} className="shrink-0 rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold text-slate-500 dark:bg-slate-800">Xoá</button>
            )}
          </div>

          {/* Stats */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs text-slate-400 dark:text-slate-500">
            <span>100+ Tools</span>
            <span>⚡ Instant</span>
            <span>🔒 Private</span>
            <span>💯 Free</span>
          </div>
        </div>
      </section>

      {/* Mobile category bar */}
      <MobileCatBar active={cat} onSelect={setCat} />

      <div className="flex gap-8">
        {/* Sidebar */}
        <Sidebar active={cat} onSelect={setCat} />

        {/* Main content */}
        <div className="min-w-0 flex-1">
          {/* Recently used */}
          {!isSearching && recentTools.length > 0 && (
            <section className="mb-8 animate-fade-in">
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Tiếp tục sử dụng</h2>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {recentTools.map((t, i) => (
                  <ToolCard key={t.slug} tool={t} index={i} />
                ))}
              </div>
            </section>
          )}

          {/* Most used */}
          {!isSearching && mostUsedTools.length > 0 && (
            <section className="mb-8 animate-fade-in">
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">📊 Nhiều người dùng</h2>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {mostUsedTools.map(({ tool, count }, i) => (
                  <div key={tool.slug} className="tool-card group relative flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/50" style={{ animationDelay: `${i * 30}ms` }}>
                    <Link href={`/cong-cu/${tool.slug}`} className="absolute inset-0 z-0" />
                    <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-2xl transition group-hover:scale-110 group-hover:bg-blue-100 dark:bg-blue-900/20 dark:group-hover:bg-blue-900/30">{tool.icon}</span>
                    <div className="relative z-10 min-w-0 flex-1">
                      <h3 className="truncate text-sm font-bold text-slate-900 group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400">{tool.name}</h3>
                      <p className="mt-0.5 line-clamp-1 text-xs text-slate-500 dark:text-slate-400">{tool.description}</p>
                    </div>
                    <span className="relative z-10 shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">{count}×</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Search results */}
          {isSearching ? (
            <section className="animate-fade-in">
              <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">
                Tìm thấy <b className="text-slate-900 dark:text-slate-100">{filtered.length}</b> công cụ {q && <>cho &ldquo;{q}&rdquo;</>} {cat && <>• {cat}</>}
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {filtered.map((t, i) => (
                  <ToolCard key={t.slug} tool={t} index={i} />
                ))}
              </div>
              {filtered.length === 0 && (
                <div className="rounded-2xl border border-dashed p-10 text-center text-slate-400">
                  Không tìm thấy. Thử &ldquo;qr&rdquo;, &ldquo;bmi&rdquo;, &ldquo;json&rdquo;...
                </div>
              )}
            </section>
          ) : (
            <>
              {/* Trending */}
              <section className="mb-8 animate-fade-in">
                <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">🔥 Phổ biến</h2>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {trendingTools.map((t, i) => (
                    <ToolCard key={t.slug} tool={t} index={i} />
                  ))}
                </div>
              </section>

              <AdSlot zone="in-content" />

              {/* Categories */}
              {grouped?.map(([cname, tools]) => {
                const meta = CATEGORIES.find((c) => c.name === cname);
                return (
                  <section key={cname} className="mb-8 animate-fade-in">
                    <h2 className="mb-1 text-base font-extrabold">{meta?.icon} {cname} <span className="ml-1 text-xs font-medium text-slate-400">({tools.length})</span></h2>
                    <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">{meta?.desc}</p>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {tools.map((t, i) => (
                        <ToolCard key={t.slug} tool={t} index={i} />
                      ))}
                    </div>
                  </section>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
