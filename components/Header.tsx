"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TOOLS, CATEGORIES, getToolDisplay } from "@/lib/tools";
import ThemeToggle from "./ThemeToggle";
import Icon from "./Icon";
import { useLang } from "@/lib/language-context";

const RECENT_KEY = "toolboxvn:recent";

function readRecentSlugs(): string[] {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"); } catch { return []; }
}

export default function Header() {
  const [cmdOpen, setCmdOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cmdQ, setCmdQ] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { lang, t, setLang } = useLang();

  // Track scroll for header background
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openCmd = useCallback(() => {
    setCmdOpen(true);
    setCmdQ("");
    setActiveIdx(0);
    try { setRecentSlugs(readRecentSlugs()); } catch {}
  }, []);
  const closeCmd = useCallback(() => setCmdOpen(false), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (cmdOpen) closeCmd(); else openCmd();
      }
      if (e.key === "Escape") { closeCmd(); setMenuOpen(false); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [openCmd, closeCmd, cmdOpen]);

  useEffect(() => {
    if (cmdOpen) setTimeout(() => inputRef.current?.focus(), 50);
  }, [cmdOpen]);

  function fuzzyScore(hay: string, needle: string): number {
    if (!needle) return 0;
    if (hay.includes(needle)) return 200 + needle.length * 4;
    let score = 0, hi = 0;
    for (let ni = 0; ni < needle.length; ni++) {
      const idx = hay.indexOf(needle[ni], hi);
      if (idx === -1) return 0;
      score += idx === hi ? 3 : 1;
      hi = idx + 1;
    }
    return Math.max(1, score - hi * 0.05);
  }

  const results = useMemo(() => {
    const spaced = cmdQ.trim().toLowerCase();
    if (!spaced) return [];
    const compact = spaced.replace(/\s+/g, "");
    return TOOLS.map((tool) => {
      const d = getToolDisplay(tool, lang);
      const fields = [tool.name.toLowerCase(), d.name.toLowerCase(), tool.description.toLowerCase(), d.description.toLowerCase(), tool.slug, ...tool.keywords.map((k) => k.toLowerCase())];
      let best = 0;
      for (const f of fields) {
        const sc = f.includes(spaced) ? 300 + spaced.length * 4 : fuzzyScore(f.replace(/\s+/g, ""), compact);
        if (sc > best) best = sc;
      }
      return { tool, best };
    }).filter((x) => x.best > 0).sort((a, b) => b.best - a.best).slice(0, 8).map((x) => x.tool);
  }, [cmdQ, lang]);

  const catMatches = useMemo(() => {
    const s = cmdQ.trim().toLowerCase();
    if (!s) return [];
    return CATEGORIES.filter((c) => c.name.toLowerCase().includes(s)).slice(0, 3);
  }, [cmdQ]);

  const recentTools = useMemo(() => recentSlugs.map((s) => TOOLS.find((tool) => tool.slug === s)).filter(Boolean).slice(0, 4) as typeof TOOLS, [recentSlugs]);
  const suggested = useMemo(() => TOOLS.slice(0, 4), []);
  const suggestedUnique = useMemo(() => suggested.filter((s) => !recentTools.some((r) => r.slug === s.slug)).slice(0, 4), [suggested, recentTools]);

  type NavItem = { kind: "tool"; slug: string } | { kind: "cat"; name: string };

  const toolRows = cmdQ.trim() ? results : [...recentTools, ...suggestedUnique].slice(0, 8);
  const navItems: NavItem[] = useMemo(() => cmdQ.trim()
    ? [...results.map((x) => ({ kind: "tool" as const, slug: x.slug })), ...catMatches.map((c) => ({ kind: "cat" as const, name: c.name }))]
    : [...recentTools, ...suggestedUnique].slice(0, 8).map((x) => ({ kind: "tool" as const, slug: x.slug })),
    [cmdQ, results, catMatches, recentTools, suggestedUnique]);

  useEffect(() => { setActiveIdx(0); }, [cmdQ, cmdOpen]);

  const goTool = useCallback((slug: string) => { closeCmd(); setMenuOpen(false); router.push(`/cong-cu/${slug}`); }, [closeCmd, router]);
  const goCat = useCallback((name: string) => { closeCmd(); setMenuOpen(false); router.push(`/?cat=${encodeURIComponent(name)}`); }, [closeCmd, router]);
  const goItem = useCallback((item: NavItem) => { if (item.kind === "tool") goTool(item.slug); else goCat(item.name); }, [goTool, goCat]);

  const activeId = navItems[activeIdx] ? navItems[activeIdx].kind === "tool" ? `cmd-${(navItems[activeIdx] as { slug: string }).slug}` : `cmd-cat-${(navItems[activeIdx] as { name: string }).name}` : undefined;

  const handleKeyNav = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, Math.max(navItems.length - 1, 0))); }
    if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, 0)); }
    if (e.key === "Enter" && navItems[activeIdx]) goItem(navItems[activeIdx]);
  };

  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.querySelector<HTMLElement>(`[data-idx="${activeIdx}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIdx]);

  return (
    <>
      {/* Floating nav */}
      <div className="site-header sticky top-0 z-50 px-3 pt-3 sm:px-5">
        <header
          className={`mx-auto flex h-[52px] max-w-6xl items-center gap-2 rounded-[10px] border px-3 shadow-[var(--shadow-sm)] backdrop-blur-xl transition-all duration-300 sm:gap-4 sm:px-4 ${
            scrolled
              ? "border-[var(--border)] bg-[var(--bg-elevated)]/95 shadow-[var(--shadow-md)]"
              : "border-[var(--border-subtle)] bg-[var(--bg-elevated)]/80"
          }`}
        >
          <Link href="/" className="text-[13px] font-black tracking-[-0.02em] text-[var(--fg)]" aria-label="ToolboxVN home">
            TOOLBOX<span style={{ color: "var(--accent)" }}>VN</span>
          </Link>

          <nav className="ml-4 hidden items-center gap-5 text-[13px] font-medium text-[var(--fg-secondary)] md:flex" aria-label="Primary">
            <a href="#explorer" className="tb-link tg hover:text-[var(--fg)]">{t("navTools")}</a>
            <a href="#explorer" className="tb-link tg hover:text-[var(--fg)]">{t("navCategories")}</a>
            <a href="#popular" className="tb-link tg hover:text-[var(--fg)]">{t("navPopular")}</a>
          </nav>

          <div className="ml-auto flex items-center gap-1.5">
            <button onClick={openCmd} className="tg flex h-8 items-center gap-2 rounded-[7px] px-2.5 text-[13px] text-[var(--fg-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--fg)]" aria-label="Search tools">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <span className="hidden lg:inline">{t("searchPlaceholder")}</span>
              <kbd className="tb-kbd hidden sm:inline-block">⌘K</kbd>
            </button>
            <ThemeToggle />
            <button onClick={() => setMenuOpen((v) => !v)} className="tg flex h-8 items-center rounded-[7px] px-2.5 text-[13px] font-medium text-[var(--fg-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--fg)]" aria-expanded={menuOpen} aria-label={t("menu")}>
              {menuOpen ? (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" /></svg>
              ) : (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" /></svg>
              )}
              <span className="ml-1.5 hidden sm:inline">{t("menu")}</span>
            </button>
          </div>
        </header>

        {/* Menu drawer */}
        {menuOpen && (
          <div className="mx-auto mt-2 max-w-6xl rounded-[10px] border border-[var(--border)] bg-[var(--bg-elevated)] p-4 shadow-[var(--shadow-lg)] animate-[revealUp_250ms_cubic-bezier(0.16,1,0.3,1)_both]">
            <div className="grid gap-6 sm:grid-cols-3">
              <nav aria-label="Menu">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--fg-muted)]">{t("menu")}</p>
                <div className="mt-2 flex flex-col">
                  <a href="#explorer" onClick={() => setMenuOpen(false)} className="tg rounded-[6px] px-2 py-2 text-[14px] hover:bg-[var(--bg-hover)]">{t("navTools")}</a>
                  <a href="#explorer" onClick={() => setMenuOpen(false)} className="tg rounded-[6px] px-2 py-2 text-[14px] hover:bg-[var(--bg-hover)]">{t("navCategories")}</a>
                  <a href="#popular" onClick={() => setMenuOpen(false)} className="tg rounded-[6px] px-2 py-2 text-[14px] hover:bg-[var(--bg-hover)]">{t("navPopular")}</a>
                  <Link href="/admin" onClick={() => setMenuOpen(false)} className="tg rounded-[6px] px-2 py-2 text-[14px] hover:bg-[var(--bg-hover)]">{t("navAdmin")}</Link>
                </div>
              </nav>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--fg-muted)]">{t("language")}</p>
                <div className="mt-2 flex gap-2">
                  {(["en", "vi"] as const).map((l) => (
                    <button key={l} onClick={() => setLang(l)} className={`tg h-9 flex-1 rounded-[7px] border text-[13px] font-semibold ${lang === l ? "border-[var(--fg)] text-[var(--fg)]" : "border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--fg)]"}`} aria-pressed={lang === l}>
                      {l === "en" ? "English" : "Tiếng Việt"}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--fg-muted)]">{t("navCategories")}</p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
                  {CATEGORIES.slice(0, 8).map((c) => (
                    <a key={c.name} href="#explorer" onClick={() => setMenuOpen(false)} className="tb-link text-[13px] text-[var(--fg-secondary)]">{c.name}</a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Command palette */}
      {cmdOpen && (
        <div className="cmd-overlay fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[14vh]" onClick={closeCmd}>
          <div className="cmd-panel w-full max-w-xl overflow-hidden rounded-[10px] border border-[var(--border)] bg-[var(--bg-elevated)] shadow-[var(--shadow-lg)]" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Search tools">
            <div className="flex items-center gap-3 border-b border-[var(--border-subtle)] px-4">
              <svg className="h-4 w-4 shrink-0 text-[var(--fg-muted)]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                ref={inputRef}
                value={cmdQ}
                onChange={(e) => setCmdQ(e.target.value)}
                onKeyDown={handleKeyNav}
                placeholder={t("searchPlaceholder")}
                className="h-13 w-full bg-transparent py-4 text-[15px] text-[var(--fg)] outline-none placeholder:text-[var(--fg-muted)]"
                role="combobox"
                aria-expanded={cmdOpen}
                aria-controls="cmd-list"
                aria-activedescendant={activeId}
              />
              <kbd className="tb-kbd">ESC</kbd>
            </div>
            <div ref={listRef} id="cmd-list" role="listbox" className="max-h-[46vh] overflow-y-auto p-2">
              {!cmdQ.trim() && recentTools.length > 0 && (
                <>
                  <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--fg-muted)]">{t("recentTitle")}</p>
                  {recentTools.map((tool) => {
                    const idx = navItems.findIndex((x) => x.kind === "tool" && (x as { slug: string }).slug === tool.slug);
                    const d = getToolDisplay(tool, lang);
                    return (
                      <button key={tool.slug} id={`cmd-${tool.slug}`} data-idx={idx} role="option" aria-selected={idx === activeIdx} onClick={() => goTool(tool.slug)} onMouseEnter={() => setActiveIdx(idx)} className={`tg-fast flex w-full items-center gap-3 rounded-[7px] px-3 py-2.5 text-left ${idx === activeIdx ? "bg-[var(--bg-hover)]" : ""}`}>
                        <Icon name={tool.icon} className="h-4 w-4 shrink-0 text-[var(--fg-muted)]" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13px] font-medium text-[var(--fg)]">{d.name}</span>
                          <span className="block truncate text-[11px] text-[var(--fg-muted)]">{tool.category}</span>
                        </span>
                        <span aria-hidden="true" className="text-[13px] text-[var(--fg-muted)]">↵</span>
                      </button>
                    );
                  })}
                </>
              )}
              <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--fg-muted)]">{cmdQ.trim() ? t("paletteTools") : t("featuredTitle")}</p>
              {(cmdQ.trim() ? toolRows : suggestedUnique).map((tool) => {
                const idx = navItems.findIndex((x) => x.kind === "tool" && (x as { slug: string }).slug === tool.slug);
                const d = getToolDisplay(tool, lang);
                return (
                  <button key={tool.slug} id={`cmd-${tool.slug}`} data-idx={idx} role="option" aria-selected={idx === activeIdx} onClick={() => goTool(tool.slug)} onMouseEnter={() => setActiveIdx(idx)} className={`tg-fast flex w-full items-center gap-3 rounded-[7px] px-3 py-2.5 text-left ${idx === activeIdx ? "bg-[var(--bg-hover)]" : ""}`}>
                    <Icon name={tool.icon} className="h-4 w-4 shrink-0 text-[var(--fg-muted)]" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-medium text-[var(--fg)]">{d.name}</span>
                      <span className="block truncate text-[11px] text-[var(--fg-muted)]">{cmdQ.trim() ? d.description : tool.category}</span>
                    </span>
                    <span aria-hidden="true" className="text-[13px] text-[var(--fg-muted)]">↵</span>
                  </button>
                );
              })}
              {cmdQ.trim() && catMatches.length > 0 && (
                <>
                  <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--fg-muted)]">{t("paletteCategories")}</p>
                  {catMatches.map((c) => {
                    const idx = navItems.findIndex((x) => x.kind === "cat" && (x as { name: string }).name === c.name);
                    return (
                      <button key={c.name} id={`cmd-cat-${c.name}`} data-idx={idx} role="option" aria-selected={idx === activeIdx} onClick={() => goCat(c.name)} onMouseEnter={() => setActiveIdx(idx)} className={`tg-fast flex w-full items-center gap-3 rounded-[7px] px-3 py-2.5 text-left ${idx === activeIdx ? "bg-[var(--bg-hover)]" : ""}`}>
                        <span className="h-[6px] w-[6px] shrink-0 rounded-full bg-[var(--accent)]" aria-hidden="true" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13px] font-medium text-[var(--fg)]">{c.name}</span>
                          <span className="block truncate text-[11px] text-[var(--fg-muted)]">{c.desc}</span>
                        </span>
                        <span aria-hidden="true" className="text-[13px] text-[var(--fg-muted)]">↵</span>
                      </button>
                    );
                  })}
                </>
              )}
              {cmdQ.trim() && results.length === 0 && catMatches.length === 0 && (
                <p className="px-3 py-8 text-center text-[13px] text-[var(--fg-muted)]">{t("noResults")}</p>
              )}
            </div>
            <div className="flex items-center gap-4 border-t border-[var(--border-subtle)] px-4 py-2.5 text-[11px] text-[var(--fg-muted)]">
              <span>↑↓ {t("navTools")}</span>
              <span>↵ {t("featuredOpen")}</span>
              <span className="ml-auto">ESC {t("close")}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
