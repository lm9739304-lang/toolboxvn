"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import AdSlot from "./AdSlot";
import { CATEGORIES, type Tool, getToolDisplay } from "@/lib/tools";
import { useSite } from "@/lib/site-config";
import Icon from "./Icon";
import ToolPreview from "./ToolPreview";
import { useLang } from "@/lib/language-context";
import { translations } from "@/lib/translations";

const RECENT_KEY = "toolboxvn:recent";
const USAGE_KEY = "toolboxvn:usage";

const FEATURED_TOOL = "nen-anh";

const FALLBACK_POPULAR = [
  "tao-ma-qr",
  "json-formatter",
  "nen-anh",
  "tao-mat-khau",
  "chon-mau",
  "dem-tu",
  "may-tinh",
  "ma-hoa-base64",
  "doi-tien-te",
  "tinh-bmi",
];

const CAT_KEY_MAP: Record<string, keyof typeof translations.en> = {
  "Văn bản": "catText",
  "Mã hoá & Dev": "catDev",
  "Màu sắc": "catColor",
  "Ngẫu nhiên": "catRandom",
  "Chuyển đổi": "catConvert",
  "Tài chính": "catFinance",
  "Sức khoẻ": "catHealth",
  "Thời gian": "catTime",
  "SEO & Marketing": "catSeo",
  "Hình ảnh": "catImage",
  "Tiện ích": "catUtility",
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function fireCmdK() {
  try {
    window.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true })
    );
  } catch {}
}

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          obs.unobserve(el);
        }
      },
      { threshold: 0.06, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useReveal();
  return (
    <div ref={ref} id={id} className={`reveal ${className}`}>
      {children}
    </div>
  );
}

function HeroGrid() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.03] dark:opacity-[0.05]" aria-hidden="true">
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hgrid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hgrid)" />
      </svg>
    </div>
  );
}

export default function HomeClient({ q0 = "", cat0 = "" }: { q0?: string; cat0?: string }) {
  const [q, setQ] = useState(q0);
  const [cat, setCat] = useState(cat0);
  const [sort, setSort] = useState<"popular" | "az">("popular");
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);
  const [usage, setUsage] = useState<Record<string, number>>({});
  const { enabledTools } = useSite();
  const { t, lang } = useLang();

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
    let list = enabledTools.filter((tool) => {
      if (cat && tool.category !== cat) return false;
      if (!s) return true;
      const d = getToolDisplay(tool, lang);
      return (
        tool.name.toLowerCase().includes(s) ||
        d.name.toLowerCase().includes(s) ||
        tool.description.toLowerCase().includes(s) ||
        d.description.toLowerCase().includes(s) ||
        tool.keywords.some((k) => k.toLowerCase().includes(s))
      );
    });
    if (sort === "az") list = [...list].sort((a, b) => {
      const da = getToolDisplay(a, lang);
      const db = getToolDisplay(b, lang);
      return da.name.localeCompare(db.name);
    });
    return list;
  }, [q, cat, sort, enabledTools, lang]);

  const counts = useMemo(() => {
    const m = new Map<string, number>();
    for (const tool of enabledTools) m.set(tool.category, (m.get(tool.category) ?? 0) + 1);
    return m;
  }, [enabledTools]);

  const recentTools = useMemo(
    () => recentSlugs.map((s) => enabledTools.find((x) => x.slug === s)).filter(Boolean) as Tool[],
    [recentSlugs, enabledTools]
  );

  const featuredTool = enabledTools.find((x) => x.slug === FEATURED_TOOL);

  const popularTools = useMemo(() => {
    const entries = Object.entries(usage).sort((a, b) => b[1] - a[1]);
    if (entries.length > 0) {
      return entries.slice(0, 10).map(([slug, count]) => {
        const tool = enabledTools.find((x) => x.slug === slug);
        return tool ? { tool, count: count as number } : null;
      }).filter(Boolean) as { tool: Tool; count: number }[];
    }
    return FALLBACK_POPULAR.map((s, i) => {
      const tool = enabledTools.find((x) => x.slug === s);
      return tool ? { tool, count: Math.max(1, 10 - i) } : null;
    }).filter(Boolean) as { tool: Tool; count: number }[];
  }, [usage, enabledTools]);

  const popularMax = useMemo(() => Math.max(1, ...popularTools.map((p) => p.count)), [popularTools]);

  const trendingTools = useMemo(() => {
    return popularTools.slice(0, 5).map((p, i) => ({
      ...p,
      trend: i < 2 ? "up" as const : i < 4 ? "stable" as const : "down" as const,
      change: i < 2 ? `+${28 - i * 11}%` : i < 4 ? "→" : `-${5 + i * 2}%`,
    }));
  }, [popularTools]);

  const isFiltering = q.trim() !== "" || cat !== "";

  const clearRecent = () => {
    try { localStorage.setItem(RECENT_KEY, "[]"); } catch {}
    setRecentSlugs([]);
  };

  const catLabel = (name: string) => {
    const key = CAT_KEY_MAP[name];
    return key ? t(key) : name;
  };

  return (
    <div className="page-enter pb-24 md:pb-0">

      {/* ═══ HERO / SEARCH CENTER ═══════════════════════ */}
      <section aria-label="Search" className="relative border-b border-[var(--border-subtle)]">
        <HeroGrid />
        <div className="relative mx-auto max-w-6xl px-4 pb-12 pt-12 sm:px-6 sm:pt-16">
          <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:items-center">
            {/* Left — headline + search */}
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-muted)]">
                {t("brandKicker")}
              </p>
              <h1 className="mt-4 text-[clamp(2.2rem,6vw,4.2rem)] font-extrabold leading-[1.02] tracking-[-0.035em] text-[var(--fg)]">
                {t("heroHeadlineA")}
                <br />
                {t("heroHeadlineB")}
              </h1>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[var(--fg-secondary)]">
                {t("heroSub")}
              </p>

              {/* Search bar */}
              <div className="mt-8 max-w-xl">
                <div className="cmd-search" role="search">
                  <span className="shrink-0 font-mono text-[18px] text-[var(--fg-muted)]" aria-hidden="true">/</span>
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Escape") setQ(""); }}
                    placeholder={t("heroSearchPlaceholder")}
                    aria-label={t("heroSearchPlaceholder")}
                    enterKeyHint="search"
                  />
                  {q ? (
                    <button onClick={() => setQ("")} className="shrink-0 text-[12px] font-medium text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]" aria-label={t("clear")}>
                      {t("clear")} ✕
                    </button>
                  ) : (
                    <button onClick={fireCmdK} className="flex shrink-0 items-center gap-2" aria-label="Open command palette">
                      <span className="hidden text-[12px] text-[var(--fg-muted)] sm:inline">{t("heroSearchHint")}</span>
                      <kbd className="tb-kbd">⌘ K</kbd>
                    </button>
                  )}
                </div>

                {/* Quick links */}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--fg-muted)]">{t("popularKicker")}:</span>
                  {(["tao-ma-qr", "json-formatter", "nen-anh", "chon-mau", "tinh-bmi"] as const).map((slug) => {
                    const tool = enabledTools.find((x) => x.slug === slug);
                    if (!tool) return null;
                    const d = getToolDisplay(tool, lang);
                    return (
                      <Link key={slug} href={`/cong-cu/${slug}`} className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-2.5 py-1 text-[12px] font-medium text-[var(--fg-secondary)] transition-all hover:border-[var(--accent)] hover:bg-[var(--accent-bg)] hover:text-[var(--accent-fg)]">
                        {d.name}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Meta stats */}
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--fg-muted)]">
                <span className="text-[var(--fg)]">{t("metaTools", enabledTools.length)}</span>
                <span aria-hidden="true">·</span>
                <span>{t("metaNoLogin")}</span>
                <span aria-hidden="true">·</span>
                <span>{t("metaFree")}</span>
                <span aria-hidden="true">·</span>
                <span>{t("metaFast")}</span>
              </div>
            </div>

            {/* Right — visual previews */}
            <div className="hidden lg:grid lg:grid-cols-2 lg:gap-3">
              {enabledTools.filter((x) => ["tao-ma-qr", "json-formatter", "chon-mau", "tinh-bmi"]).map((tool) => (
                <Link key={tool.slug} href={`/cong-cu/${tool.slug}`} className="showcase-card p-3 transition-transform hover:scale-[1.02]">
                  <ToolPreview tool={tool} className="h-20 w-full" label="" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ LIVE POPULARITY ════════════════════════════ */}
      <Reveal>
        <section aria-labelledby="popularity-title" className="border-b border-[var(--border-subtle)]">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="py-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-muted)]">
                {t("livePopularityKicker")}
              </p>
              <h2 id="popularity-title" className="mt-2 text-[22px] font-bold tracking-[-0.02em]">{t("livePopularityTitle")}</h2>
            </div>
            <div className="pb-8">
              {popularTools.slice(0, 5).map(({ tool, count }, i) => {
                const d = getToolDisplay(tool, lang);
                const pct = Math.max(8, Math.round((count / popularMax) * 100));
                return (
                  <Link key={tool.slug} href={`/cong-cu/${tool.slug}`} className="rank-row group">
                    <span className="rank-num">#{i + 1}</span>
                    <span className="min-w-0">
                      <span className="block text-[15px] font-bold tracking-[-0.015em] text-[var(--fg)] transition-transform duration-150 group-hover:translate-x-0.5">{d.name}</span>
                      <span className="mt-1 block">
                        <span className="usage-bar inline-block w-full max-w-[200px]">
                          <span className="usage-bar-fill" style={{ width: `${pct}%`, animation: "barFill 800ms cubic-bezier(0.16,1,0.3,1) both" }} />
                        </span>
                      </span>
                    </span>
                    <span className="flex items-center gap-3">
                      <span className="font-mono text-[11px] text-[var(--fg-muted)]">{count.toLocaleString()}×</span>
                      <span className="rank-arrow" aria-hidden="true">↗</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ═══ AD ═════════════════════════════════════════ */}
      <Reveal>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <AdSlot zone="in-content" />
        </div>
      </Reveal>

      {/* ═══ FEATURED TOOLS ════════════════════════════ */}
      {!isFiltering && featuredTool && (
        <Reveal>
          <section id="featured" aria-labelledby="featured-title" className="scroll-mt-24 border-b border-[var(--border-subtle)]">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <div className="py-8">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-muted)]">{t("featuredKicker")}</p>
                <h2 id="featured-title" className="mt-2 text-[22px] font-bold tracking-[-0.02em]">{t("featuredTitle")}</h2>
              </div>
              <div className="featured-canvas">
                <div className="grid lg:grid-cols-[1fr_1fr]">
                  <div className="flex flex-col justify-between p-8 lg:p-12">
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--fg-muted)]">01 — {catLabel(featuredTool.category)}</span>
                      <h3 className="mt-4 text-[clamp(1.6rem,3.5vw,2.8rem)] font-extrabold leading-[1.05] tracking-[-0.03em]">
                        {getToolDisplay(featuredTool, lang).name}
                      </h3>
                      <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[var(--fg-secondary)]">
                        {getToolDisplay(featuredTool, lang).description}
                      </p>
                    </div>
                    <Link href={`/cong-cu/${featuredTool.slug}`} className="btn-primary mt-8 w-fit">
                      {t("featuredOpen")} <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                  <div className="flex items-center justify-center border-t border-[var(--border-subtle)] bg-[var(--bg-recessed)] p-8 lg:border-t-0 lg:border-l">
                    <ToolPreview tool={featuredTool} className="h-48 w-48 sm:h-64 sm:w-64" label={`${getToolDisplay(featuredTool, lang).name} preview`} />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Reveal>
      )}

      {/* ═══ CATEGORIES ═════════════════════════════════ */}
      <Reveal>
        <section id="categories" aria-labelledby="cat-title" className="scroll-mt-24 border-b border-[var(--border-subtle)]">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="py-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-muted)]">{t("explorerKicker")}</p>
              <h2 id="cat-title" className="mt-2 text-[22px] font-bold tracking-[-0.02em]">{t("categoriesTitle")}</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 pb-8 sm:grid-cols-3 lg:grid-cols-4">
              {CATEGORIES.map((c, i) => (
                <button key={c.name} onClick={() => { setCat(c.name === cat ? "" : c.name); window.scrollTo({ top: 0, behavior: "smooth" }); }} className={`cat-block text-left ${c.name === cat ? "!border-[var(--accent)] !bg-[var(--accent-bg)]" : ""}`}>
                  <span className="font-mono text-[11px] text-[var(--fg-muted)]">{pad(i + 1)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-bold uppercase tracking-[0.05em]">{catLabel(c.name)}</span>
                    <span className="mt-0.5 block text-[11px] text-[var(--fg-muted)]">{counts.get(c.name) ?? 0} tools</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ═══ TRENDING NOW ═══════════════════════════════ */}
      {!isFiltering && (
        <Reveal>
          <section aria-labelledby="trending-title" className="border-b border-[var(--border-subtle)]">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <div className="py-8">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-muted)]">{t("trendingKicker")}</p>
                <h2 id="trending-title" className="mt-2 text-[22px] font-bold tracking-[-0.02em]">{t("trendingTitle")}</h2>
              </div>
              <div className="grid gap-3 pb-8 sm:grid-cols-2 lg:grid-cols-5">
                {trendingTools.map(({ tool, count, trend, change }) => {
                  const d = getToolDisplay(tool, lang);
                  return (
                    <Link key={tool.slug} href={`/cong-cu/${tool.slug}`} className="flex items-center gap-3 rounded-[var(--radius)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4 transition-all hover:border-[var(--accent)] hover:bg-[var(--accent-bg)]">
                      <Icon name={tool.icon} className="h-5 w-5 shrink-0 text-[var(--fg-muted)]" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-bold">{d.name}</span>
                        <span className="mt-0.5 block font-mono text-[10px] text-[var(--fg-muted)]">{count.toLocaleString()}×</span>
                      </span>
                      <span className={`font-mono text-[11px] font-bold ${trend === "up" ? "trend-up" : trend === "down" ? "trend-down" : "trend-stable"}`}>
                        {change}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        </Reveal>
      )}

      {/* ═══ EXPLORE ALL TOOLS ══════════════════════════ */}
      <Reveal>
        <section id="tools" aria-labelledby="explorer-title" className="scroll-mt-24 border-b border-[var(--border-subtle)]">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="py-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-muted)]">{t("explorerKicker")}</p>
                  <h2 id="explorer-title" className="mt-2 text-[22px] font-bold tracking-[-0.02em]">{t("explorerTitle")}</h2>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] text-[var(--fg-muted)]">{t("explorerCount", filtered.length)}</span>
                  <div className="flex gap-1">
                    <button onClick={() => setSort("popular")} className={`rounded-md px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors ${sort === "popular" ? "bg-[var(--fg)] text-[var(--bg)]" : "text-[var(--fg-muted)] hover:bg-[var(--bg-hover)]"}`}>{t("sortPopular")}</button>
                    <button onClick={() => setSort("az")} className={`rounded-md px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors ${sort === "az" ? "bg-[var(--fg)] text-[var(--bg)]" : "text-[var(--fg-muted)] hover:bg-[var(--bg-hover)]"}`}>{t("sortAZ")}</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop vertical nav + results */}
            <div className="grid gap-8 pb-8 lg:grid-cols-[200px_1fr] lg:gap-12">
              <nav aria-label={t("navCategories")} className="hidden lg:block">
                <div className="sticky top-24">
                  <button onClick={() => setCat("")} className={`cat-block w-full !p-2.5 text-left ${!cat ? "!border-[var(--accent)] !bg-[var(--accent-bg)]" : ""}`} aria-pressed={!cat}>
                    <span className="text-[12px] font-bold uppercase tracking-[0.1em]">{t("explorerAll")}</span>
                    <span className="ml-auto font-mono text-[11px] text-[var(--fg-muted)]">{enabledTools.length}</span>
                  </button>
                  {CATEGORIES.map((c, i) => (
                    <button key={c.name} onClick={() => setCat(c.name === cat ? "" : c.name)} className={`cat-block mt-2 w-full !p-2.5 text-left ${c.name === cat ? "!border-[var(--accent)] !bg-[var(--accent-bg)]" : ""}`} aria-pressed={c.name === cat}>
                      <span className="font-mono text-[11px] text-[var(--fg-muted)]">{pad(i + 1)}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[12px] font-bold uppercase tracking-[0.1em]">{catLabel(c.name)}</span>
                      </span>
                      <span className="font-mono text-[11px] text-[var(--fg-muted)]">{counts.get(c.name) ?? 0}</span>
                    </button>
                  ))}
                </div>
              </nav>

              {/* Mobile horizontal nav */}
              <nav aria-label={t("navCategories")} className="lg:hidden">
                <div className="scroll-x -mx-4 flex gap-3 overflow-x-auto px-4 pb-4">
                  <button onClick={() => setCat("")} className={`shrink-0 rounded-md border px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] transition-colors ${!cat ? "border-[var(--accent)] bg-[var(--accent-bg)] text-[var(--accent-fg)]" : "border-[var(--border-subtle)] text-[var(--fg-muted)]"}`} aria-pressed={!cat}>
                    {t("explorerAll")}
                  </button>
                  {CATEGORIES.map((c) => (
                    <button key={c.name} onClick={() => setCat(c.name === cat ? "" : c.name)} className={`shrink-0 touch-manipulation rounded-md border px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] transition-colors ${c.name === cat ? "border-[var(--accent)] bg-[var(--accent-bg)] text-[var(--accent-fg)]" : "border-[var(--border-subtle)] text-[var(--fg-muted)]"}`} aria-pressed={c.name === cat}>
                      {catLabel(c.name)}
                    </button>
                  ))}
                </div>
              </nav>

              {/* Results */}
              <div className="min-w-0">
                {filtered.length === 0 ? (
                  <p className="py-10 text-[14px] text-[var(--fg-muted)]">{t("noResults")}</p>
                ) : (
                  <div role="list" aria-label={t("explorerTitle")}>
                    {filtered.map((tool, i) => {
                      const d = getToolDisplay(tool, lang);
                      return (
                        <Link key={tool.slug} href={`/cong-cu/${tool.slug}`} role="listitem" className="dir-row group">
                          <span className="dir-num">{pad(i + 1)}</span>
                          <span className="min-w-0">
                            <span className="block text-[15px] font-bold tracking-[-0.015em] text-[var(--fg)] transition-transform duration-150 group-hover:translate-x-0.5">{d.name}</span>
                            <span className="mt-0.5 block truncate text-[12px] text-[var(--fg-muted)]">{d.description}</span>
                            <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--fg-muted)] sm:hidden">{catLabel(tool.category)}</span>
                          </span>
                          <span className="flex items-center gap-4">
                            <span className="hidden font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--fg-muted)] md:inline">{catLabel(tool.category)}</span>
                            <span className="dir-arrow" aria-hidden="true">↗</span>
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ═══ RECENTLY USED ═════════════════════════════ */}
      {!isFiltering && recentTools.length > 0 && (
        <Reveal>
          <section id="recent" aria-labelledby="recent-title" className="scroll-mt-24 border-b border-[var(--border-subtle)]">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <div className="py-8">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-muted)]">{t("recentKicker")}</p>
                    <h2 id="recent-title" className="mt-2 text-[22px] font-bold tracking-[-0.02em]">{t("recentTitle")}</h2>
                  </div>
                  <button onClick={clearRecent} className="tb-link text-[12px] text-[var(--fg-muted)]">{t("recentClear")}</button>
                </div>
              </div>
              <div className="pb-8">
                {recentTools.slice(0, 5).map((tool) => {
                  const d = getToolDisplay(tool, lang);
                  return (
                    <Link key={tool.slug} href={`/cong-cu/${tool.slug}`} className="dir-row group">
                      <span className="h-[6px] w-[6px] shrink-0 rounded-full bg-[var(--accent)]" aria-hidden="true" />
                      <span className="min-w-0">
                        <span className="block text-[14px] font-medium text-[var(--fg)]">{d.name}</span>
                        <span className="mt-0.5 block text-[11px] text-[var(--fg-muted)]">{catLabel(tool.category)}</span>
                      </span>
                      <span className="dir-arrow" aria-hidden="true">→</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        </Reveal>
      )}

      {/* ═══ WHY TOOLBOXVN ═════════════════════════════ */}
      <Reveal>
        <section aria-labelledby="why-title" className="border-b border-[var(--border-subtle)]">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="py-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-muted)]">{t("whyKicker")}</p>
              <h2 id="why-title" className="mt-2 text-[22px] font-bold tracking-[-0.02em]">{t("whyTitle")}</h2>
            </div>
            <div className="pb-12">
              {(["1", "2", "3", "4"] as const).map((n, i) => (
                <div key={n} className="grid grid-cols-[48px_1fr] gap-6 border-t border-[var(--border-subtle)] py-8 sm:grid-cols-[80px_1fr]">
                  <span className="font-mono text-[28px] font-bold leading-none text-[var(--fg-muted)] sm:text-[40px]">{n}</span>
                  <div>
                    <h3 className="text-[16px] font-bold tracking-[-0.01em]">{t(`why${n}T` as "why1T")}</h3>
                    <p className="mt-2 max-w-lg text-[14px] leading-relaxed text-[var(--fg-secondary)]">{t(`why${n}D` as "why1D")}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ═══ CONTACT ═══════════════════════════════════ */}
      <Reveal>
        <section aria-labelledby="contact-title" className="border-b border-[var(--border-subtle)]">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid items-center gap-8 py-16 sm:grid-cols-[1fr_auto]">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-muted)]">{t("contactKicker")}</p>
                <h2 id="contact-title" className="mt-2 text-[22px] font-bold tracking-[-0.02em]">{t("contactTitle")}</h2>
                <p className="mt-3 max-w-md text-[14px] leading-relaxed text-[var(--fg-secondary)]">{t("contactDesc")}</p>
              </div>
              <a href="mailto:lm9739304@gmail.com" className="btn-primary">
                {t("contactCta")} <span aria-hidden="true">→</span>
              </a>
            </div>
            <div className="border-t border-[var(--border-subtle)] py-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--fg-muted)]">
                lm9739304@gmail.com
              </p>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ═══ MOBILE BOTTOM NAV ═══════════════════════════ */}
      <nav
        aria-label="Mobile"
        className="fixed inset-x-3 bottom-3 z-40 flex h-[52px] items-center justify-around rounded-[10px] border border-[var(--border)] bg-[var(--bg-elevated)]/95 shadow-[var(--shadow-md)] backdrop-blur-xl md:hidden"
      >
        <a href="#tools" className="flex min-h-[44px] min-w-[72px] flex-col items-center justify-center gap-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--fg-secondary)]">
          <span aria-hidden="true" className="text-[15px] leading-none">☰</span>
          {t("navTools")}
        </a>
        <button onClick={fireCmdK} className="flex min-h-[44px] min-w-[72px] flex-col items-center justify-center gap-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--fg-secondary)]" aria-label="Search">
          <span aria-hidden="true" className="text-[15px] leading-none">⌕</span>
          {t("searchPlaceholder").split(" ")[0]}
        </button>
        <a href="#popular" className="flex min-h-[44px] min-w-[72px] flex-col items-center justify-center gap-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--fg-secondary)]">
          <span aria-hidden="true" className="text-[15px] leading-none">↑</span>
          {t("navPopular")}
        </a>
      </nav>
    </div>
  );
}
