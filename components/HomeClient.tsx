"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
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

const FEATURED_MAIN = "tao-ma-qr";
const FEATURED_SUBS = ["json-formatter", "tinh-bmi", "may-tinh"];

const FALLBACK_POPULAR = [
  "tinh-bmi",
  "tao-ma-qr",
  "json-formatter",
  "ma-hoa-base64",
  "tao-mat-khau",
  "dem-tu",
  "may-tinh",
  "doi-tien-te",
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

/* ── Scroll reveal hook ─────────────────────────────────── */
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
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function RevealSection({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useReveal();
  return (
    <div ref={ref} id={id} className={`reveal ${className}`}>
      {children}
    </div>
  );
}

/* ── Grid background for hero ───────────────────────────── */
function HeroGrid() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.035] dark:opacity-[0.06]" aria-hidden="true">
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid)" />
      </svg>
    </div>
  );
}

export default function HomeClient({ q0 = "", cat0 = "" }: { q0?: string; cat0?: string }) {
  const [q, setQ] = useState(q0);
  const [cat, setCat] = useState(cat0);
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);
  const [usage, setUsage] = useState<Record<string, number>>({});
  const { enabledTools } = useSite();
  const { t, lang } = useLang();
  const explorerRef = useRef<HTMLDivElement>(null);

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
    return enabledTools.filter((tool) => {
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
  }, [q, cat, enabledTools, lang]);

  const counts = useMemo(() => {
    const m = new Map<string, number>();
    for (const tool of enabledTools) m.set(tool.category, (m.get(tool.category) ?? 0) + 1);
    return m;
  }, [enabledTools]);

  const recentTools = useMemo(
    () =>
      recentSlugs
        .map((s) => enabledTools.find((x) => x.slug === s))
        .filter(Boolean) as Tool[],
    [recentSlugs, enabledTools]
  );

  const featuredMain = enabledTools.find((x) => x.slug === FEATURED_MAIN);
  const featuredSubs = FEATURED_SUBS.map((s) =>
    enabledTools.find((x) => x.slug === s)
  ).filter(Boolean) as Tool[];

  const popularTools = useMemo(() => {
    const entries = Object.entries(usage).sort((a, b) => b[1] - a[1]);
    if (entries.length > 0) {
      const list = entries
        .slice(0, 8)
        .map(([slug, count]) => {
          const tool = enabledTools.find((x) => x.slug === slug);
          return tool ? { tool, count: count as number } : null;
        })
        .filter(Boolean) as { tool: Tool; count: number }[];
      if (list.length > 0) return list;
    }
    return FALLBACK_POPULAR.map((s) => {
      const tool = enabledTools.find((x) => x.slug === s);
      return tool ? { tool, count: null as number | null } : null;
    }).filter(Boolean) as { tool: Tool; count: number | null }[];
  }, [usage, enabledTools]);

  const popularMax = useMemo(
    () => Math.max(1, ...popularTools.map((p) => p.count ?? 0)),
    [popularTools]
  );

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
    <div className="tb-home pb-24 md:pb-0">

      {/* ═══ HERO ═══════════════════════════════════════ */}
      <section aria-labelledby="tb-hero-title" className="relative pb-10 pt-10 sm:pt-16">
        <HeroGrid />
        <div className="relative">
          <div className="tb-rise">
            <p className="text-[12px] font-black uppercase tracking-[0.28em] text-[var(--fg)]">
              {t("heroEyebrowTop")}
            </p>
            <p className="mt-1.5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--fg-muted)]">
              <span className="inline-block h-px w-8 bg-[var(--accent)]" aria-hidden="true" />
              {t("heroEyebrowSub")}
            </p>
          </div>
          <h1
            id="tb-hero-title"
            className="tb-headline tb-rise tb-rise-1 mt-5 text-[clamp(2.6rem,7vw,4.9rem)] text-[var(--fg)]"
          >
            {t("heroHeadlineA")}
            <br />
            {t("heroHeadlineB")}
          </h1>
          <div className="tb-rise tb-rise-2 mt-5 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <p className="max-w-md text-[15px] leading-relaxed text-[var(--fg-secondary)]">
              {t("heroSub")}
            </p>
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--fg-muted)]">
              {enabledTools.length} — {t("statFree")}
            </p>
          </div>

          {/* Command-center search */}
          <div className="tb-rise tb-rise-3 mt-8">
            <div className="tb-cmd" role="search">
              <span className="shrink-0 font-mono text-[20px] text-[var(--fg-muted)]" aria-hidden="true">/</span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Escape") setQ(""); }}
                placeholder={t("heroSearchPlaceholder")}
                aria-label={t("heroSearchPlaceholder")}
                enterKeyHint="search"
              />
              {q ? (
                <button
                  onClick={() => setQ("")}
                  className="tg shrink-0 text-[12px] font-medium text-[var(--fg-muted)] hover:text-[var(--fg)]"
                  aria-label={t("clear")}
                >
                  {t("clear")} ✕
                </button>
              ) : (
                <button onClick={fireCmdK} className="flex shrink-0 items-center gap-2" aria-label="Open command palette">
                  <span className="hidden text-[12px] text-[var(--fg-muted)] sm:inline">{t("heroSearchHint")}</span>
                  <kbd className="tb-kbd">⌘ K</kbd>
                </button>
              )}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-1 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--fg-muted)]">
              <span className="text-[var(--fg)]">{t("metaTools", enabledTools.length)}</span>
              <span aria-hidden="true">·</span>
              <span>{t("metaNoLogin")}</span>
              <span aria-hidden="true">·</span>
              <span>{t("metaFree")}</span>
              <span aria-hidden="true">·</span>
              <span>{t("metaFast")}</span>
            </div>

            {/* Human phrase chips */}
            <div className="mt-7 flex flex-wrap gap-2">
              {([
                ["tao-ma-qr", t("chipQr")],
                ["json-formatter", t("chipJson")],
                ["chon-mau", t("chipColor")],
                ["nen-anh", t("chipCompress")],
                ["tinh-bmi", t("chipBmi")],
              ] as const).map(([slug, phrase]) => {
                const tool = enabledTools.find((x) => x.slug === slug);
                if (!tool) return null;
                return (
                  <Link
                    key={slug}
                    href={`/cong-cu/${slug}`}
                    className="tg group flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] py-1.5 pl-2 pr-3.5 text-[13px] font-medium text-[var(--fg-secondary)] hover:border-[var(--fg-muted)] hover:text-[var(--fg)] hover:shadow-sm"
                  >
                    <ToolPreview tool={tool} className="h-7 w-7 rounded-full border-0 bg-[var(--bg-recessed)] p-1" label="" />
                    <span>{phrase}</span>
                    <span aria-hidden="true" className="text-[11px] text-[var(--fg-muted)] transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FEATURED ══════════════════════════════════ */}
      {!isFiltering && featuredMain && (
        <RevealSection>
          <section aria-labelledby="tb-featured-title" className="py-10">
            <div className="mb-5 flex items-end justify-between">
              <div>
                <p className="tb-kicker">{t("featuredKicker")}</p>
                <h2 id="tb-featured-title" className="mt-2 text-[22px] font-bold tracking-[-0.02em]">{t("featuredTitle")}</h2>
              </div>
              <a href="#explorer" className="tb-link hidden text-[13px] font-medium text-[var(--fg-secondary)] sm:inline">{t("explorerAll")} →</a>
            </div>
            <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:gap-10">
              <Link href={`/cong-cu/${featuredMain.slug}`} className="tb-feature-main group">
                <div className="flex items-start justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--fg-muted)]">01 — {catLabel(featuredMain.category)}</span>
                  <Icon name={featuredMain.icon} className="h-8 w-8 text-[var(--fg-muted)]" />
                </div>
                <div className="mt-8 grid items-end gap-6 sm:grid-cols-[1fr_auto] sm:gap-8">
                  <div>
                    <h3 className="text-[clamp(1.6rem,3.4vw,2.4rem)] font-bold leading-[1.05] tracking-[-0.025em]">{getToolDisplay(featuredMain, lang).name}</h3>
                    <p className="mt-3 max-w-md text-[14px] leading-relaxed text-[var(--fg-secondary)]">{getToolDisplay(featuredMain, lang).description}</p>
                    <span className="tb-go mt-6">{t("featuredOpen")} <span aria-hidden="true">→</span></span>
                  </div>
                  <ToolPreview tool={featuredMain} className="hidden w-[150px] shrink-0 sm:flex" label={`${getToolDisplay(featuredMain, lang).name} preview`} />
                </div>
              </Link>
              <div className="flex flex-col justify-center">
                {featuredSubs.map((tool, i) => {
                  const d = getToolDisplay(tool, lang);
                  return (
                    <Link key={tool.slug} href={`/cong-cu/${tool.slug}`} className="tb-feature-sub group">
                      <span className="font-mono text-[11px] text-[var(--fg-muted)]">{pad(i + 2)}</span>
                      <Icon name={tool.icon} className="h-5 w-5 shrink-0 text-[var(--fg-muted)]" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[15px] font-semibold tracking-[-0.01em]">{d.name}</span>
                        <span className="mt-0.5 block truncate text-[12px] text-[var(--fg-muted)]">{d.description}</span>
                      </span>
                      <span className="tb-arrow" aria-hidden="true">↗</span>
                    </Link>
                  );
                })}
                <p className="mt-4 text-[12px] leading-relaxed text-[var(--fg-muted)]">{t("explorerDesc")}</p>
              </div>
            </div>
          </section>
        </RevealSection>
      )}

      {/* ═══ AD ═════════════════════════════════════════ */}
      <RevealSection>
        <AdSlot zone="in-content" />
      </RevealSection>

      {/* ═══ POPULAR ════════════════════════════════════ */}
      {!isFiltering && (
        <RevealSection>
          <section id="popular" aria-labelledby="tb-popular-title" className="scroll-mt-24 py-10">
            <p className="tb-kicker">{t("popularKicker")}</p>
            <div className="mb-4 mt-2 flex items-end justify-between">
              <h2 id="tb-popular-title" className="text-[22px] font-bold tracking-[-0.02em]">{t("popularTitle")}</h2>
              <span className="font-mono text-[11px] text-[var(--fg-muted)]">{pad(popularTools.length)}</span>
            </div>
            <div className="tb-hscroll" role="list">
              {popularTools.map(({ tool, count }, i) => {
                const d = getToolDisplay(tool, lang);
                const pct = count !== null ? Math.max(10, Math.round((count / popularMax) * 100)) : 0;
                return (
                  <Link key={tool.slug} href={`/cong-cu/${tool.slug}`} role="listitem" className="tb-hitem group">
                    <span className="flex items-center justify-between">
                      <span className="font-mono text-[11px] text-[var(--fg-muted)]">{pad(i + 1)}</span>
                      <span className="tb-arrow text-[13px] text-[var(--fg-muted)]" aria-hidden="true">↗</span>
                    </span>
                    <span className="mt-3 flex items-center gap-2">
                      <Icon name={tool.icon} className="h-4 w-4 shrink-0 text-[var(--fg-secondary)]" />
                      <span className="truncate text-[15px] font-bold tracking-[-0.01em]">{d.name}</span>
                    </span>
                    <span className="mt-1.5 block line-clamp-2 min-h-[2.4em] text-[12px] leading-snug text-[var(--fg-muted)]">{d.description}</span>
                    {count !== null ? (
                      <span className="mt-3 block">
                        <span className="block h-[3px] w-full overflow-hidden rounded-full bg-[var(--border-subtle)]" aria-hidden="true">
                          <span className="block h-full rounded-full bg-[var(--accent)] transition-all duration-700" style={{ width: `${pct}%` }} />
                        </span>
                        <span className="mt-1.5 block font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--fg-muted)]">{count}× — {catLabel(tool.category)}</span>
                      </span>
                    ) : (
                      <span className="mt-3 block font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--fg-muted)]">{catLabel(tool.category)}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </section>
        </RevealSection>
      )}

      {/* ═══ RECENT ═════════════════════════════════════ */}
      {!isFiltering && (
        <RevealSection>
          <section id="recent" aria-labelledby="tb-recent-title" className="scroll-mt-24 py-10">
            <div className="mb-1 flex items-end justify-between">
              <div>
                <p className="tb-kicker">{t("recentKicker")}</p>
                <h2 id="tb-recent-title" className="mt-2 text-[22px] font-bold tracking-[-0.02em]">{t("recentTitle")}</h2>
              </div>
              {recentTools.length > 0 && (
                <button onClick={clearRecent} className="tb-link text-[12px] text-[var(--fg-muted)]">{t("recentClear")}</button>
              )}
            </div>
            {recentTools.length === 0 ? (
              <p className="border-t border-[var(--border-subtle)] py-5 text-[13px] text-[var(--fg-muted)]">
                <span className="mr-2 inline-block h-[6px] w-[6px] rounded-full bg-[var(--border)]" aria-hidden="true" />
                {t("recentEmpty")}
              </p>
            ) : (
              <div>
                {recentTools.slice(0, 5).map((tool) => {
                  const d = getToolDisplay(tool, lang);
                  return (
                    <Link key={tool.slug} href={`/cong-cu/${tool.slug}`} className="tb-feature-sub group">
                      <span className="h-[6px] w-[6px] shrink-0 rounded-full bg-[var(--accent)]" aria-hidden="true" />
                      <Icon name={tool.icon} className="h-4 w-4 shrink-0 text-[var(--fg-muted)]" />
                      <span className="min-w-0 flex-1 truncate text-[14px] font-medium">{d.name}</span>
                      <span className="hidden font-mono text-[11px] uppercase tracking-wider text-[var(--fg-muted)] sm:inline">{catLabel(tool.category)}</span>
                      <span className="tb-arrow" aria-hidden="true">→</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        </RevealSection>
      )}

      {/* ═══ EXPLORER ═══════════════════════════════════ */}
      <RevealSection>
        <section id="explorer" aria-labelledby="tb-explorer-title" className="scroll-mt-24 py-10">
          <p className="tb-kicker">{t("explorerKicker")}</p>
          <div className="mb-6 mt-2 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <h2 id="tb-explorer-title" className="text-[22px] font-bold tracking-[-0.02em]">{t("explorerTitle")}</h2>
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--fg-muted)]">{t("explorerCount", filtered.length)}</p>
          </div>
          <div ref={explorerRef} className="grid gap-8 lg:grid-cols-[210px_1fr] lg:gap-12">
            {/* Desktop vertical nav */}
            <nav aria-label={t("navCategories")} className="hidden lg:block">
              <div className="sticky top-24">
                <p className="mb-1 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--fg-muted)]">Explore</p>
                <button onClick={() => setCat("")} className={`tb-cat ${!cat ? "active" : ""}`} aria-pressed={!cat}>
                  <span className="tb-cat-mark" aria-hidden="true" />
                  <span className="text-[13px] font-semibold uppercase tracking-[0.1em]">{t("explorerAll")}</span>
                  <span className="tb-cat-count">{enabledTools.length}</span>
                </button>
                {CATEGORIES.map((c) => (
                  <button key={c.name} onClick={() => setCat(c.name === cat ? "" : c.name)} className={`tb-cat ${c.name === cat ? "active" : ""}`} aria-pressed={c.name === cat}>
                    <span className="tb-cat-mark" aria-hidden="true" />
                    <span className="text-[13px] font-semibold uppercase tracking-[0.1em]">{catLabel(c.name)}</span>
                    <span className="tb-cat-count">{counts.get(c.name) ?? 0}</span>
                  </button>
                ))}
              </div>
            </nav>
            {/* Mobile horizontal nav */}
            <nav aria-label={t("navCategories")} className="lg:hidden">
              <div className="scroll-x -mx-4 flex gap-5 overflow-x-auto px-4 pb-3">
                <button onClick={() => setCat("")} className={`shrink-0 pb-1 text-[12px] font-bold uppercase tracking-[0.1em] ${!cat ? "border-b-2 border-[var(--accent)] text-[var(--fg)]" : "border-b-2 border-transparent text-[var(--fg-muted)]"}`} aria-pressed={!cat}>
                  {t("explorerAll")}
                </button>
                {CATEGORIES.map((c) => (
                  <button key={c.name} onClick={() => setCat(c.name === cat ? "" : c.name)} className={`shrink-0 touch-manipulation pb-1 text-[12px] font-bold uppercase tracking-[0.1em] ${c.name === cat ? "border-b-2 border-[var(--accent)] text-[var(--fg)]" : "border-b-2 border-transparent text-[var(--fg-muted)]"}`} aria-pressed={c.name === cat}>
                    {catLabel(c.name)}
                  </button>
                ))}
              </div>
            </nav>
            {/* Results */}
            <div className="min-w-0">
              {filtered.length === 0 ? (
                <p className="border-t border-[var(--border-subtle)] py-10 text-[14px] text-[var(--fg-muted)]">{t("noResults")}</p>
              ) : (
                <div role="list" aria-label={t("explorerTitle")}>
                  {filtered.map((tool, i) => {
                    const d = getToolDisplay(tool, lang);
                    return (
                      <Link key={tool.slug} href={`/cong-cu/${tool.slug}`} role="listitem" className="tb-entry group">
                        <span className="tb-num">{pad(i + 1)}</span>
                        <Icon name={tool.icon} className="h-[18px] w-[18px] text-[var(--fg-secondary)]" />
                        <span className="min-w-0">
                          <span className="block truncate text-[15px] font-bold tracking-[-0.015em] text-[var(--fg)]">{d.name}</span>
                          <span className="mt-0.5 block truncate text-[12px] text-[var(--fg-muted)]">{d.description}</span>
                          <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--fg-muted)] sm:hidden">{catLabel(tool.category)}</span>
                        </span>
                        <span className="flex items-center gap-4">
                          <span className="hidden font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--fg-muted)] md:inline">{catLabel(tool.category)}</span>
                          <span className="tb-arrow" aria-hidden="true">↗</span>
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ═══ WHY ════════════════════════════════════════ */}
      <RevealSection>
        <section className="py-16 border-t border-[var(--border-subtle)]">
          <p className="tb-kicker">{t("whyKicker")}</p>
          <h2 className="mt-2 text-[22px] font-bold tracking-[-0.02em]">3 reasons</h2>
          <div className="mt-10 grid gap-10 sm:grid-cols-3">
            {(["1", "2", "3"] as const).map((n) => (
              <div key={n}>
                <span className="block font-mono text-[36px] font-bold leading-none text-[var(--fg-muted)]">{n}</span>
                <h3 className="mt-3 text-[15px] font-bold">{t(`why${n}T` as "why1T")}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[var(--fg-secondary)]">{t(`why${n}D` as "why1D")}</p>
              </div>
            ))}
          </div>
        </section>
      </RevealSection>

      {/* ═══ FAQ ═════════════════════════════════════════ */}
      <RevealSection>
        <section id="faq" className="py-16 border-t border-[var(--border-subtle)]">
          <p className="tb-kicker">{t("homeFaqKicker")}</p>
          <h2 className="mt-2 text-[22px] font-bold tracking-[-0.02em]">{t("homeFaqTitle")}</h2>
          <div className="mt-10 grid gap-0 sm:grid-cols-2">
            {(["1", "2", "3", "4"] as const).map((n, i) => (
              <details key={n} open={i === 0} className="group border-t border-[var(--border-subtle)] py-5">
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-[14px] font-semibold tracking-[-0.01em] text-[var(--fg)] [&::-webkit-details-marker]:hidden">
                  {t(`faq${n}Q` as "faq1Q")}
                  <span aria-hidden="true" className="text-[16px] text-[var(--fg-muted)] transition-transform duration-200 group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-[13px] leading-relaxed text-[var(--fg-secondary)]">{t(`faq${n}A` as "faq1A")}</p>
              </details>
            ))}
          </div>
        </section>
      </RevealSection>

      {/* ═══ CONTACT ═════════════════════════════════════ */}
      <RevealSection>
        <section className="py-16 border-t border-[var(--border-subtle)] text-center">
          <p className="tb-kicker">{t("contactKicker")}</p>
          <h2 className="mt-2 text-[22px] font-bold tracking-[-0.02em]">{t("contactTitle")}</h2>
          <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-[var(--fg-secondary)]">{t("contactDesc")}</p>
          <a href="mailto:lm9739304@gmail.com" className="btn-primary mt-8">
            {t("contactCta")} <span aria-hidden="true">→</span>
          </a>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--fg-muted)]">
            {t("contactEmailLabel")}{" "}
            <a href="mailto:lm9739304@gmail.com" className="underline decoration-[var(--border)] underline-offset-4 hover:text-[var(--fg)] hover:decoration-[var(--fg-muted)]">lm9739304@gmail.com</a>
          </p>
        </section>
      </RevealSection>

      {/* ═══ MOBILE BOTTOM NAV ═════════════════════════ */}
      <nav
        aria-label="Mobile"
        className="fixed inset-x-3 bottom-3 z-40 flex h-[52px] items-center justify-around rounded-[10px] border border-[var(--border)] bg-[var(--bg-elevated)]/95 shadow-[var(--shadow-md)] backdrop-blur-xl md:hidden"
      >
        <a href="#explorer" className="flex min-h-[44px] min-w-[72px] flex-col items-center justify-center gap-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--fg-secondary)]">
          <span aria-hidden="true" className="text-[15px] leading-none">☰</span>
          {t("navTools")}
        </a>
        <button onClick={fireCmdK} className="flex min-h-[44px] min-w-[72px] flex-col items-center justify-center gap-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--fg-secondary)]" aria-label="Search">
          <span aria-hidden="true" className="text-[15px] leading-none">⌕</span>
          Search
        </button>
        <a href="#popular" className="flex min-h-[44px] min-w-[72px] flex-col items-center justify-center gap-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--fg-secondary)]">
          <span aria-hidden="true" className="text-[15px] leading-none">↑</span>
          {t("navPopular")}
        </a>
      </nav>
    </div>
  );
}
