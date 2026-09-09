"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import ToolCard from "./ToolCard";
import AdSlot from "./AdSlot";
import { CATEGORIES, type Tool } from "@/lib/tools";
import { useSite } from "@/lib/site-config";

const RECENT_KEY = "toolboxvn:recent";
const USAGE_KEY = "toolboxvn:usage";

const FEATURED_SLUGS = [
  "tao-ma-qr", "json-formatter", "tinh-bmi", "tao-mat-khau",
  "dem-tu", "ma-hoa-base64", "may-tinh", "doi-tien-te",
];

const TRENDING = [
  "tinh-bmi", "tao-ma-qr", "json-formatter", "ma-hoa-base64",
  "tao-mat-khau", "dem-tu", "tinh-phan-tram", "may-tinh",
  "doi-tien-te", "luong-gross-net", "tinh-diem-gpa", "tinh-tuoi",
];

function Sidebar({ active, onSelect }: { active: string; onSelect: (c: string) => void }) {
  return (
    <nav className="hidden w-44 shrink-0 lg:block">
      <div className="sticky top-16 space-y-0.5">
        <button onClick={() => onSelect("")} className={`cat-link ${!active ? "active" : ""}`}>
          All tools
        </button>
        <div className="my-2 h-px bg-[var(--border-subtle)]" />
        {CATEGORIES.map((c) => (
          <button key={c.name} onClick={() => onSelect(c.name === active ? "" : c.name)} className={`cat-link ${c.name === active ? "active" : ""}`}>
            <span className="text-[var(--fg-muted)]">{c.icon}</span>
            {c.name}
          </button>
        ))}
      </div>
    </nav>
  );
}

function MobileCatBar({ active, onSelect }: { active: string; onSelect: (c: string) => void }) {
  return (
    <div className="scroll-x flex gap-1 pb-3 lg:hidden">
      <button onClick={() => onSelect("")} className={`shrink-0 rounded-md border px-2.5 py-1 text-[12px] font-medium transition-default ${!active ? "border-[var(--accent)] bg-[var(--accent-bg)] text-[var(--accent)]" : "border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--fg-secondary)]"}`}>
        All
      </button>
      {CATEGORIES.map((c) => (
        <button key={c.name} onClick={() => onSelect(c.name === active ? "" : c.name)} className={`shrink-0 rounded-md border px-2.5 py-1 text-[12px] font-medium transition-default ${c.name === active ? "border-[var(--accent)] bg-[var(--accent-bg)] text-[var(--accent)]" : "border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--fg-secondary)]"}`}>
          {c.name}
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

  const initRef = useRef(false);
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    try {
      setRecentSlugs(JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"));
      setUsage(JSON.parse(localStorage.getItem(USAGE_KEY) || "{}"));
    } catch {}
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

  const featuredTools = useMemo(
    () => FEATURED_SLUGS.map((s) => enabledTools.find((t) => t.slug === s)).filter(Boolean) as Tool[],
    [enabledTools]
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
    <div>
      {/* Hero — compact, text-forward */}
      <section className="pt-10 pb-8 sm:pt-14 sm:pb-10">
        <h1 className="text-[28px] font-bold tracking-tight text-[var(--fg)] sm:text-[36px]" style={{ lineHeight: 1.15 }}>
          100+ tools for
          <br />
          developers & creators.
        </h1>
        <p className="mt-3 max-w-md text-[14px] leading-relaxed text-[var(--fg-secondary)]">
          No login. No uploads. Everything runs in your browser.
        </p>

        <div className="mt-5 flex max-w-lg items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 transition-default focus-within:border-[var(--accent)]">
          <svg className="h-4 w-4 shrink-0 text-[var(--fg-muted)]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Search ${enabledTools.length} tools...`}
            className="h-10 w-full bg-transparent text-[14px] text-[var(--fg)] outline-none placeholder:text-[var(--fg-muted)]"
            aria-label="Search tools"
          />
          {q && (
            <button onClick={() => setQ("")} className="shrink-0 rounded bg-[var(--bg-recessed)] px-1.5 py-0.5 text-[11px] font-medium text-[var(--fg-muted)]">Clear</button>
          )}
        </div>

        <div className="mt-3 flex gap-4 text-[12px] text-[var(--fg-muted)]">
          <span>{enabledTools.length} tools</span>
          <span>Client-side</span>
          <span>Free forever</span>
        </div>
      </section>

      <MobileCatBar active={cat} onSelect={setCat} />

      <div className="flex gap-8">
        <Sidebar active={cat} onSelect={setCat} />

        <div className="min-w-0 flex-1">
          {/* Recently used */}
          {!isSearching && recentTools.length > 0 && (
            <section className="mb-8">
              <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--fg-muted)]">Continue</h2>
              <div className="space-y-1">
                {recentTools.slice(0, 4).map((t) => (
                  <ToolCard key={t.slug} tool={t} />
                ))}
              </div>
            </section>
          )}

          {/* Most used */}
          {!isSearching && mostUsedTools.length > 0 && (
            <section className="mb-8">
              <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--fg-muted)]">Most used</h2>
              <div className="space-y-1">
                {mostUsedTools.map(({ tool, count }) => (
                  <Link key={tool.slug} href={`/cong-cu/${tool.slug}`} className="tool-row group">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--bg-recessed)] text-base">{tool.icon}</span>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-[13px] font-medium text-[var(--fg)]">{tool.name}</h3>
                    </div>
                    <span className="shrink-0 rounded bg-[var(--bg-recessed)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--fg-muted)]">{count}x</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {isSearching ? (
            <section>
              <p className="mb-3 text-[13px] text-[var(--fg-secondary)]">
                {filtered.length} result{filtered.length !== 1 ? "s" : ""} {q && <>for &ldquo;{q}&rdquo;</>} {cat && <>in {cat}</>}
              </p>
              <div className="space-y-1">
                {filtered.map((t) => (
                  <ToolCard key={t.slug} tool={t} />
                ))}
              </div>
              {filtered.length === 0 && (
                <div className="rounded-lg border border-dashed border-[var(--border)] px-6 py-12 text-center text-[13px] text-[var(--fg-muted)]">
                  No tools found. Try &ldquo;qr&rdquo;, &ldquo;bmi&rdquo;, &ldquo;json&rdquo;...
                </div>
              )}
            </section>
          ) : (
            <>
              {/* Featured — large cards, 2-col grid */}
              <section className="mb-8">
                <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--fg-muted)]">Featured</h2>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {featuredTools.map((t) => (
                    <ToolCard key={t.slug} tool={t} featured />
                  ))}
                </div>
              </section>

              <AdSlot zone="in-content" />

              {/* Trending */}
              <section className="mb-8">
                <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--fg-muted)]">Trending</h2>
                <div className="space-y-1">
                  {trendingTools.map((t) => (
                    <ToolCard key={t.slug} tool={t} />
                  ))}
                </div>
              </section>

              {/* Categories */}
              {grouped?.map(([cname, tools]) => (
                  <section key={cname} className="mb-8">
                    <div className="mb-3 flex items-baseline gap-2">
                      <h2 className="text-[14px] font-semibold text-[var(--fg)]">{cname}</h2>
                      <span className="text-[11px] text-[var(--fg-muted)]">{tools.length} tools</span>
                    </div>
                    <div className="space-y-1">
                      {tools.map((t) => (
                        <ToolCard key={t.slug} tool={t} />
                      ))}
                    </div>
                  </section>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
