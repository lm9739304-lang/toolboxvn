"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import AdSlot from "./AdSlot";
import { CATEGORIES, type Tool, getToolDisplay } from "@/lib/tools";
import { useSite } from "@/lib/site-config";
import Icon from "./Icon";
import { useLang } from "@/lib/language-context";
import { translations } from "@/lib/translations";

const RECENT_KEY = "toolboxvn:recent";
const USAGE_KEY = "toolboxvn:usage";

const FEATURED_MAIN = "tao-ma-qr";
const FEATURED_SUBS = ["json-formatter", "tinh-bmi"];

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
        .map(([slug]) => enabledTools.find((x) => x.slug === slug))
        .filter(Boolean) as Tool[];
      if (list.length > 0) return list;
    }
    return FALLBACK_POPULAR.map((s) => enabledTools.find((x) => x.slug === s)).filter(
      Boolean
    ) as Tool[];
  }, [usage, enabledTools]);

  const isFiltering = q.trim() !== "" || cat !== "";

  const clearRecent = () => {
    try {
      localStorage.setItem(RECENT_KEY, "[]");
    } catch {}
    setRecentSlugs([]);
  };

  const catLabel = (name: string) => {
    const key = CAT_KEY_MAP[name];
    return key ? t(key) : name;
  };

  return (
    <div className="tb-home pb-24 md:pb-0">
      {/* ── HERO : editorial, no card ─────────────────────────── */}
      <section aria-labelledby="tb-hero-title" className="pb-10 pt-10 sm:pt-16">
        <p className="tb-kicker tb-rise">{t("brandKicker")}</p>
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
            <svg
              className="h-5 w-5 shrink-0 text-[var(--fg-muted)]"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setQ("");
              }}
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
              <button
                onClick={fireCmdK}
                className="flex shrink-0 items-center gap-2"
                aria-label="Open command palette"
              >
                <span className="hidden text-[12px] text-[var(--fg-muted)] sm:inline">
                  {t("heroSearchHint")}
                </span>
                <kbd className="tb-kbd">⌘ K</kbd>
              </button>
            )}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-[12px] text-[var(--fg-muted)]">
            <span>{t("metaPrivate")}</span>
            <span aria-hidden="true">·</span>
            <span>{t("metaNoSignup")}</span>
            <span aria-hidden="true">·</span>
            <span>{t("metaLocal")}</span>
          </div>
        </div>
      </section>

      {/* ── FEATURED : asymmetric 60 / 40 ─────────────────────── */}
      {!isFiltering && featuredMain && (
        <section aria-labelledby="tb-featured-title" className="py-10">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="tb-kicker">{t("featuredKicker")}</p>
              <h2 id="tb-featured-title" className="mt-2 text-[22px] font-bold tracking-[-0.02em]">
                {t("featuredTitle")}
              </h2>
            </div>
            <a href="#explorer" className="tb-link hidden text-[13px] font-medium text-[var(--fg-secondary)] sm:inline">
              {t("explorerAll")} →
            </a>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:gap-10">
            {/* Main — 60% */}
            <Link href={`/cong-cu/${featuredMain.slug}`} className="tb-feature-main group">
              <div className="flex items-start justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--fg-muted)]">
                  01 — {catLabel(featuredMain.category)}
                </span>
                <Icon name={featuredMain.icon} className="h-8 w-8 text-[var(--fg-muted)]" />
              </div>
              <div className="mt-10">
                <h3 className="text-[clamp(1.6rem,3.4vw,2.4rem)] font-bold leading-[1.05] tracking-[-0.025em]">
                  {getToolDisplay(featuredMain, lang).name}
                </h3>
                <p className="mt-3 max-w-md text-[14px] leading-relaxed text-[var(--fg-secondary)]">
                  {getToolDisplay(featuredMain, lang).description}
                </p>
                <span className="tb-go mt-6">
                  {t("featuredOpen")} <span aria-hidden="true">→</span>
                </span>
              </div>
            </Link>

            {/* Subs — 40% stacked */}
            <div className="flex flex-col justify-center">
              {featuredSubs.map((tool, i) => {
                const d = getToolDisplay(tool, lang);
                return (
                  <Link key={tool.slug} href={`/cong-cu/${tool.slug}`} className="tb-feature-sub group">
                    <span className="font-mono text-[11px] text-[var(--fg-muted)]">{pad(i + 2)}</span>
                    <Icon name={tool.icon} className="h-5 w-5 shrink-0 text-[var(--fg-muted)]" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] font-semibold tracking-[-0.01em]">
                        {d.name}
                      </span>
                      <span className="mt-0.5 block truncate text-[12px] text-[var(--fg-muted)]">
                        {d.description}
                      </span>
                    </span>
                    <span className="tb-arrow" aria-hidden="true">↗</span>
                  </Link>
                );
              })}
              <p className="mt-4 text-[12px] leading-relaxed text-[var(--fg-muted)]">
                {t("explorerDesc")}
              </p>
            </div>
          </div>
        </section>
      )}

      <AdSlot zone="in-content" />

      {/* ── POPULAR : horizontal compact rows ─────────────────── */}
      {!isFiltering && (
        <section id="popular" aria-labelledby="tb-popular-title" className="scroll-mt-24 py-10">
          <p className="tb-kicker">{t("popularKicker")}</p>
          <div className="mb-4 mt-2 flex items-end justify-between">
            <h2 id="tb-popular-title" className="text-[22px] font-bold tracking-[-0.02em]">
              {t("popularTitle")}
            </h2>
            <span className="font-mono text-[11px] text-[var(--fg-muted)]">
              {pad(popularTools.length)}
            </span>
          </div>
          <div className="tb-hscroll" role="list">
            {popularTools.map((tool, i) => {
              const d = getToolDisplay(tool, lang);
              return (
                <Link key={tool.slug} href={`/cong-cu/${tool.slug}`} role="listitem" className="tb-hitem group">
                  <span className="font-mono text-[11px] text-[var(--fg-muted)]">{pad(i + 1)}</span>
                  <span className="mt-2 flex items-center gap-2">
                    <Icon name={tool.icon} className="h-4 w-4 text-[var(--fg-secondary)]" />
                    <span className="truncate text-[14px] font-semibold tracking-[-0.01em]">{d.name}</span>
                  </span>
                  <span className="mt-1 block truncate text-[12px] text-[var(--fg-muted)]">{catLabel(tool.category)}</span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ── RECENTLY USED : app feature ───────────────────────── */}
      {!isFiltering && (
        <section aria-labelledby="tb-recent-title" className="py-10">
          <div className="mb-1 flex items-end justify-between">
            <div>
              <p className="tb-kicker">{t("recentKicker")}</p>
              <h2 id="tb-recent-title" className="mt-2 text-[22px] font-bold tracking-[-0.02em]">
                {t("recentTitle")}
              </h2>
            </div>
            {recentTools.length > 0 && (
              <button onClick={clearRecent} className="tb-link text-[12px] text-[var(--fg-muted)]">
                {t("recentClear")}
              </button>
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
                    <span className="hidden font-mono text-[11px] uppercase tracking-wider text-[var(--fg-muted)] sm:inline">
                      {catLabel(tool.category)}
                    </span>
                    <span className="tb-arrow" aria-hidden="true">→</span>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* ── EXPLORER : typographic nav + catalog rows ─────────── */}
      <section id="explorer" aria-labelledby="tb-explorer-title" className="scroll-mt-24 py-10">
        <p className="tb-kicker">{t("explorerKicker")}</p>
        <div className="mb-6 mt-2 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <h2 id="tb-explorer-title" className="text-[22px] font-bold tracking-[-0.02em]">
            {t("explorerTitle")}
          </h2>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--fg-muted)]">
            {t("explorerCount", filtered.length)}
          </p>
        </div>

        <div ref={explorerRef} className="grid gap-8 lg:grid-cols-[210px_1fr] lg:gap-12">
          {/* Desktop vertical typographic nav */}
          <nav aria-label={t("navCategories")} className="hidden lg:block">
            <div className="sticky top-24">
              <button
                onClick={() => setCat("")}
                className={`tb-cat ${!cat ? "active" : ""}`}
                aria-pressed={!cat}
              >
                <span className="tb-cat-mark" aria-hidden="true" />
                <span className="text-[13px] font-semibold uppercase tracking-[0.1em]">{t("explorerAll")}</span>
                <span className="tb-cat-count">{enabledTools.length}</span>
              </button>
              {CATEGORIES.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setCat(c.name === cat ? "" : c.name)}
                  className={`tb-cat ${c.name === cat ? "active" : ""}`}
                  aria-pressed={c.name === cat}
                >
                  <span className="tb-cat-mark" aria-hidden="true" />
                  <span className="text-[13px] font-semibold uppercase tracking-[0.1em]">{catLabel(c.name)}</span>
                  <span className="tb-cat-count">{counts.get(c.name) ?? 0}</span>
                </button>
              ))}
            </div>
          </nav>

          {/* Mobile horizontal typographic nav — intentionally different */}
          <nav aria-label={t("navCategories")} className="lg:hidden">
            <div className="scroll-x -mx-4 flex gap-5 overflow-x-auto px-4 pb-3">
              <button
                onClick={() => setCat("")}
                className={`shrink-0 pb-1 text-[12px] font-bold uppercase tracking-[0.1em] ${
                  !cat
                    ? "border-b-2 border-[var(--accent)] text-[var(--fg)]"
                    : "border-b-2 border-transparent text-[var(--fg-muted)]"
                }`}
                aria-pressed={!cat}
              >
                {t("explorerAll")}
              </button>
              {CATEGORIES.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setCat(c.name === cat ? "" : c.name)}
                  className={`shrink-0 touch-manipulation pb-1 text-[12px] font-bold uppercase tracking-[0.1em] ${
                    c.name === cat
                      ? "border-b-2 border-[var(--accent)] text-[var(--fg)]"
                      : "border-b-2 border-transparent text-[var(--fg-muted)]"
                  }`}
                  aria-pressed={c.name === cat}
                >
                  {catLabel(c.name)}
                </button>
              ))}
            </div>
          </nav>

          {/* Results — numbered catalog */}
          <div className="min-w-0">
            {filtered.length === 0 ? (
              <p className="border-t border-[var(--border-subtle)] py-10 text-[14px] text-[var(--fg-muted)]">
                {t("noResults")}
              </p>
            ) : (
              <div role="list" aria-label={t("explorerTitle")}>
                {filtered.map((tool, i) => {
                  const d = getToolDisplay(tool, lang);
                  return (
                    <Link key={tool.slug} href={`/cong-cu/${tool.slug}`} role="listitem" className="tb-entry group">
                      <span className="tb-num">{pad(i + 1)}</span>
                      <Icon name={tool.icon} className="h-[18px] w-[18px] text-[var(--fg-secondary)]" />
                      <span className="min-w-0">
                        <span className="block truncate text-[14px] font-semibold tracking-[-0.01em] text-[var(--fg)]">
                          {d.name}
                        </span>
                        <span className="mt-0.5 block truncate text-[12px] text-[var(--fg-muted)]">
                          {d.description}
                        </span>
                        <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--fg-muted)] sm:hidden">
                          {catLabel(tool.category)}
                        </span>
                      </span>
                      <span className="flex items-center gap-4">
                        <span className="hidden font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--fg-muted)] md:inline">
                          {catLabel(tool.category)}
                        </span>
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

      {/* ── Mobile bottom nav ─────────────────────────────────── */}
      <nav
        aria-label="Mobile"
        className="fixed inset-x-3 bottom-3 z-40 flex h-[52px] items-center justify-around rounded-[10px] border border-[var(--border)] bg-[var(--bg-elevated)]/95 shadow-[var(--shadow-md)] backdrop-blur-xl md:hidden"
      >
        <a href="#explorer" className="flex min-h-[44px] min-w-[72px] flex-col items-center justify-center gap-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--fg-secondary)]">
          <span aria-hidden="true" className="text-[15px] leading-none">☰</span>
          {t("navTools")}
        </a>
        <button
          onClick={fireCmdK}
          className="flex min-h-[44px] min-w-[72px] flex-col items-center justify-center gap-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--fg-secondary)]"
          aria-label="Search"
        >
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
