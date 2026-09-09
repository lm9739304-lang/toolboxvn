"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import ToolCard from "./ToolCard";
import AdSlot from "./AdSlot";
import { CATEGORIES, type Tool, getToolDisplay } from "@/lib/tools";
import { useSite } from "@/lib/site-config";
import Icon, { CATEGORY_ICONS } from "./Icon";
import { useLang } from "@/lib/language-context";
import { translations, type Lang } from "@/lib/translations";

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

function Sidebar({ active, onSelect, lang }: { active: string; onSelect: (c: string) => void; lang: Lang }) {
  const { t } = useLang();
  return (
    <nav className="hidden w-44 shrink-0 lg:block">
      <div className="sticky top-16 space-y-0.5">
        <button onClick={() => onSelect("")} className={`cat-link ${!active ? "active" : ""}`}>
          {t("allTools")}
        </button>
        <div className="my-2 h-px bg-[var(--border-subtle)]" />
        {CATEGORIES.map((c) => {
          const CatIcon = CATEGORY_ICONS[c.name];
          const catKey = CAT_KEY_MAP[c.name];
          return (
            <button key={c.name} onClick={() => onSelect(c.name === active ? "" : c.name)} className={`cat-link ${c.name === active ? "active" : ""}`}>
              {CatIcon && <CatIcon className="h-3.5 w-3.5 text-[var(--fg-muted)]" strokeWidth={1.5} />}
              {catKey ? t(catKey) : c.name}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function MobileCatBar({ active, onSelect }: { active: string; onSelect: (c: string) => void }) {
  const { t } = useLang();
  return (
    <div className="scroll-x flex gap-1 pb-3 lg:hidden">
      <button onClick={() => onSelect("")} className={`shrink-0 rounded-md border px-2.5 py-1 text-[12px] font-medium transition-default ${!active ? "border-[var(--accent)] bg-[var(--accent-bg)] text-[var(--accent)]" : "border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--fg-secondary)]"}`}>
        {t("all")}
      </button>
      {CATEGORIES.map((c) => {
        const catKey = CAT_KEY_MAP[c.name];
        return (
          <button key={c.name} onClick={() => onSelect(c.name === active ? "" : c.name)} className={`shrink-0 rounded-md border px-2.5 py-1 text-[12px] font-medium transition-default ${c.name === active ? "border-[var(--accent)] bg-[var(--accent-bg)] text-[var(--accent)]" : "border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--fg-secondary)]"}`}>
            {catKey ? t(catKey) : c.name}
          </button>
        );
      })}
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

  const grouped = useMemo(() => {
    if (cat || q.trim()) return null;
    const m = new Map<string, Tool[]>();
    for (const tool of filtered) {
      if (!m.has(tool.category)) m.set(tool.category, []);
      m.get(tool.category)!.push(tool);
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
      <section className="pt-10 pb-8 sm:pt-14 sm:pb-10">
        <h1 className="text-[28px] font-bold tracking-tight text-[var(--fg)] sm:text-[36px]" style={{ lineHeight: 1.15 }}>
          {t("heroTitle1")}
          <br />
          {t("heroTitle2")}
        </h1>
        <p className="mt-3 max-w-md text-[14px] leading-relaxed text-[var(--fg-secondary)]">
          {t("heroDesc")}
        </p>

        <div className="mt-5 flex max-w-lg items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 transition-default focus-within:border-[var(--accent)]">
          <svg className="h-4 w-4 shrink-0 text-[var(--fg-muted)]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("searchInput", enabledTools.length)}
            className="h-10 w-full bg-transparent text-[14px] text-[var(--fg)] outline-none placeholder:text-[var(--fg-muted)]"
            aria-label="Search tools"
          />
          {q && (
            <button onClick={() => setQ("")} className="shrink-0 rounded bg-[var(--bg-recessed)] px-1.5 py-0.5 text-[11px] font-medium text-[var(--fg-muted)]">{t("clear")}</button>
          )}
        </div>

        <div className="mt-3 flex gap-4 text-[12px] text-[var(--fg-muted)]">
          <span>{enabledTools.length} {t("statTools")}</span>
          <span>{t("statClient")}</span>
          <span>{t("statFree")}</span>
        </div>
      </section>

      <MobileCatBar active={cat} onSelect={setCat} />

      <div className="flex gap-8">
        <Sidebar active={cat} onSelect={setCat} lang={lang} />

        <div className="min-w-0 flex-1">
          {!isSearching && recentTools.length > 0 && (
            <section className="mb-8">
              <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--fg-muted)]">{t("continueUsing")}</h2>
              <div className="space-y-1">
                {recentTools.slice(0, 4).map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </section>
          )}

          {!isSearching && mostUsedTools.length > 0 && (
            <section className="mb-8">
              <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--fg-muted)]">{t("mostUsed")}</h2>
              <div className="space-y-1">
                {mostUsedTools.map(({ tool, count }) => (
                  <Link key={tool.slug} href={`/cong-cu/${tool.slug}`} className="tool-row group">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--bg-recessed)] text-[var(--fg-muted)]">
                      <Icon name={tool.icon} className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-[13px] font-medium text-[var(--fg)]">{getToolDisplay(tool, lang).name}</h3>
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
                {filtered.length} result{filtered.length !== 1 ? "s" : ""} {t("resultsFor", q, cat)}
              </p>
              <div className="space-y-1">
                {filtered.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
              {filtered.length === 0 && (
                <div className="rounded-lg border border-dashed border-[var(--border)] px-6 py-12 text-center text-[13px] text-[var(--fg-muted)]">
                  {t("noResults")}
                </div>
              )}
            </section>
          ) : (
            <>
              <section className="mb-8">
                <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--fg-muted)]">{t("featured")}</h2>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {featuredTools.map((tool) => (
                    <ToolCard key={tool.slug} tool={tool} featured />
                  ))}
                </div>
              </section>

              <AdSlot zone="in-content" />

              <section className="mb-8">
                <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--fg-muted)]">{t("trending")}</h2>
                <div className="space-y-1">
                  {trendingTools.map((tool) => (
                    <ToolCard key={tool.slug} tool={tool} />
                  ))}
                </div>
              </section>

              {grouped?.map(([cname, tools]) => {
                const catKey = CAT_KEY_MAP[cname];
                return (
                  <section key={cname} className="mb-8">
                    <div className="mb-3 flex items-baseline gap-2">
                      <h2 className="text-[14px] font-semibold text-[var(--fg)]">{catKey ? t(catKey) : cname}</h2>
                      <span className="text-[11px] text-[var(--fg-muted)]">{tools.length} {t("statTools")}</span>
                    </div>
                    <div className="space-y-1">
                      {tools.map((tool) => (
                        <ToolCard key={tool.slug} tool={tool} />
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
